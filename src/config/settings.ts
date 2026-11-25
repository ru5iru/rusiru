import { siteSchema, type SiteConfig, type SiteSettings } from './schema';
import type englishDefaults from '../locales/en.json';
import { localeSchema } from '../i18n/schema';
import { validatePublication } from './publication';

/** English owns publication; runtime consumers receive one validated projection. */
export function resolveSiteConfig(settings: unknown, english: unknown): SiteConfig {
  const site = siteSchema.parse(settings) as SiteSettings;
  const en = localeSchema.parse(english) as typeof englishDefaults;
  const display: SiteConfig['display'] = en.display;
  const checkKeys = (flags: Record<string, unknown>, ids: string[], path: string) => {
    for (const id of ids) if (!(id in flags)) throw new Error(`Missing ${path}.${id}`);
    for (const id of Object.keys(flags)) if (!ids.includes(id)) throw new Error(`Unknown ${path} ID: ${id}`);
  };
  checkKeys(display.social, site.social.map(item => item.platform), 'display.social');
  checkKeys(display.skills, site.skills.map(item => item.id), 'display.skills');
  const config: SiteConfig = {
    ...site,
    display,
    social: site.social.map(item => ({ ...item, visible: display.social[item.platform] })),
    skills: site.skills.map(category => {
      const flags = display.skills[category.id];
      checkKeys(flags.items, category.items.map(item => item.name), `display.skills.${category.id}.items`);
      return { ...category, visible: flags.visible, items: category.items.map(item => ({ ...item, visible: flags.items[item.name] })) };
    }),
  };
  validatePublication(config, { experience: en.experience.items, education: en.education.items, certifications: en.education.certifications, projects: en.projects.items, blog: en.blog.posts }, en.projects.affiliations);
  return config;
}