import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

export default function MetricCard({ label, value, change, trend, loading = false }: MetricCardProps) {
  if (loading) {
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '116px' }}>
        <div className="skeleton" style={{ width: '60%', height: '14px' }}></div>
        <div className="skeleton" style={{ width: '40%', height: '32px', marginTop: 'auto' }}></div>
      </div>
    );
  }

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'var(--color-status-success)' : trend === 'down' ? 'var(--color-status-danger)' : 'var(--color-text-tertiary)';

  // Custom logic: in Aegis, "Failure Modes" trending down is good, but for now we'll keep standard colors or pass them via props.
  // Assuming 'up' is green, 'down' is red by default.

  return (
    <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span style={{
        color: 'var(--color-text-secondary)',
        fontSize: '0.8125rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '4px' }}>
        <span style={{
          fontSize: '2rem',
          fontWeight: 700,
          lineHeight: 1,
          color: 'var(--color-text-primary)'
        }}>
          {value}
        </span>
        {change && (
          <span
            style={{
              color: trendColor,
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: trend === 'up' ? 'var(--color-status-success-bg)' : trend === 'down' ? 'var(--color-status-danger-bg)' : 'transparent',
              padding: '2px 8px',
              borderRadius: '999px'
            }}
          >
            <TrendIcon size={14} strokeWidth={2.5} />
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
