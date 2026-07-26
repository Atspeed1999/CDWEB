import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import worker from "../dist/server/index.js";

const outputDirectory = resolve("vercel-dist");
const pages = ["/", "/directions"];

await rm(outputDirectory, { recursive: true, force: true });
await cp(resolve("dist/client"), outputDirectory, { recursive: true });

for (const page of pages) {
  const response = await worker.fetch(new Request(`https://preview.local${page}`));
  if (!response.ok) throw new Error(`Could not render ${page}: ${response.status}`);

  const pageDirectory = page === "/"
    ? outputDirectory
    : resolve(outputDirectory, page.replace(/^\//, ""));

  await mkdir(pageDirectory, { recursive: true });
  await writeFile(resolve(pageDirectory, "index.html"), await response.text());
}
