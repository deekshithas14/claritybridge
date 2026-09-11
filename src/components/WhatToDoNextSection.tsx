import React from 'react';
import {
  ListChecks,
  Clock,
  CheckCircle2,
  Circle,
  AlertOctagon,
  Check,
} from 'lucide-react';
import { ActionStep } from '../types';

interface WhatToDoNextSectionProps {
  whatToDoNext: ActionStep[];
  onToggleStep: (stepId: string) => void;
}

export const WhatToDoNextSection: React.FC<WhatToDoNextSectionProps> = ({
  whatToDoNext,
  onToggleStep,
}) => {
  const completedCount = whatToDoNext.filter((s) => s.completed).length;
  const progressPercent = whatToDoNext.length
    ? Math.round((completedCount / whatToDoNext.length) * 100)
    : 0;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            <AlertOctagon className="w-3 h-3" />
            Urgent Priority
          </span>
        );
      case 'recommended':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
            Recommended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
            Optional / Next
          </span>
        );
    }
  };

  return (
    <div
      id="section-what-to-do-next"
      className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ListChecks className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-stone-900 font-['Space_Grotesk']">
              What To Do Next
            </h2>
            <p className="text-xs text-stone-500">
              Prioritized, concrete action plan to protect yourself and resolve this
            </p>
          </div>
        </div>

        {/* Action Progress Bar */}
        <div className="flex items-center gap-2.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/70">
          <div className="w-20 sm:w-28 h-2 rounded-full bg-stone-200 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-stone-700">
            {completedCount}/{whatToDoNext.length} done
          </span>
        </div>
      </div>

      <div className="space-y-3.5">
        {whatToDoNext.map((step) => {
          const isDone = Boolean(step.completed);

          return (
            <div
              key={step.id}
              className={`rounded-xl border transition-all p-4 ${
                isDone
                  ? 'bg-stone-50/80 border-stone-200 opacity-75'
                  : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Interactive Checkbox */}
                <button
                  id={`checkbox-step-${step.id}`}
                  type="button"
                  onClick={() => onToggleStep(step.id)}
                  className="mt-0.5 text-stone-400 hover:text-emerald-600 focus:outline-none transition-colors shrink-0"
                  title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                >
                  {isDone ? (
                    <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-stone-300 hover:text-stone-500" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 text-[11px] font-bold flex items-center justify-center shrink-0">
                        {step.stepNumber}
                      </span>
                      <h3
                        className={`text-sm sm:text-base font-bold text-stone-900 transition-colors ${
                          isDone ? 'line-through text-stone-500' : ''
                        }`}
                      >
                        {step.action}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      {getPriorityBadge(step.priority)}
                      {step.timeframe && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>{step.timeframe}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className={`text-xs sm:text-sm text-stone-700 leading-relaxed ${
                      isDone ? 'text-stone-500' : ''
                    }`}
                  >
                    {step.details}
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
