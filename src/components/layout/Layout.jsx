// Layout wrapper — OceanGuard
import Navbar from './Navbar';
import Toast from '../ui/Toast';
import { useApp } from '../../context/AppContext';

export default function Layout({ children }) {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="min-h-screen bg-navy-950 bg-grid">
      <Navbar />
      <main className="pt-14">
        {children}
      </main>
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onDismiss={() => dismissToast(t.id)} />
        ))}
      </div>
    </div>
  );
}
