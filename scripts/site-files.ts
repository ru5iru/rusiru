import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';
import { siteSchema, themeSchema } from '../src/config/schema';
import { createNotFoundDocument, createSearchContent, type SearchSite, type SearchLocale, type SearchTheme } from './search-content';
import { assembleLocales, buildLocales } from '../src/i18n/build';

const localeDir = 'src/locales';

export function siteFilesPlugin(): Plugin {
  const root = process.cwd();
  const load = (file: string) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  const content = () => {
    const site = load('src/config/site.json');
    const theme = load('src/config/theme.json');
    siteSchema.parse(site); themeSchema.parse(theme);
    const files = Object.fromEntries(fs.readdirSync(path.join(root, localeDir), { withFileTypes: true }).filter(entry => entry.isDirectory())
      .flatMap(entry => fs.readdirSync(path.join(root, localeDir, entry.name)).filter(file => file.endsWith('.json')).map(file => `${localeDir}/${entry.name}/${file}`))
      .map(file => [file, load(file)]));
    const raw = assembleLocales(files);
    const en = buildLocales(raw).en;
    const rawEn = raw.en as { education: { items: { id: string }[] }; skills: { categories: Record<string, unknown>; notes: Record<string, unknown> } };
    for (const item of rawEn.education.items) if (!site.educationLogos[item.id]) throw new Error(`Missing education logo for ${item.id}`);
    for (const category of site.skills) {
      if (!rawEn.skills.categories[category.id]) throw new Error(`Missing skill category wording for ${category.id}`);
      if (!rawEn.skills.notes[category.id]) throw new Error(`Missing skill domain note for ${category.id}`);
    }
    const search = createSearchContent(site, en);
    return { site: site as SearchSite, en: en as SearchLocale, theme: theme as SearchTheme, ...search, notFound: createNotFoundDocument(site, en, theme) };
  };
  const generate = () => {
    const { site, llms, notFound } = content();
    const url = site.siteUrl.replace(/\/$/, '');
    const write = (file: string, value: string) => {
      const target = path.join(root, 'public', file);
      if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== value) fs.writeFileSync(target, value);
    };
    write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url}/</loc></url></urlset>\n`);
    write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`);
    write('llms.txt', llms);
    write('404.html', notFound);
    write('site.webmanifest', JSON.stringify({ name: site.seo.title, short_name: site.person.name, icons: [{ src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }, { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }], theme_color: site.seo.themeColor, background_color: site.seo.themeColor, display: 'standalone' }, null, 2) + '\n');
  };
  return {
    name: 'site-files', buildStart: generate,
    transformIndexHtml: { order: 'pre', handler(html) {
      const { metadata, fallback } = content();
      return html.replace('<!-- generated:metadata -->', metadata).replace('<!-- generated:content -->', fallback);
    } },
    configureServer(server) {
      const inputs = ['src/config/site.json', 'src/config/theme.json'].map(file => path.join(root, file));
      const locales = path.join(root, localeDir) + path.sep;
      server.watcher.add([...inputs, locales]);
      const change = (file: string) => { if (inputs.includes(file) || (file.startsWith(locales) && file.endsWith('.json'))) { try { generate(); server.ws.send({ type: 'full-reload' }); } catch (error) { server.config.logger.error(String(error)); } } };
      server.watcher.on('change', change);
      server.httpServer?.once('close', () => server.watcher.off('change', change));
    },
  };
}
