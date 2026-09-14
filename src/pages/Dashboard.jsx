// Dashboard page — OceanGuard Command Center
import { useNavigate } from 'react-router-dom';
import {
  Waves, MapPin, Ship, AlertTriangle, Activity,
  TrendingUp, Eye, Zap, ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import StatCard from '../components/ui/StatCard';
import AlertCard from '../components/ui/AlertCard';
import SpillCard from '../components/ui/SpillCard';
import MapView from '../components/map/MapView';
import { useApp } from '../context/AppContext';
import { weeklyDetections, severityDistribution, confidenceOverTime } from '../data/spills';
import { vesselRiskDistribution } from '../data/vessels';
import { formatRelativeTime } from '../utils/correlation';

const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    background: '#0a1e36',
    border: '1px solid rgba(34,211,238,0.2)',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: '12px',
  },
  labelStyle: { color: '#94a3b8' },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { spills, vessels, alerts, stats, activeSpill, setActiveSpill, addToast } = useApp();

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Command Center</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Marine Oil Spill Intelligence & Monitoring System · SIH26143
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500 text-right">
            <div>Last Updated</div>
            <div className="text-cyan-400 font-mono">21:54 IST, 11 Sep 2026</div>
          </div>
          <button
            onClick={() => { navigate('/spill-detection'); }}
            className="btn-primary"
          >
            <Zap size={14} />
            Analyze Image
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        <StatCard
          title="Active Oil Spills"
          value={stats.activeSpills}
          icon={Waves}
          color="red"
          trend="up"
          trendValue="+1"
          description="3 in monitoring, 1 open"
        />
        <StatCard
          title="Monitored Areas"
          value={stats.monitoredAreas}
          icon={MapPin}
          color="cyan"
          description="Across Indian waters"
        />
        <StatCard
          title="Vessels Tracked"
          value={stats.vesselsTracked}
          icon={Ship}
          color="cyan"
          trend="up"
          trendValue="+14"
          description="Real-time AIS feed"
        />
        <StatCard
          title="Active Alerts"
          value={stats.activeAlerts}
          icon={AlertTriangle}
          color="orange"
          description="Requiring attention"
        />
        <StatCard
          title="Detection Confidence"
          value={`${stats.detectionConfidence}%`}
          icon={Activity}
          color="green"
          trend="up"
          trendValue="+2.1%"
          description="Average across active spills"
        />
      </div>

      {/* Map + Recent Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Main Map */}
        <div className="xl:col-span-2 panel overflow-hidden">
          <div className="p-3 border-b border-cyan-500/10 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-200">Maritime Surveillance Map</h2>
              <p className="text-xs text-gray-500">Indian Ocean Region · Satellite + AIS overlay</p>
            </div>
            <button onClick={() => navigate('/map')} className="btn-secondary text-xs">
              <Eye size={13} />
              Full Map
            </button>
          </div>
          <MapView
            spills={spills}
            vessels={vessels}
            center={[15, 76]}
            zoom={5}
            height="420px"
            showPolygons
            showDetectionRadius
            onSpillClick={(s) => { setActiveSpill(s); addToast(`Selected spill: ${s.id}`, 'info'); }}
            onVesselClick={(v) => navigate(`/vessels/${v.id}`)}
          />
        </div>

        {/* Recent Alerts Panel */}
        <div className="panel flex flex-col">
          <div className="p-3 border-b border-cyan-500/10 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-200">Recent Alerts</h2>
            <button onClick={() => navigate('/alerts')} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {alerts.slice(0, 6).map(alert => (
              <AlertCard key={alert.id} alert={alert} compact />
            ))}
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Weekly Detections */}
        <div className="panel p-4 md:col-span-2">
          <h3 className="text-sm font-semibold text-gray-200 mb-1">Oil Spill Detections</h3>
          <p className="text-xs text-gray-500 mb-4">Last 7 days · Detection count & area (km²)</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={weeklyDetections}>
              <defs>
                <linearGradient id="detGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...CHART_TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="detections" stroke="#22d3ee" fill="url(#detGrad)" strokeWidth={2} name="Detections" />
              <Area type="monotone" dataKey="area" stroke="#f97316" fill="url(#areaGrad)" strokeWidth={2} name="Area (km²)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Distribution */}
        <div className="panel p-4">
          <h3 className="text-sm font-semibold text-gray-200 mb-1">Spill Severity</h3>
          <p className="text-xs text-gray-500 mb-4">Distribution by severity level</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={severityDistribution}
                cx="50%" cy="50%" innerRadius={42} outerRadius={64}
                paddingAngle={3} dataKey="value"
              >
                {severityDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...CHART_TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 justify-center">
            {severityDistribution.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                <span className="text-xs text-gray-400">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detection Confidence */}
        <div className="panel p-4">
          <h3 className="text-sm font-semibold text-gray-200 mb-1">Detection Confidence</h3>
          <p className="text-xs text-gray-500 mb-4">Today · % over time</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={confidenceOverTime}>
              <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[75, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...CHART_TOOLTIP_STYLE} />
              <Line
                type="monotone" dataKey="confidence"
                stroke="#22d3ee" strokeWidth={2}
                dot={{ fill: '#22d3ee', r: 3 }}
                activeDot={{ r: 5, fill: '#22d3ee' }}
                name="Confidence %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Spills + Vessel Risk */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Active Spills */}
        <div className="panel">
          <div className="p-3 border-b border-cyan-500/10 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-200">Active Spill Incidents</h2>
            <button onClick={() => navigate('/reports')} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
              View reports <ArrowRight size={12} />
            </button>
          </div>
          <div className="p-3 space-y-2">
            {spills.map(spill => (
              <SpillCard
                key={spill.id}
                spill={spill}
                compact
                onClick={(s) => { navigate('/ais-correlation'); setActiveSpill(s); }}
              />
            ))}
          </div>
        </div>

        {/* Vessel Risk Distribution */}
        <div className="panel p-4">
          <h3 className="text-sm font-semibold text-gray-200 mb-1">Vessel Risk Distribution</h3>
          <p className="text-xs text-gray-500 mb-4">137 vessels tracked · Risk categorization</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={vesselRiskDistribution} layout="vertical" barSize={14}>
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip {...CHART_TOOLTIP_STYLE} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Vessels">
                {vesselRiskDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {vesselRiskDistribution.map(d => (
              <div key={d.name} className="flex items-center gap-2 bg-navy-700/30 rounded-lg p-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                <div>
                  <div className="text-xs text-gray-400">{d.name}</div>
                  <div className="text-sm font-bold text-white font-mono">{d.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
