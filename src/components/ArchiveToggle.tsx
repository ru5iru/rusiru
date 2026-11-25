import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/i18n';

export function ArchiveToggle({ expanded, onToggle, controls, more = 'common.viewMore', less = 'common.showLess' }: { expanded: boolean; onToggle: () => void; controls: string; more?: string; less?: string }) {
  const { t } = useTranslation();
  return <div className="mt-6 flex justify-center pt-4 r-t">
    <Button variant="secondary" aria-expanded={expanded} aria-controls={controls} onClick={onToggle} className="h-auto rounded-none px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider">
      {t(expanded ? less : more)}
      {expanded ? <ChevronUp aria-hidden="true" className="ml-2 h-4 w-4" /> : <ChevronDown aria-hidden="true" className="ml-2 h-4 w-4" />}
    </Button>
  </div>;
}