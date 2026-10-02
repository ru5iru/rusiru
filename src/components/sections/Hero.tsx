import { ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/i18n';
import { siteConfig, resolveIcon, allSkills } from '@/config';

const techStack = allSkills();

export function Hero() {
  const { t } = useTranslation();

  const handleScrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };


  // Split "Full-Stack S" so the "S" stays attached to the profile image + "lutions"
  const headlineBefore = t('hero.headlineBefore');
  const lastSpace = headlineBefore.lastIndexOf(' ');
  const headlineLead = lastSpace >= 0 ? headlineBefore.slice(0, lastSpace) : '';
  const headlineSChar = lastSpace >= 0 ? headlineBefore.slice(lastSpace + 1) : headlineBefore;

  return (
    <section
      className="hero-hex relative overflow-hidden min-h-screen flex items-center pt-24 pb-16"
      aria-label={t('hero.ariaLabel')}
    >
      {/* GEO: Structured summary for generative engines */}
      <div data-geo-summary="hero" className="sr-only" aria-hidden="false">
        {t('hero.geoSummary')}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center">
        {/* SEO heading (name + role) */}
        <h1 className="sr-only">{t('hero.srHeading')}</h1>

        {/* Large Headline with profile photo as the "O" */}
        <p
          className="uppercase text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-light tracking-wide leading-[1.05] mb-8 text-slate-100 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          <span className="inline-flex items-center justify-center flex-wrap gap-x-3 gap-y-2">
            <span>{headlineLead}</span>
            <span className="inline-flex items-center whitespace-nowrap">
              <span>{headlineSChar}</span>
              <span className="relative inline-flex shrink-0 items-center justify-center align-middle mx-0.5">
                <span className="absolute inset-0 rounded-full bg-primary/40 opacity-60 blur-xl scale-110" />
                <img
                  src={siteConfig.person.profileImage}
                  alt={t('hero.profileAlt')}
                  loading="eager"
                  fetchPriority="high"
                  width={224}
                  height={224}
                  className="relative w-[0.95em] h-[0.95em] rounded-full object-cover object-center border-2 border-white/40 shadow-xl"
                />
              </span>
              <span>{t('hero.headlineAfter')}</span>
            </span>
          </span>
          <br />
          <span>{t('hero.headlineLine2')}</span>
        </p>

        {/* Description */}
        <p
          className="text-base sm:text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed opacity-0 animate-fade-in"
          style={{ animationDelay: '0.5s' }}
        >
          {t('hero.description')}
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center opacity-0 animate-fade-in"
          style={{ animationDelay: '0.7s' }}
        >
          <Button
            onClick={handleScrollToProjects}
            size="lg"
            className="bg-white/10 backdrop-blur-md border border-white/25 text-white px-7 py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 group w-full sm:w-auto"
          >
            {t('hero.viewWork')}
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="px-7 py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-full text-slate-200 hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105 w-full sm:w-auto"
          >
            <a href={siteConfig.person.resumeUrl} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {t('hero.resume')}
            </a>
          </Button>
        </div>

        {/* Tech Stack Marquee (infinite auto-scroll loop) */}
        <div
          className="marquee mt-14 max-w-[280px] sm:max-w-md md:max-w-lg rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-2 opacity-0 animate-fade-in"
          style={{ animationDelay: '0.9s' }}
          aria-label={t('hero.techStackLabel')}
        >
          <div className="marquee-track flex items-center gap-6 sm:gap-7">
            {[...techStack, ...techStack].map((tech, i) => (
              <img
                key={`${tech.name}-${i}`}
                src={resolveIcon(tech.icon)}
                alt={tech.name}
                title={tech.name}
                loading="lazy"
                width={28}
                height={28}
                aria-hidden={i >= techStack.length}
                className="h-7 w-7 shrink-0 object-contain opacity-70 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
