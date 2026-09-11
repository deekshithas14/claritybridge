import React from 'react';
import { Sparkles, History, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenHistory: () => void;
  hasAnalysis: boolean;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenHistory,
  hasAnalysis,
  historyCount,
}) => {
  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-indigo-100">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg tracking-tight text-stone-900 font-['Space_Grotesk']">
                ClarityBridge
              </span>
              <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Gemini AI
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              Translating complicated real-world documents into plain English
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {historyCount > 0 && (
            <button
              id="header-history-btn"
              onClick={onOpenHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200"
              title="View recent analyses"
            >
              <History className="w-3.5 h-3.5 text-stone-500" />
              <span>History</span>
              <span className="ml-0.5 px-1.5 py-0.2 bg-stone-200 text-stone-700 rounded-full text-[10px] font-semibold">
                {historyCount}
              </span>
            </button>
          )}

          {hasAnalysis && (
            <button
              id="header-new-analysis-btn"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Document</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
