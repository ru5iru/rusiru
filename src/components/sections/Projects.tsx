import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DisclosureRow, DetailList } from '@/components/DisclosureRow';
import { SectionHeading } from '@/components/SectionHeading';
import { useTranslation } from '@/i18n/i18n';
import { useRecordLedger } from '@/lib/useRecordLedger';
import { ArchiveToggle } from '@/components/ArchiveToggle';

interface ProjectItem { id: string; title: string; link?: string; github?: string; period?: string; description: string[]; tech: string[] }

export function Projects() {
  const { t, tr } = useTranslation();
  const projects = tr<ProjectItem[]>('projects.items');
  const { entries, visible, showAll, setShowAll, openIndices, allOpen, toggleItem, toggleAll } = useRecordLedger('projects', projects);
  const featuredCount = entries.filter(entry => entry.settings.featured).length;

  return (
    <section id="projects" aria-label={t('projects.ariaLabel')} className="py-8 r-double-b">
      <div data-geo-summary="projects" className="sr-only">{entries.map(entry => entry.item.title).join('; ')}</div>
      <SectionHeading kicker={t('projects.kicker')} title={t('projects.title')} actions={<>
        <Button variant={showAll ? 'outline' : 'default'} onClick={() => setShowAll(false)} aria-pressed={!showAll} className={`h-auto px-3 py-1 font-mono text-xs ${!showAll ? 'bg-foreground text-background hover:bg-foreground/90' : ''}`}>{t('projects.featuredFilter', { count: featuredCount })}</Button>
        <Button variant={showAll ? 'default' : 'outline'} onClick={() => setShowAll(true)} aria-pressed={showAll} className={`h-auto px-3 py-1 font-mono text-xs ${showAll ? 'bg-foreground text-background hover:bg-foreground/90' : ''}`}>{t('projects.allWorksFilter', { count: entries.length })}</Button>
        <Button variant="secondary" onClick={toggleAll} aria-expanded={allOpen} className="h-auto px-3 py-1 font-mono text-xs font-semibold text-primary">{t(allOpen ? 'projects.foldAll' : 'projects.unfoldAll')}</Button>
      </>} />

      <div id="projects-ledger" className="space-y-4">
        {visible.map(({ item: project, index, settings }) => {
          const open = openIndices.has(index);
          const links = <>
            {project.link && <Button asChild className="h-auto rounded-none bg-foreground px-3 py-1.5 font-mono text-xs font-semibold text-background hover:bg-foreground/90"><a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={t('projects.visit', { title: project.title })}>{t('projects.visitLabel')} <ExternalLink aria-hidden="true" className="ml-1 h-3.5 w-3.5" /></a></Button>}
            {project.github && <Button asChild variant="outline" className="h-auto rounded-none px-3 py-1.5 font-mono text-xs font-semibold"><a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={t('projects.viewOnGithub', { title: project.title })}>{t('projects.githubLabel')} <Github aria-hidden="true" className="ml-1 h-3.5 w-3.5" /></a></Button>}
          </>;
          return (
            <DisclosureRow
              key={project.title}
              id={`proj-card-${index}`}
              label={project.title}
              open={open}
              onToggle={() => toggleItem(index)}
              badge={<>
                <span className="r-box bg-secondary px-2 py-0.5 font-bold text-primary">{t('projects.dossierLabel', { number: String(index + 1).padStart(2, '0') })}</span>
                {project.period && <span className="text-faint">{project.period}</span>}
                <span className={`r-box px-1.5 py-0.5 text-[10px] uppercase ${settings.featured ? '' : 'text-faint'}`}>{t(settings.featured ? 'projects.featuredBadge' : 'projects.archiveBadge')}</span>
                {settings.affiliation && <span className="r-box px-2 py-0.5">{t(`projects.affiliations.${settings.affiliation}`)}</span>}
              </>}
              title={project.title}
              summary={<div className="flex flex-wrap gap-1.5 pt-1">{project.tech.map(tech => <span key={tech} className="r-box bg-background px-2 py-0.5 font-mono text-xs">{tech}</span>)}</div>}
              links={links}
              toggleLabel={t(open ? 'projects.foldItem' : 'projects.unfoldItem', { count: project.description.length })}
              lead={project.description[0]}
            >
              <DetailList items={project.description} marker="bracket" />
            </DisclosureRow>
          );
        })}
      </div>

      {entries.some(entry => !entry.settings.featured) && <ArchiveToggle expanded={showAll} onToggle={() => setShowAll(current => !current)} controls="projects-ledger" more="projects.viewMore" less="projects.showLess" />}
    </section>
  );
}
