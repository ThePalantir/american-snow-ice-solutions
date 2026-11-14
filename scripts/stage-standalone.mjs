import { cp } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const standalone = new URL(".next/standalone/", root);

await Promise.all([
  cp(new URL("public/", root), new URL("public/", standalone), { recursive: true }),
  cp(new URL(".next/static/", root), new URL(".next/static/", standalone), { recursive: true }),
]);
