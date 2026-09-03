import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const requiredFiles = [
  "dist/manifest.json",
  "dist/popup.html",
  "dist/popup.css",
  "dist/popup.js",
  "dist/mathlive/mathlive-static.css",
  "dist/mathlive/mathlive-fonts.css",
  "dist/sounds/plonk.wav",
];

test("build contains a loadable extension", async () => {
  await Promise.all(requiredFiles.map((file) => readFile(file)));

  const manifest = JSON.parse(await readFile("dist/manifest.json", "utf8"));
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.action.default_popup, "popup.html");

  const html = await readFile("dist/popup.html", "utf8");
  assert.match(html, /src="popup\.js"/);
  assert.doesNotMatch(html, /node_modules\/mathlive/);
});