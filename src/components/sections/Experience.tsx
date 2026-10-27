import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useTranslation } from '@/i18n/i18n';
import { DisclosureRow, DetailList } from '@/components/DisclosureRow';

interface Item { company: string; role: string; period: string; dateTime: string; description: string[]; }
export function Experience() {
  const { ref, isVisible } = useScrollAnimation();
  const { t, tr } = useTranslation();
  const items = tr<Item[]>('experience.items') ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return <section id="experience" aria-label={t('experience.ariaLabel')} className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
    <div data-geo-summary="experience" className="sr-only">{t('experience.geoSummary')}</div>
    <div ref={ref} className={`container mx-auto px-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h2 className="mb-6 text-sm font-bold tracking-[0.2em] uppercase text-primary">{t('experience.title')}</h2>
      <div className="mb-8 h-px bg-border" />
      {items.map((item, index) => <DisclosureRow key={index} id={`experience-${index}`} label={item.role} open={openIndex === index} onToggle={() => setOpenIndex(openIndex === index ? null : index)} badge={<span className="inline-block rounded-full border border-primary/25 bg-primary/15 px-4 py-1.5 text-sm font-medium leading-snug text-primary">{item.role}</span>} summary={<><span className="mb-1 block text-sm text-muted-foreground"><time dateTime={item.dateTime}>{item.period}</time></span><span className="block text-xl font-display font-bold md:text-2xl">{item.company}</span></>}><DetailList items={item.description} /></DisclosureRow>)}
    </div>
  </section>;
}
