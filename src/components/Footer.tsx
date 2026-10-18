import { useTranslation } from '@/i18n/i18n';
import { brandIcons } from '@/components/icons/BrandIcons';
import { siteConfig, resolveIcon, allSkills } from '@/config';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="py-12 border-t border-border bg-card/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-8">
          {/* Social Links */}
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {siteConfig.social.map((link) => {
              const brand = brandIcons[link.platform];
              const key = `footer.social.${link.platform}`;
              const label = t(key) === key ? link.platform : t(key);
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className={`text-muted-foreground ${brand?.hover ?? 'hover:text-foreground'} transition-all duration-300 hover:scale-125`}
                  aria-label={t('footer.socialAria', { label })}
                >
                  {link.icon ? <img src={link.icon} alt="" className="w-6 h-6" /> : brand ? <brand.icon className="w-6 h-6" /> : <span className="text-sm">{label}</span>}
                </a>
              );
            })}
          </div>

          {/* Logo */}
          <a href="#" className="text-3xl font-display font-bold gradient-text">
            {t('footer.brand')}
          </a>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            {t('footer.copyright', { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
}
