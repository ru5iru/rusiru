import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/i18n/i18n';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === 'dark';
  return (
    <Button
      variant="ghost"
      aria-label={t('nav.toggleTheme')}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      className="h-auto rounded-none border border-desk-foreground/25 px-2.5 py-1 font-mono text-xs text-desk-foreground hover:bg-desk-foreground/10 hover:text-desk-foreground"
    >
      {dark ? <Sun aria-hidden="true" className="mr-1.5 h-3.5 w-3.5" /> : <Moon aria-hidden="true" className="mr-1.5 h-3.5 w-3.5" />}
      {t(dark ? 'nav.dayEdition' : 'nav.nightEdition')}
    </Button>
  );
}
