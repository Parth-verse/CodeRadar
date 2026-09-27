import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  FileCode, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  Terminal, 
  Check, 
  MessageSquare,
  Wrench
} from 'lucide-react';

export default function FindingDetailModal({
  finding,
  onClose,
  onOpenInCodeViewer,
  onAskGemini,
  onToggleResolve,
  isResolved = false,
  apiKey
}) {
  if (!finding) return null;

  const [geminiExplanation, setGeminiExplanation] = useState(null);
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);
  const [copiedFix, setCopiedFix] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchGeminiExplanation() {
      setIsLoadingGemini(true);
      try {
        const res = await fetch('/api/gemini/explain-finding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            finding,
            codeSnippet: finding.codeSnippet || '',
            apiKey
          })
        });
        const data = await res.json();
        if (isMounted) setGeminiExplanation(data);
      } catch (e) {
        console.error("Failed to load Gemini explanation:", e);
      } finally {
        if (isMounted) setIsLoadingGemini(false);
      }
    }

    fetchGeminiExplanation();
    return () => { isMounted = false; };
  }, [finding, apiKey]);

  const handleCopyFix = () => {
    navigator.clipboard.writeText(finding.suggestedFix || '');
    setCopiedFix(true);
    setTimeout(() => setCopiedFix(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#111820] border border-[#21262D] rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-[#21262D] bg-[#161E27] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
              finding.severity === 'critical'
                ? 'bg-[#F85149]/15 text-[#F85149] border border-[#F85149]/30'
                : finding.severity === 'high'
                ? 'bg-[#D29922]/15 text-[#D29922] border border-[#D29922]/30'
                : 'bg-[#58A6FF]/15 text-[#58A6FF] border border-[#58A6FF]/30'
            }`}>
              {finding.severity} Severity
            </span>
            <div className="flex items-center gap-1 text-xs font-mono text-[#8B949E] bg-[#0B0F14] px-2 py-0.5 rounded border border-[#21262D]">
              <FileCode className="w-3.5 h-3.5 text-[#58A6FF]" />
              <span>{finding.file}:{finding.line}</span>
            </div>
            <span className="text-xs text-[#8B949E] capitalize">
              Domain: {finding.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Finding Title & Overview */}
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#E6EDF3] leading-snug">
              {finding.title}
            </h2>
          </div>

          {/* Section: What CodeRadar Found */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8B949E]">
              What CodeRadar Found
            </h4>
            <div className="p-3 rounded-lg bg-[#161E27] border border-[#21262D] text-[#E6EDF3] leading-relaxed">
              {finding.description}
            </div>
          </div>

          {/* Section: Why It Matters */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8B949E]">
              Why It Matters
            </h4>
            <div className="p-3 rounded-lg bg-[#161E27] border border-[#21262D] text-[#E6EDF3] leading-relaxed">
              {finding.whyItMatters}
            </div>
          </div>

          {/* Section: Evidence (Code Snippet) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8B949E]">
                Evidence (Snippet)
              </h4>
              <span className="text-[11px] font-mono text-[#8B949E]">{finding.file}</span>
            </div>
            <div className="p-3.5 rounded-lg bg-[#0B0F14] border border-[#21262D] font-mono text-[11px] text-[#E6EDF3] overflow-x-auto whitespace-pre leading-relaxed">
              {finding.codeSnippet}
            </div>
          </div>

          {/* Section: Gemini AI Analysis & Reasoning */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#161E27] to-[#111820] border border-[#58A6FF]/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#58A6FF]">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold text-xs uppercase tracking-wider">
                  Gemini Deep Reasoning & Root Cause
                </span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#58A6FF]/10 text-[#58A6FF] border border-[#58A6FF]/20">
                Gemini 1.5 Flash
              </span>
            </div>

            {isLoadingGemini ? (
              <div className="py-4 text-center text-[#8B949E] animate-pulse">
                Gemini reasoning over codebase context...
              </div>
            ) : geminiExplanation ? (
              <div className="space-y-2.5 text-xs text-[#E6EDF3]">
                <p className="leading-relaxed">
                  {geminiExplanation.summary}
                </p>
                {geminiExplanation.rootCauseAnalysis && (
                  <div className="pt-2 border-t border-[#21262D]">
                    <span className="font-semibold text-[#8B949E] block mb-0.5">Root Cause:</span>
                    <p className="text-[#8B949E] leading-relaxed">
                      {geminiExplanation.rootCauseAnalysis}
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Section: Suggested Fix */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3FB950] flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                <span>Suggested Remediation</span>
              </h4>
              <button
                onClick={handleCopyFix}
                className="text-[11px] text-[#8B949E] hover:text-[#E6EDF3] flex items-center gap-1 transition"
              >
                {copiedFix ? <Check className="w-3 h-3 text-[#3FB950]" /> : null}
                <span>{copiedFix ? 'Copied!' : 'Copy Fix'}</span>
              </button>
            </div>
            <div className="p-3 rounded-lg bg-[#0B0F14] border border-[#21262D] font-mono text-[11px] text-[#3FB950] whitespace-pre-wrap">
              {finding.suggestedFix}
            </div>
          </div>

          {/* Section: How to Verify */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8B949E] flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#58A6FF]" />
              <span>How to Verify</span>
            </h4>
            <div className="p-3 rounded-lg bg-[#161E27] border border-[#21262D] text-[#8B949E] leading-relaxed">
              {finding.verification}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#21262D] bg-[#161E27] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onOpenInCodeViewer(finding.file, finding.line);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] font-medium text-xs transition"
            >
              <FileCode className="w-3.5 h-3.5 text-[#58A6FF]" />
              <span>Open in Code Viewer</span>
            </button>

            <button
              onClick={() => {
                onAskGemini(`How do I resolve this issue: "${finding.title}" in ${finding.file}?`);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#58A6FF]/15 hover:bg-[#58A6FF]/25 border border-[#58A6FF]/40 text-[#58A6FF] font-medium text-xs transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Gemini</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleResolve(finding.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                isResolved
                  ? 'bg-[#3FB950]/20 text-[#3FB950] border border-[#3FB950]/40'
                  : 'bg-[#3FB950] hover:bg-[#349c43] text-white shadow-sm'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isResolved ? 'Mark as Unresolved' : 'Simulate Fix & Resolve'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
