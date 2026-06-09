import { useEffect, useState, useCallback } from 'react';
import { machineService } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import Spinner from '../components/Spinner';

function MachineCard({ machine }) {
  const cpuPct = machine.cpuUsage;
  const ramPct = machine.ramUsage;

  const getHealthStatus = () => {
    if (cpuPct >= 80 || ramPct >= 80) return { label: 'Critical', color: 'text-danger', dot: 'bg-danger' };
    if (cpuPct >= 60 || ramPct >= 60) return { label: 'Moderate', color: 'text-warn', dot: 'bg-warn' };
    return { label: 'Healthy', color: 'text-glow', dot: 'bg-glow' };
  };

  const status = getHealthStatus();

  return (
    <div className="machine-card">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.8" className="w-5 h-5">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M6 9h4M6 12h2M14 9h4M14 12h2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-bright font-semibold font-mono text-sm">{machine.machineName}</p>
            <p className="text-muted text-xs">{machine._id?.slice(-8) || 'node-id'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status.dot} animate-pulse-slow`} />
          <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-4">
        <ProgressBar value={cpuPct} label="CPU Usage" />
        <ProgressBar value={ramPct} label="RAM Usage" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5 text-muted">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" strokeLinecap="round" />
          </svg>
          <span className="text-xs">Uptime: <span className="text-text font-mono">{machine.uptime}</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="online-dot" />
          <span className="text-glow text-xs">Online</span>
        </div>
      </div>
    </div>
  );
}

export default function Machines() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchMachines = useCallback(async () => {
    try {
      const data = await machineService.getAll();
      setMachines(data);
      setLastRefresh(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMachines();
    const interval = setInterval(fetchMachines, 5000);
    return () => clearInterval(interval);
  }, [fetchMachines]);

  if (loading) return <Spinner text="Scanning nodes..." />;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Connected Machines</h2>
          <p className="text-muted text-sm mt-0.5">{machines.length} node{machines.length !== 1 ? 's' : ''} in cluster · auto-refresh 5s</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted font-mono">
          <div className="online-dot" />
          {lastRefresh && `Updated ${lastRefresh.toLocaleTimeString()}`}
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 flex items-center gap-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" strokeLinecap="round" />
          </svg>
          <p className="text-danger text-sm">{error}</p>
        </div>
      )}

      {machines.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#4a6080" strokeWidth="1.5" className="w-8 h-8">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M9 12h6M12 9v6" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-muted font-medium">No machines connected</p>
          <p className="text-muted/60 text-sm text-center max-w-xs">
            Start the agent on your machines to see them appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {machines.map((machine) => (
            <MachineCard key={machine._id} machine={machine} />
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-5 pt-2">
        <p className="label-text">Health indicators:</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-glow" />
          <span className="text-xs text-muted">Healthy (0–59%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-warn" />
          <span className="text-xs text-muted">Moderate (60–79%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-danger" />
          <span className="text-xs text-muted">Critical (80%+)</span>
        </div>
      </div>
    </div>
  );
}
