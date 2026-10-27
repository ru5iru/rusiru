import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/i18n';
import { siteConfig } from '@/config';
import { navigateToSection, scrollBehavior } from '@/lib/navigation';
const navItems = siteConfig.sections.map(key => ({ href: `#${key}`, key }));
export function Navbar() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll(); window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observed = new Set<Element>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id);
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
    const register = () => navItems.forEach(({ key }) => {
      const target = document.getElementById(key);
      if (target && !observed.has(target)) { observer.observe(target); observed.add(target); }
    });
    register();
    const mutations = new MutationObserver(register);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => { mutations.disconnect(); observer.disconnect(); };
  }, []);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const close = () => { if (media.matches) setIsMobileMenuOpen(false); };
    media.addEventListener('change', close);
    return () => media.removeEventListener('change', close);
  }, []);
  const click = (event: React.MouseEvent<HTMLAnchorElement>, key: string) => {
    event.preventDefault(); setIsMobileMenuOpen(false); navigateToSection(key);
  };
  return <Dialog.Root open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${isScrolled ? 'py-3 glass border-b border-border/50' : 'py-6 bg-transparent'}`}>
      <nav className="container mx-auto flex items-center justify-between px-6" aria-label={t('nav.mainNavigation')}>
        <a href="#" onClick={event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: scrollBehavior() }); }} className="text-xl font-display font-bold gradient-text sm:text-2xl">{t('nav.brand')}</a>
        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          {navItems.map(link => <a key={link.key} href={link.href} onClick={e => click(e, link.key)} aria-current={activeSection === link.key ? 'true' : undefined} className={`text-sm font-medium transition-colors ${activeSection === link.key ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{t(`nav.links.${link.key}`)}</a>)}
          <div className="flex items-center gap-1"><ThemeToggle /><LanguageSelector /></div>
        </div>
        <div className="flex items-center gap-2 md:hidden"><LanguageSelector /><ThemeToggle /><Dialog.Trigger asChild><Button variant="ghost" size="icon" aria-label={t('nav.openMenu')}><Menu className="h-6 w-6" /></Button></Dialog.Trigger></div>
      </nav>
    </header>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[55] bg-background/95 backdrop-blur-lg" />
      <Dialog.Content aria-describedby={undefined} className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 overflow-y-auto px-6 py-20">
        <Dialog.Title className="sr-only">{t('nav.mainNavigation')}</Dialog.Title>
        <Dialog.Close asChild><Button variant="ghost" size="icon" aria-label={t('nav.closeMenu')} className="absolute right-6 top-6"><X className="h-6 w-6" /></Button></Dialog.Close>
        {navItems.map(link => <a key={link.key} href={link.href} onClick={e => click(e, link.key)} aria-current={activeSection === link.key ? 'true' : undefined} className="text-2xl font-display font-semibold text-foreground hover:text-primary">{t(`nav.links.${link.key}`)}</a>)}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
