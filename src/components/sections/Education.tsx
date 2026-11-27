import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { ViewMoreButton } from '@/components/ViewMoreButton';
import { hasArchived, visibleRecords } from '@/i18n/publish';
import { useTranslation } from '@/i18n/i18n';
import { DetailList } from '@/components/DisclosureRow';
import { SectionHeading } from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config';

interface Item { id: string; institution: string; degree: string; period: string; archived?: boolean; details: string[] }
interface Certification { id: string; issuer: string; date: string; title: string; skills: string; url: string; archived?: boolean }

export function Education() {
  const { t, tr } = useTranslation();
  const formal = tr<boolean>('education.formalEducation.published') !== false ? tr<Item[]>('education.items') ?? [] : [];
  const certifications = tr<boolean>('education.continuingEducation.published') !== false ? tr<Certification[]>('education.certifications') ?? [] : [];
  const [allFormal, setAllFormal] = useState(false);
  const [allCertifications, setAllCertifications] = useState(false);
  const ledgerLink = <Button asChild variant="link" className="h-auto min-h-6 whitespace-normal p-0 text-left font-mono text-xs font-semibold text-primary"><a href={siteConfig.continuingEducationUrl} target="_blank" rel="noopener noreferrer">{t('education.viewAllCertifications')} <ExternalLink aria-hidden="true" className="ml-1 h-3.5 w-3.5" /></a></Button>;

  return (
    <section id="education" aria-label={t('education.ariaLabel')} className="py-8 r-double-b">
      <div data-geo-summary="education" className="sr-only">{t('education.geoSummary')}</div>
      <SectionHeading kicker={t('education.kicker')} title={t('education.title')} actions={ledgerLink} />
      <div className="grid items-start gap-8 lg:grid-cols-12">
        {formal.length > 0 && <div className={`space-y-4 ${certifications.length ? 'lg:col-span-5 lg:pr-6 lg:r-r' : 'lg:col-span-12'}`}>
          <div className="flex items-center justify-between gap-2 bg-secondary p-2.5 r-heavy-t r-b font-mono text-xs">
            <span className="font-bold uppercase">{t('education.formalTitle')}</span>
            <span>{t('education.formalSubtitle')}</span>
          </div>
          <div id="education-ledger" className="space-y-4">
          {visibleRecords(formal, allFormal).map(({ item }) => (
            <article key={item.id} className="r-box space-y-3 bg-card p-5">
              <div className="flex items-start gap-3.5">
                <img src={siteConfig.educationLogos[item.id]} alt={item.institution} width={44} height={44} loading="lazy" className="mt-0.5 h-11 w-11 shrink-0 object-contain" />
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-xs text-primary">{item.period}</div>
                  <h3 className="mt-0.5 font-display text-xl font-bold leading-snug">{item.institution}</h3>
                  <div className="mt-0.5 text-sm font-medium text-muted-foreground">{item.degree}</div>
                </div>
              </div>
              {item.details.length === 0 ? null : item.details.length === 1 ? (
                <div className="flex items-center justify-between gap-3 pt-3 r-t font-mono text-xs">
                  <span>{t('education.academicStanding')}</span>
                  <span className="r-box bg-secondary px-2 py-0.5 font-semibold">{item.details[0]}</span>
                </div>
              ) : <div className="pt-3 r-t"><DetailList items={item.details} marker="bullet" /></div>}
            </article>
          ))}
          </div>
          {hasArchived(formal) && <ViewMoreButton expanded={allFormal} controls="education-ledger" moreLabel={t('education.viewMoreEducation')} lessLabel={t('education.showLess')} onToggle={() => setAllFormal(current => !current)} />}
        </div>}

        {certifications.length > 0 && <div className={`space-y-4 ${formal.length ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="flex flex-wrap items-center justify-between gap-2 bg-secondary p-2.5 r-heavy-t r-b font-mono text-xs">
            <span className="font-bold uppercase text-primary">{t('education.certificationsTitle')}</span>
            <span>{t('education.certificationsSubtitle')}</span>
          </div>
          <div id="certifications-ledger" className="r-box divide-y divide-border bg-card">
            {visibleRecords(certifications, allCertifications).map(({ item: certification }) => (
              <article key={certification.id} className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
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
          {hasArchived(certifications) && <ViewMoreButton expanded={allCertifications} controls="certifications-ledger" moreLabel={t('education.viewMoreCertifications')} lessLabel={t('education.showLess')} onToggle={() => setAllCertifications(current => !current)} />}
          <div className="r-box flex flex-wrap items-center justify-between gap-2 bg-secondary p-3.5 font-mono text-xs">
            <span>{t('education.moreCertificationsNote')}</span>
            <a href={siteConfig.continuingEducationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-6 items-center font-bold text-primary underline">{t('education.seeAllCertifications')}</a>
          </div>
        </div>}
      </div>
    </section>
  );
}
