// VesselDetails page — Detailed vessel investigation profile
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Ship, Anchor, Navigation, Gauge,
  MapPin, Clock, AlertTriangle, CheckCircle, Info, Flag
} from 'lucide-react';
import MapView from '../components/map/MapView';
import CorrelationScore from '../components/ui/CorrelationScore';
import { useApp } from '../context/AppContext';
import { formatRelativeTime, getRiskLevel } from '../utils/correlation';

export default function VesselDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vessels, activeSpill } = useApp();

  const vessel = vessels.find(v => v.id === id);

  if (!vessel) {
    return (
      <div className="p-6 flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
        <Ship size={40} className="text-gray-600 mb-4" />
        <h2 className="text-lg font-bold text-gray-300 mb-2">Vessel Not Found</h2>
        <p className="text-sm text-gray-500 mb-4">Vessel ID "{id}" not found in the AIS database.</p>
        <button onClick={() => navigate('/ais-correlation')} className="btn-primary">
          <ArrowLeft size={14} /> Back to AIS Analysis
        </button>
      </div>
    );
  }

  const risk = getRiskLevel(vessel.correlationScore);
  const riskColor = vessel.correlationScore >= 80 ? '#ef4444' :
    vessel.correlationScore >= 60 ? '#f97316' :
    vessel.correlationScore >= 40 ? '#eab308' : '#22c55e';

  const INFO_FIELDS = [
    { label: 'MMSI', value: vessel.mmsi, mono: true },
    { label: 'IMO Number', value: vessel.imo, mono: true },
    { label: 'Vessel Type', value: vessel.type },
    { label: 'Flag State', value: vessel.flag },
    { label: 'Call Sign', value: vessel.callsign, mono: true },
    { label: 'Length', value: `${vessel.length} m` },
    { label: 'Breadth', value: `${vessel.breadth} m` },
    { label: 'Draught', value: `${vessel.draught} m` },
    { label: 'Destination', value: vessel.destination },
    { label: 'ETA', value: vessel.eta ? new Date(vessel.eta).toLocaleDateString('en-IN') : '—' },
  ];

  const POSITION_FIELDS = [
    { label: 'Latitude', value: `${vessel.lat.toFixed(4)}° N` },
    { label: 'Longitude', value: `${vessel.lng.toFixed(4)}° E` },
    { label: 'Speed (SOG)', value: `${vessel.speed} knots` },
    { label: 'Course (COG)', value: `${vessel.course}°` },
    { label: 'Heading', value: `${vessel.heading}°` },
    { label: 'Last AIS Update', value: formatRelativeTime(vessel.lastUpdate) },
    { label: 'Distance from Spill', value: `${vessel.distanceFromSpill} km` },
    { label: 'Status', value: vessel.status },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/ais-correlation')} className="btn-icon">
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-white">{vessel.name}</h1>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${risk.color} ${risk.bg}`}>
                {vessel.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{vessel.type} · {vessel.flag} · MMSI {vessel.mmsi}</p>
          </div>
        </div>

        {/* Correlation score hero */}
        <div className="flex items-center gap-4 bg-navy-800 border border-cyan-500/15 rounded-2xl p-4">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Correlation Score</div>
            <div className="text-4xl font-bold font-mono" style={{ color: riskColor }}>{vessel.correlationScore}%</div>
          </div>
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: `${riskColor}15`, border: `2px solid ${riskColor}40` }}>
            <AlertTriangle size={24} style={{ color: riskColor }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="xl:col-span-2 space-y-4">
          {/* Vessel Info */}
          <div className="panel p-4">
            <div className="section-title mb-3 flex items-center gap-2">
              <Anchor size={13} />
              Vessel Information
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {INFO_FIELDS.map(f => (
                <div key={f.label} className="bg-navy-700/30 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-0.5">{f.label}</div>
                  <div className={`text-sm font-semibold text-gray-200 ${f.mono ? 'font-mono' : ''}`}>{f.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Position Data */}
          <div className="panel p-4">
            <div className="section-title mb-3 flex items-center gap-2">
              <Navigation size={13} />
              Real-Time Position
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {POSITION_FIELDS.map(f => (
                <div key={f.label} className={`bg-navy-700/30 rounded-lg p-3 ${
                  f.label === 'Status' && vessel.status === 'Suspicious' ? 'border border-red-500/20' : ''
                }`}>
                  <div className="text-xs text-gray-500 mb-0.5">{f.label}</div>
                  <div className={`text-sm font-semibold font-mono ${
                    f.label === 'Status'
                      ? vessel.status === 'Suspicious' ? 'text-red-400' : vessel.status === 'Moderate' ? 'text-orange-400' : 'text-green-400'
                      : 'text-gray-200'
                  }`}>{f.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Map with track */}
          <div className="panel overflow-hidden">
            <div className="p-3 border-b border-cyan-500/10">
              <h3 className="text-sm font-semibold text-gray-200">Vessel Track</h3>
              <p className="text-xs text-gray-500">Historical AIS positions · Last 12 hours</p>
            </div>
            <MapView
              spills={activeSpill ? [activeSpill] : []}
              vessels={[vessel]}
              center={[vessel.lat, vessel.lng]}
              zoom={9}
              height="320px"
              showPolygons
              showTracks
            />
          </div>

          {/* Why flagged */}
          <div className="panel p-4">
            <div className="section-title mb-3">Why is this vessel highly correlated?</div>
            <div className="space-y-2">
              {vessel.flagReason?.map((reason, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-navy-700/30 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle size={11} className="text-green-400" />
                  </div>
                  <span className="text-sm text-gray-300">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Correlation breakdown */}
        <div className="space-y-4">
          <div className="panel p-4">
            <div className="section-title mb-4">Correlation Breakdown</div>
            <CorrelationScore vessel={vessel} />
          </div>

          {/* Track waypoints */}
          <div className="panel p-4">
            <div className="section-title mb-3">Vessel Track Waypoints</div>
            <div className="space-y-2">
              {vessel.track?.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${i === vessel.track.length - 1 ? 'bg-red-500' : 'bg-cyan-500'} shrink-0 mt-0.5`} />
                    {i < vessel.track.length - 1 && <div className="w-0.5 h-6 bg-cyan-500/20 mt-1" />}
                  </div>
                  <div className="pb-2">
                    <div className="text-xs font-mono text-gray-400">{point.lat.toFixed(4)}°N, {point.lng.toFixed(4)}°E</div>
                    <div className="text-xs text-gray-600">{formatRelativeTime(point.time)}</div>
                    {i === vessel.track.length - 1 && <div className="text-xs text-red-400 font-semibold mt-0.5">Current Position</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <button onClick={() => navigate('/reports')} className="btn-primary w-full justify-center">
              Generate Incident Report
            </button>
            <button onClick={() => navigate('/map')} className="btn-secondary w-full justify-center">
              <MapPin size={14} />
              View on Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
