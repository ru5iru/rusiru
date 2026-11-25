import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { siteConfig } from '@/config';
import { localeSchema } from '@/i18n/schema';
import { resolveSiteConfig } from '@/config/settings';
import siteSettings from '@/config/site.json';
import { enabledSections, publishedItems, validatePublication, visibleSkills } from '@/config/publication';
import en from '@/locales/en.json';
import { I18nProvider } from '@/i18n/i18n';
import { Projects } from '@/components/sections/Projects';
import { Experience } from '@/components/sections/Experience';
import { Education } from '@/components/sections/Education';
import { Blog } from '@/components/sections/Blog';
import { About } from '@/components/sections/About';
import Index from '@/pages/Index';
import { jumpToBroadsheetItem, setBroadsheetAllExpanded } from '@/lib/navigation';
import { createSearchContent } from '../../scripts/search-content';
import { mergeLocale } from '@/i18n/locale';

vi.mock('next-themes', () => ({ useTheme: () => ({ theme: 'system', resolvedTheme: 'light', setTheme: vi.fn() }) }));
const baseline = structuredClone(siteConfig);
const records = { experience: en.experience.items, education: en.education.items, certifications: en.education.certifications, projects: en.projects.items, blog: en.blog.posts };
afterEach(() => { cleanup(); setBroadsheetAllExpanded(false); Object.assign(siteConfig, structuredClone(baseline)); });
const wrap = (children: React.ReactNode) => render(<I18nProvider>{children}</I18nProvider>);

describe('publication settings', () => {
  it('loads section flags exclusively from en.json', () => {
    const english = structuredClone(en);
    english.display.sections.projects = false;
    const config = resolveSiteConfig(siteSettings, english);
    expect(siteSettings).not.toHaveProperty('display');
    expect(enabledSections(config)).not.toContain('projects');
    expect(createSearchContent(siteSettings, english).metadata).not.toContain('ItemList');
  });

  it('loads item placement, expansion, and affiliations from en.json', () => {
    const english = structuredClone(en);
    english.display.items.projects.jira = { visible: true, featured: false, frontPage: true, expanded: false, affiliation: 'personal' };
    const config = resolveSiteConfig(siteSettings, english);
    expect(publishedItems(config, 'projects', english.projects.items).find(entry => entry.item.id === 'jira')?.settings).toEqual({ visible: true, featured: false, frontPage: true, expanded: false, affiliation: 'personal' });
  });

  it('loads skill and social visibility from en.json', () => {
    const english = structuredClone(en);
    english.display.skills.languages.items.Java = false;
    english.display.social.linkedin = false;
    const config = resolveSiteConfig(siteSettings, english);
    expect(visibleSkills(config).flatMap(category => category.items.map(item => item.name))).not.toContain('Java');
    expect(config.social.find(item => item.platform === 'linkedin')?.visible).toBe(false);
    expect(siteSettings.skills[0].items[0]).not.toHaveProperty('visible');
    expect(siteSettings.social[0]).not.toHaveProperty('visible');
  });

  it('keeps English publication flags unchanged across translations', () => {
    const english = structuredClone(en);
    english.display.sections.projects = false;
    const merged = mergeLocale(english, { display: en.display }) as typeof en;
    expect(merged.display.sections.projects).toBe(false);
  });

  it('rejects missing or unknown skill and social flags', () => {
    const english = structuredClone(en);
    expect(() => resolveSiteConfig(siteSettings, { ...english, display: { ...english.display, social: {} } })).toThrow('Missing display.social.linkedin');
    expect(() => resolveSiteConfig(siteSettings, { ...english, display: { ...english.display, social: { ...english.display.social, typo: true } } })).toThrow('Unknown display.social ID: typo');
    english.display.skills.languages.items = { ...english.display.skills.languages.items, typo: true } as typeof english.display.skills.languages.items;
    expect(() => resolveSiteConfig(siteSettings, english)).toThrow('Unknown display.skills.languages.items ID: typo');
  });
  it('keeps record IDs stable when changing languages', () => {
    expect(mergeLocale({ id: 'jira', title: 'Jira Worklog Manager' }, { id: 'translated-id', title: 'Translated title' })).toEqual({ id: 'jira', title: 'Translated title' });
  });

  it('removes an explicitly unselected project from the front page without hiding its full entry', () => {
    siteConfig.display.items.projects.jira.frontPage = false;
    wrap(<><About /><Projects /></>);
    expect(screen.getAllByRole('button', { name: en.hero.readDossier })).toHaveLength(1);
    expect(screen.getByRole('button', { name: /: Jira Worklog Manager$/ })).toBeInTheDocument();
  });

  it('hides configured banner, footer, theme controls, and biography', async () => {
    siteConfig.display.chrome.banner = false;
    siteConfig.display.chrome.footer = false;
    siteConfig.display.chrome.themeToggle = false;
    siteConfig.display.frontPage.biography = false;
    render(<HelmetProvider><I18nProvider><Index /></I18nProvider></HelmetProvider>);
    await screen.findByRole('region', { name: en.contact.ariaLabel });
    expect(screen.queryByRole('region', { name: en.hero.ariaLabel })).not.toBeInTheDocument();
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: en.nav.toggleTheme })).not.toBeInTheDocument();
    expect(createSearchContent(siteConfig, en).fallback).not.toContain("Hello! I&#39;m");
  });

  it('hides a disabled section in the application and search data', async () => {
    siteConfig.display.sections.projects = false;
    render(<HelmetProvider><I18nProvider><Index /></I18nProvider></HelmetProvider>);
    await screen.findByRole('region', { name: en.contact.ariaLabel });
    expect(screen.queryByRole('region', { name: en.projects.ariaLabel })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: en.nav.links.projects })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: en.hero.readDossier })).not.toBeInTheDocument();
    expect(enabledSections(siteConfig)).not.toContain('projects');
    expect(createSearchContent(siteConfig, en).metadata).not.toContain('ItemList');
  });

  it('never reveals a hidden project through View More or Unfold All', () => {
    siteConfig.display.items.projects.roamly.visible = false;
    wrap(<Projects />);
    fireEvent.click(screen.getByRole('button', { name: en.projects.viewMore }));
    fireEvent.click(screen.getByRole('button', { name: en.projects.unfoldAll }));
    expect(screen.queryByRole('button', { name: /Roamly/ })).not.toBeInTheDocument();
    const content = createSearchContent(siteConfig, en);
    expect(content.metadata).not.toContain('Roamly');
    expect(content.llms).not.toContain('Roamly');
    expect(content.fallback).not.toContain('Roamly');
  });

  it('keeps project front-page placement independent from archive placement', () => {
    siteConfig.display.items.projects.jira.featured = false;
    siteConfig.display.items.projects.jira.frontPage = true;
    wrap(<><About /><Projects /></>);
    expect(screen.queryByRole('button', { name: /Read Full Log.*Jira Worklog Manager/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: en.hero.readDossier })[1]);
    expect(screen.getByRole('button', { name: /Fold Log: Jira Worklog Manager/ })).toHaveAttribute('aria-expanded', 'true');
  });

  it('preserves original row indices after an earlier career entry is hidden', () => {
    siteConfig.display.items.experience['software-engineer'].visible = false;
    siteConfig.display.items.experience['associate-engineer'].featured = false;
    wrap(<><About /><Experience /></>);
    fireEvent.click(screen.getAllByRole('button', { name: en.hero.readDispatch })[0]);
    expect(screen.getByRole('button', { name: /Fold Dispatch: Associate Software Engineer/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.queryByRole('button', { name: /: Software Engineer$/ })).not.toBeInTheDocument();
  });

  it('supports formal education entries in View More', () => {
    siteConfig.display.items.education.mcg.featured = false;
    wrap(<Education />);
    expect(screen.queryByRole('heading', { name: en.education.items[1].institution })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: en.common.viewMore }));
    expect(screen.getByRole('heading', { name: en.education.items[1].institution })).toBeInTheDocument();
  });

  it('reveals an archived CE record when selected on the front page', () => {
    siteConfig.display.items.certifications.gdpr.featured = false;
    siteConfig.display.items.certifications.gdpr.frontPage = true;
    wrap(<><About /><Education /></>);
    expect(screen.queryByRole('link', { name: `${en.education.showCredential}: ${en.education.certifications[3].title}` })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: en.hero.inspectEducation }));
    expect(screen.getByRole('link', { name: `${en.education.showCredential}: ${en.education.certifications[3].title}` })).toBeInTheDocument();
  });

  it('excludes hidden credentials from the credential schema and registry', () => {
    siteConfig.display.items.certifications.kong.visible = false;
    wrap(<Education />);
    expect(screen.queryByRole('heading', { name: en.education.certifications[0].title })).not.toBeInTheDocument();
    expect(createSearchContent(siteConfig, en).metadata).not.toContain(en.education.certifications[0].title);
  });

  it('disables CE independently of formal education', () => {
    siteConfig.display.groups.continuingEducation = false;
    wrap(<><About /><Education /></>);
    expect(screen.getByRole('heading', { name: en.education.items[0].institution })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: en.hero.inspectEducation })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: en.education.certifications[0].title })).not.toBeInTheDocument();
    expect(createSearchContent(siteConfig, en).metadata).not.toContain('EducationalOccupationalCredential');
  });

  it('reveals archived blog entries without revealing hidden ones', () => {
    siteConfig.display.items.blog.owasp.visible = false;
    siteConfig.display.items.blog['clean-code'].featured = false;
    wrap(<Blog />);
    fireEvent.click(screen.getByRole('button', { name: en.common.viewMore }));
    expect(screen.getByRole('heading', { name: en.blog.posts[1].title })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: en.blog.posts[0].title })).not.toBeInTheDocument();
  });

  it.each(['omobio', 'personal', 'ucsc'])('accepts the configurable %s project affiliation', affiliation => {
    siteConfig.display.items.projects.jira.affiliation = affiliation;
    const project = publishedItems(siteConfig, 'projects', en.projects.items).find(entry => entry.item.id === 'jira');
    expect(project?.settings.affiliation).toBe(affiliation);
    expect(() => validatePublication(siteConfig, records, en.projects.affiliations)).not.toThrow();
    expect(createSearchContent(siteConfig, en).llms).toContain(`Jira Worklog Manager (${en.projects.affiliations[affiliation as keyof typeof en.projects.affiliations]})`);
  });

  it('uses configured initial expansion rather than positional defaults', () => {
    siteConfig.display.items.projects.dialog.expanded = false;
    siteConfig.display.items.projects.bizcare.expanded = true;
    wrap(<Projects />);
    expect(screen.getByRole('button', { name: /: Dialog.lk$/ })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: /: Dialog BizCare$/ })).toHaveAttribute('aria-expanded', 'true');
  });

  it('excludes hidden skill domains, skills, and social profiles from generated data', () => {
    siteConfig.skills[0].visible = false;
    siteConfig.skills[1].items[0].visible = false;
    siteConfig.social[0].visible = false;
    expect(visibleSkills(siteConfig).flatMap(category => category.items.map(item => item.name))).not.toContain('Java');
    expect(visibleSkills(siteConfig).flatMap(category => category.items.map(item => item.name))).not.toContain('React');
    const graph = JSON.parse(createSearchContent(siteConfig, en).metadata.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? '{}')['@graph'];
    expect(graph[0].sameAs).not.toContain(siteConfig.social[0].url);
  });

  it('rejects unknown IDs, duplicate IDs, unknown affiliations, and nonboolean switches', () => {
    siteConfig.display.items.projects.jira.affiliation = 'misspelled';
    expect(() => validatePublication(siteConfig, records, en.projects.affiliations)).toThrow('Missing affiliation');
    siteConfig.display.items.projects.jira.affiliation = '';
    siteConfig.display.items.projects.typo = { ...siteConfig.display.items.projects.jira };
    expect(() => validatePublication(siteConfig, records, en.projects.affiliations)).toThrow('Unknown projects record ID');
    delete siteConfig.display.items.projects.typo;
    expect(() => validatePublication(siteConfig, { ...records, projects: [en.projects.items[0], en.projects.items[0]] }, en.projects.affiliations)).toThrow('Duplicate');
    expect(localeSchema.safeParse({ ...en, display: { ...en.display, groups: { formalEducation: 'false', continuingEducation: true } } }).success).toBe(false);
  });

  it('ignores attempts to jump to unpublished records', () => {
    siteConfig.display.items.projects.jira.visible = false;
    wrap(<Projects />);
    jumpToBroadsheetItem('projects', 3);
    expect(screen.queryByRole('button', { name: /Jira Worklog Manager/ })).not.toBeInTheDocument();
  });
});