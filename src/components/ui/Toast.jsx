// Toast notification component
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};
const STYLES = {
  success: 'bg-green-500/15 border-green-500/30 text-green-300',
  error: 'bg-red-500/15 border-red-500/30 text-red-300',
  warning: 'bg-orange-500/15 border-orange-500/30 text-orange-300',
  info: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
};

export default function Toast({ toast, onDismiss }) {
  const Icon = ICONS[toast.type] || Info;
  const style = STYLES[toast.type] || STYLES.info;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-panel animate-slide-in ${style} min-w-[280px] max-w-[360px]`}>
      <Icon size={16} className="shrink-0" />
      <span className="text-sm flex-1">{toast.message}</span>
      <button onClick={onDismiss} className="opacity-60 hover:opacity-100 transition-opacity shrink-0">
        <X size={14} />
      </button>
    </div>
  );
}
