import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lynex.dev"),
  title: "Lynex | Software a medida para negocios que avanzan",
  description: "Diseñamos y desarrollamos software a medida para ordenar operaciones, automatizar procesos y tomar mejores decisiones.",
  openGraph: {
    title: "Lynex | Software a medida",
    description: "Soluciones digitales que encajan con la forma real de trabajar de tu empresa.",
    url: "https://lynex.dev",
    siteName: "Lynex",
    locale: "es_ES",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Lynex",
              url: "https://lynex.dev",
              email: "hola@lynex.dev",
              description: "Desarrollo de software a medida para negocios que avanzan.",
            }),
          }}
        />
      </body>
    </html>
  );
}
