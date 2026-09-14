// Global App Context for OceanGuard SIH26143
import React, { createContext, useContext, useState, useCallback } from 'react';
import { spills, scenarios } from '../data/spills';
import { vessels } from '../data/vessels';
import { alerts } from '../data/alerts';
import { incidents } from '../data/incidents';
import { findNearbyVessels } from '../utils/correlation';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeScenario, setActiveScenario] = useState(scenarios[0]);
  const [activeSpill, setActiveSpill] = useState(spills[0]);
  const [activeVessel, setActiveVessel] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapFilter, setMapFilter] = useState('ALL');

  // Derived: vessels near active spill
  const nearbyVessels = findNearbyVessels(activeSpill, vessels);

  // Load a demo scenario
  const loadScenario = useCallback((scenario) => {
    const spill = spills.find(s => s.id === scenario.spillId);
    if (spill) {
      setActiveScenario(scenario);
      setActiveSpill(spill);
      setActiveVessel(null);
      addToast(`Loaded: ${scenario.name}`, 'success');
    }
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Dashboard stats
  const stats = {
    activeSpills: spills.filter(s => s.status === 'Open' || s.status === 'Investigating').length,
    monitoredAreas: 28,
    vesselsTracked: vessels.length + 127, // mock extra vessels
    activeAlerts: alerts.filter(a => !a.acknowledged).length,
    detectionConfidence: 94.2,
  };

  return (
    <AppContext.Provider value={{
      spills,
      vessels,
      alerts,
      incidents,
      scenarios,
      activeScenario,
      activeSpill,
      activeVessel,
      nearbyVessels,
      toasts,
      sidebarOpen,
      mapFilter,
      stats,
      setActiveSpill,
      setActiveVessel,
      setSidebarOpen,
      setMapFilter,
      loadScenario,
      addToast,
      dismissToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
