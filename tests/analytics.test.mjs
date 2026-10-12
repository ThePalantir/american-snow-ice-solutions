import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const { outputText } = ts.transpileModule(await readFile(new URL("../app/analytics.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const enabled = {
  NEXT_PUBLIC_GA4_MEASUREMENT_ID: "G-TEST123456",
  NEXT_PUBLIC_ANALYTICS_ENABLED: "true",
  NEXT_PUBLIC_PRIVACY_NOTICE_APPROVED: "true",
};
function setup(env = enabled, consent = "granted", pathname = "/quote") {
  const scripts = [];
  const commands = [];
  const exports = {};
  const window = {
    location: { origin: "https://americansnowandicesolutions.com", pathname, search: "?email=private@example.com" },
    gtag: (...args) => commands.push(args), dispatchEvent() {},
  };
  const context = {
    exports, process: { env }, window,
    localStorage: { getItem: () => consent, setItem() {} },
    document: { getElementById: () => scripts[0], createElement: () => ({}), head: { appendChild: (s) => scripts.push(s) } },
  };
  runInNewContext(outputText, context);
  return { api: exports, scripts, commands, window, context };
}

test("analytics stays off until ID, explicit activation, privacy approval, and consent are present", () => {
  for (const [env, consent] of [[{}, "granted"], [{ ...enabled, NEXT_PUBLIC_GA4_MEASUREMENT_ID: "bad" }, "granted"],
    [{ ...enabled, NEXT_PUBLIC_ANALYTICS_ENABLED: "false" }, "granted"],
    [{ ...enabled, NEXT_PUBLIC_PRIVACY_NOTICE_APPROVED: "false" }, "granted"], [enabled, null], [enabled, "denied"]]) {
    const { api, scripts, commands } = setup(env, consent);
    api.startAnalytics(); api.trackEvent("generate_lead");
    assert.equal(scripts.length, 0); assert.equal(commands.length, 0);
  }
});

test("consented initialization loads one tag and disables automatic page views and advertising", () => {
  const { api, scripts, window } = setup();
  api.startAnalytics(); api.startAnalytics();
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].src, "https://www.googletagmanager.com/gtag/js?id=G-TEST123456");
  const config = window.dataLayer.find((entry) => entry[0] === "config")[2];
  assert.equal(config.send_page_view, false);
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.page_location, "https://americansnowandicesolutions.com/quote");
  const consent = window.dataLayer.find((entry) => entry[0] === "consent")[2];
  assert.equal(consent.ad_storage, "denied");
  assert.equal(consent.ad_user_data, "denied");
});

test("custom events exclude query strings, referrer, arbitrary paths, and supplied extra fields", () => {
  const { api, commands } = setup(enabled, "granted", "/private@example.com");
  api.trackEvent("generate_lead", { email: "private@example.com" });
  const payload = commands[0][2];
  assert.equal(payload.page_location, "https://americansnowandicesolutions.com/other");
  assert.equal(payload.page_referrer, "");
  assert.equal(payload.form_id, "risk_consultation");
  assert.doesNotMatch(JSON.stringify(commands), /private@example|\?email/);
});

test("storage or analytics failures do not interrupt optional event tracking", () => {
  const first = setup();
  first.window.gtag = () => { throw new Error("Blocked analytics"); };
  assert.doesNotThrow(() => first.api.trackEvent("generate_lead"));
  const second = setup();
  second.context.localStorage.getItem = () => { throw new Error("Blocked storage"); };
  second.api.startAnalytics(); second.api.trackEvent("generate_lead");
  assert.equal(second.scripts.length, 0); assert.equal(second.commands.length, 0);
});
