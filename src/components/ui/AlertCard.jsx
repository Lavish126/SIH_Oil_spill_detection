// AlertCard component
import { formatRelativeTime, getAlertStyle } from '../../utils/correlation';
import { AlertTriangle, AlertOctagon, Info, Ship, Wifi, TrendingUp, CheckCircle, Satellite } from 'lucide-react';

const ICON_MAP = {
  AlertTriangle, AlertOctagon, Info, Ship, WifiOff: Wifi,
  TrendingUp, CheckCircle, Satellite,
};

export default function AlertCard({ alert, compact = false }) {
  const style = getAlertStyle(alert.type);
  const IconComp = ICON_MAP[alert.icon] || AlertTriangle;

  if (compact) {
    return (
      <div className={`flex items-start gap-3 p-3 rounded-xl border ${style.border} ${style.bg} transition-all hover:border-opacity-60`}>
        <div className={`p-1.5 rounded-lg ${style.bg} border ${style.border} shrink-0 mt-0.5`}>
          <IconComp size={14} className={style.color} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold uppercase tracking-wider ${style.color}`}>{alert.type}</span>
            {alert.acknowledged && (
              <span className="text-xs text-gray-600 bg-gray-500/10 px-1.5 py-0.5 rounded">Acknowledged</span>
            )}
          </div>
          <p className="text-sm text-gray-300 font-medium mt-0.5 truncate">{alert.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{alert.location} · {formatRelativeTime(alert.createdAt)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border ${style.border} ${style.bg} transition-all hover:border-opacity-70 animate-fade-in`}>
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-xl border ${style.border} shrink-0`} style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <IconComp size={18} className={style.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${style.color} ${style.bg} ${style.border}`}>
                  {alert.type}
                </span>
                {alert.acknowledged && (
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full border border-gray-700">
                    Acknowledged
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-gray-100">{alert.title}</h3>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">{formatRelativeTime(alert.createdAt)}</span>
          </div>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed">{alert.message}</p>
          {alert.location && (
            <div className="mt-2 text-xs text-gray-600">
              📍 {alert.location}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
