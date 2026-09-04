import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");

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

