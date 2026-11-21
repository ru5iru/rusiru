import { useTranslation } from '@/i18n/i18n';
import { siteConfig } from '@/config';

export function Skills() {
  const { t } = useTranslation();
  return (
    <section id="skills" className="py-8 r-double-b" aria-label={t('skills.ariaLabel')}>
      <div data-geo-summary="skills" className="sr-only">{t('skills.geoSummary')}</div>
      <div className="grid items-start gap-8 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-4">
          <div className="font-mono text-xs uppercase tracking-widest text-primary">{t('skills.kicker')}</div>
          <h2 className="font-display text-2xl font-black leading-tight sm:text-3xl">{t('skills.titleBefore')} {t('skills.titleHighlight')}</h2>
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{t('skills.philosophy')}</p>
          <div className="r-box bg-secondary p-3 font-mono text-xs text-muted-foreground"><strong className="text-foreground">{t('skills.noteLabel')}</strong> {t('skills.note')}</div>
        </div>
        <div className="lg:col-span-8">
          <div className="r-t r-b divide-y divide-border">
            {siteConfig.skills.map(category => (
              <div key={category.id} className="grid items-baseline gap-2 py-3.5 sm:grid-cols-12 sm:gap-4">
                <div className="sm:col-span-4">
                  <h3 className="font-display text-base font-bold">{t(`skills.categories.${category.id}`)}</h3>
                  <div className="text-xs italic text-faint">{t(`skills.notes.${category.id}`)}</div>
                </div>
                <div className="font-mono text-xs leading-relaxed text-muted-foreground sm:col-span-8 sm:text-sm">
                  {category.items.map(item => item.name).join(' · ')} <span className="text-faint">{t('skills.relatedEcosystem')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
