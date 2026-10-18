import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/i18n';
import { scrollBehavior } from '@/lib/navigation';

export function BackToTop() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Button
      size="icon"
      onClick={() => window.scrollTo({ top: 0, behavior: scrollBehavior() })}
      aria-label={t('common.backToTop')}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full gradient-bg text-primary-foreground shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </Button>
  );
}
