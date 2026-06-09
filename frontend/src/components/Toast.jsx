import { useEffect, useState } from 'react';

export function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      border: 'border-glow/30',
      bg: 'bg-glow/10',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#00ff9d" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      text: 'text-glow',
    },
    error: {
      border: 'border-danger/30',
      bg: 'bg-danger/10',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
        </svg>
      ),
      text: 'text-danger',
    },
  };

  const c = config[type];

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border ${c.border} ${c.bg}
        shadow-card backdrop-blur-sm transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      {c.icon}
      <p className={`text-sm font-medium ${c.text}`}>{message}</p>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        className="ml-2 text-muted hover:text-bright transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
}
