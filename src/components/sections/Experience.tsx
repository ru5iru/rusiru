import { useTranslation } from '@/i18n/i18n';
import { DisclosureRow, DetailList } from '@/components/DisclosureRow';
import { SectionHeading } from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import { useRecordLedger } from '@/lib/useRecordLedger';
import { ArchiveToggle } from '@/components/ArchiveToggle';

interface Item { id: string; company: string; role: string; period: string; dateTime: string; description: string[] }

export function Experience() {
  const { t, tr } = useTranslation();
  const items = tr<Item[]>('experience.items');
  const { entries, visible, showAll, setShowAll, openIndices, allOpen, toggleItem, toggleAll } = useRecordLedger('experience', items);

  return (
    <section id="experience" aria-label={t('experience.ariaLabel')} className="py-8 r-double-b">
      <div data-geo-summary="experience" className="sr-only">{entries.map(entry => `${entry.item.role}: ${entry.item.company}`).join('; ')}</div>
      <SectionHeading kicker={t('experience.kicker')} title={t('experience.title')} actions={<>
        <span className="hidden text-muted-foreground xl:inline">{t('experience.hint')}</span>
        <Button variant="secondary" onClick={toggleAll} aria-expanded={allOpen} className="h-auto font-mono text-xs font-semibold">{t(allOpen ? 'experience.foldAll' : 'experience.unfoldAll', { count: entries.length })}</Button>
      </>} />
      <div id="experience-ledger" className="space-y-4">
        {visible.map(({ item, index }) => {
          const open = openIndices.has(index);
          return (
            <DisclosureRow
              key={`${item.role}-${item.period}`}
              id={`exp-card-${index}`}
              label={item.role}
              open={open}
              onToggle={() => toggleItem(index)}
              badge={<>
                <span className={`r-box px-2 py-0.5 font-bold ${index === 0 ? 'border-primary bg-primary text-primary-foreground' : 'bg-secondary'}`}>{t('experience.dispatchLabel', { number: String(index + 1).padStart(2, '0') })}</span>
                <time dateTime={item.dateTime} className="text-muted-foreground">{item.period}</time>
              </>}
              title={item.role}
              summary={<span className="font-medium">— {item.company}</span>}
              toggleLabel={t(open ? 'experience.foldItem' : 'experience.unfoldItem', { count: item.description.length })}
              lead={`${t('experience.leadSummary')}: ${item.description[0]}`}
            >
              <DetailList items={item.description} section={index + 1} />
            </DisclosureRow>
          );
        })}
      </div>
      {entries.some(entry => !entry.settings.featured) && <ArchiveToggle expanded={showAll} onToggle={() => setShowAll(current => !current)} controls="experience-ledger" />}
    </section>
  );
}
