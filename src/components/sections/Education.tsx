import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useTranslation } from '@/i18n/i18n';
import { DisclosureRow, DetailList } from '@/components/DisclosureRow';
import { siteConfig } from '@/config';
interface Item { id: string; institution: string; degree: string; period: string; details: string[]; }
export function Education() {
  const { ref, isVisible } = useScrollAnimation();
  const { t, tr } = useTranslation();
  const items = tr<Item[]>('education.items') ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return <section id="education" aria-label={t('education.ariaLabel')} className="py-24 md:py-32  relative overflow-hidden">
    <div data-geo-summary="education" className="sr-only">{t('education.geoSummary')}</div>
    <div ref={ref} className={`container mx-auto px-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h2 className="mb-6 text-sm font-bold tracking-[0.2em] uppercase text-primary">{t('education.title')}</h2>
      <div className="mb-8 h-px bg-border" />
      {items.map((item, index) => <DisclosureRow key={index} id={`education-${index}`} label={item.degree} open={openIndex === index} onToggle={() => setOpenIndex(openIndex === index ? null : index)} badge={<><img src={siteConfig.educationLogos[item.id]} alt={item.institution} width={32} height={32} loading="lazy" className="h-8 w-8 shrink-0 object-contain" /><span className="inline-block rounded-full border border-primary/25 bg-primary/15 px-4 py-1.5 text-sm font-medium leading-snug text-primary">{item.degree}</span></>} summary={<><span className="mb-1 block text-sm text-muted-foreground">{item.period}</span><span className="block text-xl font-display font-bold md:text-2xl">{item.institution}</span></>}><DetailList items={item.details} /></DisclosureRow>)}
    </div>
  </section>;
}
