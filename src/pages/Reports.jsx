// Reports page — OceanGuard SIH26143
import { FileText, Download, ShieldCheck, Share2, Printer } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Reports() {
  const { spills, vessels } = useApp();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="text-cyan-400" /> Incident & Compliance Reports
          </h1>
          <p className="text-sm text-gray-400 mt-1">Generated evidence dockets, maritime authority submissions & analytical summaries</p>
        </div>
        <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-glow">
          <Download size={16} /> Export Full Audit Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {spills.map(spill => (
          <div key={spill.id} className="bg-navy-800/80 border border-cyan-500/20 rounded-xl p-5 hover:border-cyan-500/40 transition-all space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold">{spill.id}</span>
                <h3 className="font-bold text-white text-lg mt-0.5">{spill.locationName}</h3>
              </div>
              <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded text-xs">
                {spill.confidenceScore}% Match
              </span>
            </div>

            <div className="text-xs text-gray-300 space-y-1.5 bg-navy-900/60 p-3 rounded-lg border border-navy-700">
              <div className="flex justify-between">
                <span className="text-gray-400">Area Estimated:</span>
                <span className="font-medium text-white">{spill.estimatedAreaSqKm} km²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Satellite Sensor:</span>
                <span className="font-medium text-cyan-300">{spill.satelliteSensor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Suspected Vessel:</span>
                <span className="font-medium text-amber-400">{spill.suspectedVesselName || 'Under Correlation'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-navy-700">
              <button className="flex-1 bg-navy-700 hover:bg-navy-600 text-gray-200 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors">
                <Printer size={14} /> PDF Report
              </button>
              <button className="flex-1 bg-navy-700 hover:bg-navy-600 text-cyan-400 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors">
                <Share2 size={14} /> Share Docket
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
