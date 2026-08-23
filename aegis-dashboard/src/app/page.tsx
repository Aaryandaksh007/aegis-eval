'use client';

import React, { useState, useEffect } from 'react';
import MetricCard from '@/components/MetricCard';
import { ShieldAlert, Play, RefreshCw, AlertTriangle, Bug, Navigation, ArrowRight } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const API_BASE = 'http://localhost:8000';

const mockRegressionData = [
  { name: 'v1.0', reliability: 65, safety: 80 },
  { name: 'v1.1', reliability: 68, safety: 82 },
  { name: 'v1.2', reliability: 62, safety: 75 },
  { name: 'v1.3', reliability: 74, safety: 88 },
  { name: 'v1.4', reliability: 81, safety: 92 },
  { name: 'v1.5', reliability: 86, safety: 95 },
];

interface RunSummary {
  run_id: string;
  status: string;
  created_at: string;
  scorecard: any;
  verdict: any;
  request: any;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [runningEval, setRunningEval] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [healthRes, runsRes] = await Promise.all([
        fetch(`${API_BASE}/api/health`),
        fetch(`${API_BASE}/api/evaluations?limit=10`),
      ]);
      setHealth(await healthRes.json());
      const runsData = await runsRes.json();
      setRuns(runsData.runs || []);
    } catch (e) {
      console.error('Failed to fetch data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRunEvaluation = async () => {
    setRunningEval(true);
    try {
      const res = await fetch(`${API_BASE}/api/evaluations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_id: 'refund',
          faults: ['timeout'],
          mutations: true,
          trial_count: 50,
          destructive_probe: true,
          llm_mode: 'mock',
        }),
      });
      const data = await res.json();
      // Wait a moment then refresh
      setTimeout(() => {
        fetchData();
        setRunningEval(false);
      }, 2000);
    } catch (e) {
      console.error('Failed to run evaluation:', e);
      setRunningEval(false);
    }
  };

  // Compute live metrics from runs
  const completedRuns = runs.filter(r => r.status === 'completed' && r.scorecard);
  const avgPassK = completedRuns.length > 0
    ? Math.round(completedRuns.reduce((sum, r) => sum + (r.scorecard?.pass_k || 0), 0) / completedRuns.length)
    : 0;
  const blockedCount = completedRuns.filter(r => r.scorecard?.blocked).length;
  const totalFailureModes = completedRuns.reduce((sum, r) => sum + (r.scorecard?.failure_count || 0), 0);

  // Build recent failures from actual run data
  const recentFailures = completedRuns
    .filter(r => r.scorecard?.blocked)
    .slice(0, 3)
    .map(r => ({
      id: r.run_id,
      type: r.scorecard?.failure_modes?.[0]?.name || 'Unknown',
      desc: r.scorecard?.failure_modes?.[0]?.description || 'Failure detected during evaluation.',
      severity: r.scorecard?.failure_modes?.[0]?.severity === 'critical' ? 'high' : 'medium',
      icon: r.scorecard?.failure_modes?.[0]?.id?.includes('loop') ? RefreshCw : r.scorecard?.failure_modes?.[0]?.id?.includes('hallucin') ? Bug : Navigation,
    }));

  // Fallback failures for empty state
  const displayFailures = recentFailures.length > 0 ? recentFailures : [
    { id: 'no-runs', type: 'No failures yet', desc: 'Run an evaluation to see results here.', severity: 'medium', icon: AlertTriangle },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>
            System Overview
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
            Continuous Integration for Autonomous Agents
            {health && <span style={{ color: 'var(--color-text-tertiary)', marginLeft: '0.75rem', fontSize: '0.8125rem' }}>v{health.version}</span>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={fetchData} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-pulse' : ''} />
            Sync Results
          </button>
          <button className="btn btn-primary" onClick={handleRunEvaluation} disabled={runningEval}>
            <Play size={16} fill="currentColor" />
            {runningEval ? 'Running...' : 'Run Evaluation'}
          </button>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <MetricCard loading={loading} label="Avg. Pass@k Score" value={`${avgPassK}%`} change={completedRuns.length > 0 ? `${completedRuns.length} runs` : '—'} trend={avgPassK > 50 ? 'up' : 'down'} />
        <MetricCard loading={loading} label="Blocked Releases" value={blockedCount} change={completedRuns.length > 0 ? `of ${completedRuns.length}` : '—'} trend={blockedCount > 0 ? 'down' : 'up'} />
        <MetricCard loading={loading} label="Total Runs" value={runs.length} change="all time" trend="neutral" />
        <MetricCard loading={loading} label="Active Failure Modes" value={totalFailureModes} change={totalFailureModes > 0 ? 'detected' : 'none'} trend={totalFailureModes > 0 ? 'down' : 'up'} />
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
            <span className="badge info">Pass@k Metric</span>
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
                Detected by Process Reward Model.
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
              displayFailures.map((failure) => {
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
