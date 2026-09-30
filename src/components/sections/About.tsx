import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Cloud, Shield, Rocket } from 'lucide-react';
import { useTranslation } from '@/i18n/i18n';
import { RichText } from '@/components/RichText';

const statIcons = [Rocket, Cloud, Shield];

export function About() {
  const { ref, isVisible } = useScrollAnimation();
  const { t, tr } = useTranslation();
  const paragraphs = tr<string[]>('about.paragraphs') ?? [];
  const stats = (tr<{ value: string; label: string }[]>('about.stats') ?? []).map((s, i) => ({ ...s, icon: statIcons[i % statIcons.length] }));

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden" aria-label={t('about.ariaLabel')} itemScope itemType="https://schema.org/AboutPage">
      {/* GEO: Hidden structured summary for AI engines to extract */}
      <div data-geo-summary="about" className="sr-only" aria-hidden="false">
        {t('about.geoSummary')}
      </div>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative">
        <div ref={ref}>
          <h2
            className={`section-heading transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {t('about.titleBefore')} <span className="gradient-text">{t('about.titleHighlight')}</span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div
              className={`space-y-6 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
            >
              {paragraphs.map((p, i) => (
                <p key={i} className="text-lg text-muted-foreground leading-relaxed">
                  <RichText text={p} />
                </p>
              ))}
            </div>

            {/* Stats Grid */}
            <div
              className={`grid grid-cols-2 gap-6 transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="gradient-border p-6 rounded-2xl bg-card hover:scale-105 transition-transform duration-300 group"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-4xl font-display font-bold gradient-text mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
