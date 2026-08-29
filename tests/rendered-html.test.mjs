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
    "/winter-risk-plan",
    "/technology-reporting",
    "/snow-ice-science",
    "/salt-brine",
    "/schedule",
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
  assert.match(html, /Professional Winter Risk Management \| American Snow &amp; Ice Solutions/i);
  assert.match(html, /We professionally manage/i);
  assert.match(html, /winter risk/i);
  assert.match(html, /weatherwidget-io/i);
  assert.match(html, /LEHIGH VALLEY/i);
  assert.match(html, /American Snow &amp; Ice Solutions/i);
  assert.doesNotMatch(html, /24\/7 winter event operations/i);
  assert.match(html, /We take the stress out of winter/i);
  assert.match(html, /\/salt-brine/i);
  assert.match(html, /https:\/\/truecore\.services\//i);
  assert.match(html, /\/media\/brand\/asais-gpt-logo\.png/i);
  await access(new URL("../public/media/brand/asais-gpt-logo.png", import.meta.url));
});

test("serves technical SEO and GEO discovery endpoints", async () => {
  const robots = await (await fetch(`${baseUrl}/robots.txt`)).text();
  assert.match(robots, /Sitemap: https:\/\/americansnowandicesolutions\.com\/sitemap\.xml/i);

  const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /https:\/\/americansnowandicesolutions\.com\/services\/commercial-plowing/i);
  assert.match(sitemap, /https:\/\/americansnowandicesolutions\.com\/service-areas/i);
  assert.match(sitemap, /https:\/\/americansnowandicesolutions\.com\/winter-risk-plan/i);
  assert.match(sitemap, /https:\/\/americansnowandicesolutions\.com\/salt-brine/i);
  assert.match(sitemap, /https:\/\/americansnowandicesolutions\.com\/quote/i);

  const manifest = await (await fetch(`${baseUrl}/manifest.webmanifest`)).json();
  assert.equal(manifest.name, "American Snow & Ice Solutions");

  const llms = await (await fetch(`${baseUrl}/llms.txt`)).text();
  assert.match(llms, /Professional commercial snow and ice management company/i);

  const serviceHtml = await (await fetch(`${baseUrl}/services/commercial-plowing`)).text();
  assert.match(serviceHtml, /application\/ld\+json/i);
  assert.match(serviceHtml, /Commercial snow plowing/i);
  assert.match(serviceHtml, /rel="canonical" href="https:\/\/americansnowandicesolutions\.com\/services\/commercial-plowing"/i);
});

test("publishes the salt brine resource with canonical metadata and responsible claims", async () => {
  const response = await fetch(`${baseUrl}/salt-brine`);
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /<h1[^>]*>Salt Brine &amp; Anti-Icing<\/h1>/i);
  assert.match(html, /sodium-chloride solution/i);
  assert.match(html, /produces salt brine on-site/i);
  assert.match(html, /rel="canonical" href="https:\/\/americansnowandicesolutions\.com\/salt-brine"/i);
  assert.doesNotMatch(html, /3[–-]4 times faster/i);
  assert.doesNotMatch(html, /Headwaters Hot/i);
});

test("renders a consistent interaction hierarchy across key routes", async () => {
  const home = await (await fetch(baseUrl)).text();
  assert.match(home, /class="button button--signal" href="\/quote"/i);
  assert.match(home, /class="button button--secondary" href="\/technology-reporting"/i);
  assert.match(home, /class="text-link" href="\/winter-risk-plan"/i);
  assert.match(home, /class="service-card service-card--feature"/i);

  const services = await (await fetch(`${baseUrl}/services`)).text();
  assert.match(services, /class="service-list__item"/i);

  const serviceAreas = await (await fetch(`${baseUrl}/service-areas`)).text();
  assert.match(serviceAreas, /class="button button--signal" href="\/quote"/i);
  assert.match(serviceAreas, /class="button button--secondary" href="\/partner-network"/i);

  const contact = await (await fetch(`${baseUrl}/contact`)).text();
  assert.match(contact, /class="contact-phone" href="tel:\+16107600600" aria-label="Call American Snow &amp; Ice Solutions/i);
  assert.match(contact, /class="contact-email" href="mailto:info@americansnowandice.com"/i);
});
