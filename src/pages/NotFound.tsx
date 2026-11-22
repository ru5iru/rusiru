import { Seo } from '@/components/Seo';
import { useTranslation } from '@/i18n/i18n';
import { siteConfig } from '@/config';

const NotFound = () => {
  const { t } = useTranslation();
  const title = `${t('notFound.title')} | ${siteConfig.person.name}`;

  return (
    <>
      <Seo title={title} description={t('notFound.description')} url="" robots="noindex, follow" />
      <div className="min-h-screen bg-desk p-4 text-desk-foreground sm:p-8">
        <main className="broadsheet-page mx-auto max-w-3xl p-8 text-foreground sm:p-12">
          <div className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">{t('nav.editionBadge')}</div>
          <div aria-hidden="true" className="mt-4 font-display text-8xl font-black leading-none sm:text-9xl">404</div>
          <h1 className="mt-6 font-display text-3xl font-black sm:text-4xl">{t('notFound.title')}</h1>
          <p className="mt-3 text-xl text-muted-foreground">{t('notFound.message')}</p>
          <p className="mt-5 pt-5 r-t">{t('notFound.description')}</p>
          <a href="/" className="mt-6 inline-block bg-primary px-5 py-3 font-mono text-xs font-semibold text-primary-foreground hover:underline">{t('notFound.backHome')}</a>
        </main>
      </div>
    </>
  );
};

export default NotFound;
