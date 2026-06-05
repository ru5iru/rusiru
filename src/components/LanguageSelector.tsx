import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/i18n/i18n';

export function LanguageSelector() {
  const { lang, setLang, languages, t } = useTranslation();
  const current = languages.find((l) => l.code === lang);

  // Only show the selector when more than one language is available.
  if (languages.length < 2) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground px-2">
        <Globe className="h-4 w-4" />
        {current?.label}
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 rounded-full px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
          aria-label={t('nav.selectLanguage')}
        >
          <Globe className="h-4 w-4" />
          {current?.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {languages.map((option) => (
          <DropdownMenuItem
            key={option.code}
            onClick={() => setLang(option.code)}
            className="flex items-center justify-between gap-2"
          >
            {option.name}
            {option.code === lang && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
