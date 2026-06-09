export default function StatCard({ title, value, unit, icon, color = 'accent', trend }) {
  const colorMap = {
    accent: 'text-accent bg-accent/10 border-accent/20',
    glow: 'text-glow bg-glow/10 border-glow/20',
    warn: 'text-warn bg-warn/10 border-warn/20',
    danger: 'text-danger bg-danger/10 border-danger/20',
  };

  return (
    <div className="stat-card animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${trend >= 0 ? 'text-glow bg-glow/10' : 'text-danger bg-danger/10'}`}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="label-text mb-1">{title}</p>
      <div className="flex items-end gap-1">
        <span className="text-bright text-2xl font-bold font-mono tracking-tight">{value}</span>
        {unit && <span className="text-muted text-sm mb-0.5">{unit}</span>}
      </div>
    </div>
  );
}
