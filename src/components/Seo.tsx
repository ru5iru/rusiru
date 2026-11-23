import { Helmet } from 'react-helmet-async';
import { siteConfig } from '@/config';
import { useTranslation } from '@/i18n/i18n';

interface SeoProps {
  title?: string;
  description?: string;
  socialDescription?: string;
  url?: string;
  robots?: string;
}

export function Seo({ title = siteConfig.seo.title, description = siteConfig.seo.description, socialDescription = siteConfig.seo.ogDescription, url = `${siteConfig.siteUrl}/`, robots = 'index, follow' }: SeoProps) {
  const { t } = useTranslation();
  const { seo, person, siteUrl } = siteConfig;
  const image = new URL(seo.shareImage, `${siteUrl}/`).href;
  const imageAlt = t('seo.shareImageAlt', { name: person.name });

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {url && <link rel="canonical" href={url} />}
      <meta name="robots" content={robots} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={socialDescription} />
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={imageAlt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={socialDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />
    </Helmet>
  );
}
