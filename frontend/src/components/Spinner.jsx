export default function Spinner({ size = 'md', text = 'Loading...' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizes[size]} relative`}>
        <div className={`${sizes[size]} rounded-full border-2 border-border`} />
        <div
          className={`${sizes[size]} rounded-full border-2 border-transparent border-t-accent absolute inset-0 animate-spin`}
        />
      </div>
      {text && <p className="text-muted text-sm">{text}</p>}
    </div>
  );
}
