import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import MarineMap from './pages/MarineMap';
import SpillDetection from './pages/SpillDetection';
import AISCorrelation from './pages/AISCorrelation';
import VesselDetails from './pages/VesselDetails';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<MarineMap />} />
            <Route path="/spill-detection" element={<SpillDetection />} />
            <Route path="/spills" element={<SpillDetection />} />
            <Route path="/spills/:id" element={<SpillDetection />} />
            <Route path="/ais-correlation" element={<AISCorrelation />} />
            <Route path="/correlation" element={<AISCorrelation />} />
            <Route path="/correlation/:spillId" element={<AISCorrelation />} />
            <Route path="/vessel/:id" element={<VesselDetails />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

