// SpillCard component
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Satellite, ChevronRight } from 'lucide-react';
import { getSeverityStyle, formatRelativeTime } from '../../utils/correlation';
import ConfidenceMeter from './ConfidenceMeter';

export default function SpillCard({ spill, onClick, compact = false }) {
  const navigate = useNavigate();
  const style = getSeverityStyle(spill.severity);

  if (compact) {
    return (
      <div
        onClick={() => onClick?.(spill)}
        className="flex items-center gap-3 p-3 panel hover:border-cyan-500/25 cursor-pointer transition-all group"
      >
        <div className={`w-2 h-8 rounded-full shrink-0 ${
          spill.severity === 'CRITICAL' ? 'bg-red-500' :
          spill.severity === 'HIGH' ? 'bg-orange-500' :
          spill.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
        }`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400">{spill.id}</span>
            <span className={`text-xs font-semibold ${style.color}`}>{spill.severity}</span>
          </div>
          <div className="text-sm text-gray-200 font-medium truncate">{spill.location}</div>
          <div className="text-xs text-gray-500">{spill.area} km² · {spill.confidence}% confidence</div>
        </div>
        <ChevronRight size={14} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick?.(spill)}
      className={`panel p-4 cursor-pointer hover:border-cyan-500/25 transition-all group border-l-2 ${
        spill.severity === 'CRITICAL' ? 'border-l-red-500' :
        spill.severity === 'HIGH' ? 'border-l-orange-500' :
        spill.severity === 'MEDIUM' ? 'border-l-yellow-500' : 'border-l-green-500'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-gray-500">{spill.id}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.color} ${style.bg} border ${style.border}`}>
              {spill.severity}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              spill.status === 'Open' ? 'text-red-400 bg-red-500/10 border border-red-500/20' :
              spill.status === 'Investigating' ? 'text-orange-400 bg-orange-500/10 border border-orange-500/20' :
              'text-gray-400 bg-gray-500/10 border border-gray-500/20'
            }`}>{spill.status}</span>
          </div>
          <h3 className="text-base font-semibold text-gray-100 mt-1">{spill.location}</h3>
        </div>
        <ConfidenceMeter value={spill.confidence} size="sm" showLabel={false} />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-navy-700/50 rounded-lg p-2">
          <div className="text-xs text-gray-500">Estimated Area</div>
          <div className="text-sm font-bold text-white font-mono">{spill.area} km²</div>
        </div>
        <div className="bg-navy-700/50 rounded-lg p-2">
          <div className="text-xs text-gray-500">Satellite</div>
          <div className="text-sm font-bold text-white">{spill.satellite}</div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <MapPin size={11} />
          <span>{spill.lat.toFixed(4)}°N, {spill.lng.toFixed(4)}°E</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={11} />
          <span>{formatRelativeTime(spill.detectedAt)}</span>
        </div>
      </div>
    </div>
  );
}
