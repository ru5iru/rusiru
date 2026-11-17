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
    <Button size="icon" onClick={() => window.scrollTo({ top: 0, behavior: scrollBehavior() })} aria-label={t('common.backToTop')} tabIndex={visible ? 0 : -1} className={`print-hidden fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-none border border-foreground bg-primary text-primary-foreground transition-opacity ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
      <ArrowUp aria-hidden="true" className="h-5 w-5" />
    </Button>
  );
}
