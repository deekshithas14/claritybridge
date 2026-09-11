import React from 'react';
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { ImportantPoint } from '../types';

interface ImportantPointsSectionProps {
  importantPoints: ImportantPoint[];
}

export const ImportantPointsSection: React.FC<ImportantPointsSectionProps> = ({
  importantPoints,
}) => {
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          cardBg: 'bg-rose-50/50 hover:bg-rose-50/80',
          border: 'border-rose-200',
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
          icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
          label: 'Critical Caveat',
        };
      case 'warning':
        return {
          cardBg: 'bg-amber-50/50 hover:bg-amber-50/80',
          border: 'border-amber-200',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
          label: 'Important Fine Print',
        };
      default:
        return {
          cardBg: 'bg-sky-50/40 hover:bg-sky-50/70',
          border: 'border-sky-200',
          badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
          icon: <Info className="w-4 h-4 text-sky-600" />,
          label: 'Helpful Stipulation',
        };
    }
  };

  return (
    <div
      id="section-important-points"
      className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs"
    >
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-stone-900 font-['Space_Grotesk']">
              Important Points
            </h2>
            <p className="text-xs text-stone-500">
              Fine print stipulations, hidden conditions, and crucial nuances
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
          {importantPoints.length} key {importantPoints.length === 1 ? 'point' : 'points'}
        </span>
      </div>

      <div className="space-y-3.5">
        {importantPoints.map((point) => {
          const style = getSeverityStyle(point.severity);
          return (
            <div
              key={point.id}
              className={`p-4 rounded-xl border ${style.border} ${style.cardBg} transition-colors`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">{style.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-stone-900 leading-snug">
                      {point.title}
                    </h3>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${style.badgeBg}`}
                    >
                      {style.label}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mt-1">
                    {point.detail}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
