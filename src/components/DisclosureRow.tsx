import { type ReactNode } from 'react';
import { Plus, Minus } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Button } from '@/components/ui/button';

export function DisclosureRow({ id, label, open, onToggle, badge, summary, links, children }: {
  id: string; label: string; open: boolean; onToggle: () => void;
  badge: ReactNode; summary?: ReactNode; links?: ReactNode; children: ReactNode;
}) {
  return (
    <Collapsible.Root open={open} onOpenChange={onToggle} asChild>
      <article className="border-b border-border">
        <div className="flex items-start gap-3 py-6 md:py-8">
          <Collapsible.Trigger asChild>
            <Button variant="ghost" aria-label={label} aria-controls={`${id}-panel`} id={`${id}-trigger`}
              className="group h-auto min-w-0 flex-1 justify-start whitespace-normal p-0 text-left hover:bg-transparent">
              <span className="flex w-full min-w-0 flex-col gap-4 md:flex-row md:items-center md:gap-6">
                <span className="flex min-w-0 items-center gap-3 md:w-1/3 md:shrink-0">{badge}</span>
                {summary && <span className="min-w-0 flex-1">{summary}</span>}
              </span>
              <span className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border md:h-10 md:w-10">
                {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </Button>
          </Collapsible.Trigger>
          {links && <div className="flex shrink-0 gap-3 pt-2">{links}</div>}
        </div>
        <Collapsible.Content id={`${id}-panel`} aria-labelledby={`${id}-trigger`} className="disclosure-content overflow-hidden">
          <div className="pb-6 md:pb-8 md:pl-[33.333%] md:pr-14">{children}</div>
        </Collapsible.Content>
      </article>
    </Collapsible.Root>
  );
}

export function DetailList({ items }: { items: string[] }) {
  return <ul className="space-y-2">{items.map((item, index) => <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground md:text-base"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /><span className="leading-relaxed">{item}</span></li>)}</ul>;
}
