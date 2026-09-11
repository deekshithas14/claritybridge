import React, { useState } from 'react';
import { Send, MessageSquare, Sparkles, HelpCircle } from 'lucide-react';
import { ClarityAnalysis } from '../types';

interface ClarificationChatProps {
  analysis: ClarityAnalysis;
}

interface QnAItem {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

export const ClarificationChat: React.FC<ClarificationChatProps> = ({ analysis }) => {
  const [question, setQuestion] = useState('');
  const [qnaList, setQnaList] = useState<QnAItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    'Can they legally do this?',
    'What if I cannot pay by the deadline?',
    'What exact words should I say when I call them?',
    'Is there any way to dispute or reduce this?',
  ];

  const handleAsk = async (qText?: string) => {
    const query = qText || question;
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    const userQ = query.trim();
    if (!qText) setQuestion('');

    try {
      const res = await fetch('/api/clarify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userQ,
          documentSummary: {
            headline: analysis.headline,
            documentType: analysis.documentType,
            urgencyLevel: analysis.urgencyLevel,
            theBottomLine: analysis.simpleExplanation.theBottomLine,
            keyInformation: analysis.keyInformation.map((k) => `${k.label}: ${k.value}`),
            importantPoints: analysis.importantPoints.map((p) => `${p.title}: ${p.detail}`),
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch clarification.');
      }

      const data = await res.json();
      setQnaList((prev) => [
        ...prev,
        {
          id: `qna-${Date.now()}`,
          question: userQ,
          answer: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setQnaList((prev) => [
        ...prev,
        {
          id: `qna-${Date.now()}`,
          question: userQ,
          answer: 'Unable to reach the clarification service. Please verify your connection or try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="section-clarification"
      className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs"
    >
      <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100 mb-5">
        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
          <MessageSquare className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-stone-900 font-['Space_Grotesk']">
            Ask ClarityBridge
          </h2>
          <p className="text-xs text-stone-500">
            Have a specific worry or question about this document? Ask in plain English.
          </p>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="mb-4">
        <span className="text-xs font-semibold text-stone-500 block mb-2">
          Suggested questions:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              id={`quick-q-${idx}`}
              type="button"
              disabled={isLoading}
              onClick={() => handleAsk(q)}
              className="text-xs px-3 py-1.5 rounded-lg bg-stone-50 hover:bg-teal-50 text-stone-700 hover:text-teal-900 border border-stone-200 hover:border-teal-200 transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* QnA History */}
      {qnaList.length > 0 && (
        <div className="space-y-3.5 mb-5 max-h-96 overflow-y-auto pr-1">
          {qnaList.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex justify-end">
                <div className="bg-stone-900 text-white text-xs sm:text-sm px-3.5 py-2 rounded-2xl rounded-tr-xs max-w-lg">
                  {item.question}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-teal-50/70 border border-teal-200/60 text-stone-800 text-xs sm:text-sm p-3.5 rounded-2xl rounded-tl-xs max-w-xl leading-relaxed">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-teal-800 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Plain English Advice</span>
                  </div>
                  <div className="whitespace-pre-line">{item.answer}</div>
                  <span className="block text-[10px] text-teal-700/70 mt-2 text-right">
                    {item.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="flex items-center gap-2"
      >
        <input
          id="clarify-input"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about this document..."
          disabled={isLoading}
          className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
        />
        <button
          id="clarify-submit-btn"
          type="submit"
          disabled={!question.trim() || isLoading}
          className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors shadow-2xs ${
            question.trim() && !isLoading
              ? 'bg-teal-700 hover:bg-teal-800 text-white cursor-pointer'
              : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
          }`}
        >
          {isLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
