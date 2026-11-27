import { useEffect, useState, type ReactNode } from 'react';
import { Menu, Minus, Plus, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/i18n';
import { siteConfig } from '@/config';
import { isBroadsheetAllExpanded, navigateToSection, setBroadsheetAllExpanded } from '@/lib/navigation';

export function Navbar({ children }: { children: ReactNode }) {
  const { t, sections } = useTranslation();
  const navItems = sections.map(key => ({ href: `#${key}`, key }));
  const sectionKey = sections.join(',');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [allExpanded, setAllExpanded] = useState(isBroadsheetAllExpanded());

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observed = new Set<Element>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id);
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
    const register = () => sectionKey.split(',').forEach(key => {
      const target = document.getElementById(key);
      if (target && !observed.has(target)) { observer.observe(target); observed.add(target); }
    });
    register();
    const mutations = new MutationObserver(register);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => { mutations.disconnect(); observer.disconnect(); };
  }, [sectionKey]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const close = () => { if (media.matches) setIsMobileMenuOpen(false); };
    media.addEventListener('change', close);
    return () => media.removeEventListener('change', close);
  }, []);

  const click = (event: React.MouseEvent<HTMLAnchorElement>, key: string) => {
    event.preventDefault();
    setIsMobileMenuOpen(false);
    navigateToSection(key);
  };
  const toggleAll = () => {
    const next = !allExpanded;
    setAllExpanded(next);
    setBroadsheetAllExpanded(next);
  };
  const links = navItems.map(link => (
    <a
      key={link.key}
      href={link.href}
      onClick={event => click(event, link.key)}
      aria-current={activeSection === link.key ? 'location' : undefined}
      className={`r-box inline-flex min-h-6 items-center px-2.5 py-0.5 font-semibold hover:underline ${activeSection === link.key ? 'bg-foreground text-background' : link.key === 'contact' ? 'text-primary' : ''}`}
    >
      {t(`nav.links.${link.key}`)}
    </a>
  ));

  return (
    <Dialog.Root open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <div className="min-h-screen bg-desk px-2 py-4 text-desk-foreground sm:px-6 sm:py-8">
        <div className="mx-auto mb-4 flex max-w-6xl flex-wrap items-center justify-between gap-3 border border-desk-foreground/15 bg-desk-foreground/[0.06] px-3.5 py-2 font-mono text-xs text-desk-foreground">
          <div className="flex items-center gap-2.5">
            <span className="bg-primary px-2 py-0.5 font-semibold text-primary-foreground">{t('nav.editionBadge')}</span>
            <span className="hidden sm:inline">{t('nav.editionSubtitle')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" onClick={toggleAll} aria-pressed={allExpanded} className="h-auto rounded-none border border-desk-foreground/25 px-2.5 py-1 font-mono text-xs text-desk-foreground hover:bg-desk-foreground/10 hover:text-desk-foreground">
              {allExpanded ? <Minus aria-hidden="true" className="mr-1.5 h-3.5 w-3.5" /> : <Plus aria-hidden="true" className="mr-1.5 h-3.5 w-3.5" />}
              {t(allExpanded ? 'nav.foldAll' : 'nav.unfoldAll')}
            </Button>
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </div>

        <div className="broadsheet-page p-4 text-foreground sm:p-8 md:p-12">
          <header id="front-page">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 r-b font-mono text-[11px] text-muted-foreground">
              <span>{t('nav.registrationEdition')}</span>
              <span className="hidden md:inline">{t('nav.registrationDisciplines')}</span>
              <span>{t('nav.registrationIssue')}</span>
            </div>
            <div className="py-6 text-center r-heavy-b sm:py-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{t('nav.mastheadKicker')}</div>
              <h1 className="mt-1.5 font-display text-5xl font-black leading-[0.94] tracking-tight sm:text-7xl lg:text-[76px]">{siteConfig.person.name.toUpperCase()}</h1>
              <p className="mx-auto mt-2 max-w-2xl font-serif text-base italic text-muted-foreground sm:text-lg">{t('hero.mastheadSubtitle')}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 py-2.5 r-double-b font-mono text-xs">
              <div>
                <strong>{t('nav.indexTitle')}</strong> — <span className="text-muted-foreground">{t('nav.indexSubtitle')}</span>
              </div>
              <nav className="hidden flex-wrap gap-1.5 lg:flex" aria-label={t('nav.mainNavigation')}>{links}</nav>
              <Dialog.Trigger asChild>
                <Button variant="outline" size="sm" aria-label={t('nav.openMenu')} className="font-mono lg:hidden"><Menu aria-hidden="true" className="mr-2 h-4 w-4" />{t('nav.indexTitle')}</Button>
              </Dialog.Trigger>
            </div>
          </header>
          {children}
        </div>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[55] bg-desk/90" />
        <Dialog.Content aria-describedby={undefined} className="fixed inset-4 z-[60] overflow-y-auto border border-foreground bg-background p-6 text-foreground shadow-2xl sm:inset-x-16 sm:inset-y-10">
          <Dialog.Title className="pr-10 font-display text-2xl font-black">{t('nav.indexTitle')}</Dialog.Title>
          <Dialog.Close asChild><Button variant="ghost" size="icon" aria-label={t('nav.closeMenu')} className="absolute right-4 top-4"><X aria-hidden="true" className="h-6 w-6" /></Button></Dialog.Close>
          <nav className="mt-8 flex flex-col gap-4" aria-label={t('nav.mainNavigation')}>
            {navItems.map(link => <a key={link.key} href={link.href} onClick={event => click(event, link.key)} className="r-b pb-3 font-display text-2xl font-semibold hover:text-primary">{t(`nav.links.${link.key}`)}</a>)}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
