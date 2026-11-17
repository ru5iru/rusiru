import { ArrowDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RichText } from '@/components/RichText';
import { useTranslation } from '@/i18n/i18n';
import { siteConfig } from '@/config';
import { jumpToBroadsheetItem, navigateToSection } from '@/lib/navigation';

interface ExperienceItem { company: string; role: string; period: string; summary?: string; description: string[] }
interface ProjectItem { title: string; featured: boolean; frontPage?: boolean; frontPageKicker?: string; summary?: string; description: string[] }

export function About() {
  const { t, tr } = useTranslation();
  const paragraphs = tr<string[]>('about.paragraphs') ?? [];
  const experience = tr<ExperienceItem[]>('experience.items') ?? [];
  const projects = tr<ProjectItem[]>('projects.items') ?? [];
  const indexedProjects = projects.map((project, index) => ({ project, index }));
  const frontPageProjects = indexedProjects.filter(({ project }) => project.frontPage);
  const featured = (frontPageProjects.length ? frontPageProjects : indexedProjects.filter(({ project }) => project.featured)).slice(0, 2);
  const midpoint = Math.ceil(paragraphs.length / 2);

  return (
    <section id="about" className="pb-6 r-double-b" aria-label={t('about.ariaLabel')} itemScope itemType="https://schema.org/AboutPage">
      <div data-geo-summary="about" className="sr-only">{t('about.geoSummary')}</div>
      <div className="grid items-start gap-6 lg:grid-cols-12">
        <aside className="space-y-4 lg:col-span-3 lg:pr-5 lg:r-r">
          <div className="bg-secondary p-3 r-heavy-t r-heavy-b">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-primary">{t('hero.careerTitle')}</div>
            <h3 className="mt-0.5 font-display text-lg font-bold leading-snug">{experience[0]?.company ?? t('hero.careerSubtitle')}</h3>
          </div>
          <div className="space-y-3.5 text-xs">
            {experience.map((item, index) => (
              <article key={`${item.role}-${item.period}`} className={index < experience.length - 1 ? 'pb-3.5 r-b' : ''}>
                <time className={`font-mono font-semibold ${index === 0 ? 'text-primary' : 'text-faint'}`}>{item.period}</time>
                <h4 className="mt-0.5 font-display text-base font-bold">{item.role}</h4>
                <p className="mt-1 leading-relaxed text-muted-foreground">{item.summary ?? item.description[0]}</p>
                <button type="button" onClick={() => jumpToBroadsheetItem('experience', index)} className={`mt-1.5 text-left font-mono text-[11px] underline ${index === 0 ? 'font-semibold text-primary' : ''}`}>
                  {t('hero.readDispatch')}
                </button>
              </article>
            ))}
          </div>
        </aside>

        <div className="space-y-5 lg:col-span-6 lg:pr-5 lg:r-r">
          <figure className="r-box bg-secondary p-3.5">
            <div className="grid items-center gap-4 sm:grid-cols-12">
              <div className="sm:col-span-5">
                <img src={siteConfig.person.profileImage} alt={t('hero.profileAlt')} loading="eager" {...{ fetchpriority: 'high' }} width={448} height={448} className="engraving-photo r-box aspect-square w-full object-cover" />
              </div>
              <figcaption className="space-y-2.5 text-xs sm:col-span-7">
                <div className="font-mono font-semibold uppercase text-primary">{t('hero.profileKicker')}</div>
                <div className="font-display text-xl font-bold leading-snug">{t('hero.profileTitle')}</div>
                <p className="leading-relaxed text-muted-foreground">{t('hero.profileSummary')}</p>
                <div className="flex flex-wrap gap-2 pt-1 font-mono">
                  <Button asChild className="h-auto rounded-none bg-foreground px-3 py-1.5 font-mono text-xs font-semibold uppercase text-background hover:bg-foreground/90">
                    <a href="#projects" onClick={event => { event.preventDefault(); navigateToSection('projects'); }}>{t('hero.viewWork')} <ArrowDown aria-hidden="true" className="ml-1.5 h-3.5 w-3.5" /></a>
                  </Button>
                  <Button asChild variant="outline" className="h-auto rounded-none px-3 py-1.5 font-mono text-xs font-semibold uppercase">
                    <a href={siteConfig.person.resumeUrl} target="_blank" rel="noopener noreferrer">{t('hero.resume')} <ExternalLink aria-hidden="true" className="ml-1.5 h-3.5 w-3.5" /></a>
                  </Button>
                </div>
              </figcaption>
            </div>
          </figure>

          <div className="grid gap-5 text-justify text-sm leading-[1.7] sm:grid-cols-2 sm:text-[15px]">
            {[paragraphs.slice(0, midpoint), paragraphs.slice(midpoint)].map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-3">
                {column.map((paragraph, index) => (
                  <p key={index} className={`${columnIndex === 0 && index === 0 ? 'lead-dropcap ' : ''}${columnIndex === 0 && index === 0 ? '' : 'text-muted-foreground'}`}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4 lg:col-span-3">
          <div className="bg-secondary p-3 r-heavy-t r-heavy-b">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-primary">{t('hero.featuredTitle')}</div>
            <h3 className="mt-0.5 font-display text-lg font-bold leading-snug">{t('hero.featuredSubtitle')}</h3>
          </div>
          <div className="space-y-3 text-xs">
            {featured.map(({ project, index }) => (
              <article key={project.title} className="r-box space-y-1.5 bg-card p-3">
                <div className="font-mono text-[10px] font-bold text-primary">{t('projects.dossierLabel', { number: String(index + 1).padStart(2, '0') })}{project.frontPageKicker ? ` · ${project.frontPageKicker}` : ''}</div>
                <h4 className="font-display text-base font-bold">{project.title}</h4>
                <p className="leading-relaxed text-muted-foreground">{project.summary ?? project.description[0]}</p>
                <button type="button" onClick={() => jumpToBroadsheetItem('projects', index)} className="font-mono text-[11px] font-semibold text-primary underline">{t('hero.readDossier')}</button>
              </article>
            ))}
            <article className="r-box space-y-1.5 bg-card p-3">
              <div className="font-mono text-[10px] font-bold">{t('education.certificationsSubtitle')}</div>
              <h4 className="font-display text-base font-bold">{t('hero.continuingEducationTitle')}</h4>
              <p className="leading-relaxed text-muted-foreground">{t('hero.continuingEducationSummary')}</p>
              <a href="#education" onClick={event => { event.preventDefault(); navigateToSection('education'); }} className="inline-block font-mono text-[11px] font-semibold text-primary underline">{t('hero.inspectEducation')}</a>
            </article>
          </div>
        </aside>
      </div>
    </section>
  );
}
