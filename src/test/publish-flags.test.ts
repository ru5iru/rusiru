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

  it('accepts renamed records and independently disabled template features', () => {
    const en = english();
    en.experience.items = [{ ...en.experience.items[0], id: 'custom-role', role: 'Custom Occupation', expanded: false, frontPage: false }];
    en.projects.items = [{ ...en.projects.items[0], id: 'custom-project', title: 'Custom Work', featured: false, frontPage: false, expanded: false }];
    en.education.items = [];
    en.education.certifications = [];
    const built = build(en).en;
    expect(built.experience.items.map(item => item.id)).toEqual(['custom-role']);
    expect(built.experience.items[0].frontPage).toBe(false);
    expect(built.projects.items[0].featured).toBe(false);
    expect(built.projects.items[0].frontPage).toBe(false);
    expect(publishedSections(built, site.sections)).not.toContain('education');
  });

  it('hides one role but keeps the others', () => {
    const en = english(); en.experience.items[0].published = false;
    const ids = build(en).en.experience.items.map(item => item.id);
    expect(ids).toEqual(['role-2', 'role-3']);
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
    const built = build(english(), { si: { experience: { items: [{ id: 'role-1', published: false }] } } });
    expect(built.en.experience.items.map(item => item.id)).toContain('role-1');
    expect(built.si.experience.items.map(item => item.id)).not.toContain('role-1');
    expect(built.si.experience.items).toHaveLength(2);
  });

  it('inherits an English flag when a translation only changes wording', () => {
    const en = english(); en.experience.items[0].published = false;
    const built = build(en, { si: { experience: { items: [{ id: 'role-1', role: 'Translated Role' }] } } });
    expect(built.si.experience.items.map(item => item.id)).not.toContain('role-1');
  });

  it('matches translated records by id, not list position', () => {
    expect(mergeLocale([{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }], [{ id: 'b', title: 'Bee' }])).toEqual([{ id: 'a', title: 'A' }, { id: 'b', title: 'Bee' }]);
  });

  it('uses expanded flags for the default open rows', () => {
    const raw = english();
    raw.experience.items.forEach((item: Raw, index: number) => { item.expanded = index === 1; });
    raw.projects.items.forEach((item: Raw, index: number) => { item.expanded = index === 2; });
    const built = build(raw).en;
    expect(expandedIndices(built.experience.items)).toEqual([1]);
    expect(expandedIndices(built.projects.items)).toEqual([2]);
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
    en.projects.affiliations.acme = 'Sample Affiliation';
    expect(build(en).en.projects.items[0].affiliation).toBe('acme');
  });

  it('rejects translation ids and files English does not have', () => {
    expect(() => build(english(), { si: { experience: { items: [{ id: 'ghost', published: false }] } } })).toThrow(/unknown id "ghost"/);
    expect(() => build(english(), { si: { awards: {} } })).toThrow(/unknown key "awards"/);
  });

  it('leaves unpublished content out of search and AI summaries', () => {
    const en = english(); en.projects.items[2].published = false;
    const content = createSearchContent(site, build(en).en);
    expect(content.llms).not.toContain('Sample Project 3');
    expect(content.fallback).not.toContain('Sample Project 3');
    expect(content.metadata).not.toContain('Sample Project 3');
  });
});
