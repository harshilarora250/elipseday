'use client';

import { useEffect, useRef } from 'react';

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export default function StatCounters({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nums = Array.from(el.querySelectorAll<HTMLElement>('.stat-n'));
    let done = false;

    const countUp = (node: HTMLElement) => {
      const target = Number(node.dataset.count);
      const dur = 1000;
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min((t - t0) / dur, 1);
        node.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done) {
            done = true;
            nums.forEach(countUp);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="stats-row" id="stats" ref={ref}>
      {stats.map((s, i) => (
        <div className="stat-cell" key={i}>
          <span>
            <span className="stat-n" data-count={s.value}>
              0
            </span>
            {s.suffix && <span className="stat-suf">{s.suffix}</span>}
          </span>
          <span className="stat-l">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
