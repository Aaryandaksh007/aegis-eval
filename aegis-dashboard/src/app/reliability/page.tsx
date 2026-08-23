'use client';

import React from 'react';
import { Activity, CheckCircle, XCircle, TrendingUp, TrendingDown, Target, Brain } from 'lucide-react';

export default function ReliabilityPage() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>
            Reliability Scorecard
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
            Aggregated agent performance across 1,000+ benchmark iterations.
          </p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        {[
          { label: 'Overall Completion', val: '94.2%', trend: '+2.1%', up: true, icon: Target },
          { label: 'Hallucination Rate', val: '1.8%', trend: '-0.5%', up: true, icon: Brain },
          { label: 'Avg Steps to Solve', val: '8.4', trend: '+1.2', up: false, icon: Activity },
          { label: 'Tool Mastery', val: '98.5%', trend: '+0.1%', up: true, icon: CheckCircle },
        ].map((metric, i) => (
          <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animationDelay: `${i * 100}ms` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', margin: 0 }}>{metric.label}</h3>
              <metric.icon size={16} color="var(--color-text-tertiary)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1 }}>{metric.val}</span>
              <span style={{ 
                display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 500,
                color: metric.up ? 'var(--color-status-success)' : 'var(--color-status-danger)'
              }}>
                {metric.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {metric.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Latest Regression Tests</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              <th style={{ padding: '1rem' }}>Test Suite</th>
              <th style={{ padding: '1rem' }}>Model</th>
              <th style={{ padding: '1rem' }}>Pass Rate</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Last Run</th>
            </tr>
          </thead>
          <tbody>
            {[
              { suite: 'OS Embodied Control', model: 'gpt-4-turbo', rate: '88%', status: 'success', time: '10 mins ago' },
              { suite: 'Code Refactoring', model: 'gpt-4-turbo', rate: '92%', status: 'success', time: '2 hours ago' },
              { suite: 'API Integration (Stripe)', model: 'gpt-3.5-turbo', rate: '45%', status: 'danger', time: '4 hours ago' },
              { suite: 'Customer Support', model: 'claude-3-opus', rate: '99%', status: 'success', time: '1 day ago' },
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--color-border-subtle)', fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{row.suite}</td>
                <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>{row.model}</td>
                <td style={{ padding: '1rem' }}>{row.rate}</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge ${row.status}`}>{row.status === 'success' ? 'Passed' : 'Failed'}</span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
