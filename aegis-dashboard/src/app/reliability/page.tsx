'use client';

import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, TrendingUp, TrendingDown, Target, Brain, Loader2, RefreshCw, Clock } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

interface RunRecord {
  run_id: string;
  status: string;
  created_at: string;
  scorecard: any;
  verdict: any;
  request: any;
}

export default function ReliabilityPage() {
  const [loading, setLoading] = useState(true);
  const [runs, setRuns] = useState<RunRecord[]>([]);

  const fetchRuns = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/evaluations?limit=50`);
      const data = await res.json();
      setRuns(data.runs || []);
    } catch (e) {
      console.error('Failed to fetch runs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRuns(); }, []);

  const completedRuns = runs.filter(r => r.status === 'completed' && r.scorecard);

  // Compute real metrics
  const totalRuns = completedRuns.length;
  const passedRuns = completedRuns.filter(r => !r.scorecard?.blocked);
  const completionRate = totalRuns > 0 ? ((passedRuns.length / totalRuns) * 100).toFixed(1) : '0.0';

  // Hallucination rate: percentage of runs with hallucinated_confidence failure
  const hallucinationRuns = completedRuns.filter(r =>
    (r.scorecard?.failure_modes || []).some((m: any) => m.id === 'hallucinated_confidence')
  );
  const hallucinationRate = totalRuns > 0 ? ((hallucinationRuns.length / totalRuns) * 100).toFixed(1) : '0.0';

  // Average steps (from PRM step_count if available)
  const stepsData = completedRuns
    .map(r => r.scorecard?.prm?.step_count)
    .filter((s: any) => typeof s === 'number' && s > 0);
  const avgSteps = stepsData.length > 0 ? (stepsData.reduce((a: number, b: number) => a + b, 0) / stepsData.length).toFixed(1) : '—';

  // Tool mastery: avg mutation_coverage / trials coverage rate
  const coverageData = completedRuns
    .filter(r => r.scorecard?.trials && r.scorecard?.trials > 0)
    .map(r => (r.scorecard.recovered_trials / r.scorecard.trials) * 100);
  const toolMastery = coverageData.length > 0 ? (coverageData.reduce((a, b) => a + b, 0) / coverageData.length).toFixed(1) : '0.0';

  // Trends (compare first half vs second half of runs)
  const computeTrend = (metricFn: (runs: RunRecord[]) => number): { delta: string; up: boolean } => {
    if (completedRuns.length < 2) return { delta: '—', up: true };
    const mid = Math.floor(completedRuns.length / 2);
    const firstHalf = completedRuns.slice(0, mid);
    const secondHalf = completedRuns.slice(mid);
    const first = metricFn(firstHalf);
    const second = metricFn(secondHalf);
    const diff = second - first;
    return { delta: `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`, up: diff >= 0 };
  };

  const completionTrend = computeTrend(runs => runs.length > 0 ? (runs.filter(r => !r.scorecard?.blocked).length / runs.length) * 100 : 0);
  const hallucinationTrend = computeTrend(runs => runs.length > 0 ? (runs.filter(r => (r.scorecard?.failure_modes || []).some((m: any) => m.id === 'hallucinated_confidence')).length / runs.length) * 100 : 0);
  // For hallucination, lower is better, so invert the "up" flag
  hallucinationTrend.up = !hallucinationTrend.up;

  const timeSince = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const metrics = [
    { label: 'Overall Completion', val: `${completionRate}%`, trend: completionTrend.delta, up: completionTrend.up, icon: Target },
    { label: 'Hallucination Rate', val: `${hallucinationRate}%`, trend: hallucinationTrend.delta, up: hallucinationTrend.up, icon: Brain },
    { label: 'Avg Steps to Solve', val: avgSteps, trend: '—', up: true, icon: Activity },
    { label: 'Tool Mastery', val: `${toolMastery}%`, trend: '—', up: true, icon: CheckCircle },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>
            Reliability Scorecard
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
            Aggregated agent performance across {totalRuns} completed evaluation{totalRuns !== 1 ? 's' : ''}.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchRuns} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'animate-pulse' : ''} />
          Refresh
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="skeleton" style={{ height: '16px', width: '60%' }}></div>
              <div className="skeleton" style={{ height: '32px', width: '40%' }}></div>
            </div>
          ))
        ) : (
          metrics.map((metric, i) => (
            <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animationDelay: `${i * 100}ms` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', margin: 0 }}>{metric.label}</h3>
                <metric.icon size={16} color="var(--color-text-tertiary)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1 }}>{metric.val}</span>
                {metric.trend !== '—' && (
                  <span style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 500,
                    color: metric.up ? 'var(--color-status-success)' : 'var(--color-status-danger)'
                  }}>
                    {metric.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {metric.trend}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="card" style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Latest Evaluation Runs</h3>
          <span className="badge info">{completedRuns.length} completed</span>
        </div>
        {loading ? (
          <div className="skeleton" style={{ height: '200px', width: '100%' }}></div>
        ) : completedRuns.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', padding: '3rem', fontSize: '0.9375rem' }}>
            No completed evaluations yet. Go to the Overview page and run an evaluation to see results here.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem' }}>Run ID</th>
                <th style={{ padding: '1rem' }}>Scenario</th>
                <th style={{ padding: '1rem' }}>Pass@k</th>
                <th style={{ padding: '1rem' }}>Faults</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {completedRuns.slice(0, 10).map((run) => (
                <tr key={run.run_id} style={{ borderBottom: '1px solid var(--color-border-subtle)', fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-brand-primary)' }}>
                    {run.run_id}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>
                    {run.request?.scenario_id || '—'}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>
                    {run.scorecard?.pass_k ?? '—'}%
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                    {run.request?.faults?.length > 0 ? run.request.faults.join(', ') : 'none'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${run.scorecard?.blocked ? 'danger' : 'success'}`}>
                      {run.scorecard?.blocked ? 'Blocked' : 'Passed'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Clock size={12} /> {timeSince(run.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
