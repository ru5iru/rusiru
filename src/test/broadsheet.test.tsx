import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { I18nProvider } from '@/i18n/i18n';
import { About } from '@/components/sections/About';
import { Education } from '@/components/sections/Education';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Navbar } from '@/components/Navbar';
import { setBroadsheetAllExpanded } from '@/lib/navigation';
import { createSearchContent } from '../../scripts/search-content';
import site from '@/config/site.json';
import en from '@/locales/en.json';

beforeEach(() => setBroadsheetAllExpanded(false));
afterEach(cleanup);

describe('broadsheet sections', () => {
  it('renders formal education and all five Continuing Education credentials', () => {
    render(<I18nProvider><Education /></I18nProvider>);
    expect(screen.getByRole('heading', { name: en.education.items[0].institution })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: en.education.items[1].institution })).toBeInTheDocument();
    for (const certification of en.education.certifications) {
      expect(screen.getByRole('heading', { name: certification.title })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: `${en.education.showCredential}: ${certification.title}` })).toHaveAttribute('href', certification.url);
    }
    expect(en.education.certifications).toHaveLength(5);
  });

  it('unfolds and folds every experience dispatch from the section control', () => {
    render(<I18nProvider><Experience /></I18nProvider>);
    const triggers = () => en.experience.items.map(item => screen.getByRole('button', { name: new RegExp(`: ${item.role}$`) }));
    expect(triggers()[0]).toHaveAttribute('aria-expanded', 'true');
    expect(triggers()[1]).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(screen.getByRole('button', { name: 'Unfold All 3 Roles' }));
    for (const trigger of triggers()) expect(trigger).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByRole('button', { name: en.experience.foldAll }));
    expect(triggers()[0]).toHaveAttribute('aria-expanded', 'true');
    expect(triggers()[1]).toHaveAttribute('aria-expanded', 'false');
    expect(triggers()[2]).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens a front-page career brief at the matching full dispatch', () => {
    render(<I18nProvider><About /><Experience /></I18nProvider>);
    fireEvent.click(screen.getAllByRole('button', { name: en.hero.readDispatch })[1]);
    expect(screen.getByRole('button', { name: new RegExp(`: ${en.experience.items[1].role}$`) })).toHaveAttribute('aria-expanded', 'true');
  });

  it('applies the global unfold control to experience and archived projects', () => {
    render(<I18nProvider><Navbar><Experience /><Projects /></Navbar></I18nProvider>);
    expect(screen.queryByRole('button', { name: /Roamly/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: en.nav.unfoldAll }));
    expect(screen.getByRole('button', { name: /Roamly/ })).toHaveAttribute('aria-expanded', 'true');
    for (const item of en.experience.items) expect(screen.getByRole('button', { name: new RegExp(`: ${item.role}$`) })).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByRole('button', { name: en.nav.foldAll }));
    expect(screen.queryByRole('button', { name: /Roamly/ })).not.toBeInTheDocument();
  });

  it('keeps generated education search content synchronized with the locale', () => {
    const content = createSearchContent(site, en);
    for (const certification of en.education.certifications) {
      expect(content.fallback).toContain(certification.title);
      expect(content.llms).toContain(certification.title);
    }
    expect(content.fallback).toContain(site.continuingEducationUrl);
    expect(content.fallback).not.toContain('Years Experience');
    expect(content.fallback).not.toContain('Code Quality');
  });
});
