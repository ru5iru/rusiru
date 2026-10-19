import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import site from '@/config/site.json';
import theme from '@/config/theme.json';
import en from '@/locales/en.json';
import { siteSchema, themeSchema } from '@/config/schema';
import { mergeLocale, readLanguage, storeLanguage } from '@/i18n/locale';
import { I18nProvider } from '@/i18n/i18n';
import { Projects } from '@/components/sections/Projects';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { navigateToSection } from '@/lib/navigation';
import { createSearchContent } from '../../scripts/search-content';

const setTheme = vi.fn();
vi.mock('next-themes', () => ({ useTheme: () => ({ theme: 'system', resolvedTheme: 'dark', setTheme }) }));
beforeEach(() => { vi.clearAllMocks(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('settings', () => {
  it('accepts current settings', () => { expect(siteSchema.safeParse(site).success).toBe(true); expect(themeSchema.safeParse(theme).success).toBe(true); });
  it('rejects duplicate sections', () => { expect(siteSchema.safeParse({ ...site, sections: ['about', 'about'] }).success).toBe(false); });
  it('rejects unknown sections', () => { expect(siteSchema.safeParse({ ...site, sections: ['unknown'] }).success).toBe(false); });
  it('supports no optional sections', () => { expect(siteSchema.safeParse({ ...site, sections: [] }).success).toBe(true); });
  it('rejects unsafe outbound URLs', () => { expect(siteSchema.safeParse({ ...site, blogUrl: 'javascript:alert(1)' }).success).toBe(false); });
  it('rejects missing nested fields', () => { expect(siteSchema.safeParse({ ...site, person: { ...site.person, email: '' } }).success).toBe(false); });
  it('rejects malformed theme values', () => { expect(themeSchema.safeParse({ light: { primary: '0 999% 50%' }, dark: {} }).success).toBe(false); });
});
describe('locales', () => {
  it('falls back by key and array position', () => { expect(mergeLocale({ title: 'Title', items: [{ title: 'First', description: ['One', 'Two'] }] }, { items: [{ title: 'Translated', description: ['Uno'] }] })).toEqual({ title: 'Title', items: [{ title: 'Translated', description: ['Uno', 'Two'] }] }); });
  it('rejects a lost placeholder', () => { expect(mergeLocale('Visit {title}', 'Visit')).toBe('Visit {title}'); });
  it('rejects a malformed array', () => { expect(mergeLocale(['One'], 'wrong')).toEqual(['One']); });
  it('survives denied storage reads', () => { vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Denied'); }); expect(readLanguage('en', { en: {} })).toBe('en'); });
  it('survives denied storage writes', () => { vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Denied'); }); expect(() => storeLanguage('en')).not.toThrow(); });
});
describe('interactions', () => {
  it('switches system-dark appearance to light on first click', () => { render(<I18nProvider><ThemeToggle /></I18nProvider>); fireEvent.click(screen.getByRole('button', { name: en.nav.toggleTheme })); expect(setTheme).toHaveBeenCalledWith('light'); });
  it('reveals additional projects and expands Jira independently', () => {
    render(<I18nProvider><Projects /></I18nProvider>);
    expect(screen.queryByRole('button', { name: 'Roamly' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: en.projects.viewMore }));
    expect(screen.getByRole('button', { name: 'Roamly' })).toBeInTheDocument();
    const jira = screen.getByRole('button', { name: 'Jira Worklog Manager' }); fireEvent.click(jira);
    expect(jira).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(jira); expect(jira).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(screen.getByRole('button', { name: en.projects.showLess }));
    expect(screen.queryByRole('button', { name: 'Roamly' })).not.toBeInTheDocument();
  });
  it('shows content when IntersectionObserver is unavailable', () => {
    function Probe() { const { ref, isVisible } = useScrollAnimation(); return <div ref={ref}>{String(isVisible)}</div>; }
    render(<Probe />); expect(screen.getByText('true')).toBeInTheDocument();
  });
  it('waits for a lazy target', async () => {
    const cancel = navigateToSection('late-target');
    const target = document.createElement('section'); target.id = 'late-target'; target.scrollIntoView = vi.fn(); document.body.appendChild(target);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(target.scrollIntoView).toHaveBeenCalled(); cancel(); target.remove();
  });
});
describe('search data', () => {
  it('includes all seven projects including Jira from current data', () => { const content = createSearchContent(site, en); const schema = JSON.parse(content.metadata.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? '{}'); const projects = schema['@graph'].find((item: Record<string, unknown>) => item['@type'] === 'ItemList'); expect(projects.numberOfItems).toBe(7); expect(projects.itemListElement.map((item: { item: { name: string } }) => item.item.name)).toContain('Jira Worklog Manager'); expect(content.llms).toContain('Jira Worklog Manager'); });
  it('uses configured section order and disabled sections in search data', () => { const content = createSearchContent({ ...site, sections: ['contact', 'about'] }, en); expect(content.fallback.indexOf('<section id="contact"')).toBeLessThan(content.fallback.indexOf('<section id="about"')); expect(content.fallback).not.toContain('<section id="projects"'); expect(content.metadata).not.toContain('ItemList'); });
  it('escapes injected metadata and structured data', () => { const content = createSearchContent({ ...site, seo: { ...site.seo, title: '</title><script>bad</script>' } }, en); expect(content.metadata).toContain('&lt;/title&gt;'); expect(content.metadata).not.toContain('<script>bad</script>'); });
  it('generates deterministic search content', () => { expect(createSearchContent(site, en)).toEqual(createSearchContent(site, en)); });
});