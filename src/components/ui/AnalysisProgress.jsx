// AnalysisProgress — animated pipeline for satellite image analysis
import { useEffect, useState } from 'react';
import { Check, Loader2, Circle } from 'lucide-react';

const STEPS = [
  { id: 'upload', label: 'Uploading Image', duration: 300 },
  { id: 'preprocess', label: 'Preprocessing', duration: 450 },
  { id: 'ocean', label: 'Ocean Region Detection', duration: 500 },
  { id: 'slick', label: 'Slick Detection', duration: 600 },
  { id: 'segment', label: 'Spill Segmentation', duration: 500 },
  { id: 'confidence', label: 'Confidence Calculation', duration: 400 },
  { id: 'complete', label: 'Analysis Complete', duration: 200 },
];

export default function AnalysisProgress({ running, onComplete }) {
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    if (!running) { setCurrentStep(-1); return; }
    setCurrentStep(0);
    let delay = 0;
    STEPS.forEach((step, idx) => {
      delay += step.duration;
      const timer = setTimeout(() => {
        setCurrentStep(idx + 1);
        if (idx === STEPS.length - 1) {
          setTimeout(() => onComplete?.(), 300);
        }
      }, delay);
    });
  }, [running]);

  return (
    <div className="space-y-1">
      {STEPS.map((step, idx) => {
        const done = currentStep > idx;
        const active = currentStep === idx;
        const pending = currentStep < idx;

        return (
          <div
            key={step.id}
            className={`analysis-step ${done ? 'done' : active ? 'active' : 'pending'}`}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              {done ? (
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check size={11} className="text-white" />
                </div>
              ) : active ? (
                <Loader2 size={16} className="text-cyan-400 animate-spin" />
              ) : (
                <Circle size={14} className="text-gray-600" />
              )}
            </div>
            <span className={`text-sm font-medium ${done ? 'text-green-400' : active ? 'text-cyan-300' : 'text-gray-500'}`}>
              {step.label}
            </span>
            {active && (
              <div className="ml-auto">
                <div className="flex gap-0.5">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1 h-1 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
