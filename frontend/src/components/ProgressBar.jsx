export default function ProgressBar({ value, max = 100, label, showValue = true }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  let color = 'bg-glow';
  let textColor = 'text-glow';
  if (pct >= 80) {
    color = 'bg-danger';
    textColor = 'text-danger';
  } else if (pct >= 60) {
    color = 'bg-warn';
    textColor = 'text-warn';
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        {label && <span className="label-text">{label}</span>}
        {showValue && (
          <span className={`text-xs font-mono font-medium ${textColor}`}>
            {pct.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="progress-bar">
        <div
          className={`progress-fill ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
