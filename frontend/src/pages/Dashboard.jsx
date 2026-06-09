import { useEffect, useState, useCallback } from 'react';
import { dashboardService } from '../services/api';
import StatCard from '../components/StatCard';
import Spinner from '../components/Spinner';

const ICONS = {
  machines: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M6 9h4M6 12h2M14 9h4M14 12h2" strokeLinecap="round" />
    </svg>
  ),
  workloads: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  allocated: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  pending: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" strokeLinecap="round" />
    </svg>
  ),
  cpu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" strokeLinecap="round" />
    </svg>
  ),
  ram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <rect x="2" y="8" width="20" height="8" rx="2" />
      <path d="M6 8V6M10 8V6M14 8V6M18 8V6M6 16v2M10 16v2M14 16v2M18 16v2" strokeLinecap="round" />
    </svg>
  ),
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
      setLastRefresh(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  if (loading) return <Spinner text="Fetching cluster stats..." />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" className="w-6 h-6">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-danger font-medium">Failed to connect to backend</p>
        <p className="text-muted text-sm font-mono">{error}</p>
        <button onClick={fetchStats} className="btn-primary mt-2">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Cluster Overview</h2>
          <p className="text-muted text-sm mt-0.5">Real-time resource monitoring · auto-refresh 5s</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted font-mono">
          <div className="online-dot" />
          {lastRefresh && `Updated ${lastRefresh.toLocaleTimeString()}`}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Machines"
          value={stats.totalMachines}
          color="accent"
          icon={ICONS.machines}
        />
        <StatCard
          title="Total Workloads"
          value={stats.totalWorkloads}
          color="accent"
          icon={ICONS.workloads}
        />
        <StatCard
          title="Allocated"
          value={stats.allocatedWorkloads}
          color="glow"
          icon={ICONS.allocated}
        />
        <StatCard
          title="Pending"
          value={stats.pendingWorkloads}
          color={stats.pendingWorkloads > 0 ? 'warn' : 'glow'}
          icon={ICONS.pending}
        />
        <StatCard
          title="Available CPU"
          value={stats.availableCpu?.toFixed(2)}
          unit="cores"
          color="accent"
          icon={ICONS.cpu}
        />
        <StatCard
          title="Available RAM"
          value={stats.availableRam?.toFixed(2)}
          unit="GB"
          color="accent"
          icon={ICONS.ram}
        />
      </div>

      {/* Allocation ratio */}
      {stats.totalWorkloads > 0 && (
        <div className="stat-card">
          <p className="section-title mb-4">Workload Allocation Ratio</p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="label-text">Allocated</span>
                <span className="text-glow text-xs font-mono font-medium">
                  {stats.allocatedWorkloads}/{stats.totalWorkloads}
                </span>
              </div>
              <div className="progress-bar h-2">
                <div
                  className="progress-fill bg-glow"
                  style={{ width: `${(stats.allocatedWorkloads / stats.totalWorkloads) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <span className="text-bright text-xl font-bold font-mono">
                {((stats.allocatedWorkloads / stats.totalWorkloads) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick info strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.8" className="w-5 h-5">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="label-text mb-0.5">Heartbeat Interval</p>
            <p className="text-bright font-semibold text-sm">Every 10 seconds</p>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-glow/10 border border-glow/20 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="#00ff9d" strokeWidth="1.8" className="w-5 h-5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="label-text mb-0.5">Platform Status</p>
            <p className="text-glow font-semibold text-sm">All systems operational</p>
          </div>
        </div>
      </div>
    </div>
  );
}
