import React from 'react';
import { X, Clock, FileText, Trash2, ArrowRight } from 'lucide-react';
import { ClarityAnalysis } from '../types';

interface RecentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ClarityAnalysis[];
  onSelect: (item: ClarityAnalysis) => void;
  onClear: () => void;
}

export const RecentHistoryModal: React.FC<RecentHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-lg w-full overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-stone-600" />
            <h3 className="font-semibold text-stone-900 text-base font-['Space_Grotesk']">
              Recent Analyses ({history.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-8 text-stone-500 text-xs sm:text-sm">
              No previous analyses stored yet.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="p-3.5 rounded-xl border border-stone-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    {item.documentType}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    {new Date(item.analyzedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-indigo-900">
                  {item.headline}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                  {item.simpleExplanation.theBottomLine}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
            <button
              onClick={onClear}
              className="inline-flex items-center gap-1.5 text-stone-500 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
            <span className="text-stone-400">Stored locally in your browser</span>
          </div>
        )}
      </div>
    </div>
  );
};
