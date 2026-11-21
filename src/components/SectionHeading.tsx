import type { ReactNode } from 'react';

export function SectionHeading({ kicker, title, actions }: { kicker: string; title: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3 pb-3 r-heavy-b">
      <div>
        <div className="font-mono text-xs uppercase tracking-widest text-primary">{kicker}</div>
        <h2 className="mt-0.5 font-display text-3xl font-black sm:text-4xl">{title}</h2>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 font-mono text-xs">{actions}</div>}
    </div>
  );
}
