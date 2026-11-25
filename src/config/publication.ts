import type { SiteConfig } from './schema';

export type RecordGroup = keyof SiteConfig['display']['items'];
export type Publication = SiteConfig['display']['items']['projects'][string];

/** Keep source indices intact so front-page jumps still target the right row. */
export function publishedItems<T extends { id: string }>(site: SiteConfig, group: RecordGroup, items: T[]) {
  return items.flatMap((item, index) => {
    const settings = site.display.items[group][item.id];
    return settings?.visible ? [{ item, index, settings }] : [];
  });
}

export const enabledSections = (site: SiteConfig): string[] => site.sections.filter(id => site.display.sections[id as keyof SiteConfig['display']['sections']]);
export const visibleSkills = (site: SiteConfig) => site.skills.filter(category => category.visible).map(category => ({ ...category, items: category.items.filter(item => item.visible) })).filter(category => category.items.length > 0);
export const visibleSocial = (site: SiteConfig) => site.social.filter(social => social.visible);

/** Reject misspelled/stale IDs instead of silently publishing the wrong content. */
export function validatePublication(site: SiteConfig, records: Record<RecordGroup, { id: string }[]>, affiliations: Record<string, string>) {
  for (const group of Object.keys(records) as RecordGroup[]) {
    const ids = records[group].map(item => item.id);
    if (new Set(ids).size !== ids.length) throw new Error(`Duplicate ${group} record IDs`);
    for (const id of ids) if (!site.display.items[group][id]) throw new Error(`Missing display.items.${group}.${id}`);
    for (const [id, settings] of Object.entries(site.display.items[group])) {
      if (!ids.includes(id)) throw new Error(`Unknown ${group} record ID: ${id}`);
      if (settings.affiliation && !affiliations[settings.affiliation]) throw new Error(`Missing affiliation wording: ${settings.affiliation}`);
    }
  }
}