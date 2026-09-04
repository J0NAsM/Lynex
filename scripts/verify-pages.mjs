import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const output = join(process.cwd(), "out");
const indexPath = join(output, "index.html");

const requiredFiles = [
  indexPath,
  join(output, ".nojekyll"),
  join(output, "lynex-wordmark.svg"),
  join(output, "privacidad", "index.html"),
  join(output, "404.html"),
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    throw new Error(`Falta un archivo obligatorio en la exportación: ${file}`);
  }
}

if (statSync(indexPath).size < 30_000) {
  throw new Error("out/index.html es demasiado pequeño para contener la portada completa.");
}

const index = readFileSync(indexPath, "utf8");
const requiredFragments = [
  'id="inicio"',
  'id="servicios"',
  'id="problemas"',
  'id="proceso"',
  'id="garantias"',
  'id="nosotros"',
  'id="preguntas"',
  'id="contacto"',
  'href="#servicios"',
  'href="#contacto"',
  '/Lynex/lynex-wordmark.svg',
  '/Lynex/privacidad/',
  '/Lynex/_next/',
  "Carapeguá",
  "martinezlynex@gmail.com",
  "https://wa.me/595986914726",
  "tel:+595986914726",
];

for (const fragment of requiredFragments) {
  if (!index.includes(fragment)) {
    throw new Error(`El índice exportado no contiene: ${fragment}`);
  }
}

if (index.includes("/api/contact")) {
  throw new Error("La versión estática no debe intentar enviar datos a /api/contact.");
}

console.log("Exportación de Pages verificada: índice, navegación, marca y rutas completas.");
