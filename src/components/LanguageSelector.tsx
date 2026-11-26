import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/i18n/i18n';

export function LanguageSelector() {
  const { lang, setLang, languages, t } = useTranslation();
  const current = languages.find(language => language.code === lang);
  if (languages.length < 2) return <span className="inline-flex items-center gap-1.5 px-2 font-mono text-xs font-medium text-desk-foreground"><Globe aria-hidden="true" className="h-3.5 w-3.5" />{current?.label}</span>;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-auto gap-1.5 rounded-none border border-desk-foreground/25 px-2.5 py-1 font-mono text-xs font-medium text-desk-foreground hover:bg-desk-foreground/10 hover:text-desk-foreground" aria-label={t('nav.selectLanguage')}><Globe aria-hidden="true" className="h-3.5 w-3.5" />{current?.label}</Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {languages.map(option => <DropdownMenuItem key={option.code} onClick={() => setLang(option.code)} className="flex items-center justify-between gap-2">{option.name}{option.code === lang && <Check aria-hidden="true" className="h-4 w-4 text-primary" />}</DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
