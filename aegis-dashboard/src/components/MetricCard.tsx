import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function MetricCard({ label, value, change, trend }: MetricCardProps) {
  return (
    <div className="glass-panel metric-card">
      <span className="metric-label">{label}</span>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <span className="metric-value">{value}</span>
        {change && (
          <span
            style={{
              color:
                trend === 'up' ? 'var(--success)' : trend === 'down' ? 'var(--danger)' : 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {change}
          </span>
        )}
      </div>
    </div>
  );
}
