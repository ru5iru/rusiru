import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';
import { siteSchema, themeSchema } from '../src/config/schema';
import { createSearchContent, type SearchSite, type SearchLocale } from './search-content';

export function siteFilesPlugin(): Plugin {
  const root = process.cwd();
  const load = (file: string) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  const content = () => {
    const site = load('src/config/site.json');
    siteSchema.parse(site); themeSchema.parse(load('src/config/theme.json'));
    const en = load('src/locales/en.json');
    return { site: site as SearchSite, en: en as SearchLocale, ...createSearchContent(site, en) };
  };
  const generate = () => {
    const { site, llms } = content();
    const url = site.siteUrl.replace(/\/$/, '');
    const write = (file: string, value: string) => {
      const target = path.join(root, 'public', file);
      if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== value) fs.writeFileSync(target, value);
    };
    write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url}/</loc></url></urlset>\n`);
    write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`);
    write('llms.txt', llms);
    write('site.webmanifest', JSON.stringify({ name: site.seo.title, short_name: site.person.name, icons: [{ src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }, { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }], theme_color: site.seo.themeColor, background_color: site.seo.themeColor, display: 'standalone' }, null, 2) + '\n');
  };
  return {
    name: 'site-files', buildStart: generate,
    transformIndexHtml: { order: 'pre', handler(html) {
      const { metadata, fallback } = content();
      return html.replace('<!-- generated:metadata -->', metadata).replace('<!-- generated:content -->', fallback);
    } },
    configureServer(server) {
      const inputs = ['src/config/site.json', 'src/config/theme.json', 'src/locales/en.json'].map(file => path.join(root, file));
      server.watcher.add(inputs);
      const change = (file: string) => { if (inputs.includes(file)) { try { generate(); server.ws.send({ type: 'full-reload' }); } catch (error) { server.config.logger.error(String(error)); } } };
      server.watcher.on('change', change);
      server.httpServer?.once('close', () => server.watcher.off('change', change));
    },
  };
}
