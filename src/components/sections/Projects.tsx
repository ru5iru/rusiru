import { useState } from 'react';
import { ExternalLink, Github, ChevronDown, ChevronUp } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/button';
import { DisclosureRow, DetailList } from '@/components/DisclosureRow';
import { useTranslation } from '@/i18n/i18n';
interface ProjectItem { title: string; link?: string; github?: string; description: string[]; tech: string[]; featured: boolean; }
export function Projects() {
  const { ref, isVisible } = useScrollAnimation();
  const { t, tr } = useTranslation();
  const projects = tr<ProjectItem[]>('projects.items') ?? [];
  const [showAll, setShowAll] = useState(false);
  const [openTitle, setOpenTitle] = useState<string | null>(projects.find(p => p.featured)?.title ?? null);
  const visible = [...projects.filter(p => p.featured), ...(showAll ? projects.filter(p => !p.featured) : [])];
  return <section id="projects" aria-label={t('projects.ariaLabel')} className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
    <div data-geo-summary="projects" className="sr-only">{t('projects.geoSummary')}</div>
    <div ref={ref} className={`container mx-auto px-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h2 className="mb-6 text-sm font-bold tracking-[0.2em] uppercase text-primary">{t('projects.title')}</h2><div className="mb-8 h-px bg-border" />
      {visible.map((project, index) => <DisclosureRow key={project.title} id={`project-${index}`} label={project.title} open={openTitle === project.title} onToggle={() => setOpenTitle(openTitle === project.title ? null : project.title)}
        badge={<span className="inline-block rounded-full border border-primary/25 bg-primary/15 px-4 py-1.5 text-sm font-medium leading-snug text-primary">{project.title}</span>}
        summary={<span className="flex flex-wrap gap-2">{project.tech.map(tech => <span key={tech} className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{tech}</span>)}</span>}
        links={<>{project.link && <Button asChild variant="ghost" size="icon" className="h-6 w-6"><a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={t('projects.visit', { title: project.title })}><ExternalLink className="h-4 w-4" /></a></Button>}{project.github && <Button asChild variant="ghost" size="icon" className="h-6 w-6"><a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={t('projects.viewOnGithub', { title: project.title })}><Github className="h-4 w-4" /></a></Button>}</>}>
        <DetailList items={project.description} />
      </DisclosureRow>)}
      {projects.some(p => !p.featured) && <div className="mt-10 flex justify-center"><Button variant="outline" size="lg" aria-expanded={showAll} onClick={() => { setShowAll(!showAll); setOpenTitle(projects.find(p => p.featured)?.title ?? null); }} className="rounded-full border-2 px-8">{t(showAll ? 'projects.showLess' : 'projects.viewMore')}{showAll ? <ChevronUp className="ml-2 h-5 w-5" /> : <ChevronDown className="ml-2 h-5 w-5" />}</Button></div>}
    </div>
  </section>;
}
