'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErr(data.error || 'Login failed');
        setBusy(false);
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setErr('Network error');
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="login-card" onSubmit={submit}>
        <div className="login-title">LOG IN</div>
        <div className="login-sub">to the control room ✶</div>
        <div className="field">
          <label className="field-label">Username</label>
          <input
            className="field-input"
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label">Password</label>
          <input
            className="field-input"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {err && <div className="field-error">{err}</div>}
        <button className="btn btn-primary" type="submit" disabled={busy} style={{ marginTop: '0.6rem', width: '100%' }}>
          {busy ? 'Checking…' : 'Enter'}
        </button>
        <a href="/" className="admin-link" style={{ display: 'block', marginTop: '1rem' }}>
          ← Back to site
        </a>
      </form>
    </div>
  );
}
