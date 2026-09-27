import React, { useState } from 'react';
import { X, Download, Copy, Check, FileText, ShieldAlert, Sparkles } from 'lucide-react';

export default function AuditReportModal({ isOpen, onClose, report }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !report) return null;

  const markdownReport = `# CodeRadar Codebase Intelligence Audit Report
**Repository:** ${report.repository?.name || 'pulsecart/platform-core'}
**Branch:** ${report.repository?.branch || 'main'}
**Scanned At:** ${report.repository?.scannedAt || new Date().toISOString()}

---

## 📊 Executive Summary
- **CodeRadar Health Score:** ${report.healthScore} / 100 (${report.statusText})
- **Total Files Analyzed:** ${report.metrics?.totalFiles || 0}
- **Lines of Code:** ~${report.metrics?.totalLinesOfCode || 0}
- **High / Critical Risks:** ${(report.metrics?.criticalCount || 0) + (report.metrics?.highCount || 0)}
- **Edge-Case Test Coverage:** ${report.testing?.coverageRate || 0}%

### Category Breakdown:
- 🔐 Security: ${report.categoryScores?.security || 0} / 100
- 🐛 Bugs & Reliability: ${report.categoryScores?.bugs || 0} / 100
- 🧹 Code Quality: ${report.categoryScores?.quality || 0} / 100
- 🧪 Testing Health: ${report.categoryScores?.testing || 0} / 100
- 📦 Dependencies: ${report.categoryScores?.dependencies || 0} / 100
- 🏗 Architecture & Coupling: ${report.categoryScores?.architecture || 0} / 100

---

## 🚨 Priority Findings
${(report.findings || []).map((f, i) => `### ${i + 1}. [${f.severity.toUpperCase()}] ${f.title}
- **File:** \`${f.file}:${f.line}\`
- **Category:** ${f.category}
- **Issue:** ${f.description}
- **Impact:** ${f.whyItMatters}
- **Remediation:** \`${f.suggestedFix}\`
- **Verification:** ${f.verification}
`).join('\n')}

---
*Report generated automatically by CodeRadar &mdash; "Scan your code. Spot the risks. Ship with confidence."*
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coderadar-audit-${report.repository?.name?.replace('/', '-') || 'report'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111820] border border-[#21262D] rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#21262D] pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#58A6FF]" />
            <div>
              <h3 className="text-sm font-bold text-[#E6EDF3]">Export CodeRadar Audit Report</h3>
              <p className="text-[11px] text-[#8B949E]">Shareable Markdown report with executive scores and remediations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Container */}
        <div className="p-3.5 rounded-lg bg-[#0B0F14] border border-[#21262D] font-mono text-[11px] text-[#8B949E] overflow-auto max-h-[360px] whitespace-pre leading-relaxed select-text">
          {markdownReport}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg bg-[#161E27] hover:bg-[#21262D] text-[#E6EDF3] text-xs font-medium border border-[#21262D] flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#3FB950]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied to Clipboard!" : "Copy Markdown"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-lg bg-[#58A6FF] hover:bg-[#4094f7] text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
