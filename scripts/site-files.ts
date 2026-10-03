import fs from "fs";
import path from "path";
import type { Plugin } from "vite";

/**
 * Regenerates public/sitemap.xml, public/robots.txt and public/site.webmanifest
 * from src/config/site.json on every dev start and build.
 */
export function siteFilesPlugin(): Plugin {
  const generate = () => {
    const root = process.cwd();
    const site = JSON.parse(fs.readFileSync(path.join(root, "src/config/site.json"), "utf8"));
    const url = String(site.siteUrl).replace(/\/$/, "");
    const today = new Date().toISOString().slice(0, 10);
    const pub = path.join(root, "public");
    const write = (f: string, c: string) => {
      const p = path.join(pub, f);
      if (!fs.existsSync(p) || fs.readFileSync(p, "utf8") !== c) fs.writeFileSync(p, c);
    };

    write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`);

    const bots = ["Googlebot", "Bingbot", "Twitterbot", "facebookexternalhit", "GPTBot", "ChatGPT-User",
      "Google-Extended", "PerplexityBot", "ClaudeBot", "Amazonbot", "anthropic-ai", "Bytespider", "cohere-ai", "Meta-ExternalAgent"];
    write("robots.txt", [...bots, "*"].map((b) => `User-agent: ${b}\nAllow: /\n`).join("\n") + `\nSitemap: ${url}/sitemap.xml\n`);

    write("site.webmanifest", JSON.stringify({
      name: site.seo?.title ?? site.person?.name,
      short_name: site.person?.name,
      icons: [
        { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      theme_color: site.seo?.themeColor ?? "#ffffff",
      background_color: site.seo?.themeColor ?? "#ffffff",
      display: "standalone",
    }, null, 2) + "\n");
  };
  return { name: "site-files", buildStart: generate };
}
