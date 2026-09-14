// Alerts page — OceanGuard SIH26143
import { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AlertCard from '../components/ui/AlertCard';

export default function Alerts() {
  const { alerts } = useApp();
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity !== 'ALL' && alert.severity !== filterSeverity) return false;
    if (searchTerm && !alert.title.toLowerCase().includes(searchTerm.toLowerCase()) && !alert.location.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Bell className="text-cyan-400" /> System Alerts & Notifications
          </h1>
          <p className="text-sm text-gray-400 mt-1">Real-time satellite detection alerts & AIS trajectory anomaly flags</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-navy-800 border border-cyan-500/20 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="bg-navy-800 border border-cyan-500/20 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAlerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}
