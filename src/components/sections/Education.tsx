import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from '@/i18n/i18n';
import { DetailList } from '@/components/DisclosureRow';
import { SectionHeading } from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config';
import { publishedItems } from '@/config/publication';
import { ArchiveToggle } from '@/components/ArchiveToggle';
import { focusBroadsheetCard, subscribeToBroadsheetJump } from '@/lib/navigation';

interface Item { id: string; institution: string; degree: string; period: string; details: string[] }
interface Certification { id: string; issuer: string; date: string; title: string; skills: string; url: string }

export function Education() {
  const { t, tr } = useTranslation();
  const items = tr<Item[]>('education.items');
  const certifications = tr<Certification[]>('education.certifications');
  const [showEducation, setShowEducation] = useState(false);
  const [showCE, setShowCE] = useState(false);
  const academic = publishedItems(siteConfig, 'education', items);
  const credentials = publishedItems(siteConfig, 'certifications', certifications);
  const formalEnabled = siteConfig.display.groups.formalEducation;
  const ceEnabled = siteConfig.display.groups.continuingEducation;
  useEffect(() => subscribeToBroadsheetJump('education', ({ index }) => {
    if (!siteConfig.display.groups.formalEducation || !publishedItems(siteConfig, 'education', items).some(entry => entry.index === index)) return;
    setShowEducation(true);
    focusBroadsheetCard(`edu-card-${index}`);
  }), [items]);
  useEffect(() => subscribeToBroadsheetJump('certifications', ({ index }) => {
    if (!siteConfig.display.groups.continuingEducation || !publishedItems(siteConfig, 'certifications', certifications).some(entry => entry.index === index)) return;
    setShowCE(true);
    focusBroadsheetCard(`ce-card-${index}`);
  }), [certifications]);
  const ledgerLink = <Button asChild variant="link" className="h-auto min-h-6 whitespace-normal p-0 text-left font-mono text-xs font-semibold text-primary"><a href={siteConfig.continuingEducationUrl} target="_blank" rel="noopener noreferrer">{t('education.viewAllCertifications')} <ExternalLink aria-hidden="true" className="ml-1 h-3.5 w-3.5" /></a></Button>;

  return (
    <section id="education" aria-label={t('education.ariaLabel')} className="py-8 r-double-b">
      <div data-geo-summary="education" className="sr-only">{formalEnabled ? academic.map(entry => `${entry.item.institution}: ${entry.item.degree}`).join('; ') : ''}</div>
      <SectionHeading kicker={t('education.kicker')} title={t('education.title')} actions={ceEnabled ? ledgerLink : undefined} />
      <div className="grid items-start gap-8 lg:grid-cols-12">
        {formalEnabled && <div id="education-ledger" className={`space-y-4 ${ceEnabled ? 'lg:col-span-5 lg:pr-6 lg:r-r' : 'lg:col-span-12'}`}>
          <div className="flex items-center justify-between gap-2 bg-secondary p-2.5 r-heavy-t r-b font-mono text-xs">
            <span className="font-bold uppercase">{t('education.formalTitle')}</span>
            <span>{t('education.formalSubtitle')}</span>
          </div>
          {academic.filter(entry => showEducation || entry.settings.featured).map(({ item, index }) => (
            <article id={`edu-card-${index}`} key={item.id} className="r-box space-y-3 bg-card p-5">
              <div className="flex items-start gap-3.5">
                <img src={siteConfig.educationLogos[item.id]} alt={item.institution} width={44} height={44} loading="lazy" className="mt-0.5 h-11 w-11 shrink-0 object-contain" />
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-xs text-primary">{item.period}</div>
                  <h3 className="mt-0.5 font-display text-xl font-bold leading-snug">{item.institution}</h3>
                  <div className="mt-0.5 text-sm font-medium text-muted-foreground">{item.degree}</div>
                </div>
              </div>
              {item.details.length === 1 ? (
                <div className="flex items-center justify-between gap-3 pt-3 r-t font-mono text-xs">
                  <span>{t('education.academicStanding')}</span>
                  <span className="r-box bg-secondary px-2 py-0.5 font-semibold">{item.details[0]}</span>
                </div>
              ) : <div className="pt-3 r-t"><DetailList items={item.details} marker="bullet" /></div>}
            </article>
          ))}
          {academic.some(entry => !entry.settings.featured) && <ArchiveToggle expanded={showEducation} onToggle={() => setShowEducation(current => !current)} controls="education-ledger" />}
        </div>}

        {ceEnabled && <div className={`space-y-4 ${formalEnabled ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="flex flex-wrap items-center justify-between gap-2 bg-secondary p-2.5 r-heavy-t r-b font-mono text-xs">
            <span className="font-bold uppercase text-primary">{t('education.certificationsTitle')}</span>
            <span>{t('education.certificationsSubtitle')}</span>
          </div>
          <div id="certifications-ledger" className="r-box divide-y divide-border bg-card">
            {credentials.filter(entry => showCE || entry.settings.featured).map(({ item: certification, index }) => (
              <article id={`ce-card-${index}`} key={certification.id} className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                    <span className="r-box bg-accent px-1.5 py-0.5 font-bold text-accent-foreground">{certification.issuer}</span>
                    <span className="text-faint">{certification.date}</span>
                  </div>
                  <h3 className="font-display text-base font-bold leading-snug sm:text-lg">{certification.title}</h3>
                  <div className="font-mono text-xs text-muted-foreground">{t('education.skillsLabel')}: {certification.skills}</div>
                </div>
                <Button asChild variant="outline" className="h-auto shrink-0 self-start rounded-none px-3 py-1.5 font-mono text-xs sm:self-auto"><a href={certification.url} target="_blank" rel="noopener noreferrer" aria-label={`${t('education.showCredential')}: ${certification.title}`}>{t('education.showCredential')} <ExternalLink aria-hidden="true" className="ml-1 h-3.5 w-3.5" /></a></Button>
              </article>
            ))}
          </div>
          {credentials.some(entry => !entry.settings.featured) && <ArchiveToggle expanded={showCE} onToggle={() => setShowCE(current => !current)} controls="certifications-ledger" />}
          <div className="r-box flex flex-wrap items-center justify-between gap-2 bg-secondary p-3.5 font-mono text-xs">
            <span>{t('education.moreCertificationsNote')}</span>
            <a href={siteConfig.continuingEducationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-6 items-center font-bold text-primary underline">{t('education.seeAllCertifications')}</a>
          </div>
        </div>}
      </div>
    </section>
  );
}
