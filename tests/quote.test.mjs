import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Exercise the actual handler and SDK with only the provider network mocked.
const routeUrl = new URL("../app/api/quote/route.ts", import.meta.url);
const { outputText } = ts.transpileModule(await readFile(routeUrl, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const environment = {
  RESEND_API_KEY: "re_test_key_not_real",
  RESEND_FROM_EMAIL: "ASIS <website@example.com>",
};
const submission = {
  company: "Example <Warehouse>", name: "Test Contact", email: "visitor@example.com",
  phone: "610-555-0100", location: "Example commercial property", details: "<script>example</script>",
};

function handler(env = environment) {
  const exports = {};
  runInNewContext(outputText, {
    exports, require: createRequire(routeUrl), process: { env }, console: { error() {} },
  });
  return exports.POST;
}

function request(body = submission) {
  return new Request("http://localhost/api/quote", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
}

test("sends through Resend using runtime settings, a fixed recipient, and the visitor Reply-To", async (t) => {
  const network = t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://api.resend.com/emails");
    assert.equal(options.method, "POST");
    assert.equal(new Headers(options.headers).get("authorization"), `Bearer ${environment.RESEND_API_KEY}`);
    const email = JSON.parse(options.body);
    assert.equal(email.from, environment.RESEND_FROM_EMAIL);
    assert.deepEqual(email.to, ["Piechotagrpinc@gmail.com"]);
    assert.equal(email.reply_to, submission.email);
    assert.match(email.text, /Example <Warehouse>/);
    assert.match(email.html, /&lt;script&gt;example&lt;\/script&gt;/);
    assert.doesNotMatch(email.html, /<script>/);
    return Response.json({ id: "test-message" });
  });
  const response = await handler()(request({ ...submission, to: "attacker@example.com" }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(network.mock.callCount(), 1);
});

test("missing configuration, invalid input, and honeypots never contact Resend", async (t) => {
  const network = t.mock.method(globalThis, "fetch", () => { throw new Error("Unexpected provider request"); });
  assert.equal((await handler({})(request())).status, 503);
  assert.equal((await handler({ RESEND_API_KEY: environment.RESEND_API_KEY })(request())).status, 503);
  assert.equal((await handler()(request({ ...submission, email: "invalid" }))).status, 400);
  assert.equal((await handler()(request({ ...submission, _honey: "bot" }))).status, 200);
  assert.equal(network.mock.callCount(), 0);
});

test("a provider rejection or network failure never reports successful delivery", async (t) => {
  const network = t.mock.method(globalThis, "fetch", async () => Response.json(
    { name: "validation_error", message: "Test provider rejection" }, { status: 403 },
  ));
  assert.equal((await handler()(request())).status, 502);
  network.mock.mockImplementation(async () => { throw new Error("Test connection failure"); });
  assert.equal((await handler()(request())).status, 502);
});
