import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/config";
import { useTranslation } from "@/i18n/i18n";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const { t } = useTranslation();
  const url = `${siteConfig.siteUrl}${location.pathname}`;
  const title = `${t("notFound.title")} | ${siteConfig.person.name}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta
          name="description"
          content={t("notFound.description")}
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={t("notFound.description")}
        />
        <meta property="og:url" content={url} />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">{t("notFound.message")}</p>
          <a href="/" className="text-primary underline hover:text-primary/90">
            {t("notFound.backHome")}
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
