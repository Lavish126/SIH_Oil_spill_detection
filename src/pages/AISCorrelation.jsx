// AIS Correlation page — Vessel correlation analysis
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Waves, Ship, AlertTriangle, Info, ChevronRight,
  RefreshCw, BarChart2, MapPin
} from 'lucide-react';
import VesselCard from '../components/ui/VesselCard';
import SpillCard from '../components/ui/SpillCard';
import CorrelationScore from '../components/ui/CorrelationScore';
import MapView from '../components/map/MapView';
import { useApp } from '../context/AppContext';
import { getSeverityStyle } from '../utils/correlation';

export default function AISCorrelation() {
  const navigate = useNavigate();
  const { activeSpill, nearbyVessels, vessels, spills, loadScenario, scenarios, activeScenario, addToast } = useApp();
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const handleRunCorrelation = () => {
    setRunning(true);
    setDone(false);
    setSelectedVessel(null);
    setTimeout(() => {
      setRunning(false);
      setDone(true);
      addToast(`Correlation complete — ${nearbyVessels.length} vessels ranked`, 'success');
    }, 2200);
  };

  const spillStyle = getSeverityStyle(activeSpill?.severity);

  // Get vessels in the map area
  const mapVessels = vessels.filter(v => activeSpill?.nearbyVessels?.includes(v.id));

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">AIS Vessel Correlation</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Identify vessels potentially associated with the detected oil spill.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-300">
        <Info size={15} className="shrink-0 mt-0.5" />
        <span>Correlation score is an analytical indicator and does not establish legal responsibility. All findings should be verified by competent maritime authorities.</span>
      </div>

      {/* Scenario selector */}
      <div className="flex flex-wrap gap-2">
        {scenarios.map(sc => (
          <button
            key={sc.id}
            onClick={() => { loadScenario(sc); setDone(false); setSelectedVessel(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              activeScenario.id === sc.id
                ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                : 'border-cyan-500/10 text-gray-400 hover:border-cyan-500/20 hover:text-gray-300'
            }`}
          >
            {sc.name.split('—')[0].trim()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left — Spill info + Vessel list */}
        <div className="xl:col-span-1 space-y-4">
          {/* Active Spill */}
          <div className="panel p-4">
            <div className="section-title mb-3">Detected Spill</div>
            {activeSpill && (
              <SpillCard spill={activeSpill} onClick={() => navigate('/map')} />
            )}
          </div>

          {/* Run Correlation */}
          <button
            onClick={handleRunCorrelation}
            disabled={running}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              running
                ? 'bg-navy-700 text-gray-500 cursor-not-allowed'
                : 'bg-cyan-500 hover:bg-cyan-400 text-navy-950 shadow-glow-cyan'
            }`}
          >
            {running ? (
              <><RefreshCw size={15} className="animate-spin" />Running Correlation Analysis...</>
            ) : (
              <><BarChart2 size={15} />Run AIS Correlation Analysis</>
            )}
          </button>

          {/* Vessel rankings */}
          {(done || nearbyVessels.length > 0) && (
            <div className="space-y-2">
              <div className="section-title mb-2">Ranked Vessels ({nearbyVessels.length})</div>
              {nearbyVessels.map((vessel, idx) => (
                <VesselCard
                  key={vessel.id}
                  vessel={vessel}
                  rank={idx + 1}
                  onClick={(v) => setSelectedVessel(v)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right — Map + Details */}
        <div className="xl:col-span-2 space-y-4">
          {/* Map */}
          <div className="panel overflow-hidden">
            <div className="p-3 border-b border-cyan-500/10">
              <h3 className="text-sm font-semibold text-gray-200">Investigation Zone Map</h3>
              <p className="text-xs text-gray-500">Spill location · Vessel tracks · Detection radius</p>
            </div>
            <MapView
              spills={activeSpill ? [activeSpill] : []}
              vessels={mapVessels}
              center={activeSpill ? [activeSpill.lat, activeSpill.lng] : [15, 76]}
              zoom={9}
              height="340px"
              showPolygons
              showTracks
              showDetectionRadius
              onVesselClick={(v) => setSelectedVessel(v)}
            />
          </div>

          {/* Selected vessel correlation detail */}
          {selectedVessel ? (
            <div className="panel p-4 animate-fade-in">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Potentially Associated Vessel</div>
                  <h2 className="text-lg font-bold text-white">{selectedVessel.name}</h2>
                  <div className="text-xs text-gray-400 font-mono">MMSI: {selectedVessel.mmsi} · {selectedVessel.type} · {selectedVessel.flag}</div>
                </div>
                <button
                  onClick={() => navigate(`/vessels/${selectedVessel.id}`)}
                  className="btn-primary"
                >
                  <ChevronRight size={14} />
                  Full Details
                </button>
              </div>

              {/* Why flagged */}
              <div className="mb-4 p-3 bg-navy-700/40 rounded-xl border border-cyan-500/10">
                <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                  Why is this vessel highly correlated?
                </div>
                <div className="space-y-1.5">
                  {selectedVessel.flagReason?.map((reason, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <CorrelationScore vessel={selectedVessel} />
            </div>
          ) : (
            <div className="panel p-8 flex flex-col items-center justify-center text-center">
              <Ship size={28} className="text-gray-600 mb-3" />
              <h3 className="text-sm font-semibold text-gray-400 mb-1">Select a Vessel</h3>
              <p className="text-xs text-gray-600">Click a vessel from the ranked list or map to view the correlation breakdown and investigation details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
