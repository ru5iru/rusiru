# Deployment and maintenance

## Prepare a release

1. Set `siteUrl` in [site.json](../src/config/site.json) to the intended public HTTPS origin. Review identity, résumé, profiles, articles, project links, and every language's publication flags.
2. Replace inherited imagery, favicons, and site-verification material when using the template for someone else.
3. Run lint and tests, then `bun run build` locally. In Lovable's managed workspace, review automatic compilation results instead of invoking a manual build.
4. Preview the result and check navigation, individual/global fold controls, project filters, View More, front-page jumps, theme switching, mobile menu, and contact actions. Exercise additional languages and archives if enabled.
5. Deploy through your hosting workflow. Lovable publishing uses the project's Publish dialog; it is separate from saving code. For a static host, deploy `dist/`.

## Generated content

[scripts/site-files.ts](../scripts/site-files.ts) and [scripts/search-content.ts](../scripts/search-content.ts) own:

| Output | Purpose |
| --- | --- |
| `public/sitemap.xml` | Canonical homepage URL |
| `public/robots.txt` | Crawler policy and sitemap location |
| `public/site.webmanifest` | Site names, theme colors, and icon references |
| `public/llms.txt` | Readable portfolio summary and links |
| `public/404.html` | Static, noindex error document |
| Served/built `index.html` | Metadata, social tags, JSON-LD, and readable no-JavaScript fallback |

The HTML source keeps generation markers; Vite fills them when serving or building. Generated content follows shared settings and English publication flags. Archived records remain included; unpublished records do not. Sitemap modification dates and profile creation dates are omitted rather than guessed.

During development, settings/locale edits regenerate public files. Preview serves an existing build; rebuild locally to preview new release content. Image optimization is a separate command and runs automatically before production builds.

The manifest does not provide offline support. Search metadata and crawler allowances do not guarantee indexing or rankings.

## Hosting rules

[netlify.toml](../netlify.toml) configures the build command, `dist/` output, and a permanent `/index.html` → `/` redirect. Netlify serves the generated `404.html` with HTTP 404 for unmatched paths.

Other hosts must provide equivalent canonical redirects and real error statuses. Avoid blanket rewrites that turn every unknown path into a homepage with HTTP 200. A client-side error view cannot set the HTTP response status. Lovable preview hosting may use its own fallback rules, so verify production behavior separately.

DNS, HTTPS, cache rules, security headers, search-account verification, and rollback controls belong to the chosen host and owner. Keep a known-good release or version available; use the host's rollback controls or republish that version if needed.

## After deployment

- Open the homepage, `/index.html`, and an unknown path. Check the canonical URL, redirect, and HTTP 404 respectively.
- Check `robots.txt`, sitemap, manifest, `llms.txt`, static 404, social image, portrait, and favicon URLs.
- Inspect page title, description, social tags, and structured data; the error page should be noindex and use error-specific descriptions.
- Follow résumé, blog, credentials, project, and contact links. Some profile services restrict automated requests; confirm questionable links in a normal browser before removing them.
- Submit the sitemap and inspect indexing in your own search-engine accounts. Keep verification material provider-issued.
- Measure production performance with appropriate lab or field data. A single local loading sample is not a Core Web Vitals verdict.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Invalid locale/configuration message | JSON syntax, required schema fields, stable IDs, placeholders, URLs, and HSL ranges |
| Missing education logo during generation | Every English school ID must map to a logo; original local logos must mirror the `/media/` path under `media-src/` |
| Unexpectedly hidden content | Section/group/item `published` flags and inherited English flags; development console lists explicitly hidden paths |
| Missing lower section or loading error | Browser console and lazy-chunk requests; use the section's reload action |
| Metadata or search files show old content | Correct inputs, regenerated files, deployed release, and host caches |
| Unknown URL returns HTTP 200 | Host rewrite/fallback configuration, not the React error view |
| Portrait or social card is wrong | Configured portrait path, `favicon.svg`, image generation, and deployed media |
| Email action does not send a message | The button opens the visitor's email client; this template does not send mail itself |

Keep credentials and private data out of configuration, locales, public assets, and browser-visible code. Report vulnerabilities through [SECURITY.md](../SECURITY.md).
