import { useEffect, useState } from 'react';
import { useTranslation } from '@/i18n/i18n';
import { DisclosureRow, DetailList } from '@/components/DisclosureRow';
import { SectionHeading } from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import { ViewMoreButton } from '@/components/ViewMoreButton';
import { expandedIndices, hasArchived, visibleRecords } from '@/i18n/publish';
import { focusBroadsheetCard, subscribeToBroadsheetJump, subscribeToBroadsheetToggleAll } from '@/lib/navigation';

interface Item { id: string; company: string; role: string; period: string; dateTime: string; expanded?: boolean; archived?: boolean; description: string[] }

export function Experience() {
  const { t, tr } = useTranslation();
  const items = tr<Item[]>('experience.items');
  const [openIndices, setOpenIndices] = useState<Set<number>>(() => new Set(expandedIndices(items)));
  const [showAll, setShowAll] = useState(false);
  const defaults = expandedIndices(items);
  const allOpen = items.length > 0 && openIndices.size === items.length;

  useEffect(() => subscribeToBroadsheetJump('experience', ({ index }) => {
    if (!items[index]) return;
    if (items[index].archived) setShowAll(true);
    setOpenIndices(current => new Set(current).add(index));
    focusBroadsheetCard(`exp-card-${index}`);
  }), [items]);

  useEffect(() => subscribeToBroadsheetToggleAll(expanded => {
    setShowAll(expanded);
    setOpenIndices(new Set(expanded ? items.map((_, index) => index) : expandedIndices(items)));
  }), [items]);

  const toggleItem = (index: number) => setOpenIndices(current => {
    const next = new Set(current);
    if (next.has(index)) next.delete(index); else next.add(index);
    return next;
  });
  const toggleAll = () => {
    if (!allOpen) setShowAll(true);
    setOpenIndices(new Set(allOpen ? defaults : items.map((_, index) => index)));
  };

  return (
    <section id="experience" aria-label={t('experience.ariaLabel')} className="py-8 r-double-b">
      <div data-geo-summary="experience" className="sr-only">{t('experience.geoSummary')}</div>
      <SectionHeading kicker={t('experience.kicker')} title={t('experience.title')} actions={<>
        <span className="hidden text-muted-foreground xl:inline">{t('experience.hint')}</span>
        <Button variant="secondary" onClick={toggleAll} aria-expanded={allOpen} className="h-auto font-mono text-xs font-semibold">{t(allOpen ? 'experience.foldAll' : 'experience.unfoldAll', { count: items.length })}</Button>
      </>} />
      <div id="experience-ledger" className="space-y-4">
        {visibleRecords(items, showAll).map(({ item, index }) => {
          const open = openIndices.has(index);
          return (
            <DisclosureRow
              key={item.id}
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
              lead={item.description[0] ? `${t('experience.leadSummary')}: ${item.description[0]}` : item.company}
            >
              <DetailList items={item.description} section={index + 1} />
            </DisclosureRow>
          );
        })}
      </div>
      {hasArchived(items) && <ViewMoreButton expanded={showAll} controls="experience-ledger" moreLabel={t('experience.viewMore')} lessLabel={t('experience.showLess')} onToggle={() => setShowAll(current => !current)} />}
    </section>
  );
}
