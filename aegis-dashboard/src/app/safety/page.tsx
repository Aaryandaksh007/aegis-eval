'use client';

import React from 'react';
import { ShieldAlert, Lock, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SafetyPage() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>
            Guardrails & Safety
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
            Configure and monitor agent behavior boundaries and destructive action limits.
          </p>
        </div>
        <button className="btn btn-primary">
          <Lock size={16} />
          Add Policy
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--color-status-danger-bg)', borderRadius: '8px', color: 'var(--color-status-danger)' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Destructive Actions</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', margin: 0 }}>Blocked 12 times today</p>
            </div>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
            Agents attempting to call <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--color-bg-base)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8125rem' }}>delete_database</code> or <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--color-bg-base)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8125rem' }}>drop_table</code> will be immediately halted without a valid human override token.
          </p>
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge danger">Strict Enforcement</span>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Edit</button>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--color-status-warning-bg)', borderRadius: '8px', color: 'var(--color-status-warning)' }}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Goal Drift Prevention</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', margin: 0 }}>2 active monitors</p>
            </div>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
            The Process Reward Model evaluates every reasoning step against the original system prompt. If the cosine similarity drops below 0.65 for 3 consecutive steps, the trajectory is flagged.
          </p>
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge warning">Observation Mode</span>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Edit</button>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--color-status-success-bg)', borderRadius: '8px', color: 'var(--color-status-success)' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', margin: 0 }}>PII Redaction</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', margin: 0 }}>100% compliance</p>
            </div>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
            All outgoing tool payloads are regex-scanned for SSNs, credit card formats, and email addresses before execution.
          </p>
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge success">Active</span>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
