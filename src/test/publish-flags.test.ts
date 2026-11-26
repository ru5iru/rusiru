import { describe, expect, it } from 'vitest';
import site from '@/config/site.json';
import { rawLocales } from '@/i18n/locales';
import { buildLocales } from '@/i18n/build';
import { mergeLocale, type Dict } from '@/i18n/locale';
import { expandedIndices, publishedSections } from '@/i18n/publish';
import { createSearchContent } from '../../scripts/search-content';

type Raw = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const english = () => structuredClone(rawLocales.en) as Raw;
const build = (en: Raw, extra: Record<string, Dict> = {}) => buildLocales({ en, ...extra });

describe('publish flags', () => {
  it('hides a whole section when its flag is false', () => {
    const en = english(); en.experience.published = false;
    expect(publishedSections(build(en).en, site.sections)).not.toContain('experience');
  });

  it('hides a section whose items are all unpublished', () => {
    const en = english(); for (const post of en.blog.posts) post.published = false;
    expect(publishedSections(build(en).en, site.sections)).not.toContain('blog');
  });

  it('hides one role but keeps the others', () => {
    const en = english(); en.experience.items[0].published = false;
    const ids = build(en).en.experience.items.map(item => item.id);
    expect(ids).toEqual(['associate-software-engineer', 'trainee-full-stack-developer']);
  });

  it('hides one bullet point inside a role', () => {
    const en = english(); const [first, second] = en.experience.items[0].description;
    en.experience.items[0].description[1] = { text: second, published: false };
    const points = build(en).en.experience.items[0].description;
    expect(points).toContain(first);
    expect(points).not.toContain(second);
  });

  it('hides a skill category and a social label', () => {
    const en = english();
    en.skills.categories.languages = { text: en.skills.categories.languages, published: false };
    en.footer.social.reddit = { text: 'Reddit', published: false };
    const built = build(en).en;
    expect(built.skills.categories).not.toHaveProperty('languages');
    expect(built.footer.social).not.toHaveProperty('reddit');
  });

  it('hides formal or continuing education independently', () => {
    const en = english(); en.education.continuingEducation.published = false;
    const built = build(en).en;
    expect(built.education.continuingEducation.published).toBe(false);
    expect(publishedSections(built, site.sections)).toContain('education');
  });

  it('lets another language hide a role that English still shows', () => {
    const built = build(english(), { si: { experience: { items: [{ id: 'software-engineer', published: false }] } } });
    expect(built.en.experience.items.map(item => item.id)).toContain('software-engineer');
    expect(built.si.experience.items.map(item => item.id)).not.toContain('software-engineer');
    expect(built.si.experience.items).toHaveLength(2);
  });

  it('inherits an English flag when a translation only changes wording', () => {
    const en = english(); en.experience.items[0].published = false;
    const built = build(en, { si: { experience: { items: [{ id: 'software-engineer', role: 'මෘදුකාංග ඉංජිනේරු' }] } } });
    expect(built.si.experience.items.map(item => item.id)).not.toContain('software-engineer');
  });

  it('matches translated records by id, not list position', () => {
    expect(mergeLocale([{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }], [{ id: 'b', title: 'Bee' }])).toEqual([{ id: 'a', title: 'A' }, { id: 'b', title: 'Bee' }]);
  });

  it('uses expanded flags for the default open rows', () => {
    const built = build(english()).en;
    expect(expandedIndices(built.experience.items)).toEqual([0]);
    expect(expandedIndices(built.projects.items)).toEqual([0, 2, 3]);
  });

  it('rejects a misspelled flag', () => {
    const en = english(); en.experience.items[0].publised = false;
    expect(() => build(en)).toThrow(/publised/);
  });

  it('rejects duplicate ids', () => {
    const en = english(); en.projects.items[1].id = en.projects.items[0].id;
    expect(() => build(en)).toThrow(/Duplicate id/);
  });

  it('rejects an unknown affiliation and accepts a configured one', () => {
    const en = english(); en.projects.items[0].affiliation = 'acme';
    expect(() => build(en)).toThrow(/Unknown affiliation/);
    en.projects.items[0].affiliation = 'omobio';
    expect(build(en).en.projects.items[0].affiliation).toBe('omobio');
  });

  it('rejects translation ids and files English does not have', () => {
    expect(() => build(english(), { si: { experience: { items: [{ id: 'ghost', published: false }] } } })).toThrow(/unknown id "ghost"/);
    expect(() => build(english(), { si: { awards: {} } })).toThrow(/unknown key "awards"/);
  });

  it('leaves unpublished content out of search and AI summaries', () => {
    const en = english(); en.projects.items.find((item: Raw) => item.id === 'roamly').published = false;
    const content = createSearchContent(site, build(en).en);
    expect(content.llms).not.toContain('Roamly');
    expect(content.fallback).not.toContain('Roamly');
    expect(content.metadata).not.toContain('Roamly');
  });
});
