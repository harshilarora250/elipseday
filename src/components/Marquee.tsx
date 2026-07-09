interface MarqueeProps {
  items: string[];
  variant: 'm1' | 'm2';
  dot?: string;
}

// Static marquee (CSS-animated). Doubles the content so the loop is seamless.
export default function Marquee({ items, variant, dot = '/' }: MarqueeProps) {
  if (!items.length) return null;
  const render = (keyPrefix: string) =>
    items.map((it, i) => (
      <span key={`${keyPrefix}-${i}`}>
        <span>{it}</span>
        <span className="dot">{dot}</span>
      </span>
    ));

  return (
    <div className={`marquee ${variant}`} aria-hidden="true">
      <div className="marquee-track">
        {render('a')}
        {render('b')}
      </div>
    </div>
  );
}
