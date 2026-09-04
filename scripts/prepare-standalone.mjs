import { cpSync, existsSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");

if (process.env.GITHUB_PAGES === "true") {
  const exported = join(root, "out");

  if (!existsSync(exported)) {
    throw new Error("No se encontró la exportación estática de Next.js.");
  }

  // Evita que GitHub Pages procese la carpeta _next con Jekyll.
  writeFileSync(join(exported, ".nojekyll"), "");
  process.exit(0);
}

if (!existsSync(standalone)) {
  throw new Error("No se encontró la salida standalone de Next.js.");
}

for (const [source, destination] of [
  [join(root, "public"), join(standalone, "public")],
  [join(root, ".next", "static"), join(standalone, ".next", "static")],
]) {
  if (!existsSync(source)) continue;
  rmSync(destination, { recursive: true, force: true });
  cpSync(source, destination, { recursive: true });
}
