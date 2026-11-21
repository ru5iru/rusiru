import { useTranslation } from '@/i18n/i18n';

export function Hero() {
  const { t } = useTranslation();
  return (
    <section className="pt-6" aria-label={t('hero.ariaLabel')}>
      <div data-geo-summary="hero" className="sr-only">{t('hero.geoSummary')}</div>
      <div className="mb-6 pb-4 r-b">
        <div className="mb-1 font-mono text-xs uppercase tracking-widest text-primary">{t('hero.bannerKicker')}</div>
        <h2 className="font-display text-3xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl lg:text-[50px]">{t('hero.bannerTitle')}</h2>
        <p className="mt-2 max-w-4xl text-sm text-muted-foreground sm:text-base">{t('hero.description')}</p>
      </div>
    </section>
  );
}
