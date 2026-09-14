// StatCard UI component
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ title, value, unit = '', icon: Icon, trend, trendValue, color = 'cyan', description }) {
  const colorMap = {
    cyan: { icon: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', value: 'text-cyan-300' },
    red: { icon: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', value: 'text-red-300' },
    orange: { icon: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', value: 'text-orange-300' },
    green: { icon: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', value: 'text-green-300' },
    yellow: { icon: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', value: 'text-yellow-300' },
  };
  const c = colorMap[color] || colorMap.cyan;

  return (
    <div className={`panel p-4 hover:border-cyan-500/25 transition-all duration-300 cursor-default group`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${c.bg} border ${c.border}`}>
          {Icon && <Icon size={18} className={c.icon} />}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
            trend === 'up' ? 'text-green-400 bg-green-500/10' :
            trend === 'down' ? 'text-red-400 bg-red-500/10' :
            'text-gray-400 bg-gray-500/10'
          }`}>
            {trend === 'up' ? <TrendingUp size={11} /> : trend === 'down' ? <TrendingDown size={11} /> : <Minus size={11} />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="space-y-0.5">
        <div className="text-2xl font-bold text-white font-mono tracking-tight">
          {value}<span className="text-sm font-medium text-gray-400 ml-1">{unit}</span>
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-wider">{title}</div>
        {description && <div className="text-xs text-gray-600 mt-1">{description}</div>}
      </div>
    </div>
  );
}
