'use client';

import { useRef, useState } from 'react';
import { uploadImage } from './admin-api';
import type { Chip, ChipColor } from '@/lib/types';

export function Field({
  label,
  value,
  onChange,
  hint,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  error?: string;
}) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <input
        className="field-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <div className="field-hint">{hint}</div>}
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  hint,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  rows?: number;
}) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <textarea
        className="field-textarea"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <div className="field-hint">{hint}</div>}
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="track" />
      {label}
    </label>
  );
}

const COLORS: ChipColor[] = ['yellow', 'mint', 'pink', 'coral', 'lavender'];

export function ChipEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  let chips: Chip[] = [];
  try {
    chips = JSON.parse(value || '[]');
  } catch {
    chips = [];
  }
  const [text, setText] = useState('');
  const [color, setColor] = useState<ChipColor>('yellow');

  const add = () => {
    const t = text.trim();
    if (!t) return;
    chips = [...chips, { text: t, color }];
    onChange(JSON.stringify(chips));
    setText('');
  };
  const remove = (i: number) => {
    chips = chips.filter((_, idx) => idx !== i);
    onChange(JSON.stringify(chips));
  };

  return (
    <div className="field">
      <label className="field-label">Sticker chips (comma-free, add one at a time)</label>
      <div className="chip-editor">
        {chips.map((c, i) => (
          <span className="chip-pill" key={i} style={{ background: `var(--${c.color})` }}>
            <span className="color-swatch" style={{ background: `var(--${c.color})` }} />
            {c.text}
            <button type="button" onClick={() => remove(i)} aria-label="Remove">
              ×
            </button>
          </span>
        ))}
        {chips.length === 0 && (
          <span className="field-hint">No chips yet.</span>
        )}
      </div>
      <div className="img-row" style={{ marginTop: '0.6rem' }}>
        <input
          className="field-input"
          placeholder="chip text…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
        />
        <select
          className="field-select"
          style={{ maxWidth: 160 }}
          value={color}
          onChange={(e) => setColor(e.target.value as ChipColor)}
        >
          {COLORS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-ghost" style={{ marginTop: '0.5rem' }} type="button" onClick={add}>
        + Add chip
      </button>
    </div>
  );
}

export function ImageField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onFile = async (file: File) => {
    setBusy(true);
    setErr('');
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (e) {
      setErr((e as Error).message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <div className="img-row">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="img-thumb" src={value} alt="preview" />
        )}
        <div style={{ flex: 1, minWidth: 160 }}>
          <input
            className="field-input"
            placeholder="https://… or upload"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <div
            className="upload-zone"
            onClick={() => fileRef.current?.click()}
            style={{ marginTop: '0.5rem' }}
          >
            {busy ? 'Uploading…' : '⬆ Upload image'}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
        </div>
      </div>
      {hint && <div className="field-hint">{hint}</div>}
      {err && <div className="field-error">{err}</div>}
    </div>
  );
}
