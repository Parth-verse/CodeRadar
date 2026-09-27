import React from 'react';
import { ShieldAlert, ShieldCheck, Key, Lock, FileCode, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function SecurityScan({ findings = [], onSelectFinding }) {
  const secFindings = findings.filter(f => f.category === 'security');
  const criticalCount = secFindings.filter(f => f.severity === 'critical').length;
  const highCount = secFindings.filter(f => f.severity === 'high').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#E6EDF3]">Security & Secret Exposure Scan</h2>
        <p className="text-xs text-[#8B949E] mt-0.5">
          Deterministic regex secret detection with automated masking and .gitignore audit.
        </p>
      </div>

      {/* Security Status Card */}
      <div className="bg-[#111820] border border-[#21262D] rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#F85149]/15 border border-[#F85149]/30 flex items-center justify-center text-[#F85149]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#E6EDF3]">
                {secFindings.length > 0 ? "Potential Security Findings Detected" : "No Credential Leaks Discovered"}
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F85149]/15 text-[#F85149] border border-[#F85149]/30">
                {criticalCount} Critical
              </span>
            </div>
            <p className="text-xs text-[#8B949E] mt-0.5">
              All identified secrets are automatically masked in the UI to prevent credential leakage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-xs text-[#8B949E] block">High / Critical Alerts</span>
            <span className="text-lg font-mono font-bold text-[#F85149]">{criticalCount + highCount}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#8B949E] block">Total Security Items</span>
            <span className="text-lg font-mono font-bold text-[#E6EDF3]">{secFindings.length}</span>
          </div>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8B949E] block">
          Detected Security Findings
        </span>

        {secFindings.map(finding => (
          <div
            key={finding.id}
            onClick={() => onSelectFinding(finding)}
            className="p-4 rounded-xl bg-[#111820] hover:bg-[#161E27] border border-[#21262D] hover:border-[#30363D] transition cursor-pointer space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F85149]/15 text-[#F85149] font-bold border border-[#F85149]/30">
                    {finding.severity}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-mono text-[#8B949E] bg-[#0B0F14] px-2 py-0.5 rounded border border-[#21262D]">
                    <FileCode className="w-3 h-3 text-[#58A6FF]" />
                    <span>{finding.file}:{finding.line}</span>
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-[#E6EDF3]">{finding.title}</h4>
                <p className="text-xs text-[#8B949E]">{finding.description}</p>
              </div>

              <button className="text-xs text-[#58A6FF] hover:underline flex items-center gap-1 shrink-0">
                <span>Remediate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Masked Snippet Box */}
            <div className="p-2.5 rounded-lg bg-[#0B0F14] border border-[#21262D] font-mono text-[11px] text-[#8B949E] overflow-x-auto truncate">
              {finding.codeSnippet}
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#8B949E] pt-1">
              <span>Why: {finding.whyItMatters}</span>
              <span className="text-[#3FB950] font-mono">Verified Heuristic</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
