# American Snow and Ice Solutions image library

Source: https://americansnowandicesolutions.com/

Retrieved on August 1, 2026 for use in the American Snow and Ice Solutions proof-of-concept website. The project owner confirmed that the images currently published on the source website are approved for reuse in this project.

## Contents

- `photos/` — original photos from the WordPress media library
- `logos-certifications-associations/` — company logos, certification marks, association marks, and related identity assets
- `graphics/` — maps, application graphics, illustrations, and other non-photo media
- `site-only/` — additional image references discovered in public pages and stylesheets, including rendered variants
- `manifest.csv` — source URL, original metadata, dimensions where available, local path, file size, and SHA-256 hash for every downloaded file

The retrieval covered all 76 images exposed by the public WordPress media API, all 14 indexed pages, and 29 referenced stylesheets. It produced 141 local image files representing 126 unique file hashes, with no unresolved download failures.

To refresh the library from the live website, run `tools/retrieve-approved-site-images.ps1` from the project root.
