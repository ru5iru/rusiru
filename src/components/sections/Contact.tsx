import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Mail, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/i18n';

export function Contact() {
  const { ref, isVisible } = useScrollAnimation();
  const { t } = useTranslation();

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden" aria-label={t('contact.ariaLabel')}>
      {/* GEO: Contact summary for AI engines */}
      <div data-geo-summary="contact" className="sr-only" aria-hidden="false">
        {t('contact.geoSummary')}
      </div>
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative">
        <div ref={ref} className="text-center">
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {t('contact.titleBefore')} <span className="gradient-text">{t('contact.titleHighlight')}</span>
          </h2>

          <p
            className={`text-lg text-muted-foreground mb-10 max-w-2xl mx-auto transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {t('contact.description')}
          </p>

          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Button
              asChild
              size="lg"
              className="gradient-bg text-white px-8 py-6 text-lg font-semibold rounded-xl hover:opacity-90 transition-all duration-300 hover:scale-[1.02] glow"
            >
              <a href={`mailto:${t('contact.email')}`}>
                <Mail className="mr-2 w-5 h-5" />
                {t('contact.getInTouch')}
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary px-8 py-6 text-lg font-semibold rounded-xl hover:bg-primary/10 transition-all duration-300 hover:scale-[1.02]"
            >
              <a href={t('contact.linkedinUrl')} target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 w-5 h-5" />
                {t('contact.linkedin')}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
