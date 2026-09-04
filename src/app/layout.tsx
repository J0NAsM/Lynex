import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const staticImageExtension = site.staticHosting ? ".png" : "";
const appleIconUrl = `${site.url}/apple-icon${staticImageExtension}`;
const socialImageUrl = `${site.url}/opengraph-image${staticImageExtension}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Lynex | Webs y sistemas a medida en ${site.city}`,
    template: "%s | Lynex",
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  icons: { icon: `${site.url}/icon.svg`, apple: appleIconUrl },
  manifest: `${site.url}/manifest.webmanifest`,
  appleWebApp: { capable: true, title: site.name, statusBarStyle: "default" },
  openGraph: {
    title: "Lynex | Webs y sistemas a medida",
    description: `Construimos webs y software a medida para empresas de ${site.region}.`,
    url: site.url,
    siteName: site.name,
    locale: site.locale,
    type: "website",
    images: [{ url: socialImageUrl, width: 1200, height: 630, alt: "Lynex, webs y sistemas a medida" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lynex | Webs y sistemas a medida",
    description: "Software que trabaja como tu negocio.",
    images: [socialImageUrl],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#132b28",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const serviceArea = { "@type": "Country", name: site.region };
  const businessSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    email: site.email,
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(site.linkedin ? { sameAs: [site.linkedin] } : {}),
    description: site.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressCountry: "PY",
    },
    areaServed: serviceArea,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de Lynex",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sitios web profesionales",
            serviceType: "Desarrollo de sitios web",
            areaServed: serviceArea,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sistemas a medida",
            serviceType: "Desarrollo de software a medida",
            areaServed: serviceArea,
          },
        },
      ],
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: site.email,
      contactType: "sales",
      areaServed: "PY",
      availableLanguage: "Spanish",
    },
  }).replaceAll("<", "\\u003c");

  return (
    <html lang="es-PY">
      <body className={`${dmSans.variable} ${spaceGrotesk.variable}`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: businessSchema }}
        />
      </body>
    </html>
  );
}
