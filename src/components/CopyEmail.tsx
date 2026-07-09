'use client';

import { useState } from 'react';

export default function CopyEmail({
  email,
  label,
}: {
  email: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const t = document.createElement('textarea');
      t.value = email;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      className={`copy-email${copied ? ' done' : ''}`}
      type="button"
      onClick={copy}
    >
      {copied ? 'Copied!' : label}
    </button>
  );
}
