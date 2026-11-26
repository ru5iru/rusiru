import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewMoreButtonProps { expanded: boolean; controls: string; moreLabel: string; lessLabel: string; onToggle: () => void }

/** Shared View More / Show Less toggle for ledgers with `archived` items. */
export function ViewMoreButton({ expanded, controls, moreLabel, lessLabel, onToggle }: ViewMoreButtonProps) {
  return (
    <div className="mt-6 flex justify-center pt-4 r-t">
      <Button variant="secondary" aria-expanded={expanded} aria-controls={controls} onClick={onToggle} className="h-auto rounded-none px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider">
        {expanded ? lessLabel : moreLabel}
        {expanded ? <ChevronUp aria-hidden="true" className="ml-2 h-4 w-4" /> : <ChevronDown aria-hidden="true" className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  );
}
