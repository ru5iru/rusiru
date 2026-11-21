import { Fragment } from 'react';

// Renders locale strings with light markup:
//   **text** -> emphasized (foreground, semibold)
//   ==text== -> editorial crimson highlight
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|==[^=]+==)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <span key={i} className="text-foreground font-semibold">{part.slice(2, -2)}</span>;
        }
        if (part.startsWith('==') && part.endsWith('==')) {
          return <span key={i} className="bg-accent px-1 font-medium text-accent-foreground">{part.slice(2, -2)}</span>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
