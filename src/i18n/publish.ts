import type { Locale } from './schema';

type SectionId = 'about' | 'experience' | 'education' | 'projects' | 'skills' | 'blog' | 'contact';
const hasContent: Partial<Record<SectionId, (locale: Locale) => boolean>> = {
  about: locale => locale.about.paragraphs.length > 0,
  experience: locale => locale.experience.items.length > 0,
  projects: locale => locale.projects.items.length > 0,
  blog: locale => locale.blog.posts.length > 0,
  skills: locale => Object.keys(locale.skills.categories).length > 0,
  education: locale => (locale.education.formalEducation.published && locale.education.items.length > 0)
    || (locale.education.continuingEducation.published && locale.education.certifications.length > 0),
};

/** Configured section order, minus sections this language unpublished or left with nothing to show. */
export function publishedSections(locale: Locale, sections: readonly string[]): string[] {
  return sections.filter(id => {
    const section = locale[id as SectionId] as { published?: boolean } | undefined;
    return section?.published !== false && (hasContent[id as SectionId]?.(locale) ?? true);
  });
}

/** Items that start unfolded; falls back to the first item when none is flagged. */
export function expandedIndices(items: { expanded?: boolean }[]): number[] {
  const flagged = items.flatMap((item, index) => item.expanded ? [index] : []);
  return flagged.length || !items.length ? flagged : [0];
}

/** True when any item is flagged `archived` and therefore sits behind a View More toggle. */
export function hasArchived(items: { archived?: boolean }[]): boolean {
  return items.some(item => item.archived === true);
}

/** Items shown for the current View More state, keeping each item's original index. */
export function visibleRecords<T extends { archived?: boolean }>(items: T[], showAll: boolean): { item: T; index: number }[] {
  return items.map((item, index) => ({ item, index })).filter(({ item }) => showAll || item.archived !== true);
}
