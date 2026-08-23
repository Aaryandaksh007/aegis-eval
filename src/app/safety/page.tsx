'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Lock, AlertTriangle, ShieldCheck, RefreshCw, TrendingUp, XCircle } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

interface RunRecord {
  run_id: string;
  status: string;
  created_at: string;
  scorecard: any;
  verdict: any;
  request: any;
}

export default function SafetyPage() {
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

  // Destructive actions blocked
  const destructiveBlockedRuns = completedRuns.filter(r =>
    r.scorecard?.guardrail_probe?.blocked === true
  );
  const destructiveBlockedCount = destructiveBlockedRuns.length;
  const destructiveEnabledCount = completedRuns.filter(r =>
    r.scorecard?.guardrail_probe?.enabled === true
  ).length;

  // Goal drift detection: runs with silent_goal_drift failure mode
  const goalDriftRuns = completedRuns.filter(r =>
    (r.scorecard?.failure_modes || []).some((m: any) => m.id === 'silent_goal_drift')
  );
  const goalDriftCount = goalDriftRuns.length;

  // Hallucination interceptions
  const hallucinationRuns = completedRuns.filter(r =>
    (r.scorecard?.failure_modes || []).some((m: any) => m.id === 'hallucinated_confidence')
  );

  // PII/safety compliance: runs with no failures = compliant
  const compliantRuns = completedRuns.filter(r => !r.scorecard?.blocked);
  const complianceRate = completedRuns.length > 0
    ? Math.round((compliantRuns.length / completedRuns.length) * 100)
    : 100;

  // Recent safety events (last 5 blocked runs)
  const recentSafetyEvents = completedRuns
    .filter(r => r.scorecard?.blocked)
    .slice(0, 5);

  const timeSince = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const cardContentStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '1.5rem' };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>
            Guardrails & Safety
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
            Live agent behavior boundaries and destructive action enforcement across {completedRuns.length} evaluations.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchRuns} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'animate-pulse' : ''} />
          Refresh
        </button>
      </header>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton" style={{ height: '180px', width: '100%' }}></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Destructive Actions Card */}
            <div className="card" style={cardContentStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', background: 'var(--color-status-danger-bg)', borderRadius: '8px', color: 'var(--color-status-danger)' }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Destructive Actions</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', margin: 0 }}>
                    Blocked {destructiveBlockedCount} of {destructiveEnabledCount} probed
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 700, color: destructiveBlockedCount > 0 ? 'var(--color-status-danger)' : 'var(--color-status-success)', lineHeight: 1 }}>
                  {destructiveBlockedCount}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)', paddingBottom: '0.25rem' }}>interceptions</span>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                Agents attempting irreversible actions (fund transfers, account deletions, payment releases) without explicit confirmation tokens are immediately halted in the sandbox.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge danger">Strict Enforcement</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                  {destructiveEnabledCount > 0 ? `${Math.round((destructiveBlockedCount / destructiveEnabledCount) * 100)}% block rate` : 'No probes run'}
                </span>
              </div>
            </div>

            {/* Goal Drift Card */}
            <div className="card" style={cardContentStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', background: 'var(--color-status-warning-bg)', borderRadius: '8px', color: 'var(--color-status-warning)' }}>
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Goal Drift Prevention</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', margin: 0 }}>
                    {goalDriftCount} drift event{goalDriftCount !== 1 ? 's' : ''} detected
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 700, color: goalDriftCount > 0 ? 'var(--color-status-warning)' : 'var(--color-status-success)', lineHeight: 1 }}>
                  {goalDriftCount}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)', paddingBottom: '0.25rem' }}>detections</span>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                The Process Reward Model evaluates every reasoning step against the original system prompt. If the trajectory changes the task objective after a fault, the run is flagged as a silent goal drift.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${goalDriftCount > 0 ? 'warning' : 'success'}`}>
                  {goalDriftCount > 0 ? 'Active Monitoring' : 'All Clear'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                  PRM axis: goal_adherence
                </span>
              </div>
            </div>

            {/* Compliance Card */}
            <div className="card" style={cardContentStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', background: 'var(--color-status-success-bg)', borderRadius: '8px', color: 'var(--color-status-success)' }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Safety Compliance</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', margin: 0 }}>
                    {complianceRate}% pass rate
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 700, color: complianceRate >= 80 ? 'var(--color-status-success)' : 'var(--color-status-danger)', lineHeight: 1 }}>
                  {complianceRate}%
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)', paddingBottom: '0.25rem' }}>compliance</span>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                Measures the percentage of evaluation runs where the agent completed its task safely without triggering any failure mode or requiring a release block.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${complianceRate >= 80 ? 'success' : 'danger'}`}>
                  {complianceRate >= 80 ? 'Healthy' : 'Needs Attention'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                  {compliantRuns.length} of {completedRuns.length} runs clean
                </span>
              </div>
            </div>
          </div>

          {/* Recent Safety Events */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Recent Safety Interceptions</h3>
              <span className="badge danger">{recentSafetyEvents.length} events</span>
            </div>
            {recentSafetyEvents.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', padding: '2rem', fontSize: '0.9375rem' }}>
                No safety interceptions recorded. All evaluated agents passed their guardrail checks.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentSafetyEvents.map(run => {
                  const modes = run.scorecard?.failure_modes || [];
                  return (
                    <div key={run.run_id} style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '1rem', borderRadius: '8px',
                      background: 'var(--color-status-danger-bg)',
                      border: '1px solid rgba(248, 113, 113, 0.15)',
                    }}>
                      <XCircle size={18} color="var(--color-status-danger)" style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-brand-primary)', fontWeight: 600 }}>{run.run_id}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>{timeSince(run.created_at)}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {modes.map((m: any, i: number) => (
                            <span key={i} className="badge danger" style={{ fontSize: '0.625rem' }}>{m.name}</span>
                          ))}
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '0.375rem 0 0 0' }}>
                          {run.verdict?.text || 'Agent behavior violated safety guardrails.'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
