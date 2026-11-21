import { type ReactNode } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Button } from '@/components/ui/button';

export function DisclosureRow({ id, label, open, onToggle, badge, title, summary, links, toggleLabel, lead, children }: {
  id: string;
  label: string;
  open: boolean;
  onToggle: () => void;
  badge: ReactNode;
  title: ReactNode;
  summary?: ReactNode;
  links?: ReactNode;
  toggleLabel: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <Collapsible.Root open={open} onOpenChange={onToggle} asChild>
      <article id={id} className="r-box bg-card transition-colors">
        <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">{badge}</div>
            <h3 className="font-display text-xl font-bold leading-snug sm:text-2xl">{title}</h3>
            {summary && <div className="text-sm text-muted-foreground">{summary}</div>}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2 font-mono text-xs">
            {links}
            <Collapsible.Trigger asChild>
              <Button
                variant="secondary"
                id={`${id}-trigger`}
                aria-controls={`${id}-panel`}
                aria-label={`${toggleLabel}: ${label}`}
                className="h-auto whitespace-normal px-3 py-1.5 font-mono text-xs font-semibold"
              >
                {toggleLabel}
              </Button>
            </Collapsible.Trigger>
          </div>
        </div>
        {!open && (
          <div className="flex items-center justify-between gap-4 px-5 pb-4 pt-2 r-t text-xs text-muted-foreground sm:text-sm">
            <span className="truncate">{lead}</span>
          </div>
        )}
        <Collapsible.Content id={`${id}-panel`} aria-labelledby={`${id}-trigger`} className="disclosure-content overflow-hidden">
          <div className="px-5 pb-6 pt-3 r-t">{children}</div>
        </Collapsible.Content>
      </article>
    </Collapsible.Root>
  );
}

export function DetailList({ items, marker = 'section', section = 1 }: { items: string[]; marker?: 'section' | 'bracket' | 'bullet'; section?: number }) {
  return (
    <ul className="space-y-2.5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
      {items.map((item, index) => {
        const label = marker === 'section' ? `§${section}.${index + 1}` : marker === 'bracket' ? `[${String(index + 1).padStart(2, '0')}]` : '•';
        return (
          <li key={index} className="flex items-start gap-3">
            <span aria-hidden="true" className="mt-1 shrink-0 font-mono text-xs font-bold text-primary">{label}</span>
            <span>{item}</span>
          </li>
        );
      })}
    </ul>
  );
}
