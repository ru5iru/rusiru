import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DisclosureRow, DetailList } from '@/components/DisclosureRow';
import { SectionHeading } from '@/components/SectionHeading';
import { useTranslation } from '@/i18n/i18n';
import { expandedIndices } from '@/i18n/publish';
import { focusBroadsheetCard, subscribeToBroadsheetJump, subscribeToBroadsheetToggleAll } from '@/lib/navigation';

interface ProjectItem { id: string; expanded?: boolean; affiliation?: string; title: string; link?: string; github?: string; period?: string; description: string[]; tech: string[]; featured: boolean }

export function Projects() {
  const { t, tr } = useTranslation();
  const projects = tr<ProjectItem[]>('projects.items');
  const [showAll, setShowAll] = useState(false);
  const [openIndices, setOpenIndices] = useState<Set<number>>(() => new Set(expandedIndices(projects)));
  const affiliations = tr<Record<string, string>>('projects.affiliations') ?? {};
  const visible = projects.map((project, index) => ({ project, index })).filter(({ project }) => showAll || project.featured);
  const featuredCount = projects.filter(project => project.featured).length;
  const allOpen = projects.length > 0 && openIndices.size === projects.length;

  useEffect(() => subscribeToBroadsheetJump('projects', ({ index }) => {
    if (!projects[index]) return;
    if (!projects[index].featured) setShowAll(true);
    setOpenIndices(current => new Set(current).add(index));
    focusBroadsheetCard(`proj-card-${index}`);
  }), [projects]);

  useEffect(() => subscribeToBroadsheetToggleAll(expanded => {
    setShowAll(expanded);
    setOpenIndices(new Set(expanded ? projects.map((_, index) => index) : expandedIndices(projects)));
  }), [projects]);

  const toggleItem = (index: number) => setOpenIndices(current => {
    const next = new Set(current);
    if (next.has(index)) next.delete(index); else next.add(index);
    return next;
  });
  const toggleAll = () => {
    if (allOpen) {
      setOpenIndices(new Set([0]));
    } else {
      setShowAll(true);
      setOpenIndices(new Set(projects.map((_, index) => index)));
    }
  };

  return (
    <section id="projects" aria-label={t('projects.ariaLabel')} className="py-8 r-double-b">
      <div data-geo-summary="projects" className="sr-only">{t('projects.geoSummary')}</div>
      <SectionHeading kicker={t('projects.kicker')} title={t('projects.title')} actions={<>
        <Button variant={showAll ? 'outline' : 'default'} onClick={() => setShowAll(false)} aria-pressed={!showAll} className={`h-auto px-3 py-1 font-mono text-xs ${!showAll ? 'bg-foreground text-background hover:bg-foreground/90' : ''}`}>{t('projects.featuredFilter', { count: featuredCount })}</Button>
        <Button variant={showAll ? 'default' : 'outline'} onClick={() => setShowAll(true)} aria-pressed={showAll} className={`h-auto px-3 py-1 font-mono text-xs ${showAll ? 'bg-foreground text-background hover:bg-foreground/90' : ''}`}>{t('projects.allWorksFilter', { count: projects.length })}</Button>
        <Button variant="secondary" onClick={toggleAll} aria-expanded={allOpen} className="h-auto px-3 py-1 font-mono text-xs font-semibold text-primary">{t(allOpen ? 'projects.foldAll' : 'projects.unfoldAll')}</Button>
      </>} />

      <div id="projects-ledger" className="space-y-4">
        {visible.map(({ project, index }) => {
          const open = openIndices.has(index);
          const links = <>
            {project.link && <Button asChild className="h-auto rounded-none bg-foreground px-3 py-1.5 font-mono text-xs font-semibold text-background hover:bg-foreground/90"><a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={t('projects.visit', { title: project.title })}>{t('projects.visitLabel')} <ExternalLink aria-hidden="true" className="ml-1 h-3.5 w-3.5" /></a></Button>}
            {project.github && <Button asChild variant="outline" className="h-auto rounded-none px-3 py-1.5 font-mono text-xs font-semibold"><a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={t('projects.viewOnGithub', { title: project.title })}>{t('projects.githubLabel')} <Github aria-hidden="true" className="ml-1 h-3.5 w-3.5" /></a></Button>}
          </>;
          return (
            <DisclosureRow
              key={project.id}
              id={`proj-card-${index}`}
              label={project.title}
              open={open}
              onToggle={() => toggleItem(index)}
              badge={<>
                <span className="r-box bg-secondary px-2 py-0.5 font-bold text-primary">{t('projects.dossierLabel', { number: String(index + 1).padStart(2, '0') })}</span>
                {project.period && <span className="text-faint">{project.period}</span>}
                {project.affiliation && affiliations[project.affiliation] && <span className="r-box bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">{affiliations[project.affiliation]}</span>}
                <span className={`r-box px-1.5 py-0.5 text-[10px] uppercase ${project.featured ? '' : 'text-faint'}`}>{t(project.featured ? 'projects.featuredBadge' : 'projects.archiveBadge')}</span>
              </>}
              title={project.title}
              summary={<div className="flex flex-wrap gap-1.5 pt-1">{project.tech.map(tech => <span key={tech} className="r-box bg-background px-2 py-0.5 font-mono text-xs">{tech}</span>)}</div>}
              links={links}
              toggleLabel={t(open ? 'projects.foldItem' : 'projects.unfoldItem', { count: project.description.length })}
              lead={project.description[0] ?? project.title}
            >
              <DetailList items={project.description} marker="bracket" />
            </DisclosureRow>
          );
        })}
      </div>

      {projects.some(project => !project.featured) && <div className="mt-6 flex justify-center pt-4 r-t">
        <Button variant="secondary" aria-expanded={showAll} aria-controls="projects-ledger" onClick={() => setShowAll(current => !current)} className="h-auto rounded-none px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider">
          {t(showAll ? 'projects.showLess' : 'projects.viewMore')}
          {showAll ? <ChevronUp aria-hidden="true" className="ml-2 h-4 w-4" /> : <ChevronDown aria-hidden="true" className="ml-2 h-4 w-4" />}
        </Button>
      </div>}
    </section>
  );
}
