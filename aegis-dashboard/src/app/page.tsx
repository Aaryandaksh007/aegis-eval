'use client';

import React from 'react';
import MetricCard from '@/components/MetricCard';
import { ShieldAlert, Play, RefreshCw } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const mockRegressionData = [
  { name: 'v1.0', reliability: 65, safety: 80 },
  { name: 'v1.1', reliability: 68, safety: 82 },
  { name: 'v1.2', reliability: 62, safety: 75 }, // Regression detected
  { name: 'v1.3', reliability: 74, safety: 88 },
  { name: 'v1.4', reliability: 81, safety: 92 },
  { name: 'v1.5', reliability: 86, safety: 95 },
];

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="heading-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            System Overview
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Continuous Integration for Autonomous Agents
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary">
            <RefreshCw size={18} />
            Sync Results
          </button>
          <button className="btn">
            <Play size={18} />
            Run Evaluation Suite
          </button>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <MetricCard label="Global Reliability Score" value="86%" change="5%" trend="up" />
        <MetricCard label="Safety & Guardrails" value="95%" change="3%" trend="up" />
        <MetricCard label="Avg. Tokens / Task" value="12.4k" change="1.2k" trend="down" />
        <MetricCard label="Active Failure Modes" value="3" change="2" trend="down" />
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3 style={{ marginBottom: '8px' }}>Reliability Regression Tracker</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Tracking agent capability and safety across version updates.
            </p>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockRegressionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReliability" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSafety" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="reliability" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorReliability)" name="Reliability %" />
                <Area type="monotone" dataKey="safety" stroke="var(--success)" fillOpacity={1} fill="url(#colorSafety)" name="Safety %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3 style={{ marginBottom: '8px' }}>Recent Failures</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Latest identified failure modes (Process Classifier).
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { id: 'run-993', type: 'Tool Loop', desc: 'Agent repeatedly called check_status() without waiting.', severity: 'high' },
              { id: 'run-991', type: 'Hallucination', desc: 'Invented non-existent parameter in write_file().', severity: 'medium' },
              { id: 'run-985', type: 'Goal Drift', desc: 'Forgot primary objective during multi-step web search.', severity: 'medium' },
            ].map((failure) => (
              <div key={failure.id} style={{ padding: '16px', background: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{failure.type}</span>
                  <span className={`badge ${failure.severity === 'high' ? 'danger' : 'warning'}`}>{failure.id}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{failure.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
