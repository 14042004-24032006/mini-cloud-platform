import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  {
    path: '/',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    path: '/machines',
    label: 'Machines',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M6 9h4M6 12h2M14 9h4M14 12h2" strokeLinecap="round" />
        <circle cx="12" cy="18.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    path: '/deploy',
    label: 'Deploy',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    path: '/allocations',
    label: 'Allocations',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
        <path d="M8 6h13M8 12h13M8 18h13" strokeLinecap="round" />
        <circle cx="3" cy="6" r="1.5" />
        <circle cx="3" cy="12" r="1.5" />
        <circle cx="3" cy="18" r="1.5" />
      </svg>
    ),
  },
];

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitle = NAV_ITEMS.find((n) => n.path === location.pathname)?.label || 'Dashboard';

  return (
    <div className="flex h-screen bg-void overflow-hidden grid-bg">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-60 bg-panel border-r border-border
          flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                fill="rgba(0,212,255,0.15)"
                stroke="#00d4ff"
                strokeWidth="1.5"
              />
              <path d="M8 12h8M12 8v8" stroke="#00d4ff" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-bright text-sm font-semibold leading-tight">MiniCloud</p>
            <p className="text-muted text-xs">Platform v1.0</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="label-text px-4 mb-3">Navigation</p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="online-dot" />
            <span className="text-muted text-xs">All systems operational</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-panel/80 backdrop-blur-sm border-b border-border px-5 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden text-muted hover:text-bright transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
              </svg>
            </button>
            <div>
              <h1 className="text-bright font-semibold text-base">{pageTitle}</h1>
              <p className="text-muted text-xs font-mono">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Cluster indicator */}
            <div className="hidden sm:flex items-center gap-2 bg-glow/5 border border-glow/20 rounded-full px-3 py-1">
              <div className="online-dot" />
              <span className="text-glow text-xs font-medium font-mono">cluster-01</span>
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.8" className="w-4 h-4">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
