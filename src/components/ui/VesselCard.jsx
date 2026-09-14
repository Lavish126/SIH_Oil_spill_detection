// VesselCard component
import { useNavigate } from 'react-router-dom';
import { Anchor, Navigation, Gauge, ChevronRight } from 'lucide-react';
import { getRiskLevel } from '../../utils/correlation';

export default function VesselCard({ vessel, rank, onClick, showRank = true }) {
  const navigate = useNavigate();
  const risk = getRiskLevel(vessel.correlationScore);

  const statusDot = vessel.status === 'Suspicious'
    ? 'bg-red-500 animate-pulse'
    : vessel.status === 'Moderate'
    ? 'bg-orange-500'
    : 'bg-green-500';

  return (
    <div
      onClick={() => onClick ? onClick(vessel) : navigate(`/vessels/${vessel.id}`)}
      className="panel p-4 cursor-pointer hover:border-cyan-500/25 transition-all group"
    >
      <div className="flex items-start gap-3">
        {showRank && rank && (
          <div className="w-7 h-7 rounded-full bg-navy-700 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-cyan-400">#{rank}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className={`w-2 h-2 rounded-full shrink-0 ${statusDot}`} />
                <h3 className="text-sm font-semibold text-gray-100 truncate">{vessel.name}</h3>
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-xs text-gray-500 font-mono">MMSI: {vessel.mmsi}</span>
                <span className="text-xs text-gray-600">·</span>
                <span className="text-xs text-gray-500">{vessel.type}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className={`text-lg font-bold font-mono ${risk.color}`}>{vessel.correlationScore}%</div>
              <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${risk.color} ${risk.bg}`}>
                {risk.label}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-navy-700/40 rounded-lg p-2 text-center">
              <div className="text-xs text-gray-500">Distance</div>
              <div className="text-sm font-bold text-white font-mono">{vessel.distanceFromSpill} <span className="text-xs font-normal">km</span></div>
            </div>
            <div className="bg-navy-700/40 rounded-lg p-2 text-center">
              <div className="text-xs text-gray-500">Speed</div>
              <div className="text-sm font-bold text-white font-mono">{vessel.speed} <span className="text-xs font-normal">kts</span></div>
            </div>
            <div className="bg-navy-700/40 rounded-lg p-2 text-center">
              <div className="text-xs text-gray-500">Flag</div>
              <div className="text-sm font-bold text-white">{vessel.flagCode}</div>
            </div>
          </div>

          {/* Correlation bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Correlation Score</span>
              <span className={risk.color}>{vessel.correlationScore}%</span>
            </div>
            <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  vessel.correlationScore >= 80 ? 'bg-red-500' :
                  vessel.correlationScore >= 60 ? 'bg-orange-500' :
                  vessel.correlationScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${vessel.correlationScore}%`, transition: 'width 1s ease-out' }}
              />
            </div>
          </div>
        </div>
        <ChevronRight size={14} className="text-gray-600 group-hover:text-cyan-400 transition-colors shrink-0 mt-1" />
      </div>
    </div>
  );
}
