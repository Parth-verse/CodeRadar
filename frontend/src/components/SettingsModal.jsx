import React, { useState } from 'react';
import { X, Key, Sparkles, Check, AlertCircle } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey
}) {
  const [tempKey, setTempKey] = useState(apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(tempKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111820] border border-[#21262D] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#21262D] pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#58A6FF]" />
            <h3 className="text-sm font-bold text-[#E6EDF3]">CodeRadar Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-xs text-[#E6EDF3] font-semibold flex items-center justify-between">
              <span>Google Gemini API Key</span>
              <span className="text-[10px] text-[#8B949E] font-normal">Optional / Fallback Ready</span>
            </label>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="AIzaSy***********************************"
              className="w-full p-2.5 rounded-lg bg-[#0B0F14] border border-[#21262D] font-mono text-xs text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:border-[#58A6FF]"
            />
            <p className="text-[11px] text-[#8B949E] leading-relaxed">
              If left blank, CodeRadar automatically operates in deterministic static + realistic heuristic reasoning mode so you can demo immediately without entering keys.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#161E27] border border-[#21262D] space-y-1">
            <div className="flex items-center gap-1.5 text-[#58A6FF] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Active Model Engine</span>
            </div>
            <p className="text-[11px] text-[#8B949E]">
              Gemini 1.5 Flash &bull; Context Window: 1M tokens &bull; Code AST Reasoning
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setTempKey('');
                onSaveApiKey('');
              }}
              className="text-xs text-[#8B949E] hover:text-[#F85149] transition"
            >
              Clear Key
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#58A6FF] hover:bg-[#4094f7] text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5 text-white" /> : null}
              <span>{savedSuccess ? "Saved!" : "Save Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
