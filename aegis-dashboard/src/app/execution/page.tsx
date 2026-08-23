'use client';

import React, { useState } from 'react';
import { Terminal, CheckCircle2, XCircle, AlertCircle, PlayCircle } from 'lucide-react';

const mockTrace = [
  { id: 1, step: 'Init', action: 'System prompt loaded', status: 'success', time: '0.0s', type: 'system' },
  { id: 2, step: 'Think', action: 'Analyzing requirements for payment gateway latency.', status: 'success', time: '1.2s', type: 'reasoning' },
  { id: 3, step: 'Act', action: 'call_tool: fetch_logs({ service: "PaymentGateway" })', status: 'success', time: '2.5s', type: 'tool' },
  { id: 4, step: 'Observe', action: 'Tool output: "Error 500: Connection refused to logging server"', status: 'warning', time: '3.1s', type: 'observation' },
  { id: 5, step: 'Think', action: 'Logging server is down. I should check the network configuration.', status: 'success', time: '4.5s', type: 'reasoning' },
  { id: 6, step: 'Act', action: 'call_tool: execute_bash("ping log-server -c 4")', status: 'error', time: '5.2s', type: 'tool' },
  { id: 7, step: 'Eval', action: 'Process Reward Model: Agent hallucinated "execute_bash" tool which is not in the allowed list.', status: 'error', time: '5.5s', type: 'system' }
];

export default function ExecutionViewer() {
  const [selectedRun] = useState('run-994-payment-gateway-diagnostic');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', height: '100%' }}>
      <header>
        <h1 className="heading-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          Execution Traces
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Dense intermediate process verification for long-horizon trajectories.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', flex: 1, minHeight: 0 }}>
        {/* Run List Sidebar */}
        <div className="glass-panel" style={{ overflowY: 'auto', padding: '16px' }}>
          <h3 style={{ marginBottom: '16px' }}>Recent Runs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ padding: '12px', background: 'var(--accent-primary)', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Run #994</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Payment Diagnostic</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--glass-bg)', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Run #993</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>DB Migration Test</div>
            </div>
          </div>
        </div>

        {/* Trace Viewer */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={20} /> {selectedRun}
              </h3>
              <span className="badge danger" style={{ marginTop: '8px' }}>Failed: Hallucinated Tool</span>
            </div>
            <button className="btn btn-secondary">
              <PlayCircle size={18} />
              Replay Trace
            </button>
          </div>

          <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mockTrace.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  padding: '16px', 
                  borderRadius: '8px',
                  background: item.status === 'error' ? 'rgba(239, 68, 68, 0.1)' : item.status === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'var(--glass-bg)',
                  border: `1px solid ${item.status === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-color)'}`
                }}
              >
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', minWidth: '50px' }}>{item.time}</div>
                <div>
                  {item.status === 'success' && <CheckCircle2 size={20} color="var(--success)" />}
                  {item.status === 'error' && <XCircle size={20} color="var(--danger)" />}
                  {item.status === 'warning' && <AlertCircle size={20} color="var(--warning)" />}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {item.step}
                  </div>
                  <div style={{ color: 'var(--text-primary)', fontFamily: item.type === 'tool' ? 'monospace' : 'inherit' }}>
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
