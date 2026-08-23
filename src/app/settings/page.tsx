'use client';

import React from 'react';
import { Settings, Save, Server, Key, Database, KeyRound } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>
            System Settings
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
            Configure database connections, LLM providers, and evaluation engine parameters.
          </p>
        </div>
        <button className="btn btn-primary">
          <Save size={16} />
          Save Changes
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '1rem' }}>
            <KeyRound size={20} color="var(--color-brand-primary)" />
            <h3 style={{ fontSize: '1.125rem', margin: 0 }}>API Keys & Providers</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>OpenAI API Key</label>
              <input type="password" value="sk-proj-***********************************" readOnly style={{ 
                padding: '0.75rem 1rem', borderRadius: '6px', background: 'var(--color-bg-base)', border: '1px solid var(--color-border-default)', color: 'var(--color-text-primary)', outline: 'none', fontFamily: 'var(--font-mono)' 
              }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Anthropic API Key</label>
              <input type="password" value="sk-ant-api03-******************************" readOnly style={{ 
                padding: '0.75rem 1rem', borderRadius: '6px', background: 'var(--color-bg-base)', border: '1px solid var(--color-border-default)', color: 'var(--color-text-primary)', outline: 'none', fontFamily: 'var(--font-mono)' 
              }} />
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '1rem' }}>
            <Server size={20} color="var(--color-brand-primary)" />
            <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Evaluation Engine</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Max Concurrency</label>
              <select defaultValue="20 (Default)" style={{ 
                padding: '0.75rem 1rem', borderRadius: '6px', background: 'var(--color-bg-base)', border: '1px solid var(--color-border-default)', color: 'var(--color-text-primary)', outline: 'none' 
              }}>
                <option>10</option>
                <option>20 (Default)</option>
                <option>50</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Process Reward Model (PRM)</label>
              <select defaultValue="aegis-prm-v2 (Local)" style={{ 
                padding: '0.75rem 1rem', borderRadius: '6px', background: 'var(--color-bg-base)', border: '1px solid var(--color-border-default)', color: 'var(--color-text-primary)', outline: 'none' 
              }}>
                <option>aegis-prm-v2 (Local)</option>
                <option>gpt-4o (Cloud Proxy)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
