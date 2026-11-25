import { ArrowUp } from 'lucide-react';
import { useTranslation } from '@/i18n/i18n';
import { siteConfig } from '@/config';
import { scrollBehavior } from '@/lib/navigation';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 pt-5 r-double-t font-mono text-xs text-muted-foreground">
      <div><strong className="text-foreground">{t('footer.brand')}</strong> — {t('footer.copyright', { year: new Date().getFullYear() })}</div>
      {siteConfig.display.chrome.backToTop && <a href="#front-page" onClick={event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: scrollBehavior() }); }} className="inline-flex min-h-6 items-center font-semibold text-primary underline">{t('common.backToTop')} <ArrowUp aria-hidden="true" className="inline h-3.5 w-3.5" /></a>}
    </footer>
  );
}
