// SpillDetection page — Satellite Image Upload & Analysis
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, ImageIcon, Scan, AlertTriangle, CheckCircle,
  MapPin, ArrowRight, RefreshCw, FileImage, X, Info
} from 'lucide-react';
import AnalysisProgress from '../components/ui/AnalysisProgress';
import ConfidenceMeter from '../components/ui/ConfidenceMeter';
import { useApp } from '../context/AppContext';

const DEMO_SCENARIOS = [
  { id: 'demo1', label: 'Bay of Bengal — High Severity', confidence: 94, area: 12.6, severity: 'HIGH', lat: 13.2456, lng: 80.3152, satellite: 'Sentinel-1', time: '21:18 IST' },
  { id: 'demo2', label: 'Arabian Sea — Medium Severity', confidence: 82, area: 4.8, severity: 'MEDIUM', lat: 18.9252, lng: 72.8244, satellite: 'Sentinel-2', time: '14:52 IST' },
  { id: 'demo3', label: 'Indian Ocean — Low Confidence', confidence: 67, area: 1.7, severity: 'LOW', lat: 10.5892, lng: 76.3412, satellite: 'Landsat-8', time: '19:35 IST' },
  { id: 'demo4', label: 'Gulf of Kutch — Critical', confidence: 97, area: 28.4, severity: 'CRITICAL', lat: 21.3412, lng: 68.9234, satellite: 'Sentinel-1', time: '12:45 IST' },
];

export default function SpillDetection() {
  const navigate = useNavigate();
  const { addToast, setActiveSpill, spills } = useApp();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      addToast('Please upload a valid image file (JPG, PNG, WEBP)', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageMeta({ width: img.width, height: img.height, size: (file.size / 1024).toFixed(0) + ' KB', name: file.name });
        setUploadedImage(e.target.result);
        setSelectedDemo(null);
        setResult(null);
        addToast('Image uploaded successfully', 'success');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const handleSelectDemo = (demo) => {
    setSelectedDemo(demo);
    setUploadedImage(null);
    setImageMeta(null);
    setResult(null);
    addToast(`Demo image loaded: ${demo.label}`, 'info');
  };

  const handleAnalyze = () => {
    if (!uploadedImage && !selectedDemo) {
      addToast('Please upload or select a satellite image first', 'warning');
      return;
    }
    setAnalyzing(true);
    setResult(null);
  };

  const handleAnalysisComplete = () => {
    setAnalyzing(false);
    const r = selectedDemo || DEMO_SCENARIOS[0];
    setResult(r);
    // Update active spill
    const matchSpill = spills.find(s => s.id === (
      r.id === 'demo1' ? 'OS-2026-014' :
      r.id === 'demo2' ? 'OS-2026-013' :
      r.id === 'demo3' ? 'OS-2026-012' : 'OS-2026-011'
    ));
    if (matchSpill) setActiveSpill(matchSpill);
    addToast('Analysis complete! Oil spill detected.', 'success');
  };

  const reset = () => {
    setUploadedImage(null);
    setImageMeta(null);
    setSelectedDemo(null);
    setResult(null);
    setAnalyzing(false);
  };

  const hasImage = uploadedImage || selectedDemo;

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Oil Spill Detection</h1>
          <p className="text-sm text-gray-500 mt-0.5">Satellite SAR/Optical image analysis · SIH26143 Demo</p>
        </div>
        {hasImage && (
          <button onClick={reset} className="btn-secondary">
            <RefreshCw size={14} />
            Reset
          </button>
        )}
      </div>

      {/* Demo notice */}
      <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-300">
        <Info size={15} className="shrink-0 mt-0.5" />
        <span>This is a frontend demo. Analysis is simulated locally — no real ML model is running. Select a demo image or upload any satellite image to demonstrate the workflow.</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left — Upload + Controls */}
        <div className="xl:col-span-2 space-y-4">
          {/* Upload zone */}
          <div className="panel p-4">
            <h2 className="text-sm font-semibold text-gray-200 mb-3">Upload Satellite Image</h2>
            {!uploadedImage ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragging
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : 'border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/5'
                }`}
              >
                <Upload size={32} className="mx-auto text-cyan-400 mb-3" />
                <div className="text-sm font-medium text-gray-300">Drag & drop or click to upload</div>
                <div className="text-xs text-gray-500 mt-1">Supported: JPG, PNG, WEBP · Satellite imagery</div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Uploaded satellite image"
                  className="w-full rounded-xl object-cover"
                  style={{ maxHeight: '220px' }}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); setUploadedImage(null); setImageMeta(null); }}
                  className="absolute top-2 right-2 p-1 bg-navy-900/80 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
                {imageMeta && (
                  <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-navy-700/50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Width</div>
                      <div className="text-xs font-bold text-white font-mono">{imageMeta.width}px</div>
                    </div>
                    <div className="bg-navy-700/50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Height</div>
                      <div className="text-xs font-bold text-white font-mono">{imageMeta.height}px</div>
                    </div>
                    <div className="bg-navy-700/50 rounded-lg p-2">
                      <div className="text-xs text-gray-500">Size</div>
                      <div className="text-xs font-bold text-white font-mono">{imageMeta.size}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Demo Images */}
          <div className="panel p-4">
            <h2 className="text-sm font-semibold text-gray-200 mb-3">Demo Satellite Images</h2>
            <div className="space-y-2">
              {DEMO_SCENARIOS.map(demo => (
                <button
                  key={demo.id}
                  onClick={() => handleSelectDemo(demo)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedDemo?.id === demo.id
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                      : 'bg-navy-700/30 border-cyan-500/10 text-gray-300 hover:border-cyan-500/30 hover:bg-navy-700/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileImage size={13} className={selectedDemo?.id === demo.id ? 'text-cyan-400' : 'text-gray-500'} />
                    <span className="text-sm font-medium">{demo.label}</span>
                    {selectedDemo?.id === demo.id && (
                      <CheckCircle size={13} className="text-cyan-400 ml-auto" />
                    )}
                  </div>
                  <div className="flex gap-3 mt-1.5 text-xs text-gray-500">
                    <span>{demo.satellite}</span>
                    <span>·</span>
                    <span className={`font-semibold ${
                      demo.severity === 'CRITICAL' ? 'text-red-400' :
                      demo.severity === 'HIGH' ? 'text-orange-400' :
                      demo.severity === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
                    }`}>{demo.severity}</span>
                    <span>·</span>
                    <span>{demo.confidence}% confidence</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Analyze button */}
          <button
            onClick={handleAnalyze}
            disabled={!hasImage || analyzing}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              hasImage && !analyzing
                ? 'bg-cyan-500 hover:bg-cyan-400 text-navy-950 shadow-glow-cyan'
                : 'bg-navy-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Scan size={16} />
            {analyzing ? 'Analyzing...' : 'Analyze Satellite Image'}
          </button>
        </div>

        {/* Right — Analysis Output */}
        <div className="xl:col-span-3 space-y-4">
          {/* Analysis pipeline */}
          {(analyzing || result) && (
            <div className="panel p-4">
              <h2 className="text-sm font-semibold text-gray-200 mb-3">Analysis Pipeline</h2>
              <AnalysisProgress running={analyzing} onComplete={handleAnalysisComplete} />
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-4 animate-fade-in">
              {/* Detection header */}
              <div className="panel p-4 border-l-2 border-l-orange-500">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle size={16} className="text-orange-400" />
                      <span className="text-base font-bold text-white">Oil Spill Detected</span>
                    </div>
                    <p className="text-xs text-gray-500">Satellite analysis complete · Simulated demo result</p>
                  </div>
                  <ConfidenceMeter value={result.confidence} />
                </div>
              </div>

              {/* Side-by-side images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original */}
                <div className="panel overflow-hidden">
                  <div className="p-2 border-b border-cyan-500/10">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Original Image</span>
                  </div>
                  <div className="relative" style={{ minHeight: '200px' }}>
                    {uploadedImage ? (
                      <img src={uploadedImage} alt="Original satellite" className="w-full object-cover" style={{ maxHeight: '240px' }} />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-navy-800 to-navy-700 flex items-center justify-center relative overflow-hidden">
                        {/* Simulated satellite image */}
                        <div className="absolute inset-0 opacity-30">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-teal-950" />
                          {[...Array(8)].map((_, i) => (
                            <div key={i} className="absolute rounded-full opacity-20"
                              style={{
                                width: `${20 + Math.random() * 40}px`, height: `${20 + Math.random() * 40}px`,
                                top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                                background: 'rgba(100,150,180,0.4)', transform: 'translate(-50%,-50%)',
                              }}
                            />
                          ))}
                        </div>
                        <div className="relative flex flex-col items-center gap-2 text-gray-500">
                          <ImageIcon size={28} />
                          <span className="text-xs">Demo Satellite Image</span>
                          <span className="text-xs text-gray-600">{result.satellite}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detection overlay */}
                <div className="panel overflow-hidden">
                  <div className="p-2 border-b border-cyan-500/10">
                    <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Oil Spill Detection</span>
                  </div>
                  <div className="relative" style={{ minHeight: '200px' }}>
                    <div className="w-full h-48 bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center relative overflow-hidden">
                      {/* Simulated detection overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-teal-950 opacity-40" />
                      {/* Spill polygon overlay */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polygon
                          points="38,35 52,33 60,42 55,58 42,60 32,50 34,38"
                          fill={result.severity === 'CRITICAL' ? 'rgba(239,68,68,0.35)' :
                            result.severity === 'HIGH' ? 'rgba(249,115,22,0.35)' :
                            result.severity === 'MEDIUM' ? 'rgba(234,179,8,0.35)' : 'rgba(34,197,94,0.25)'}
                          stroke={result.severity === 'CRITICAL' ? '#ef4444' :
                            result.severity === 'HIGH' ? '#f97316' :
                            result.severity === 'MEDIUM' ? '#eab308' : '#22c55e'}
                          strokeWidth="0.8"
                          strokeDasharray="3 2"
                        />
                        {/* Heatmap dots */}
                        {[{cx:45,cy:45,r:6},{cx:50,cy:50,r:4},{cx:42,cy:52,r:5},{cx:48,cy:40,r:3},{cx:53,cy:47,r:4}].map((d,i) => (
                          <circle key={i} cx={d.cx} cy={d.cy} r={d.r}
                            fill={result.severity === 'CRITICAL' ? 'rgba(239,68,68,0.5)' :
                              result.severity === 'HIGH' ? 'rgba(249,115,22,0.5)' :
                              result.severity === 'MEDIUM' ? 'rgba(234,179,8,0.5)' : 'rgba(34,197,94,0.4)'}
                          />
                        ))}
                      </svg>
                      <div className="relative z-10 flex flex-col items-center gap-1">
                        <span className="text-xs font-bold uppercase tracking-wider"
                          style={{ color: result.severity === 'CRITICAL' ? '#f87171' : result.severity === 'HIGH' ? '#fb923c' : result.severity === 'MEDIUM' ? '#fbbf24' : '#4ade80' }}>
                          {result.severity} SEVERITY
                        </span>
                        <span className="text-xs text-gray-400">Slick detected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detection metrics */}
              <div className="panel p-4">
                <h3 className="text-sm font-semibold text-gray-200 mb-3">Detection Results</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Confidence', value: `${result.confidence}%`, color: 'text-cyan-400' },
                    { label: 'Est. Area', value: `${result.area} km²`, color: 'text-white' },
                    { label: 'Severity', value: result.severity, color: result.severity === 'CRITICAL' ? 'text-red-400' : result.severity === 'HIGH' ? 'text-orange-400' : result.severity === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400' },
                    { label: 'Satellite', value: result.satellite, color: 'text-white' },
                    { label: 'Latitude', value: `${result.lat}° N`, color: 'text-gray-300' },
                    { label: 'Longitude', value: `${result.lng}° E`, color: 'text-gray-300' },
                    { label: 'Detection Time', value: result.time, color: 'text-gray-300' },
                    { label: 'Status', value: 'Confirmed', color: 'text-green-400' },
                  ].map(item => (
                    <div key={item.label} className="bg-navy-700/40 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-0.5">{item.label}</div>
                      <div className={`text-sm font-bold font-mono ${item.color}`}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate('/map')} className="btn-primary flex-1">
                  <MapPin size={14} />
                  View on Marine Map
                </button>
                <button onClick={() => navigate('/ais-correlation')} className="btn-secondary flex-1">
                  <Ship size={14} />
                  AIS Vessel Correlation
                </button>
                <button onClick={() => navigate('/reports')} className="btn-secondary">
                  <ArrowRight size={14} />
                  Incident Report
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!analyzing && !result && (
            <div className="panel p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                <Scan size={28} className="text-cyan-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-300 mb-2">Ready for Analysis</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Upload a satellite image or select a demo scenario, then click "Analyze Satellite Image" to begin the simulated oil spill detection workflow.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add missing Ship import
import { Ship } from 'lucide-react';
