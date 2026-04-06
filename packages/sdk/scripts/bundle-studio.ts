/**
 * Inlines the standalone studio bundle into a self-contained HTML string,
 * saved as src/studio-bundle.ts for the SDK routers to serve.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const STANDALONE = resolve(import.meta.dir, "../../studio/dist-standalone");
const OUT = resolve(import.meta.dir, "../src/studio-bundle.ts");

const js = readFileSync(resolve(STANDALONE, "studio.iife.js"), "utf-8");
const css = readFileSync(resolve(STANDALONE, "studio.css"), "utf-8");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ModelKit Studio</title>
  <style>*,*::before,*::after{box-sizing:border-box}html,body,#root{margin:0;padding:0;height:100%;width:100%}</style>
  <style>${css}</style>
</head>
<body>
  <div id="root"></div>
  <script>${js}</script>
  <script>ModelKitStudioLib.mount(document.getElementById("root"),"__MODELKIT_API_URL__")</script>
</body>
</html>`;

const escaped = html.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

writeFileSync(OUT, `// AUTO-GENERATED — do not edit. Run: bun scripts/bundle-studio.ts
export const STUDIO_HTML_TEMPLATE = \`${escaped}\`;
export function renderStudioHtml(apiUrl: string): string {
  return STUDIO_HTML_TEMPLATE.replace("__MODELKIT_API_URL__", apiUrl);
}
`);

console.log(`✓ Studio bundle → src/studio-bundle.ts (${Math.round(html.length / 1024)}kb)`);
