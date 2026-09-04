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
  "Lynex desarrolla y administra sus propios sistemas",
  "pagando una suscripción mensual",
  "Plan mensual",
  "Según el sistema y el plan",
];

if (process.env.NEXT_PUBLIC_INTAKE_API_URL?.trim()) {
  requiredFragments.push(
    "¿En qué etapa está tu idea?",
    "Diagnóstico Lynex",
    "Tus respuestas se guardan automáticamente",
  );
} else {
  requiredFragments.push(
    "Contacto directo",
    "El diagnóstico guiado se habilita únicamente cuando su envío seguro está conectado.",
  );
}

for (const fragment of requiredFragments) {
  if (!index.includes(fragment)) {
    throw new Error(`El índice exportado no contiene: ${fragment}`);
  }
}

const forbiddenFragments = [
  "/api/contact",
  "El código es tuyo",
  "¿De quién es el código?",
  "se transfiere todo",
  "Software SaaS para tu operación",
  "sistema SaaS que tu empresa necesita",
  "Primera versión en 4 a 8 semanas",
];

for (const fragment of forbiddenFragments) {
  if (index.includes(fragment)) {
    throw new Error(`El índice exportado contiene texto o comportamiento obsoleto: ${fragment}`);
  }
}

console.log("Exportación de Pages verificada: índice, navegación, marca y rutas completas.");
