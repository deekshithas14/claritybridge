import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Clock,
  Copy,
  Check,
  Printer,
  Share2,
  FileText,
  CheckCircle2,
  AlertOctagon,
  Info,
} from 'lucide-react';
import { ClarityAnalysis } from '../types';
import { SimpleExplanationSection } from './SimpleExplanationSection';
import { KeyInformationSection } from './KeyInformationSection';
import { ImportantPointsSection } from './ImportantPointsSection';
import { WhatToDoNextSection } from './WhatToDoNextSection';
import { ClarificationChat } from './ClarificationChat';

interface AnalysisViewProps {
  analysis: ClarityAnalysis;
  onToggleStep: (stepId: string) => void;
  onNewAnalysis: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  analysis,
  onToggleStep,
  onNewAnalysis,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);

  const getUrgencyBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return {
          bg: 'bg-rose-500 text-white shadow-sm shadow-rose-200',
          icon: <AlertOctagon className="w-4 h-4" />,
          label: 'Critical Urgency',
        };
      case 'high':
        return {
          bg: 'bg-amber-500 text-white shadow-sm shadow-amber-200',
          icon: <AlertTriangle className="w-4 h-4" />,
          label: 'High Priority Action',
        };
      case 'medium':
        return {
          bg: 'bg-sky-600 text-white shadow-sm shadow-sky-200',
          icon: <Clock className="w-4 h-4" />,
          label: 'Moderate Urgency',
        };
      default:
        return {
          bg: 'bg-stone-600 text-white shadow-sm shadow-stone-200',
          icon: <Info className="w-4 h-4" />,
          label: 'Informational',
        };
    }
  };

  const urgency = getUrgencyBadge(analysis.urgencyLevel);

  const handleCopyMarkdown = () => {
    const md = `# ClarityBridge Summary: ${analysis.headline}
Document Type: ${analysis.documentType}
Urgency: ${analysis.urgencyLevel.toUpperCase()} (${analysis.urgencyReason})

## 1. Simple Explanation
**The Bottom Line**: ${analysis.simpleExplanation.theBottomLine}

${analysis.simpleExplanation.summaryParagraphs.join('\n\n')}

Who is affected: ${analysis.simpleExplanation.whoIsAffected}
Tone: ${analysis.simpleExplanation.toneSummary}

## 2. Key Information
${analysis.keyInformation.map((item) => `- **${item.label}**: ${item.value}${item.note ? ` (${item.note})` : ''}`).join('\n')}

## 3. Important Points
${analysis.importantPoints.map((p) => `- **${p.title}** [${p.severity.toUpperCase()}]: ${p.detail}`).join('\n')}

## 4. What To Do Next
${analysis.whatToDoNext.map((s) => `${s.stepNumber}. [ ] **${s.action}** (${s.timeframe}): ${s.details}`).join('\n')}
`;

    navigator.clipboard.writeText(md);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Headline & Quick Summary */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs overflow-hidden relative">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${urgency.bg}`}
            >
              {urgency.icon}
              <span>{urgency.label}</span>
            </span>

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200/80">
              {analysis.documentType}
            </span>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            <button
              id="btn-copy-markdown"
              type="button"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors"
              title="Copy entire summary as Markdown"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-500" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              id="btn-print-summary"
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors print:hidden"
              title="Print clean summary"
            >
              <Printer className="w-3.5 h-3.5 text-stone-500" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Primary Headline */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight leading-snug font-['Space_Grotesk'] mb-3">
          {analysis.headline}
        </h1>

        {/* Urgency Justification */}
        {analysis.urgencyReason && (
          <div className="flex items-start gap-2 text-xs sm:text-sm text-stone-600 bg-stone-50 rounded-xl p-3 border border-stone-200/60">
            <Clock className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
            <span>
              <strong className="text-stone-800">Timeline factor:</strong>{' '}
              {analysis.urgencyReason}
            </span>
          </div>
        )}
      </div>

      {/* SECTION 1: Simple Explanation */}
      <SimpleExplanationSection
        simpleExplanation={analysis.simpleExplanation}
        documentType={analysis.documentType}
      />

      {/* SECTION 2: Key Information */}
      <KeyInformationSection keyInformation={analysis.keyInformation} />

      {/* SECTION 3: Important Points */}
      <ImportantPointsSection importantPoints={analysis.importantPoints} />

      {/* SECTION 4: What To Do Next */}
      <WhatToDoNextSection
        whatToDoNext={analysis.whatToDoNext}
        onToggleStep={onToggleStep}
      />

      {/* Interactive Clarification (Ask follow-up questions) */}
      <div className="print:hidden">
        <ClarificationChat analysis={analysis} />
      </div>

      {/* Bottom Floating/Clean Navigation */}
      <div className="pt-2 pb-6 flex justify-center print:hidden">
        <button
          id="btn-bottom-new-document"
          type="button"
          onClick={onNewAnalysis}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Decode Another Document</span>
        </button>
      </div>
    </div>
  );
};
