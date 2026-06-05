import { useRef } from 'react';
import { ArrowRight, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/i18n';
import profilePhoto from '@/assets/profile/profile-photo.webp';
import awsIcon from '@/assets/icons/aws.svg';
import drupalIcon from '@/assets/icons/drupal.svg';
import laravelIcon from '@/assets/icons/laravel.svg';
import symfonyIcon from '@/assets/icons/symfony.svg';
import yiiIcon from '@/assets/icons/yii.svg';
import postmanIcon from '@/assets/icons/postman.svg';
import sonarqubeIcon from '@/assets/icons/sonarqube.svg';

const cdn = (path: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}`;

// All technologies mirrored from the Technical Skills section
const techStack = [
  // Languages
  { name: 'Java', icon: cdn('java/java-plain.svg'), dark: false },
  { name: 'JavaScript', icon: cdn('javascript/javascript-plain.svg'), dark: false },
  { name: 'PHP', icon: cdn('php/php-plain.svg'), dark: false },
  { name: 'C++', icon: cdn('cplusplus/cplusplus-plain.svg'), dark: false },
  // Frameworks
  { name: 'React', icon: cdn('react/react-original.svg'), dark: false },
  { name: 'Node.js', icon: cdn('nodejs/nodejs-plain.svg'), dark: false },
  { name: 'Spring Boot', icon: cdn('spring/spring-original.svg'), dark: false },
  { name: 'Drupal', icon: drupalIcon, dark: false },
  { name: 'Yii', icon: yiiIcon, dark: true },
  { name: 'Laravel', icon: laravelIcon, dark: false },
  { name: 'Symfony', icon: symfonyIcon, dark: true },
  // Databases
  { name: 'MySQL', icon: cdn('mysql/mysql-original.svg'), dark: false },
  { name: 'PostgreSQL', icon: cdn('postgresql/postgresql-plain.svg'), dark: false },
  { name: 'MongoDB', icon: cdn('mongodb/mongodb-plain.svg'), dark: false },
  { name: 'Redis', icon: cdn('redis/redis-plain.svg'), dark: false },
  // DevOps & Cloud
  { name: 'AWS', icon: awsIcon, dark: false },
  { name: 'Docker', icon: cdn('docker/docker-plain.svg'), dark: false },
  { name: 'Kubernetes', icon: cdn('kubernetes/kubernetes-plain.svg'), dark: false },
  { name: 'Jenkins', icon: cdn('jenkins/jenkins-original.svg'), dark: false },
  { name: 'Kafka', icon: cdn('apachekafka/apachekafka-original.svg'), dark: true },
  // Tools
  { name: 'Git', icon: cdn('git/git-plain.svg'), dark: false },
  { name: 'Linux', icon: cdn('linux/linux-original.svg'), dark: false },
  { name: 'SonarQube', icon: sonarqubeIcon, dark: false },
  { name: 'Postman', icon: postmanIcon, dark: false },
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
                  src={profilePhoto}
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
            <a href={t('hero.resumeUrl')} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {t('hero.resume')}
            </a>
          </Button>
        </div>

        {/* Tech Stack Carousel */}
        <div
          className="mt-14 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-2 py-1.5 opacity-0 animate-fade-in"
          style={{ animationDelay: '0.9s' }}
          aria-label={t('hero.techStackLabel')}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollTrack(-1)}
            className="shrink-0 rounded-full h-9 w-9 text-slate-300 hover:text-white hover:bg-white/10"
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
                className="h-7 w-7 shrink-0 object-contain opacity-70 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollTrack(1)}
            className="shrink-0 rounded-full h-9 w-9 text-slate-300 hover:text-white hover:bg-white/10"
            aria-label={t('hero.scrollNext')}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
