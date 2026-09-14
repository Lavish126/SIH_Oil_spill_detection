// MarineMap page — Full-screen interactive map with filters
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Filter, Layers, X, MapPin, Ship, AlertTriangle,
  ChevronRight, Navigation, Gauge, Satellite
} from 'lucide-react';
import MapView from '../components/map/MapView';
import { useApp } from '../context/AppContext';
import { getSeverityStyle, formatRelativeTime } from '../utils/correlation';
import ConfidenceMeter from '../components/ui/ConfidenceMeter';

const FILTERS = ['ALL', 'OIL SPILLS', 'VESSELS', 'HIGH RISK', 'ALERTS'];

export default function MarineMap() {
  const navigate = useNavigate();
  const { spills, vessels, activeSpill, setActiveSpill, setActiveVessel, addToast } = useApp();
  const [filter, setFilter] = useState('ALL');
  const [selectedSpill, setSelectedSpill] = useState(null);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [dateFilter, setDateFilter] = useState('today');

  const filteredSpills = spills.filter(s => {
    if (filter === 'OIL SPILLS') return true;
    if (filter === 'HIGH RISK') return s.severity === 'HIGH' || s.severity === 'CRITICAL';
    if (filter === 'VESSELS') return false;
    if (filter === 'ALERTS') return s.status === 'Open';
    return true;
  });

  const filteredVessels = vessels.filter(v => {
    if (filter === 'VESSELS') return true;
    if (filter === 'HIGH RISK') return v.correlationScore >= 80;
    if (filter === 'OIL SPILLS') return false;
    return true;
  });

  const handleSpillClick = (spill) => {
    setSelectedSpill(spill);
    setSelectedVessel(null);
    setActiveSpill(spill);
    setShowPanel(true);
  };

  const handleVesselClick = (vessel) => {
    setSelectedVessel(vessel);
    setSelectedSpill(null);
    setShowPanel(true);
  };

  const mapCenter = selectedSpill
    ? [selectedSpill.lat, selectedSpill.lng]
    : selectedVessel
    ? [selectedVessel.lat, selectedVessel.lng]
    : [15, 76];

  const mapZoom = selectedSpill || selectedVessel ? 9 : 5;

  return (
    <div className="relative" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Map */}
      <MapView
        spills={filteredSpills}
        vessels={filteredVessels}
        center={mapCenter}
        zoom={mapZoom}
        height="100%"
        showPolygons
        showTracks
        showDetectionRadius
        onSpillClick={handleSpillClick}
        onVesselClick={handleVesselClick}
      />

      {/* Top Filter Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] flex flex-wrap gap-2 justify-center px-4">
        <div className="flex items-center gap-1 bg-navy-900/95 border border-cyan-500/20 rounded-xl p-1 backdrop-blur-md shadow-panel">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-cyan-500 text-navy-950'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-navy-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-navy-900/95 border border-cyan-500/20 rounded-xl p-1 backdrop-blur-md shadow-panel">
          {['today', '7d', '30d'].map(d => (
            <button key={d} onClick={() => setDateFilter(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${dateFilter === d ? 'bg-navy-600 text-cyan-300' : 'text-gray-500 hover:text-gray-300'}`}>
              {d === 'today' ? 'Today' : d === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-4 z-[400] bg-navy-900/95 border border-cyan-500/15 rounded-xl p-3 backdrop-blur-md shadow-panel">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Legend</div>
        <div className="space-y-1.5">
          {[
            { color: '#ef4444', label: 'Critical Spill' },
            { color: '#f97316', label: 'High Severity Spill' },
            { color: '#eab308', label: 'Medium Severity Spill' },
            { color: '#22c55e', label: 'Low Severity Spill' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}60` }} />
              <span className="text-xs text-gray-400">{item.label}</span>
            </div>
          ))}
          <div className="border-t border-cyan-500/10 pt-1.5 mt-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-red-400 rounded-sm" style={{ background: 'rgba(239,68,68,0.2)' }} />
              <span className="text-xs text-gray-400">Suspicious Vessel</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-3 h-3 border-2 border-cyan-400 rounded-sm" style={{ background: 'rgba(34,211,238,0.2)' }} />
              <span className="text-xs text-gray-400">Normal Vessel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 left-4 z-[400] bg-navy-900/95 border border-cyan-500/15 rounded-xl p-3 backdrop-blur-md shadow-panel hidden md:block">
        <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Active Assets</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-gray-400">{filteredSpills.length} oil spills</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-gray-400">{filteredVessels.length} vessels</span>
          </div>
        </div>
      </div>

      {/* Detail Side Panel */}
      {showPanel && (selectedSpill || selectedVessel) && (
        <div className="absolute top-4 right-4 bottom-4 w-80 z-[400] bg-navy-900/97 border border-cyan-500/20 rounded-2xl backdrop-blur-md shadow-panel overflow-hidden flex flex-col">
          <div className="p-4 border-b border-cyan-500/10 flex items-center justify-between shrink-0">
            <h3 className="text-sm font-semibold text-gray-200">
              {selectedSpill ? 'Spill Details' : 'Vessel Details'}
            </h3>
            <button onClick={() => setShowPanel(false)} className="btn-icon">
              <X size={15} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {selectedSpill && (
              <SpillDetailPanel
                spill={selectedSpill}
                onFindVessels={() => navigate('/ais-correlation')}
              />
            )}
            {selectedVessel && (
              <VesselMiniPanel
                vessel={selectedVessel}
                onViewDetails={() => navigate(`/vessels/${selectedVessel.id}`)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SpillDetailPanel({ spill, onFindVessels }) {
  const style = getSeverityStyle(spill.severity);
  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs text-gray-500 font-mono">{spill.id}</div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.color} ${style.bg} border ${style.border}`}>
            {spill.severity}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            spill.status === 'Open' ? 'text-red-400 bg-red-500/10 border border-red-500/20' :
            spill.status === 'Investigating' ? 'text-orange-400 bg-orange-500/10 border border-orange-500/20' :
            'text-gray-400 bg-gray-500/10 border border-gray-500/20'
          }`}>{spill.status}</span>
        </div>
      </div>

      <div className="flex justify-center">
        <ConfidenceMeter value={spill.confidence} />
      </div>

      <div className="space-y-2">
        {[
          { label: 'Estimated Area', value: `${spill.area} km²` },
          { label: 'Location', value: spill.location },
          { label: 'Latitude', value: `${spill.lat.toFixed(4)}° N` },
          { label: 'Longitude', value: `${spill.lng.toFixed(4)}° E` },
          { label: 'Satellite', value: spill.satellite },
          { label: 'Detected', value: formatRelativeTime(spill.detectedAt) },
        ].map(item => (
          <div key={item.label} className="flex justify-between items-center py-2 border-b border-cyan-500/5">
            <span className="text-xs text-gray-500">{item.label}</span>
            <span className="text-xs font-semibold text-gray-200 font-mono">{item.value}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">{spill.description}</p>

      <button onClick={onFindVessels} className="btn-primary w-full justify-center">
        <Ship size={14} />
        Find Nearby Vessels
      </button>
    </div>
  );
}

function VesselMiniPanel({ vessel, onViewDetails }) {
  const riskColor = vessel.correlationScore >= 80 ? 'text-red-400' :
    vessel.correlationScore >= 60 ? 'text-orange-400' :
    vessel.correlationScore >= 40 ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs text-gray-500 font-mono">MMSI: {vessel.mmsi}</div>
        <div className="text-base font-bold text-white mt-1">{vessel.name}</div>
        <div className="text-xs text-gray-400">{vessel.type} · {vessel.flag}</div>
      </div>

      <div className="flex items-center justify-between bg-navy-700/40 rounded-xl p-3">
        <span className="text-xs text-gray-500">Correlation Score</span>
        <span className={`text-2xl font-bold font-mono ${riskColor}`}>{vessel.correlationScore}%</span>
      </div>

      <div className="space-y-2">
        {[
          { label: 'Speed', value: `${vessel.speed} kts` },
          { label: 'Course', value: `${vessel.course}°` },
          { label: 'Distance from Spill', value: `${vessel.distanceFromSpill} km` },
          { label: 'Destination', value: vessel.destination },
          { label: 'Last AIS Update', value: formatRelativeTime(vessel.lastUpdate) },
        ].map(item => (
          <div key={item.label} className="flex justify-between items-center py-2 border-b border-cyan-500/5">
            <span className="text-xs text-gray-500">{item.label}</span>
            <span className="text-xs font-semibold text-gray-200 font-mono">{item.value}</span>
          </div>
        ))}
      </div>

      <button onClick={onViewDetails} className="btn-primary w-full justify-center">
        <ChevronRight size={14} />
        View Full Details
      </button>
    </div>
  );
}
