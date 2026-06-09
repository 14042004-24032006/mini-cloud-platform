import { useState } from 'react';
import { workloadService } from '../services/api';
import { ToastContainer } from '../components/Toast';

export default function Deploy() {
  const [form, setForm] = useState({ containerName: '', cpuNeeded: '', ramNeeded: '' });
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [result, setResult] = useState(null);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.containerName.trim()) {
      addToast('Container name is required', 'error');
      return;
    }
    if (!form.cpuNeeded || isNaN(form.cpuNeeded) || Number(form.cpuNeeded) <= 0) {
      addToast('Enter a valid CPU value', 'error');
      return;
    }
    if (!form.ramNeeded || isNaN(form.ramNeeded) || Number(form.ramNeeded) <= 0) {
      addToast('Enter a valid RAM value', 'error');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const data = await workloadService.create({
        containerName: form.containerName.trim(),
        cpuNeeded: Number(form.cpuNeeded),
        ramNeeded: Number(form.ramNeeded),
      });
      setResult(data);
      addToast(`Workload "${form.containerName}" deployed successfully!`, 'success');
      setForm({ containerName: '', cpuNeeded: '', ramNeeded: '' });
    } catch (err) {
      addToast(err.message || 'Deployment failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="section-title">Deploy Workload</h2>
        <p className="text-muted text-sm mt-0.5">Submit a new container workload to the cluster</p>
      </div>

      {/* Form card */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-card">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.8" className="w-4.5 h-4.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <p className="text-bright font-semibold text-sm">New Deployment</p>
            <p className="text-muted text-xs">Container resource allocation</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Container name */}
          <div>
            <label className="label-text block mb-2">Container Name</label>
            <input
              type="text"
              name="containerName"
              value={form.containerName}
              onChange={handleChange}
              placeholder="e.g. nginx, redis, my-app"
              className="input-field"
            />
          </div>

          {/* CPU and RAM row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text block mb-2">CPU Needed</label>
              <div className="relative">
                <input
                  type="number"
                  name="cpuNeeded"
                  value={form.cpuNeeded}
                  onChange={handleChange}
                  placeholder="2"
                  min="0.1"
                  step="0.1"
                  className="input-field pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs font-mono">cores</span>
              </div>
            </div>
            <div>
              <label className="label-text block mb-2">RAM Needed</label>
              <div className="relative">
                <input
                  type="number"
                  name="ramNeeded"
                  value={form.ramNeeded}
                  onChange={handleChange}
                  placeholder="4"
                  min="0.1"
                  step="0.1"
                  className="input-field pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs font-mono">GB</span>
              </div>
            </div>
          </div>

          {/* Preview */}
          {(form.containerName || form.cpuNeeded || form.ramNeeded) && (
            <div className="bg-void rounded-lg border border-border p-3 animate-fade-in">
              <p className="label-text mb-2">Request Preview</p>
              <pre className="text-accent text-xs font-mono leading-relaxed">
{JSON.stringify({
  containerName: form.containerName || '...',
  cpuNeeded: form.cpuNeeded ? Number(form.cpuNeeded) : '...',
  ramNeeded: form.ramNeeded ? Number(form.ramNeeded) : '...',
}, null, 2)}
              </pre>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-void/30 border-t-void animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Deploy Workload
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result card */}
      {result && (
        <div className="bg-glow/5 border border-glow/20 rounded-xl p-5 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-glow/10 border border-glow/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#00ff9d" strokeWidth="2" className="w-4 h-4">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-glow font-semibold text-sm">Deployment Successful</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="label-text mb-1">Assigned Machine</p>
              <p className="text-bright font-mono font-semibold text-sm">{result.assignedMachine || 'N/A'}</p>
            </div>
            <div>
              <p className="label-text mb-1">Status</p>
              <span className="badge-allocated">{result.status || 'Allocated'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <p className="label-text mb-3">Deployment Notes</p>
        <ul className="space-y-2">
          {[
            'The scheduler allocates workloads based on available CPU and RAM.',
            'If no machine has sufficient resources, the workload will remain Pending.',
            'Machines send heartbeat data every 10 seconds to update their resource stats.',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted">
              <span className="text-accent mt-0.5 flex-shrink-0">›</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
