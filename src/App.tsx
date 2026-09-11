/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertCircle,
  FileSearch,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ClarityAnalysis, InputMode } from './types';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { AnalysisView } from './components/AnalysisView';
import { RecentHistoryModal } from './components/RecentHistoryModal';

const LOADING_STEPS = [
  'Decoding document structure and extracting text...',
  'Translating confusing jargon into plain English...',
  'Isolating critical figures, deadlines, and entities...',
  'Detecting hidden caveats, fine print, and obligations...',
  'Formulating prioritized, actionable next steps...',
];

export default function App() {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [textInput, setTextInput] = useState('');
  const [imageFile, setImageFile] = useState<{
    data: string;
    mimeType: string;
    name: string;
    size: number;
  } | null>(null);
  const [userFocus, setUserFocus] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [currentAnalysis, setCurrentAnalysis] = useState<ClarityAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [history, setHistory] = useState<ClarityAnalysis[]>(() => {
    try {
      const saved = localStorage.getItem('claritybridge_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Cycle loading step messages during processing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStepIndex(0);
      timer = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  // Sync history to localStorage
  const saveToHistory = (item: ClarityAnalysis) => {
    setHistory((prev) => {
      const updated = [item, ...prev.filter((p) => p.id !== item.id)].slice(0, 15);
      try {
        localStorage.setItem('claritybridge_history', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save to localStorage:', err);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('claritybridge_history');
    } catch (err) {
      console.warn('Failed to clear storage:', err);
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload: any = {
        mode: inputMode,
        userFocus: userFocus.trim() || undefined,
      };

      if (inputMode === 'text') {
        payload.text = textInput;
      } else {
        if (!imageFile) throw new Error('Please choose an image file first.');
        payload.image = {
          data: imageFile.data,
          mimeType: imageFile.mimeType,
        };
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned error (${res.status})`);
      }

      const analysis: ClarityAnalysis = await res.json();
      setCurrentAnalysis(analysis);
      saveToHistory(analysis);

      // Scroll smoothly to results
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Analyze request failed:', err);
      setErrorMessage(
        err.message ||
          'Failed to decode document. Please verify your input or check your connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStep = (stepId: string) => {
    if (!currentAnalysis) return;
    const updatedSteps = currentAnalysis.whatToDoNext.map((step) => {
      if (step.id === stepId) {
        return { ...step, completed: !step.completed };
      }
      return step;
    });

    const updatedAnalysis = {
      ...currentAnalysis,
      whatToDoNext: updatedSteps,
    };

    setCurrentAnalysis(updatedAnalysis);
    saveToHistory(updatedAnalysis);
  };

  const handleReset = () => {
    setCurrentAnalysis(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Persistent Navigation Header */}
      <Header
        onReset={handleReset}
        onOpenHistory={() => setIsHistoryOpen(true)}
        hasAnalysis={Boolean(currentAnalysis)}
        historyCount={history.length}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Error Alert Banner */}
        {errorMessage && (
          <div
            id="error-alert-banner"
            className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 shadow-xs"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
            <div className="flex-1 text-sm">
              <p className="font-semibold">Unable to analyze document</p>
              <p className="mt-0.5 text-rose-700 text-xs sm:text-sm leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700 text-xs font-semibold px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading Overlay / Progress Banner */}
        {isLoading && (
          <div
            id="analysis-loading-state"
            className="my-8 bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center shadow-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-5">
              <div className="w-7 h-7 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-['Space_Grotesk'] mb-2">
              Decoding Your Document with Gemini
            </h3>

            <p className="text-sm font-medium text-indigo-700 min-h-[24px] transition-all duration-300">
              {LOADING_STEPS[loadingStepIndex]}
            </p>

            <div className="max-w-xs mx-auto mt-6">
              <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-500 rounded-full"
                  style={{
                    width: `${((loadingStepIndex + 1) / LOADING_STEPS.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <p className="text-xs text-stone-400 mt-4">
              Analyzing plain English translations, vital numbers, fine print caveats, and action plans...
            </p>
          </div>
        )}

        {/* View Mode: Analysis Output vs Input Panel */}
        {!isLoading && currentAnalysis ? (
          <AnalysisView
            analysis={currentAnalysis}
            onToggleStep={handleToggleStep}
            onNewAnalysis={handleReset}
          />
        ) : (
          !isLoading && (
            <div className="space-y-6">
              {/* Introduction Card */}
              <div className="text-center max-w-2xl mx-auto pt-2 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold mb-3.5 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Real-World Document Demystifier</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight font-['Space_Grotesk'] leading-tight">
                  Turn complicated, messy documents into crystal-clear actions.
                </h1>
                <p className="mt-2.5 text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl mx-auto">
                  Paste confusing text or drop an image of medical bills, lease
                  contracts, legal notices, or city citations. We extract what matters,
                  explain it simply, and give you immediate next steps.
                </p>
              </div>

              {/* Two-Mode Input Panel */}
              <InputPanel
                inputMode={inputMode}
                setInputMode={setInputMode}
                textInput={textInput}
                setTextInput={setTextInput}
                imageFile={imageFile}
                setImageFile={setImageFile}
                userFocus={userFocus}
                setUserFocus={setUserFocus}
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
              />

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
                <div className="p-4 rounded-xl bg-white/70 border border-stone-200/70 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-2.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                    1. Simple Explanation
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Plain-English summaries that skip legal double-speak and tell you the bottom line directly.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/70 border border-stone-200/70 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2.5">
                    <FileSearch className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                    2. Key Information
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Extracted dollar amounts, critical deadlines, case numbers, and contact channels.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/70 border border-stone-200/70 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-2.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                    3. Important Points
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Uncovers hidden clauses, fine print traps, potential penalties, and statutory rights.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/70 border border-stone-200/70 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                    4. What To Do Next
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Interactive, prioritized checklist with phone scripts, deadlines, and dispute steps.
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white/80 py-4 text-center text-xs text-stone-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            ClarityBridge • Powered by Gemini AI • Always review original documents for legal determinations
          </p>
          <p className="text-stone-400">
            Plain English Document Translation
          </p>
        </div>
      </footer>

      {/* History Drawer / Modal */}
      <RecentHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={(selected) => setCurrentAnalysis(selected)}
        onClear={handleClearHistory}
      />
    </div>
  );
}
