param(
    [string]$SiteUrl = "https://americansnowandicesolutions.com",
    [string]$OutputRoot = (Join-Path (Split-Path $PSScriptRoot -Parent) "images")
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

function ConvertTo-SafeFileName {
    param([string]$Name)

    $decoded = [System.Net.WebUtility]::UrlDecode($Name)
    $safe = $decoded -replace '[<>:"/\\|?*]', '-'
    $safe = $safe -replace '\s+', '-'
    $safe = $safe.Trim(' ', '.', '-')
    if ([string]::IsNullOrWhiteSpace($safe)) {
        return "image"
    }
    return $safe
}

function Get-AssetCategory {
    param(
        [string]$Title,
        [string]$Url,
        [string]$MimeType
    )

    $searchable = "$Title $Url".ToLowerInvariant()
    if ($searchable -match 'logo|favicon|sima|asca|snowfighters|chamber|bbb|association|certif|member|badge|trust|aps-star|worktogether') {
        return "logos-certifications-associations"
    }
    if ($searchable -match 'map|app|device|icon|graphic|illustration|yeti|flag' -or $MimeType -eq 'image/svg+xml') {
        return "graphics"
    }
    return "photos"
}

function Get-FileNameFromUrl {
    param([string]$Url)

    $uri = [Uri]$Url
    $name = [IO.Path]::GetFileName($uri.AbsolutePath)
    return ConvertTo-SafeFileName $name
}

function Save-WebImage {
    param(
        [string]$Url,
        [string]$Destination,
        [int]$Retries = 3
    )

    for ($attempt = 1; $attempt -le $Retries; $attempt++) {
        try {
            Invoke-WebRequest -Uri $Url -OutFile $Destination -UseBasicParsing -TimeoutSec 60
            if ((Get-Item -LiteralPath $Destination).Length -le 0) {
                throw "Downloaded file is empty."
            }
            return
        }
        catch {
            if ($attempt -eq $Retries) {
                throw
            }
            Start-Sleep -Seconds $attempt
        }
    }
}

$folders = @(
    $OutputRoot,
    (Join-Path $OutputRoot "photos"),
    (Join-Path $OutputRoot "logos-certifications-associations"),
    (Join-Path $OutputRoot "graphics"),
    (Join-Path $OutputRoot "site-only")
)
foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
}

$manifest = [System.Collections.Generic.List[object]]::new()
$failures = [System.Collections.Generic.List[object]]::new()
$knownUrls = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)

$mediaEndpoint = "$SiteUrl/wp-json/wp/v2/media?per_page=100&page=1"
$media = Invoke-RestMethod -Uri $mediaEndpoint -TimeoutSec 60

foreach ($item in $media) {
    if ($item.media_type -ne "image" -or [string]::IsNullOrWhiteSpace($item.source_url)) {
        continue
    }

    $url = [string]$item.source_url
    [void]$knownUrls.Add($url)
    $title = [System.Net.WebUtility]::HtmlDecode([string]$item.title.rendered)
    $category = Get-AssetCategory -Title $title -Url $url -MimeType ([string]$item.mime_type)
    $sourceName = Get-FileNameFromUrl $url
    $fileName = ("{0:D4}-{1}" -f [int]$item.id, $sourceName)
    $relativePath = Join-Path $category $fileName
    $destination = Join-Path $OutputRoot $relativePath

    try {
        if (-not (Test-Path -LiteralPath $destination)) {
            Save-WebImage -Url $url -Destination $destination
        }
        $file = Get-Item -LiteralPath $destination
        $hash = (Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash.ToLowerInvariant()
        $manifest.Add([PSCustomObject]@{
            media_id = [int]$item.id
            category = $category
            title = $title
            alt_text = [System.Net.WebUtility]::HtmlDecode([string]$item.alt_text)
            mime_type = [string]$item.mime_type
            width = $item.media_details.width
            height = $item.media_details.height
            bytes = $file.Length
            sha256 = $hash
            source_url = $url
            local_path = $relativePath.Replace('\\', '/')
        })
    }
    catch {
        $failures.Add([PSCustomObject]@{ source_url = $url; error = $_.Exception.Message })
    }
}

# Crawl the public sitemap and CSS for image files that are referenced by the
# rendered site but are not represented by an original media-library record.
$discoveredUrls = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$sitemapIndex = [xml](Invoke-WebRequest -Uri "$SiteUrl/wp-sitemap.xml" -UseBasicParsing -TimeoutSec 60).Content
$sitemapUrls = @($sitemapIndex.sitemapindex.sitemap.loc)
$pageUrls = [System.Collections.Generic.List[string]]::new()
foreach ($sitemapUrl in $sitemapUrls) {
    $map = [xml](Invoke-WebRequest -Uri $sitemapUrl -UseBasicParsing -TimeoutSec 60).Content
    foreach ($urlNode in @($map.urlset.url.loc)) {
        if ($urlNode) {
            $pageUrls.Add([string]$urlNode)
        }
    }
}

$assetPattern = '(?i)(?:https?:)?//[^"''\s)>]+?\.(?:png|jpe?g|webp|gif|svg)(?:\?[^"''\s)>]*)?|/(?:[^"''\s)>]+/)*[^"''\s)>]+?\.(?:png|jpe?g|webp|gif|svg)(?:\?[^"''\s)>]*)?'
$cssPattern = '(?i)(?:https?:)?//[^"''\s)>]+?\.css(?:\?[^"''\s)>]*)?|/(?:[^"''\s)>]+/)*[^"''\s)>]+?\.css(?:\?[^"''\s)>]*)?'
$cssUrls = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)

foreach ($pageUrl in $pageUrls) {
    try {
        $html = (Invoke-WebRequest -Uri $pageUrl -UseBasicParsing -TimeoutSec 60).Content
        foreach ($match in [regex]::Matches($html, $assetPattern)) {
            $candidate = [System.Net.WebUtility]::HtmlDecode($match.Value)
            $candidate = $candidate -replace '\\/', '/'
            if ($candidate.StartsWith('//')) { $candidate = "https:$candidate" }
            elseif ($candidate.StartsWith('/')) { $candidate = "$SiteUrl$candidate" }
            [void]$discoveredUrls.Add($candidate)
        }
        foreach ($match in [regex]::Matches($html, $cssPattern)) {
            $candidate = [System.Net.WebUtility]::HtmlDecode($match.Value)
            $candidate = $candidate -replace '\\/', '/'
            if ($candidate.StartsWith('//')) { $candidate = "https:$candidate" }
            elseif ($candidate.StartsWith('/')) { $candidate = "$SiteUrl$candidate" }
            [void]$cssUrls.Add($candidate)
        }
    }
    catch {
        $failures.Add([PSCustomObject]@{ source_url = $pageUrl; error = "Page crawl: $($_.Exception.Message)" })
    }
}

foreach ($cssUrl in $cssUrls) {
    try {
        $css = (Invoke-WebRequest -Uri $cssUrl -UseBasicParsing -TimeoutSec 60).Content
        foreach ($match in [regex]::Matches($css, $assetPattern)) {
            $candidate = [System.Net.WebUtility]::HtmlDecode($match.Value)
            $candidate = $candidate -replace '\\/', '/'
            if ($candidate.StartsWith('//')) {
                $candidate = "https:$candidate"
            }
            elseif ($candidate.StartsWith('/')) {
                $candidate = "$SiteUrl$candidate"
            }
            elseif (-not $candidate.StartsWith('http')) {
                $candidate = [Uri]::new([Uri]$cssUrl, $candidate).AbsoluteUri
            }
            [void]$discoveredUrls.Add($candidate)
        }
    }
    catch {
        $failures.Add([PSCustomObject]@{ source_url = $cssUrl; error = "Stylesheet crawl: $($_.Exception.Message)" })
    }
}

$siteOnlyIndex = 0
foreach ($url in $discoveredUrls) {
    $normalizedUrl = $url -replace '&amp;', '&'
    if ($knownUrls.Contains($normalizedUrl)) {
        continue
    }

    $siteOnlyIndex++
    $sourceName = Get-FileNameFromUrl $normalizedUrl
    $fileName = ("site-{0:D4}-{1}" -f $siteOnlyIndex, $sourceName)
    $relativePath = Join-Path "site-only" $fileName
    $destination = Join-Path $OutputRoot $relativePath
    try {
        if (-not (Test-Path -LiteralPath $destination)) {
            Save-WebImage -Url $normalizedUrl -Destination $destination
        }
        $file = Get-Item -LiteralPath $destination
        $hash = (Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash.ToLowerInvariant()
        $manifest.Add([PSCustomObject]@{
            media_id = ""
            category = "site-only"
            title = [IO.Path]::GetFileNameWithoutExtension($sourceName)
            alt_text = ""
            mime_type = ""
            width = ""
            height = ""
            bytes = $file.Length
            sha256 = $hash
            source_url = $normalizedUrl
            local_path = $relativePath.Replace('\\', '/')
        })
    }
    catch {
        $failures.Add([PSCustomObject]@{ source_url = $normalizedUrl; error = $_.Exception.Message })
    }
}

$manifestPath = Join-Path $OutputRoot "manifest.csv"
$manifest | Sort-Object category, media_id, local_path | Export-Csv -LiteralPath $manifestPath -NoTypeInformation -Encoding utf8

$failurePath = Join-Path $OutputRoot "download-failures.csv"
if ($failures.Count -gt 0) {
    $failures | Export-Csv -LiteralPath $failurePath -NoTypeInformation -Encoding utf8
}
elseif (Test-Path -LiteralPath $failurePath) {
    Remove-Item -LiteralPath $failurePath
}

$summary = $manifest | Group-Object category | Sort-Object Name | ForEach-Object {
    [PSCustomObject]@{ Category = $_.Name; Count = $_.Count }
}

[PSCustomObject]@{
    OutputRoot = $OutputRoot
    Downloaded = $manifest.Count
    Failed = $failures.Count
    PagesCrawled = $pageUrls.Count
    StylesheetsCrawled = $cssUrls.Count
    ByCategory = $summary
} | ConvertTo-Json -Depth 4
