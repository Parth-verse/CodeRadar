import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, BookOpen, FileCode, CheckCircle2, ArrowRight } from 'lucide-react';

export default function NewDevOnboarding({ files = [], onSelectFile, apiKey }) {
  const [onboardingData, setOnboardingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchOnboarding() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/gemini/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ files, apiKey })
        });
        const data = await res.json();
        if (isMounted) setOnboardingData(data);
      } catch (e) {
        console.error("Failed to load onboarding:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchOnboarding();
    return () => { isMounted = false; };
  }, [files, apiKey]);

  const readingList = onboardingData?.readingList || [
    { path: "README.md", reason: "Project architecture and high-level boundaries" },
    { path: "src/config/firebase.js", reason: "Client credentials and service initialization" },
    { path: "src/services/authService.js", reason: "User sessions and authentication gateway" },
    { path: "src/services/orderService.js", reason: "Core checkout transaction orchestration" },
    { path: "src/routes/api.js", reason: "Backend HTTP route handlers" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
          <h2 className="text-xl font-bold tracking-tight text-[#E6EDF3]">New Developer Onboarding Guide</h2>
        </div>
        <p className="text-xs text-[#8B949E] mt-0.5">
          "I'm new here" &mdash; Gemini-generated orientation guide, reading order, and architectural mental models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recommended "Start Here" Reading Order */}
        <div className="lg:col-span-5 bg-[#111820] border border-[#21262D] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8B949E]">
              "Start Here" Reading Order
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Curated Sequence
            </span>
          </div>

          <div className="space-y-2">
            {readingList.map((item, idx) => (
              <div
                key={item.path}
                onClick={() => onSelectFile && onSelectFile(item.path)}
                className="p-3 rounded-lg bg-[#161E27] hover:bg-[#21262D] border border-[#21262D] hover:border-[#30363D] cursor-pointer transition flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="font-mono text-xs font-bold text-[#E6EDF3] truncate">
                    {item.path}
                  </div>
                  <p className="text-[11px] text-[#8B949E] leading-snug">
                    {item.reason}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#8B949E] shrink-0 self-center" />
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-[#0B0F14] border border-[#21262D] text-xs text-[#8B949E] space-y-1">
            <span className="font-semibold text-[#E6EDF3] block">Mentor Tip:</span>
            <p className="text-[11px] leading-relaxed">
              Read in this exact sequential order to understand how identity passes from UI views to transaction services without getting overwhelmed by tangential utilities.
            </p>
          </div>
        </div>

        {/* Right Column: Full Markdown Onboarding Guide from Gemini */}
        <div className="lg:col-span-7 bg-[#111820] border border-[#21262D] rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Architectural Mental Models
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161E27] text-indigo-400 border border-[#21262D]">
                Gemini Onboarding Synthesis
              </span>
            </div>

            {isLoading ? (
              <div className="p-12 text-center text-[#8B949E] space-y-2 animate-pulse">
                <Sparkles className="w-6 h-6 text-indigo-400 mx-auto" />
                <p className="text-xs">Gemini synthesizing onboarding roadmap for new engineers...</p>
              </div>
            ) : onboardingData?.markdown ? (
              <div className="p-4 rounded-lg bg-[#0B0F14] border border-[#21262D] text-xs text-[#E6EDF3] space-y-3 leading-relaxed max-h-[480px] overflow-y-auto whitespace-pre-line font-mono">
                {onboardingData.markdown}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
