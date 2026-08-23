'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle2, XCircle, AlertCircle, PlayCircle, Settings2, Clock, Loader2 } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

interface TraceEvent {
  step: number;
  timestamp: string;
  text: string;
  style: string;
  lane: string;
}

interface RunRecord {
  run_id: string;
  status: string;
  created_at: string;
  scorecard: any;
  verdict: any;
  request: any;
}

export default function ExecutionViewer() {
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [trace, setTrace] = useState<TraceEvent[]>([]);
  const [loadingRuns, setLoadingRuns] = useState(true);
  const [loadingTrace, setLoadingTrace] = useState(false);
  const [replaying, setReplaying] = useState(false);

  // Fetch all runs
  useEffect(() => {
    fetch(`${API_BASE}/api/evaluations?limit=20`)
      .then(res => res.json())
      .then(data => {
        const runsList = data.runs || [];
        setRuns(runsList);
        if (runsList.length > 0 && !selectedRunId) {
          setSelectedRunId(runsList[0].run_id);
        }
        setLoadingRuns(false);
      })
      .catch(() => setLoadingRuns(false));
  }, []);

  // Fetch trace for selected run
  useEffect(() => {
    if (!selectedRunId) return;
    setLoadingTrace(true);
    fetch(`${API_BASE}/api/evaluations/${selectedRunId}`)
      .then(res => res.json())
      .then(data => {
        const baselineTrace = (data.baseline_trace || []).map((e: any) => ({ ...e, lane: 'baseline' }));
        const aegisTrace = (data.aegis_trace || []).map((e: any) => ({ ...e, lane: 'aegis' }));
        const combined = [...baselineTrace, ...aegisTrace].sort((a, b) => a.step - b.step);
        setTrace(combined);
        setLoadingTrace(false);
      })
      .catch(() => setLoadingTrace(false));
  }, [selectedRunId]);

  const handleReplay = async () => {
    if (!selectedRunId) return;
    setReplaying(true);
    try {
      const res = await fetch(`${API_BASE}/api/evaluations/${selectedRunId}/replay`, { method: 'POST' });
      const data = await res.json();
      // Refresh runs list
      const runsRes = await fetch(`${API_BASE}/api/evaluations?limit=20`);
      const runsData = await runsRes.json();
      setRuns(runsData.runs || []);
      setSelectedRunId(data.run_id);
    } catch (e) {
      console.error('Replay failed:', e);
    } finally {
      setReplaying(false);
    }
  };

  const getStatusForStep = (text: string, style: string): 'success' | 'error' | 'warning' => {
    if (style === 'error' || text.toLowerCase().includes('blocked') || text.toLowerCase().includes('hallucinated') || text.toLowerCase().includes('fatal')) return 'error';
    if (style === 'warning' || text.toLowerCase().includes('fault') || text.toLowerCase().includes('injected') || text.toLowerCase().includes('500')) return 'warning';
    return 'success';
  };

  const selectedRun = runs.find(r => r.run_id === selectedRunId);

  const timeSince = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', height: '100%', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>
            Execution Traces
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
            Dense intermediate process verification for long-horizon trajectories.
          </p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', flex: 1, minHeight: 0 }}>
        {/* Run List Sidebar */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Recent Runs</h3>
            <span className="badge info">{runs.length}</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
            {loadingRuns ? (
              <div style={{ padding: '1.5rem' }}>
                <div className="skeleton" style={{ height: '70px', marginBottom: '0.5rem' }}></div>
                <div className="skeleton" style={{ height: '70px', marginBottom: '0.5rem' }}></div>
                <div className="skeleton" style={{ height: '70px' }}></div>
              </div>
            ) : runs.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: '0.875rem' }}>
                No evaluation runs yet. Go to Overview and click "Run Evaluation".
              </div>
            ) : (
              runs.map(run => (
                <div
                  key={run.run_id}
                  className="card-interactive"
                  onClick={() => setSelectedRunId(run.run_id)}
                  style={{ 
                    padding: '1rem 1.5rem', 
                    cursor: 'pointer',
                    background: run.run_id === selectedRunId ? 'var(--color-brand-primary-subtle)' : 'transparent',
                    borderLeft: run.run_id === selectedRunId ? '3px solid var(--color-brand-primary)' : '3px solid transparent',
                    borderBottom: '1px solid var(--color-border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: run.run_id === selectedRunId ? 'var(--color-brand-primary)' : 'var(--color-text-primary)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>{run.run_id}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {timeSince(run.created_at)}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{run.request?.scenario_id || 'unknown'}</div>
                  <div style={{ marginTop: '0.375rem' }}>
                    <span className={`badge ${run.scorecard?.blocked ? 'danger' : run.status === 'completed' ? 'success' : 'warning'}`}>
                      {run.scorecard?.blocked ? 'Blocked' : run.status === 'completed' ? 'Passed' : run.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Trace Viewer */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-base)' }}>
            <div>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem' }}>
                <Terminal size={18} /> {selectedRunId || 'Select a run'}
              </h3>
              {selectedRun?.verdict && (
                <span className={`badge ${selectedRun.scorecard?.blocked ? 'danger' : 'success'}`} style={{ marginTop: '0.5rem' }}>
                  {selectedRun.verdict.release}
                </span>
              )}
            </div>
            <button className="btn btn-secondary" onClick={handleReplay} disabled={!selectedRunId || replaying}>
              {replaying ? <Loader2 size={16} className="animate-pulse" /> : <PlayCircle size={16} />}
              {replaying ? 'Replaying...' : 'Replay Trace'}
            </button>
          </div>

          <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#0a0a0c' }}>
            {loadingTrace ? (
              <>
                <div className="skeleton" style={{ height: '60px' }}></div>
                <div className="skeleton" style={{ height: '60px' }}></div>
                <div className="skeleton" style={{ height: '60px' }}></div>
              </>
            ) : trace.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', padding: '3rem', fontSize: '0.875rem' }}>
                {selectedRunId ? 'No trace data for this run.' : 'Select a run from the sidebar to view its execution trace.'}
              </div>
            ) : (
              trace.map((item, i) => {
                const status = getStatusForStep(item.text, item.style);
                return (
                  <div 
                    key={i} 
                    className="animate-slide-up"
                    style={{ 
                      display: 'flex', 
                      gap: '0.75rem', 
                      padding: '0.75rem 1rem', 
                      borderRadius: '6px',
                      background: status === 'error' ? 'var(--color-status-danger-bg)' : status === 'warning' ? 'var(--color-status-warning-bg)' : 'var(--color-bg-surface)',
                      border: `1px solid ${status === 'error' ? 'rgba(248, 113, 113, 0.2)' : status === 'warning' ? 'rgba(251, 191, 36, 0.2)' : 'var(--color-border-subtle)'}`,
                      animationDelay: `${i * 40}ms`
                    }}
                  >
                    <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.6875rem', minWidth: '24px', paddingTop: '2px', fontFamily: 'var(--font-mono)' }}>{item.step}</div>
                    <div style={{ paddingTop: '1px' }}>
                      {status === 'success' && <CheckCircle2 size={16} color="var(--color-status-success)" />}
                      {status === 'error' && <XCircle size={16} color="var(--color-status-danger)" />}
                      {status === 'warning' && <AlertCircle size={16} color="var(--color-status-warning)" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.125rem' }}>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', letterSpacing: '0.05em' }}>
                          {item.lane}
                        </span>
                      </div>
                      <div style={{ 
                        color: status === 'error' ? 'var(--color-status-danger)' : 'var(--color-text-primary)', 
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8125rem',
                        lineHeight: 1.5
                      }}>
                        {item.text}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
