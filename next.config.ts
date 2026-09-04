import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

function githubPagesBasePath() {
  if (!isGithubPages) return "";

  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || "").pathname.replace(/\/$/, "");
  } catch {
    return "/Lynex";
  }
}

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "connect-src 'self'",
  "font-src 'self' data:",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob:",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : "standalone",
  ...(isGithubPages
    ? {
        basePath: githubPagesBasePath(),
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
  poweredByHeader: false,
  ...(!isGithubPages
    ? {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: [
                { key: "Content-Security-Policy", value: contentSecurityPolicy },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "X-Frame-Options", value: "DENY" },
                { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
                { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
              ],
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
