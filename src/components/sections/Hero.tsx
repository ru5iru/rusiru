import { useRef } from 'react';
import { ArrowRight, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/i18n';
import profilePhoto from '@/assets/profile/profile-photo.webp';
import awsIcon from '@/assets/icons/aws.svg';

const techStack = [
  { name: 'AWS', icon: awsIcon, dark: false },
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', dark: false },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', dark: false },
  { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg', dark: false },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', dark: false },
  { name: 'Kubernetes', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg', dark: false },
  { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', dark: false },
  { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', dark: false },
];

export function Hero() {
  const { t } = useTranslation();
  const trackRef = useRef<HTMLDivElement>(null);

  const handleScrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollTrack = (direction: 1 | -1) => {
    trackRef.current?.scrollBy({ left: direction * 200, behavior: 'smooth' });
  };

  return (
    <section
      className="relative overflow-hidden min-h-screen flex items-center pt-24 pb-16"
      aria-label={t('hero.ariaLabel')}
    >
      {/* GEO: Structured summary for generative engines */}
      <div data-geo-summary="hero" className="sr-only" aria-hidden="false">
        {t('hero.geoSummary')}
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center">
        {/* SEO heading (name + role) */}
        <h1 className="sr-only">{t('hero.srHeading')}</h1>

        {/* Large Headline with profile photo as the "O" */}
        <p
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold leading-[1.05] mb-8 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          <span className="inline-flex items-center justify-center flex-wrap gap-x-1 gap-y-2">
            <span className="gradient-text">{t('hero.headlineBefore')}</span>
            <span className="relative inline-flex shrink-0 items-center justify-center align-middle mx-0.5 sm:mx-1">
              <span className="absolute inset-0 rounded-full gradient-bg opacity-30 blur-xl scale-110" />
              <img
                src={profilePhoto}
                alt={t('hero.profileAlt')}
                loading="eager"
                fetchPriority="high"
                width={224}
                height={224}
                className="relative w-[0.95em] h-[0.95em] rounded-full object-cover object-center border-2 border-primary/40 shadow-xl"
              />
            </span>
            <span className="gradient-text">{t('hero.headlineAfter')}</span>
          </span>
          <br />
          <span className="text-foreground/80">{t('hero.headlineLine2')}</span>
        </p>

        {/* Description */}
        <p
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed opacity-0 animate-fade-in"
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
            className="gradient-bg text-white px-7 py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-full hover:opacity-90 transition-all duration-300 hover:scale-105 glow group w-full sm:w-auto"
          >
            {t('hero.viewWork')}
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-7 py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-full border-2 hover:bg-primary/5 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
          >
            <a href={t('hero.resumeUrl')} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {t('hero.resume')}
            </a>
          </Button>
        </div>

        {/* Tech Stack Carousel */}
        <div
          className="mt-14 flex items-center gap-2 opacity-0 animate-fade-in"
          style={{ animationDelay: '0.9s' }}
          aria-label={t('hero.techStackLabel')}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollTrack(-1)}
            className="shrink-0 rounded-full h-9 w-9 text-muted-foreground hover:text-foreground"
            aria-label={t('hero.scrollPrev')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div
            ref={trackRef}
            className="flex items-center gap-5 sm:gap-7 overflow-x-auto scrollbar-none px-2 max-w-[260px] sm:max-w-md scroll-smooth"
          >
            {techStack.map((tech) => (
              <img
                key={tech.name}
                src={tech.icon}
                alt={tech.name}
                title={tech.name}
                loading="lazy"
                width={28}
                height={28}
                className={`h-7 w-7 shrink-0 object-contain opacity-60 hover:opacity-100 transition-opacity ${
                  tech.dark ? 'dark:invert dark:brightness-200' : ''
                }`}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollTrack(1)}
            className="shrink-0 rounded-full h-9 w-9 text-muted-foreground hover:text-foreground"
            aria-label={t('hero.scrollNext')}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
