'use client';

import React, { useState } from 'react';
import { Terminal, CheckCircle2, XCircle, AlertCircle, PlayCircle, GitBranch, Settings2, Clock } from 'lucide-react';

const mockTrace = [
  { id: 1, step: 'Init', action: 'System prompt loaded', status: 'success', time: '0.00s', type: 'system' },
  { id: 2, step: 'Think', action: 'Analyzing requirements for payment gateway latency.', status: 'success', time: '1.24s', type: 'reasoning' },
  { id: 3, step: 'Act', action: 'call_tool: fetch_logs({ service: "PaymentGateway" })', status: 'success', time: '2.51s', type: 'tool' },
  { id: 4, step: 'Observe', action: 'Tool output: "Error 500: Connection refused to logging server"', status: 'warning', time: '3.18s', type: 'observation' },
  { id: 5, step: 'Think', action: 'Logging server is down. I should check the network configuration.', status: 'success', time: '4.52s', type: 'reasoning' },
  { id: 6, step: 'Act', action: 'call_tool: execute_bash("ping log-server -c 4")', status: 'error', time: '5.29s', type: 'tool' },
  { id: 7, step: 'Eval', action: 'Process Reward Model: Agent hallucinated "execute_bash" tool which is not in the allowed list.', status: 'error', time: '5.54s', type: 'system' }
];

export default function ExecutionViewer() {
  const [selectedRun] = useState('run-994-payment-gateway-diagnostic');

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
            <Settings2 size={18} color="var(--color-text-tertiary)" />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
            <div className="card-interactive" style={{ padding: '1.25rem 1.5rem', background: 'var(--color-brand-primary-subtle)', borderLeft: '3px solid var(--color-brand-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-brand-primary)', fontSize: '0.875rem' }}>Run #994</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> 2m ago
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>Payment Diagnostic</div>
              <div style={{ marginTop: '0.5rem' }}><span className="badge danger">Failed</span></div>
            </div>
            
            <div className="card-interactive" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.875rem' }}>Run #993</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> 15m ago
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>DB Migration Test</div>
              <div style={{ marginTop: '0.5rem' }}><span className="badge success">Passed</span></div>
            </div>
          </div>
        </div>

        {/* Trace Viewer */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-base)' }}>
            <div>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem' }}>
                <Terminal size={18} /> {selectedRun}
              </h3>
              <span className="badge danger" style={{ marginTop: '0.5rem' }}>Failed: Hallucinated Tool</span>
            </div>
            <button className="btn btn-secondary">
              <PlayCircle size={16} />
              Replay Trace
            </button>
          </div>

          <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', background: '#09090b' }}>
            {mockTrace.map((item) => (
              <div 
                key={item.id} 
                className="animate-slide-up"
                style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  padding: '1rem', 
                  borderRadius: '6px',
                  background: item.status === 'error' ? 'var(--color-status-danger-bg)' : item.status === 'warning' ? 'var(--color-status-warning-bg)' : 'var(--color-bg-surface)',
                  border: `1px solid ${item.status === 'error' ? 'rgba(239, 68, 68, 0.2)' : item.status === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'var(--color-border-subtle)'}`,
                  animationDelay: `${item.id * 50}ms`
                }}
              >
                <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem', minWidth: '45px', paddingTop: '2px', fontFamily: 'var(--font-mono)' }}>[{item.time}]</div>
                <div style={{ paddingTop: '1px' }}>
                  {item.status === 'success' && <CheckCircle2 size={18} color="var(--color-status-success)" />}
                  {item.status === 'error' && <XCircle size={18} color="var(--color-status-danger)" />}
                  {item.status === 'warning' && <AlertCircle size={18} color="var(--color-status-warning)" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
                    {item.step}
                  </div>
                  <div style={{ 
                    color: item.status === 'error' ? 'var(--color-status-danger)' : 'var(--color-text-primary)', 
                    fontFamily: item.type === 'tool' ? 'var(--font-mono)' : 'var(--font-sans)',
                    fontSize: item.type === 'tool' ? '0.875rem' : '0.9375rem',
                    lineHeight: 1.5
                  }}>
                    {item.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
