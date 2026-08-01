import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { after, before, test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const nextBin = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");
let server;
let baseUrl;
let serverOutput = "";

async function findOpenPort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.unref();
    probe.on("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      const port = typeof address === "object" && address ? address.port : null;
      probe.close(() => (port ? resolve(port) : reject(new Error("Unable to reserve a test port."))));
    });
  });
}

async function waitForServer(url) {
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js exited before becoming ready.\n${serverOutput}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The process is still warming up.
    }
    await delay(250);
  }
  throw new Error(`Timed out waiting for Next.js.\n${serverOutput}`);
}

before(async () => {
  const port = await findOpenPort();
  baseUrl = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, [nextBin, "start", "-H", "127.0.0.1", "-p", String(port)], {
    cwd: projectRoot,
    env: { ...process.env, NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  server.stdout.on("data", (chunk) => { serverOutput += chunk.toString(); });
  server.stderr.on("data", (chunk) => { serverOutput += chunk.toString(); });
  await waitForServer(baseUrl);
});

after(async () => {
  if (server && server.exitCode === null) {
    server.kill();
    await Promise.race([new Promise((resolve) => server.once("exit", resolve)), delay(5_000)]);
  }
});

test("uses the standard Next.js pipeline without legacy hosting dependencies", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(packageJson.scripts.dev, "next dev");
  assert.equal(packageJson.scripts.build, "next build");
  assert.equal(packageJson.scripts.start, "next start");

  const dependencyNames = new Set([
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
  ]);
  for (const legacyDependency of [
    "vinext",
    "vite",
    "wrangler",
    "@cloudflare/vite-plugin",
    "@vitejs/plugin-react",
    "@vitejs/plugin-rsc",
    "react-server-dom-webpack",
    "drizzle-orm",
    "drizzle-kit",
  ]) {
    assert.equal(dependencyNames.has(legacyDependency), false, `${legacyDependency} should be removed`);
  }

  for (const legacyFile of [
    "../vite.config.ts",
    "../.openai/hosting.json",
    "../worker/index.ts",
    "../build/sites-vite-plugin.ts",
    "../app/chatgpt-auth.ts",
  ]) {
    await assert.rejects(access(new URL(legacyFile, import.meta.url)));
  }
});

test("serves every primary website route", async () => {
  const routes = [
    "/",
    "/services",
    "/services/commercial-plowing",
    "/services/deicing-salting",
    "/services/sidewalks-walkways",
    "/services/weather-reporting",
    "/services/risk-management",
    "/about",
    "/service-areas",
    "/quote",
    "/contact",
    "/partner-network",
  ];

  for (const route of routes) {
    const response = await fetch(`${baseUrl}${route}`);
    assert.equal(response.status, 200, `${route} should return 200`);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  }
});

test("renders the selected brand and premium homepage content", async () => {
  const response = await fetch(baseUrl);
  const html = await response.text();
  assert.match(html, /Commercial Winter Operations \| American Snow &amp; Ice Solutions/i);
  assert.match(html, /Winter doesn.t wait/i);
  assert.match(html, /American Snow &amp; Ice Solutions/i);
  assert.match(html, /\/media\/brand\/asai-logo\.png/i);
  await access(new URL("../public/media/brand/asai-logo.png", import.meta.url));
});

test("serves technical SEO and GEO discovery endpoints", async () => {
  const robots = await (await fetch(`${baseUrl}/robots.txt`)).text();
  assert.match(robots, /Sitemap: https:\/\/americansnowandicesolutions\.com\/sitemap\.xml/i);

  const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /https:\/\/americansnowandicesolutions\.com\/services\/commercial-plowing/i);
  assert.match(sitemap, /https:\/\/americansnowandicesolutions\.com\/service-areas/i);

  const manifest = await (await fetch(`${baseUrl}/manifest.webmanifest`)).json();
  assert.equal(manifest.name, "American Snow & Ice Solutions");

  const llms = await (await fetch(`${baseUrl}/llms.txt`)).text();
  assert.match(llms, /Commercial and industrial snow and ice management company/i);

  const serviceHtml = await (await fetch(`${baseUrl}/services/commercial-plowing`)).text();
  assert.match(serviceHtml, /application\/ld\+json/i);
  assert.match(serviceHtml, /Commercial snow plowing/i);
  assert.match(serviceHtml, /rel="canonical" href="https:\/\/americansnowandicesolutions\.com\/services\/commercial-plowing"/i);
});
