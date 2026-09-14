// CorrelationScore — vessel correlation breakdown with animated bars
import { useEffect, useState } from 'react';

const FACTOR_LABELS = {
  distanceScore: 'Distance from Spill',
  timeScore: 'Time Correlation',
  trackOverlap: 'Track Overlap',
  directionScore: 'Direction Correlation',
  historicalProximity: 'Historical Proximity',
};

export default function CorrelationScore({ vessel, overallScore }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [vessel?.id]);

  if (!vessel) return null;

  const factors = vessel.correlationFactors || {};

  const getColor = (score) => {
    if (score >= 80) return { bar: 'bg-red-500', text: 'text-red-400' };
    if (score >= 60) return { bar: 'bg-orange-500', text: 'text-orange-400' };
    if (score >= 40) return { bar: 'bg-yellow-500', text: 'text-yellow-400' };
    return { bar: 'bg-green-500', text: 'text-green-400' };
  };

  const overall = overallScore ?? vessel.correlationScore;
  const overallColor = getColor(overall);

  return (
    <div className="space-y-4">
      {/* Overall score */}
      <div className="flex items-center justify-between p-3 bg-navy-700/50 rounded-xl border border-cyan-500/10">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Overall Correlation</div>
          <div className="text-xs text-gray-600 mt-0.5">Analytical indicator only — not legal evidence</div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold font-mono ${overallColor.text}`}>{overall}%</div>
        </div>
      </div>

      {/* Factor breakdown */}
      <div className="space-y-3">
        {Object.entries(FACTOR_LABELS).map(([key, label]) => {
          const score = factors[key] ?? 0;
          const c = getColor(score);
          return (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">{label}</span>
                <span className={`text-xs font-bold font-mono ${c.text}`}>{score}%</span>
              </div>
              <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${c.bar}`}
                  style={{ width: animated ? `${score}%` : '0%' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-600 italic border-t border-cyan-500/10 pt-3">
        ⚠️ Correlation score is an analytical indicator and does not establish legal responsibility. All findings are subject to further investigation.
      </p>
    </div>
  );
}
