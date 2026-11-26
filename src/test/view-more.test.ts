import { describe, expect, it } from 'vitest';
import { rawLocales } from '@/i18n/locales';
import { buildLocales } from '@/i18n/build';
import { hasArchived, visibleRecords } from '@/i18n/publish';

type Raw = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const english = () => structuredClone(rawLocales.en) as Raw;

describe('view more support', () => {
  it('needs no View More when sample records have no archived flags', () => {
    const en = buildLocales({ en: english() }).en;
    expect(hasArchived(en.experience.items)).toBe(false);
    expect(hasArchived(en.education.items)).toBe(false);
    expect(hasArchived(en.education.certifications)).toBe(false);
  });

  it('puts an archived role behind View More but keeps it published', () => {
    const raw = english(); raw.experience.items[2].archived = true;
    const items = buildLocales({ en: raw }).en.experience.items;
    expect(items).toHaveLength(3);
    expect(visibleRecords(items, false).map(entry => entry.index)).toEqual([0, 1]);
    expect(visibleRecords(items, true)).toHaveLength(3);
  });

  it('archives education and credentials independently', () => {
    const raw = english(); raw.education.certifications[0].archived = true;
    const en = buildLocales({ en: raw }).en;
    expect(hasArchived(en.education.certifications)).toBe(true);
    expect(hasArchived(en.education.items)).toBe(false);
  });

  it('lets a translation archive an item without restating English', () => {
    const fr = { experience: { items: [{ id: english().experience.items[0].id, archived: true }] } };
    const locales = buildLocales({ en: english(), fr } as never);
    expect(locales.fr.experience.items[0].archived).toBe(true);
    expect(locales.en.experience.items[0].archived).toBeUndefined();
  });
});
