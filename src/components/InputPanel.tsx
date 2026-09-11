import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Image as ImageIcon,
  UploadCloud,
  X,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileQuestion,
  FileCheck2,
} from 'lucide-react';
import { InputMode, PresetExample } from '../types';
import { PRESET_EXAMPLES } from '../presets';

interface InputPanelProps {
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  textInput: string;
  setTextInput: (val: string) => void;
  imageFile: { data: string; mimeType: string; name: string; size: number } | null;
  setImageFile: (val: { data: string; mimeType: string; name: string; size: number } | null) => void;
  userFocus: string;
  setUserFocus: (val: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  inputMode,
  setInputMode,
  textInput,
  setTextInput,
  imageFile,
  setImageFile,
  userFocus,
  setUserFocus,
  onAnalyze,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showFocusInput, setShowFocusInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Allow pasting an image anywhere when in image mode
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      if (inputMode !== 'image') return;
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          handleFile(file);
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [inputMode]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageFile({
        data: result,
        mimeType: file.type || 'image/jpeg',
        name: file.name || 'Pasted Image',
        size: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSelectPreset = (preset: PresetExample) => {
    setInputMode('text');
    setTextInput(preset.text);
  };

  const charCount = textInput.length;
  const wordCount = textInput.trim() ? textInput.trim().split(/\s+/).length : 0;
  const canSubmit =
    !isLoading &&
    ((inputMode === 'text' && textInput.trim().length > 10) ||
      (inputMode === 'image' && imageFile !== null));

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
      {/* Input Mode Selector Bar */}
      <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/70 p-2 sm:px-4">
        <div className="flex items-center gap-1 bg-stone-200/60 p-1 rounded-xl">
          <button
            id="tab-mode-text"
            type="button"
            onClick={() => setInputMode('text')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              inputMode === 'text'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4 text-sky-600" />
            <span>Text Mode</span>
          </button>

          <button
            id="tab-mode-image"
            type="button"
            onClick={() => setInputMode('image')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              inputMode === 'image'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            <span>Image Mode</span>
          </button>
        </div>

        {/* Focus prompt toggle */}
        <button
          id="btn-toggle-focus"
          type="button"
          onClick={() => setShowFocusInput(!showFocusInput)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            showFocusInput || userFocus
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask Specific Question</span>
          <span className="sm:hidden">Focus</span>
        </button>
      </div>

      {/* Preset Quick Examples for fast testing */}
      <div className="px-4 py-2.5 bg-stone-50/40 border-b border-stone-100 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
        <span className="text-stone-600 font-medium whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Try a real example:</span>
        </span>
        <div className="flex items-center gap-1.5 flex-nowrap">
          {PRESET_EXAMPLES.map((preset) => (
            <button
              key={preset.id}
              id={`preset-btn-${preset.id}`}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-indigo-50 border border-stone-200 hover:border-indigo-200 text-stone-700 hover:text-indigo-900 text-xs font-medium transition-colors whitespace-nowrap shadow-2xs"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Optional User Focus / Specific Concern */}
      {(showFocusInput || userFocus) && (
        <div className="px-4 pt-3 pb-1 border-b border-stone-100 bg-amber-50/30">
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="user-focus-input"
              className="text-xs font-semibold text-stone-700 flex items-center gap-1"
            >
              <FileQuestion className="w-3.5 h-3.5 text-amber-600" />
              <span>Specific Question or Concern (Optional)</span>
            </label>
            {userFocus && (
              <button
                type="button"
                onClick={() => setUserFocus('')}
                className="text-[11px] text-stone-600 hover:text-stone-800"
              >
                Clear
              </button>
            )}
          </div>
          <input
            id="user-focus-input"
            type="text"
            value={userFocus}
            onChange={(e) => setUserFocus(e.target.value)}
            placeholder="e.g., Do I have to pay this right now? What happens if I ignore this? Is this legal?"
            className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-900 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      )}

      {/* Main Input Body */}
      <div className="p-4 sm:p-6">
        {inputMode === 'text' ? (
          <div>
            <div className="relative">
              <textarea
                id="text-input-area"
                rows={8}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste confusing real-world information here...

Examples:
• Medical bills or cryptic Explanation of Benefits (EOB)
• Formal landlord lease notices, rent hikes, or vacate warnings
• Municipal citations, parking tickets, or penalty letters
• Contractor service agreements, non-competes, or IP clauses
• Complex terms of service, utility notices, or debt collections"
                className="w-full p-3.5 text-sm text-stone-900 placeholder:text-stone-600 border border-stone-200 rounded-xl bg-stone-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono transition-all leading-relaxed"
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs text-stone-600">
              <div className="flex items-center gap-3">
                <span>{charCount.toLocaleString()} characters</span>
                <span className="w-1 h-1 rounded-full bg-stone-300" />
                <span>{wordCount.toLocaleString()} words</span>
              </div>
              {textInput && (
                <button
                  id="btn-clear-text"
                  type="button"
                  onClick={() => setTextInput('')}
                  className="text-stone-600 hover:text-stone-800 font-medium"
                >
                  Clear text
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Image Upload Mode */
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            {!imageFile ? (
              <div
                id="image-drop-zone"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
                    : 'border-stone-200 hover:border-indigo-400 bg-stone-50/50 hover:bg-stone-50'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3.5 shadow-2xs">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-stone-800 mb-1">
                  Upload an image of your document
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4 leading-relaxed">
                  Drag and drop, click to browse, or simply press <kbd className="px-1.5 py-0.5 bg-stone-200 rounded text-[10px] font-mono text-stone-700">Ctrl+V</kbd> / <kbd className="px-1.5 py-0.5 bg-stone-200 rounded text-[10px] font-mono text-stone-700">⌘+V</kbd> to paste a screenshot.
                </p>
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50">
                  <FileCheck2 className="w-4 h-4 text-indigo-600" />
                  <span>Select Image (PNG, JPG, WEBP)</span>
                </div>
              </div>
            ) : (
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/40">
                <div className="flex items-start gap-4">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-lg overflow-hidden border border-stone-200 bg-black/5 shrink-0 flex items-center justify-center relative group">
                    <img
                      src={imageFile.data}
                      alt="Uploaded document preview"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        Ready to analyze
                      </span>
                      <button
                        id="btn-remove-image"
                        type="button"
                        onClick={() => setImageFile(null)}
                        className="p-1 rounded-md text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm font-medium text-stone-900 truncate mt-2">
                      {imageFile.name}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {(imageFile.size / 1024).toFixed(1)} KB • {imageFile.mimeType}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                      >
                        Choose different image
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Button Row */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-stone-100">
          <div className="text-xs text-stone-500">
            {inputMode === 'text'
              ? 'Paste any messy bill, notice, or agreement to decode it.'
              : 'Ensure text in the image is reasonably legible for best accuracy.'}
          </div>

          <button
            id="btn-analyze-submit"
            type="button"
            disabled={!canSubmit}
            onClick={onAnalyze}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm ${
              canSubmit
                ? 'bg-stone-900 hover:bg-stone-800 text-white cursor-pointer active:scale-[0.99] shadow-stone-300'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>
                  {inputMode === 'text' ? 'Analyze Document' : 'Analyze Image'}
                </span>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
