import { ReactNode } from 'react';

// Parses `[[highlighted]]` markers in a string into <span class="hl"> chips.
export function withHighlights(text: string): ReactNode[] {
  const parts = text.split(/(\[\[.*?\]\])/g);
  return parts.map((part, i) => {
    if (part.startsWith('[[') && part.endsWith(']]')) {
      return (
        <span className="hl" key={i}>
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
