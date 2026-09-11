import React, { useState } from 'react';
import {
  DollarSign,
  Calendar,
  Hash,
  Building2,
  User,
  Phone,
  AlertCircle,
  FileText,
  Shield,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import { KeyInformationItem } from '../types';

interface KeyInformationSectionProps {
  keyInformation: KeyInformationItem[];
}

export const KeyInformationSection: React.FC<KeyInformationSectionProps> = ({
  keyInformation,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(keyInformation.map((item) => item.category || 'General')))];

  const filteredItems =
    selectedCategory === 'all'
      ? keyInformation
      : keyInformation.filter((item) => (item.category || 'General') === selectedCategory);

  const getIcon = (type?: string) => {
    switch (type) {
      case 'money':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case 'calendar':
        return <Calendar className="w-4 h-4 text-sky-600" />;
      case 'hash':
        return <Hash className="w-4 h-4 text-indigo-600" />;
      case 'building':
        return <Building2 className="w-4 h-4 text-amber-600" />;
      case 'person':
        return <User className="w-4 h-4 text-purple-600" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-teal-600" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case 'shield':
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <FileText className="w-4 h-4 text-stone-600" />;
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      id="section-key-information"
      className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-stone-900 font-['Space_Grotesk']">
              Key Information
            </h2>
            <p className="text-xs text-stone-500">
              Crucial dates, numbers, figures, and extracted entities
            </p>
          </div>
        </div>

        {/* Category Filters if multiple categories exist */}
        {categories.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-stone-200/70 bg-stone-50/40 hover:bg-white hover:border-stone-300 transition-all flex flex-col justify-between group relative"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-white border border-stone-200 flex items-center justify-center shadow-2xs">
                    {getIcon(item.iconType)}
                  </div>
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {item.category && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-stone-200/60 text-stone-700">
                      {item.category}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.value)}
                    className="p-1 text-stone-400 hover:text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity rounded"
                    title="Copy value"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-base sm:text-lg font-bold text-stone-900 tracking-tight font-mono break-words">
                {item.value}
              </p>
            </div>

            {item.note && (
              <div className="mt-2.5 pt-2 border-t border-stone-200/50">
                <p className="text-xs text-stone-600 leading-snug">
                  {item.note}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
