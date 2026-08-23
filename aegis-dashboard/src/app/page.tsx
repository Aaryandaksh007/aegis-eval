'use client';

import React, { useState, useEffect } from 'react';
import MetricCard from '@/components/MetricCard';
import { ShieldAlert, Play, RefreshCw, AlertTriangle, Bug, Navigation, ArrowRight } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);

  // Simulate network request for data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>
            System Overview
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
            Continuous Integration for Autonomous Agents
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary">
            <RefreshCw size={16} />
            Sync Results
          </button>
          <button className="btn btn-primary">
            <Play size={16} fill="currentColor" />
            Run Evaluation
          </button>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <MetricCard loading={loading} label="Global Reliability Score" value="86%" change="5%" trend="up" />
        <MetricCard loading={loading} label="Safety & Guardrails" value="95%" change="3%" trend="up" />
        <MetricCard loading={loading} label="Avg. Tokens / Task" value="12.4k" change="1.2k" trend="down" />
        <MetricCard loading={loading} label="Active Failure Modes" value="3" change="2" trend="down" />
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ marginBottom: '0.25rem', fontSize: '1.125rem' }}>Reliability Regression Tracker</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                Tracking agent capability and safety across version updates.
              </p>
            </div>
            <span className="badge info">Pass^k Metric</span>
          </div>
          
          <div style={{ height: '320px', width: '100%' }}>
            {loading ? (
               <div className="skeleton" style={{ width: '100%', height: '100%' }}></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockRegressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReliability" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-brand-primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--color-brand-primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSafety" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-status-success)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--color-status-success)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border-subtle)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--color-text-secondary)" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="var(--color-text-secondary)" domain={[0, 100]} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border-default)', borderRadius: '8px', boxShadow: 'var(--shadow-lg)' }}
                    itemStyle={{ color: 'var(--color-text-primary)', fontWeight: 500 }}
                    labelStyle={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}
                  />
                  <Area type="monotone" dataKey="reliability" stroke="var(--color-brand-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorReliability)" name="Reliability %" />
                  <Area type="monotone" dataKey="safety" stroke="var(--color-status-success)" strokeWidth={3} fillOpacity={1} fill="url(#colorSafety)" name="Safety %" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ marginBottom: '0.25rem', fontSize: '1.125rem' }}>Recent Failures</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                Detected by Process Classifier.
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loading ? (
              <>
                <div className="skeleton" style={{ width: '100%', height: '80px' }}></div>
                <div className="skeleton" style={{ width: '100%', height: '80px' }}></div>
                <div className="skeleton" style={{ width: '100%', height: '80px' }}></div>
              </>
            ) : (
              [
                { id: 'run-993', type: 'Tool Loop', desc: 'Agent repeatedly called check_status() without waiting.', severity: 'high', icon: RefreshCw },
                { id: 'run-991', type: 'Hallucination', desc: 'Invented non-existent parameter in write_file().', severity: 'medium', icon: Bug },
                { id: 'run-985', type: 'Goal Drift', desc: 'Forgot primary objective during multi-step web search.', severity: 'medium', icon: Navigation },
              ].map((failure) => {
                const Icon = failure.icon;
                return (
                  <div key={failure.id} className="card-interactive" style={{ 
                    padding: '1rem', 
                    background: 'var(--color-bg-base)', 
                    borderRadius: '8px', 
                    border: '1px solid var(--color-border-subtle)',
                    transition: 'all var(--transition-fast)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Icon size={16} color={failure.severity === 'high' ? 'var(--color-status-danger)' : 'var(--color-status-warning)'} />
                        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.875rem' }}>{failure.type}</span>
                      </div>
                      <span className={`badge ${failure.severity === 'high' ? 'danger' : 'warning'}`}>{failure.id}</span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{failure.desc}</p>
                  </div>
                )
              })
            )}
            
            {!loading && (
              <button className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'space-between' }}>
                View All Traces
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
