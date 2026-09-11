import React from 'react';
import { BookOpen, Users, Volume2, HelpCircle } from 'lucide-react';
import { SimpleExplanation } from '../types';

interface SimpleExplanationSectionProps {
  simpleExplanation: SimpleExplanation;
  documentType: string;
}

export const SimpleExplanationSection: React.FC<SimpleExplanationSectionProps> = ({
  simpleExplanation,
  documentType,
}) => {
  return (
    <div
      id="section-simple-explanation"
      className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs"
    >
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-stone-900 font-['Space_Grotesk']">
              Simple Explanation
            </h2>
            <p className="text-xs text-stone-500">
              Plain-English translation without bureaucratic jargon
            </p>
          </div>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200/60">
          {documentType}
        </span>
      </div>

      {/* The Bottom Line Callout */}
      <div className="bg-sky-50/70 border border-sky-200/70 rounded-xl p-4.5 mb-5">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-900 block mb-1">
              The Bottom Line
            </span>
            <p className="text-sm sm:text-base font-medium text-stone-900 leading-relaxed">
              {simpleExplanation.theBottomLine}
            </p>
          </div>
        </div>
      </div>

      {/* Narrative Summary Paragraphs */}
      <div className="space-y-3.5 text-sm sm:text-[15px] text-stone-700 leading-relaxed">
        {simpleExplanation.summaryParagraphs.map((para, idx) => (
          <p key={idx} className="text-stone-700">
            {para}
          </p>
        ))}
      </div>

      {/* Context Tags: Who is affected & Document Tone */}
      <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50/70 border border-stone-100">
          <Users className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block mb-0.5">
              Who Is Affected
            </span>
            <p className="text-xs text-stone-800 leading-snug">
              {simpleExplanation.whoIsAffected}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50/70 border border-stone-100">
          <Volume2 className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block mb-0.5">
              Tone & Posture
            </span>
            <p className="text-xs text-stone-800 leading-snug">
              {simpleExplanation.toneSummary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
