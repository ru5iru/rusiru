import { ExternalLink, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/SectionHeading';
import { useTranslation } from '@/i18n/i18n';
import { siteConfig } from '@/config';
import { brandIcons } from '@/components/icons/BrandIcons';

export function Contact() {
  const { t } = useTranslation();
  const platform = siteConfig.contact.secondaryButton.platform;
  const SecondaryIcon = brandIcons[platform]?.icon ?? ExternalLink;
  return (
    <section id="contact" className="pt-8" aria-label={t('contact.ariaLabel')}>
      <div data-geo-summary="contact" className="sr-only">{t('contact.geoSummary')}</div>
      <SectionHeading kicker={t('contact.kicker')} title={`${t('contact.titleBefore')} ${t('contact.titleHighlight')}`} />
      <div className="grid min-w-0 grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div className="r-box min-w-0 flex flex-col justify-between space-y-4 bg-secondary p-5 lg:col-span-5">
          <div className="space-y-2 text-xs leading-relaxed">
            <div className="font-mono font-bold uppercase text-primary">{t('contact.directChannels')}</div>
            <p className="text-muted-foreground">{t('contact.availability')}</p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-3 pt-2 r-t font-mono text-xs">
            {siteConfig.social.map(link => {
              const brand = brandIcons[link.platform];
              const label = t(`footer.social.${link.platform}`);
              const Icon = brand?.icon ?? ExternalLink;
              return <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer me" aria-label={t('footer.socialAria', { label })} className="inline-flex min-h-6 items-center gap-1.5 underline"><Icon aria-hidden="true" className="h-3.5 w-3.5" />{label}</a>;
            })}
          </div>
        </div>
        <div className="scissor-coupon min-w-0 flex flex-col justify-between space-y-4 p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs"><span className="font-bold text-primary">{t('contact.couponLabel')}</span><span>{t('contact.couponReference')}</span></div>
          <div><h3 className="font-display text-2xl font-black sm:text-3xl">{t('contact.couponTitle')}</h3><p className="mt-1 text-xs text-muted-foreground sm:text-sm">{t('contact.description')}</p></div>
          <div className="flex flex-wrap items-center gap-3 pt-1 font-mono text-xs">
            <Button asChild className="h-auto whitespace-normal break-all rounded-none px-5 py-3 text-left font-mono text-xs font-bold uppercase"><a href={`mailto:${siteConfig.person.email}`}><Mail aria-hidden="true" className="mr-2 h-4 w-4" />{t('contact.getInTouch')} ({siteConfig.person.email}) <ExternalLink aria-hidden="true" className="ml-1 h-3.5 w-3.5" /></a></Button>
            <Button asChild variant="outline" className="h-auto rounded-none px-4 py-3 font-mono text-xs font-semibold uppercase"><a href={siteConfig.contact.secondaryButton.url} target="_blank" rel="noopener noreferrer"><SecondaryIcon aria-hidden="true" className="mr-2 h-4 w-4" />{platform === 'linkedin' ? t('contact.linkedin') : t(`footer.social.${platform}`)} <ExternalLink aria-hidden="true" className="ml-1 h-3.5 w-3.5" /></a></Button>
          </div>
        </div>
      </div>
    </section>
  );
}
