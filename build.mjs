import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "esbuild";

const root = resolve(import.meta.dirname);
const dist = resolve(root, "dist");
const mathlive = resolve(root, "node_modules", "mathlive");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await build({
  entryPoints: [resolve(root, "popup.js")],
  outfile: resolve(dist, "popup.js"),
  bundle: true,
  format: "esm",
  minify: false,
  sourcemap: true,
  target: "chrome120",
  logLevel: "info",
});

const html = await readFile(resolve(root, "popup.html"), "utf8");
await writeFile(
  resolve(dist, "popup.html"),
  html.replaceAll("node_modules/mathlive/", "mathlive/"),
);
await cp(resolve(root, "popup.css"), resolve(dist, "popup.css"));
await cp(resolve(root, "manifest.json"), resolve(dist, "manifest.json"));
await mkdir(resolve(dist, "mathlive", "fonts"), { recursive: true });
await cp(resolve(mathlive, "mathlive-static.css"), resolve(dist, "mathlive", "mathlive-static.css"));
await cp(resolve(mathlive, "mathlive-fonts.css"), resolve(dist, "mathlive", "mathlive-fonts.css"));
await cp(resolve(mathlive, "fonts"), resolve(dist, "mathlive", "fonts"), { recursive: true });

console.log(`Built extension in ${dist}`);