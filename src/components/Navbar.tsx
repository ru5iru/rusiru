import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/i18n';
import { siteConfig, resolveIcon, allSkills } from '@/config';


const navItems = siteConfig.sections.map((key) => ({ href: `#${key}`, key }));

export function Navbar() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for active section highlighting
  useEffect(() => {
    const sectionIds = navItems.map((link) => link.href.replace('#', ''));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3 glass border-b border-border/50'
            : 'py-6 bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-6 flex items-center justify-between" aria-label={t('nav.mainNavigation')}>
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xl sm:text-2xl font-display font-bold gradient-text hover:opacity-80 transition-opacity tracking-wide"
          >
            {t('nav.brand')}
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-sm font-medium transition-colors relative group ${
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {t(`nav.links.${link.key}`)}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 gradient-bg transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              );
            })}
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <LanguageSelector />
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSelector />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative z-[60]"
              aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu - outside header to avoid stacking context issues */}
      <div
        className={`fixed inset-0 bg-background/95 backdrop-blur-lg z-[55] transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((link, index) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-2xl font-display font-semibold transition-colors ${
                  isActive ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
                style={{
                  animation: isMobileMenuOpen
                    ? `fade-in-up 0.5s ease-out ${index * 0.1}s forwards`
                    : 'none',
                  opacity: isMobileMenuOpen ? 0 : 1,
                }}
              >
                {t(`nav.links.${link.key}`)}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}
