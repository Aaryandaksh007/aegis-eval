'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Beaker, ShieldAlert, Activity, Settings, GitBranch, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/scenarios', label: 'Scenario Builder', icon: Beaker },
  { href: '/execution', label: 'Execution Traces', icon: GitBranch },
  { href: '/safety', label: 'Guardrails & Safety', icon: ShieldAlert },
  { href: '/reliability', label: 'Reliability Scorecard', icon: Activity },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <ShieldAlert size={collapsed ? 24 : 28} className="logo-icon" />
          {!collapsed && <h1 className="logo-text text-gradient">Aegis</h1>}
        </div>
        {!collapsed && <p className="sidebar-subtitle">Agent Evaluation Engine</p>}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span>Engine Online</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="collapse-btn"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
