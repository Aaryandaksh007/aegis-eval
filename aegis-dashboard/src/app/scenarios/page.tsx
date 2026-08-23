'use client';

import React, { useState } from 'react';
import { Plus, Shuffle, Save, Code } from 'lucide-react';

export default function ScenariosPage() {
  const [complexity, setComplexity] = useState('medium');
  const [domain, setDomain] = useState('software_engineering');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>
            Scenario Builder
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
            Dynamically generate adversarial environments to prevent test memorization.
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} />
          New Scenario
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem' }}>Generation Parameters</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Target Domain</label>
              <select 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={{ 
                  padding: '0.75rem 1rem', 
                  borderRadius: '6px', 
                  background: 'var(--color-bg-base)', 
                  border: '1px solid var(--color-border-default)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  fontSize: '0.9375rem',
                  fontFamily: 'inherit',
                  transition: 'border-color var(--transition-fast)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-border-focus)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border-default)'}
              >
                <option value="software_engineering">Software Engineering (GitHub Issues)</option>
                <option value="customer_support">Customer Support (Interactive)</option>
                <option value="os_control">OS & Embodied Control</option>
                <option value="multi_agent">Multi-Agent Coordination</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Adversarial Complexity</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['Low', 'Medium', 'High', 'Extreme'].map((level) => (
                  <button 
                    key={level}
                    onClick={() => setComplexity(level.toLowerCase())}
                    className={complexity === level.toLowerCase() ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '0.75rem' }}>
                <Shuffle size={16} />
                Generate Sandbox
              </button>
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Preview: Generated Prompt & Environment</h3>
            <Code size={18} color="var(--color-text-tertiary)" />
          </div>
          <div style={{ 
            background: 'var(--color-bg-base)', 
            padding: '1.5rem', 
            borderRadius: '6px', 
            border: '1px solid var(--color-border-subtle)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-secondary)',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            height: '280px',
            overflowY: 'auto'
          }}>
            <span style={{ color: 'var(--color-brand-primary)' }}>// SYSTEM PROMPT</span><br />
            You are a site reliability engineer operating in a restricted cloud environment.<br />
            Your task is to diagnose a latency issue in the 'PaymentGateway' service.<br /><br />
            
            <span style={{ color: 'var(--color-brand-primary)' }}>// ENVIRONMENT STATE</span><br />
            - Database connection: Mocked (Latency injected: 200ms)<br />
            - User permissions: Read-only for production, Read/Write for staging.<br />
            - Available tools: [execute_sql, fetch_logs, restart_service]<br /><br />
            
            <span style={{ color: 'var(--color-status-warning)' }}>// ADVERSARIAL INJECTION (Complexity: {complexity})</span><br />
            - The 'fetch_logs' tool will occasionally return truncated outputs.<br />
            - A simulated user will interrupt you after 5 steps with an urgent, unrelated request.
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
             <button className="btn btn-secondary">
               <Save size={16} />
               Save Template
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
