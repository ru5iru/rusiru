import "@testing-library/jest-dom";
import { vi } from "vitest";

// Behavior tests use independent samples, never the owner's editable content.
vi.mock('@/config/site.json', async () => {
  const { default: fixture } = await import('./fixtures/portfolio.json');
  return { default: structuredClone(fixture.site) };
});
vi.mock('@/config/theme.json', async () => {
  const { default: fixture } = await import('./fixtures/portfolio.json');
  return { default: structuredClone(fixture.theme) };
});
vi.mock('@/i18n/locales', async () => {
  const { default: fixture } = await import('./fixtures/portfolio.json');
  const { localeSchema } = await import('@/i18n/schema');
  const raw = structuredClone(fixture.locale);
  const english = localeSchema.parse(raw);
  return { rawLocales: { en: raw }, locales: { en: english }, english };
});

Element.prototype.scrollIntoView = vi.fn();

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
