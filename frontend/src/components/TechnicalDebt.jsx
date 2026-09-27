import React, { useState, useEffect } from 'react';
import { GitPullRequest, Sparkles, CheckCircle2, ArrowRight, ShieldAlert, Layers, Clock } from 'lucide-react';

export default function TechnicalDebt({ findings = [], onSelectFinding, apiKey }) {
  const [debtData, setDebtData] = useState(null);
  const [isLoadingDebt, setIsLoadingDebt] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchTechDebt() {
      setIsLoadingDebt(true);
      try {
        const res = await fetch('/api/gemini/tech-debt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ findings, apiKey })
        });
        const data = await res.json();
        if (isMounted) setDebtData(data);
      } catch (e) {
        console.error("Failed to load tech debt prioritization:", e);
      } finally {
        if (isMounted) setIsLoadingDebt(false);
      }
    }

    fetchTechDebt();
    return () => { isMounted = false; };
  }, [findings, apiKey]);

  const highPriority = debtData?.recommendations?.filter(r => r.priority === 'High') || [];
  const mediumPriority = debtData?.recommendations?.filter(r => r.priority === 'Medium') || [];
  const lowPriority = debtData?.recommendations?.filter(r => r.priority === 'Low') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#E6EDF3]">Technical Debt Prioritization</h2>
        <p className="text-xs text-[#8B949E] mt-0.5">
          Gemini-calculated remediation roadmap based on risk severity, architectural blast radius, and engineering effort.
        </p>
      </div>

      {/* Strategic Summary Box */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-[#161E27] to-[#111820] border border-[#58A6FF]/30 space-y-2">
        <div className="flex items-center gap-2 text-[#58A6FF]">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Gemini Strategic Triage: "What Should I Fix First?"
          </span>
        </div>
        <p className="text-xs text-[#E6EDF3] leading-relaxed">
          {isLoadingDebt 
            ? "Gemini is ranking technical debt against operational risk and architectural coupling..."
            : debtData?.topPrioritySummary || "Remediate credentials and .gitignore gaps first, followed by unhandled error boundaries."
          }
        </p>
      </div>

      {/* Priority Groups */}
      <div className="space-y-5">
        {/* 1. High Priority */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F85149]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F85149]">
              High Priority &mdash; Immediate Action Advised
            </h3>
          </div>

          <div className="space-y-2">
            {highPriority.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#111820] border border-[#21262D] hover:border-[#30363D] transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#E6EDF3]">{item.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F85149]/15 text-[#F85149]">
                      Impact: {item.impact}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#161E27] text-[#8B949E]">
                      Effort: {item.effort}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#8B949E] leading-relaxed">{item.reasoning}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Medium Priority */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D29922]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D29922]">
              Medium Priority &mdash; Reliability & Modular Decoupling
            </h3>
          </div>

          <div className="space-y-2">
            {mediumPriority.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#111820] border border-[#21262D] hover:border-[#30363D] transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#E6EDF3]">{item.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#D29922]/15 text-[#D29922]">
                      Impact: {item.impact}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#161E27] text-[#8B949E]">
                      Effort: {item.effort}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#8B949E] leading-relaxed">{item.reasoning}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Low Priority */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3FB950]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3FB950]">
              Low Priority &mdash; Maintenance & Performance Optimization
            </h3>
          </div>

          <div className="space-y-2">
            {lowPriority.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#111820] border border-[#21262D] hover:border-[#30363D] transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#E6EDF3]">{item.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#3FB950]/15 text-[#3FB950]">
                      Impact: {item.impact}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#161E27] text-[#8B949E]">
                      Effort: {item.effort}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#8B949E] leading-relaxed">{item.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
