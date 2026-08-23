'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Shuffle, Save, Code, Loader2 } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

interface Scenario {
  id: string;
  name: string;
  detail: string;
  action: string;
  tool: string;
  category: string;
  destructive: boolean;
}

export default function ScenariosPage() {
  const [complexity, setComplexity] = useState('medium');
  const [domain, setDomain] = useState('software_engineering');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [generating, setGenerating] = useState(false);
  const [previewText, setPreviewText] = useState('');
  const [loadingScenarios, setLoadingScenarios] = useState(true);

  // Fetch existing scenarios from backend
  useEffect(() => {
    fetch(`${API_BASE}/api/scenarios`)
      .then(res => res.json())
      .then(data => {
        setScenarios(data.scenarios || []);
        setLoadingScenarios(false);
      })
      .catch(() => setLoadingScenarios(false));
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/api/scenarios/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_name: 'Aegis Demo Agent',
          system_prompt: `You are an agent operating in ${domain.replace('_', ' ')} domain. Complexity: ${complexity}.`,
          task_domain: domain.replace('_', ' '),
          tools: ['service.lookup(resource)', 'api.execute(action)'],
          count: 6,
        }),
      });
      const data = await res.json();
      setPreviewText(JSON.stringify(data.scenarios, null, 2));
      // Refresh scenario list
      const scenariosRes = await fetch(`${API_BASE}/api/scenarios`);
      const scenariosData = await scenariosRes.json();
      setScenarios(scenariosData.scenarios || []);
    } catch (e) {
      setPreviewText('Error generating scenarios. Is the backend running on port 8000?');
    } finally {
      setGenerating(false);
    }
  };

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
        <span className="badge info">{scenarios.length} scenarios loaded</span>
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
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '0.75rem' }} onClick={handleGenerate} disabled={generating}>
                {generating ? <Loader2 size={16} className="animate-pulse" /> : <Shuffle size={16} />}
                {generating ? 'Generating...' : 'Generate Attack Pack'}
              </button>
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.125rem' }}>API Response Preview</h3>
            <Code size={18} color="var(--color-text-tertiary)" />
          </div>
          <div style={{ 
            background: 'var(--color-bg-base)', 
            padding: '1.5rem', 
            borderRadius: '6px', 
            border: '1px solid var(--color-border-subtle)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-secondary)',
            fontSize: '0.8125rem',
            lineHeight: 1.6,
            height: '280px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {previewText || (
              <span style={{ color: 'var(--color-text-tertiary)' }}>
                {'// Click "Generate Attack Pack" to create adversarial scenarios.\n// The API response will appear here.\n\n// Available API endpoints:\n//   POST /api/scenarios/generate\n//   POST /api/evaluations\n//   GET  /api/evaluations/{run_id}\n//   GET  /api/evaluations/{run_id}/events (SSE stream)'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Existing Scenarios Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Loaded Scenarios</h3>
        {loadingScenarios ? (
          <div className="skeleton" style={{ height: '200px', width: '100%' }}></div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>
                <th style={{ padding: '0.75rem' }}>Scenario ID</th>
                <th style={{ padding: '0.75rem' }}>Name</th>
                <th style={{ padding: '0.75rem' }}>Category</th>
                <th style={{ padding: '0.75rem' }}>Destructive</th>
                <th style={{ padding: '0.75rem' }}>Tool</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.slice(0, 10).map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border-subtle)', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                  <td style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-brand-primary)' }}>{s.id}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: '0.75rem' }}>{s.category}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`badge ${s.destructive ? 'danger' : 'success'}`}>{s.destructive ? 'Yes' : 'No'}</span>
                  </td>
                  <td style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>{s.tool}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
