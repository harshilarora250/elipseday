import React from 'react';
import type { Hero as HeroType } from '@/lib/types';
import type { Chip } from '@/lib/types';
import { HeroDoodles, StarBadge } from '@/components/Decor';

function parseChips(raw: string): Chip[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

const chipClassByIndex = ['c1', 'c2', 'c3', 'c4', 'c5'];

export default function Hero({
  hero,
  metaItems,
}: {
  hero: HeroType;
  metaItems: { label: string; value: string }[];
}) {
  const words = hero.rotatingWords
    .split('\n')
    .map((w) => w.trim())
    .filter(Boolean);
  const chips = parseChips(hero.chips);
  // Loop needs the first word repeated at the end for a seamless roll.
  const rollWords = words.length ? [...words, words[0]] : [];
  // Dynamic keyframes so the rotation works for any number of words.
  const n = words.length;
  const keyframes =
    n > 0
      ? `@keyframes roll-dyn{` +
        Array.from({ length: n + 1 }, (_, i) => {
          const pct = Math.round((i / n) * 100);
          return `${pct}%{transform:translateY(${-1.4 * i}em);}`;
        }).join('') +
        `}`
      : '';
  const rollAnim = n > 0 ? `roll-dyn ${4 + n * 1.4}s cubic-bezier(.16,1,.3,1) infinite` : 'none';

  return (
    <section id="hero">
      <div className="halftone ht-hero" />
      <HeroDoodles />

      {hero.starImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="hero-star" src={hero.starImage} alt="" aria-hidden="true" />
      ) : (
        <StarBadge className="hero-star" />
      )}

      <div className="hero-content">
        {hero.statusText && (
          <span className="hero-status">
            <span className="status-dot" />
            {hero.statusText}
          </span>
        )}
        <div className="hero-kicker">{hero.kicker}</div>
        <h1 className="hero-name">
          {hero.nameLine1}
          <span className="l2">{hero.nameLine2}</span>
        </h1>
        {hero.note && (
          <div className="jaz-note">
            <b>✶</b> {hero.note}
          </div>
        )}

        <p className="hero-sub">
          {hero.subtitle}{' '}
          {rollWords.length > 0 && (
            <span className="words">
              <style dangerouslySetInnerHTML={{ __html: keyframes }} />
              <span
                className="words-in"
                style={{ animation: rollAnim } as React.CSSProperties}
              >
                {rollWords.map((w, i) => (
                  <span key={i}>{w}</span>
                ))}
              </span>
            </span>
          )}
        </p>

        {metaItems.length > 0 && (
          <div className="hero-meta">
            {metaItems.map((m, i) => (
              <div className="hm-item" key={i}>
                <span className="hm-label">{m.label}</span>
                <span className="hm-value">{m.value}</span>
              </div>
            ))}
          </div>
        )}

        {chips.length > 0 && (
          <div className="hero-stickers">
            {chips.map((c, i) => (
              <span
                className={`chip ${chipClassByIndex[i % chipClassByIndex.length]}`}
                key={i}
              >
                {c.text}
              </span>
            ))}
          </div>
        )}

        {hero.floatNote && <div className="float-note">{hero.floatNote}</div>}
      </div>

      <div className="scroll-hint">
        <span>scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
