'use client';

import React, { useState } from 'react';
import { Plus, Shuffle, Save } from 'lucide-react';

export default function ScenariosPage() {
  const [complexity, setComplexity] = useState('medium');
  const [domain, setDomain] = useState('software_engineering');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="heading-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Scenario Builder
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Dynamically generate adversarial environments to prevent test memorization.
          </p>
        </div>
        <button className="btn">
          <Plus size={18} />
          New Scenario
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3>Generation Parameters</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Target Domain</label>
              <select 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  background: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              >
                <option value="software_engineering">Software Engineering (GitHub Issues)</option>
                <option value="customer_support">Customer Support (Interactive)</option>
                <option value="os_control">OS & embodied Control</option>
                <option value="multi_agent">Multi-Agent Coordination</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Adversarial Complexity</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['Low', 'Medium', 'High', 'Extreme'].map((level) => (
                  <button 
                    key={level}
                    onClick={() => setComplexity(level.toLowerCase())}
                    className={`btn-secondary ${complexity === level.toLowerCase() ? 'btn' : ''}`}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button className="btn" style={{ flex: 1, justifyContent: 'center' }}>
                <Shuffle size={18} />
                Generate Sandbox
              </button>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3>Preview: Generated Prompt & Environment</h3>
          <div style={{ 
            background: 'var(--bg-primary)', 
            padding: '16px', 
            borderRadius: '8px', 
            border: '1px solid var(--border-color)',
            fontFamily: 'monospace',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            height: '250px',
            overflowY: 'auto'
          }}>
            {`// SYSTEM PROMPT
You are a site reliability engineer operating in a restricted cloud environment.
Your task is to diagnose a latency issue in the 'PaymentGateway' service.

// ENVIRONMENT STATE
- Database connection: Mocked (Latency injected: 200ms)
- User permissions: Read-only for production, Read/Write for staging.
- Available tools: [execute_sql, fetch_logs, restart_service]

// ADVERSARIAL INJECTION (Complexity: ${complexity})
- The 'fetch_logs' tool will occasionally return truncated outputs.
- A simulated user will interrupt you after 5 steps with an urgent, unrelated request.`}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
             <button className="btn btn-secondary">
               <Save size={18} />
               Save Template
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
