import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useTranslation } from '@/i18n/i18n';

import { siteConfig, resolveIcon, allSkills } from '@/config';

const skillCategories = siteConfig.skills;

export function Skills() {
  const { ref, isVisible } = useScrollAnimation();
  const { t } = useTranslation();

  return (
    <section id="skills" className="py-24 md:py-32 relative overflow-hidden" aria-label={t('skills.ariaLabel')}>
      {/* GEO: Skills summary for AI engines */}
      <div data-geo-summary="skills" className="sr-only" aria-hidden="false">
        {t('skills.geoSummary')}
      </div>
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative">
        <div ref={ref}>
          <h2
            className={`section-heading transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {t('skills.titleBefore')} <span className="gradient-text">{t('skills.titleHighlight')}</span>
          </h2>

          <div className="max-w-4xl mx-auto space-y-6">
            {skillCategories.map((category, categoryIndex) => (
              <div
                key={category.id}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${categoryIndex * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-2">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider md:mr-2 md:min-w-[100px]">
                    {t(`skills.categories.${category.id}`)}
                  </span>
                  <div className="flex flex-wrap gap-2">
                  {category.items.map((skill) => {
                    const isDarkIcon = !!skill.invertInDark;
                    return (
                      <div
                        key={skill.name}
                        className="group inline-flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1.5 hover:border-primary/50 hover:bg-accent/50 transition-all duration-300 cursor-default"
                      >
                        <img
                          src={resolveIcon(skill.icon)}
                          alt=""
                          loading="lazy"
                          width="18"
                          height="18"
                          className={`w-[18px] h-[18px] object-contain ${isDarkIcon ? 'dark:invert dark:brightness-200' : ''}`}
                        />
                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                          {skill.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
