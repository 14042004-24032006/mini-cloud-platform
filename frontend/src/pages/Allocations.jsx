import { useEffect, useState, useCallback } from 'react';
import { workloadService } from '../services/api';
import Spinner from '../components/Spinner';
import { ToastContainer } from '../components/Toast';

function WorkloadCard({ workload, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const isAllocated = workload.status === 'Allocated';

  const handleDeleteClick = () => setConfirming(true);
  const handleCancel = () => setConfirming(false);

  const handleConfirmDelete = async () => {
    setDeleting(true);
    await onDelete(workload._id);
    setDeleting(false);
    setConfirming(false);
  };

  return (
    <div className="workload-card relative">
      {/* Confirm overlay */}
      {confirming && (
        <div className="absolute inset-0 bg-void/90 backdrop-blur-sm rounded-xl z-10 flex flex-col items-center justify-center gap-4 p-5 animate-fade-in">
          <div className="w-10 h-10 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" className="w-5 h-5">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-bright font-semibold text-sm mb-1">Delete workload?</p>
            <p className="text-muted text-xs">
              <span className="text-accent font-mono">{workload.containerName}</span> will be removed
              {isAllocated && ' and resources freed'}
            </p>
          </div>
          <div className="flex gap-2 w-full">
            <button
              onClick={handleCancel}
              className="flex-1 py-2 rounded-lg border border-border text-muted text-xs font-medium hover:text-bright hover:border-text/20 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="flex-1 py-2 rounded-lg bg-danger/10 border border-danger/30 text-danger text-xs font-medium hover:bg-danger/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {deleting ? (
                <div className="w-3 h-3 rounded-full border-2 border-danger/30 border-t-danger animate-spin" />
              ) : null}
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.8" className="w-4 h-4">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <div>
            <p className="text-bright font-semibold font-mono text-sm">{workload.containerName}</p>
            <p className="text-muted text-xs">{workload._id?.slice(-10) || 'workload-id'}</p>
          </div>
        </div>
        <span className={isAllocated ? 'badge-allocated' : 'badge-pending'}>
          <span className={`w-1.5 h-1.5 rounded-full ${isAllocated ? 'bg-glow' : 'bg-warn'}`} />
          {workload.status}
        </span>
      </div>

      {/* Resource grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-void rounded-lg p-3 border border-border">
          <p className="label-text mb-1">CPU Needed</p>
          <p className="text-bright font-mono font-semibold text-sm">
            {workload.cpuNeeded}
            <span className="text-muted font-normal text-xs ml-1">cores</span>
          </p>
        </div>
        <div className="bg-void rounded-lg p-3 border border-border">
          <p className="label-text mb-1">RAM Needed</p>
          <p className="text-bright font-mono font-semibold text-sm">
            {workload.ramNeeded}
            <span className="text-muted font-normal text-xs ml-1">GB</span>
          </p>
        </div>
      </div>

      {/* Assigned machine */}
      <div className="flex items-center justify-between pt-3 border-t border-border mb-4">
        <span className="label-text">Assigned Machine</span>
        {workload.assignedMachine ? (
          <div className="flex items-center gap-1.5">
            <div className="online-dot" />
            <span className="text-accent text-xs font-mono font-medium">{workload.assignedMachine}</span>
          </div>
        ) : (
          <span className="text-warn text-xs font-mono">Unassigned</span>
        )}
      </div>

      {/* Delete button */}
      <button
        onClick={handleDeleteClick}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-danger/20 text-danger text-xs font-medium hover:bg-danger/10 transition-all duration-200"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Delete Workload
      </button>
    </div>
  );
}

export default function Allocations() {
  const [workloads, setWorkloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [filter, setFilter] = useState('All');
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const fetchWorkloads = useCallback(async () => {
    try {
      const data = await workloadService.getAll();
      setWorkloads(Array.isArray(data) ? data : []);
      setLastRefresh(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkloads();
    const interval = setInterval(fetchWorkloads, 5000);
    return () => clearInterval(interval);
  }, [fetchWorkloads]);

  const handleDelete = async (id) => {
    try {
      await workloadService.delete(id);
      setWorkloads((prev) => prev.filter((w) => w._id !== id));
      addToast('Workload deleted successfully', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to delete workload', 'error');
    }
  };

  const filtered = filter === 'All' ? workloads : workloads.filter((w) => w.status === filter);
  const allocated = workloads.filter((w) => w.status === 'Allocated').length;
  const pending = workloads.filter((w) => w.status === 'Pending').length;

  if (loading) return <Spinner text="Loading allocations..." />;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Workload Allocations</h2>
          <p className="text-muted text-sm mt-0.5">
            {workloads.length} total · {allocated} allocated · {pending} pending
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted font-mono">
          <div className="online-dot" />
          {lastRefresh && `Updated ${lastRefresh.toLocaleTimeString()}`}
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-glow/5 border border-glow/20 rounded-full px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-glow" />
          <span className="text-glow text-xs font-medium">{allocated} Allocated</span>
        </div>
        <div className="flex items-center gap-2 bg-warn/5 border border-warn/20 rounded-full px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-warn" />
          <span className="text-warn text-xs font-medium">{pending} Pending</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1 w-fit">
        {['All', 'Allocated', 'Pending'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              filter === tab
                ? 'bg-accent/10 text-accent border border-accent/20'
                : 'text-muted hover:text-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 flex items-center gap-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
          </svg>
          <p className="text-danger text-sm">{error}</p>
          <button onClick={fetchWorkloads} className="ml-auto text-xs text-danger underline">Retry</button>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#4a6080" strokeWidth="1.5" className="w-8 h-8">
              <path d="M8 6h13M8 12h13M8 18h13" strokeLinecap="round" />
              <circle cx="3" cy="6" r="1.5" />
              <circle cx="3" cy="12" r="1.5" />
              <circle cx="3" cy="18" r="1.5" />
            </svg>
          </div>
          <p className="text-muted font-medium">No workloads found</p>
          <p className="text-muted/60 text-sm">Deploy a workload from the Deploy page to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((w) => (
            <WorkloadCard key={w._id} workload={w} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
