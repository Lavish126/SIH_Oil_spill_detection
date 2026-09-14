// ConfidenceMeter — circular + bar visualization
export default function ConfidenceMeter({ value, size = 'lg', showLabel = true }) {
  const radius = size === 'lg' ? 52 : 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const cx = size === 'lg' ? 64 : 48;

  const color = value >= 85 ? '#22d3ee' : value >= 70 ? '#f97316' : '#ef4444';
  const label = value >= 85 ? 'High Confidence' : value >= 70 ? 'Medium Confidence' : 'Low Confidence';

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2">
        <svg width="48" height="48" className="-rotate-90">
          <circle cx="24" cy="24" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <circle
            cx="24" cy="24" r={radius} fill="none"
            stroke={color} strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div>
          <div className="text-lg font-bold text-white font-mono">{value}%</div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={cx * 2} height={cx * 2} className="-rotate-90">
          <circle
            cx={cx} cy={cx} r={radius}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"
          />
          <circle
            cx={cx} cy={cx} r={radius}
            fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.5s ease-in-out', filter: `drop-shadow(0 0 8px ${color}60)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center rotate-90" style={{ transform: 'none', top: 0 }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white font-mono">{value}%</span>
            <span className="text-xs text-gray-400">Confidence</span>
          </div>
        </div>
      </div>
      {showLabel && (
        <div className="mt-3 text-center">
          <span
            className="text-sm font-semibold px-3 py-1 rounded-full"
            style={{ color, backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
          >
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
