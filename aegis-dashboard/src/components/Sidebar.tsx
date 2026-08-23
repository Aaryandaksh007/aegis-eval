'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Beaker, ShieldAlert, Activity, Settings, GitBranch } from 'lucide-react';
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

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <ShieldAlert size={28} className="logo-icon" />
          <h1 className="logo-text heading-gradient">Aegis</h1>
        </div>
        <p className="sidebar-subtitle">Agent Evaluation Engine</p>
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
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>Engine Online</span>
        </div>
      </div>
    </aside>
  );
}
