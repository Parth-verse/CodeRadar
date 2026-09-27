import React from 'react';
import RadarChart from './RadarChart.jsx';
import { 
  ShieldAlert, 
  Bug, 
  Sparkles, 
  TestTube2, 
  Package, 
  Network, 
  FileCode, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Layers
} from 'lucide-react';

export default function Dashboard({
  report,
  rescanDelta,
  onCategorySelect,
  onSelectFinding,
  onNavigateToTab
}) {
  if (!report) return null;

  const {
    healthScore,
    statusText,
    statusColor,
    categoryScores = {},
    findings = [],
    metrics = {},
    repository = {}
  } = report;

  const criticalFindings = findings.filter(f => f.severity === 'critical' || f.severity === 'high');

  return (
    <div className="space-y-6">
      {/* Rescan Improvement Banner (if active) */}
      {rescanDelta && (
        <div className="p-4 rounded-xl bg-[#161E27] border border-[#3FB950]/50 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#3FB950]/15 border border-[#3FB950]/30 flex items-center justify-center text-[#3FB950]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#3FB950]">
                  Health Improved by +{rescanDelta.scoreDiff} Points!
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#3FB950]/20 text-[#3FB950] font-mono">
                  {rescanDelta.previousScore} &rarr; {rescanDelta.newScore} / 100
                </span>
              </div>
              <p className="text-xs text-[#8B949E] mt-0.5">
                Successfully resolved {rescanDelta.resolvedFindings?.length || 0} findings including critical credential risks.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('findings')}
            className="text-xs px-3 py-1.5 rounded-md bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] transition"
          >
            View Remaining Issues
          </button>
        </div>
      )}

      {/* Main Top Grid: Health Card + Radar Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: CodeRadar Health Score Card */}
        <div className="lg:col-span-5 bg-[#111820] border border-[#21262D] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8B949E]">
                Repository Health
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                statusColor === 'success' 
                  ? 'bg-[#3FB950]/15 text-[#3FB950] border border-[#3FB950]/30' 
                  : statusColor === 'warning'
                  ? 'bg-[#D29922]/15 text-[#D29922] border border-[#D29922]/30'
                  : 'bg-[#F85149]/15 text-[#F85149] border border-[#F85149]/30'
              }`}>
                {statusText}
              </span>
            </div>

            <div className="my-5 flex items-baseline gap-3">
              <span className={`text-6xl font-mono font-extrabold tracking-tight ${
                healthScore >= 80 ? 'text-[#3FB950]' : healthScore >= 65 ? 'text-[#D29922]' : 'text-[#F85149]'
              }`}>
                {healthScore}
              </span>
              <span className="text-xl text-[#8B949E] font-mono">/ 100</span>
            </div>

            {/* Crucial Heuristic Disclaimer Label */}
            <div className="p-2.5 rounded-lg bg-[#161E27] border border-[#21262D] text-xs text-[#8B949E] space-y-1">
              <div className="font-semibold text-[#E6EDF3] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#58A6FF]" />
                <span>CodeRadar Health Score</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Heuristic score computed from deterministic security checks, code smells, test edge-case coverage, and architectural coupling. Not an objective code quality standard.
              </p>
            </div>
          </div>

          {/* Category Scores Breakdown */}
          <div className="mt-5 space-y-2 pt-4 border-t border-[#21262D]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8B949E]">
              Category Breakdown
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => onCategorySelect('bugs')}
                className="flex items-center justify-between p-2 rounded bg-[#161E27] hover:bg-[#21262D] transition border border-[#21262D]"
              >
                <span className="text-[#8B949E]">🐛 Bugs</span>
                <span className="font-mono font-bold text-[#E6EDF3]">{categoryScores.bugs}</span>
              </button>
              <button 
                onClick={() => onCategorySelect('security')}
                className="flex items-center justify-between p-2 rounded bg-[#161E27] hover:bg-[#21262D] transition border border-[#21262D]"
              >
                <span className="text-[#8B949E]">🔐 Security</span>
                <span className="font-mono font-bold text-[#E6EDF3]">{categoryScores.security}</span>
              </button>
              <button 
                onClick={() => onCategorySelect('quality')}
                className="flex items-center justify-between p-2 rounded bg-[#161E27] hover:bg-[#21262D] transition border border-[#21262D]"
              >
                <span className="text-[#8B949E]">🧹 Code Quality</span>
                <span className="font-mono font-bold text-[#E6EDF3]">{categoryScores.quality}</span>
              </button>
              <button 
                onClick={() => onCategorySelect('testing')}
                className="flex items-center justify-between p-2 rounded bg-[#161E27] hover:bg-[#21262D] transition border border-[#21262D]"
              >
                <span className="text-[#8B949E]">🧪 Testing</span>
                <span className="font-mono font-bold text-[#E6EDF3]">{categoryScores.testing}</span>
              </button>
              <button 
                onClick={() => onCategorySelect('dependencies')}
                className="flex items-center justify-between p-2 rounded bg-[#161E27] hover:bg-[#21262D] transition border border-[#21262D]"
              >
                <span className="text-[#8B949E]">📦 Dependencies</span>
                <span className="font-mono font-bold text-[#E6EDF3]">{categoryScores.dependencies}</span>
              </button>
              <button 
                onClick={() => onCategorySelect('architecture')}
                className="flex items-center justify-between p-2 rounded bg-[#161E27] hover:bg-[#21262D] transition border border-[#21262D]"
              >
                <span className="text-[#8B949E]">🏗 Architecture</span>
                <span className="font-mono font-bold text-[#E6EDF3]">{categoryScores.architecture}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Signature Repository Radar Chart */}
        <div className="lg:col-span-7">
          <RadarChart 
            scores={categoryScores} 
            onCategoryClick={(cat) => onCategorySelect(cat)} 
          />
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#111820] border border-[#21262D] p-4 rounded-xl">
          <span className="text-xs text-[#8B949E]">Analyzed Files</span>
          <div className="text-2xl font-mono font-bold text-[#E6EDF3] mt-1">
            {metrics.totalFiles || 0}
          </div>
          <span className="text-[11px] text-[#8B949E]">~{metrics.totalLinesOfCode || 0} lines of code</span>
        </div>

        <div className="bg-[#111820] border border-[#21262D] p-4 rounded-xl">
          <span className="text-xs text-[#8B949E]">Total Findings</span>
          <div className="text-2xl font-mono font-bold text-[#E6EDF3] mt-1">
            {metrics.findingsCount || 0}
          </div>
          <span className="text-[11px] text-[#8B949E]">Across 6 radar domains</span>
        </div>

        <div className="bg-[#111820] border border-[#21262D] p-4 rounded-xl">
          <span className="text-xs text-[#8B949E]">High / Critical Risks</span>
          <div className="text-2xl font-mono font-bold text-[#F85149] mt-1">
            {(metrics.criticalCount || 0) + (metrics.highCount || 0)}
          </div>
          <span className="text-[11px] text-[#F85149]">Immediate action advised</span>
        </div>

        <div className="bg-[#111820] border border-[#21262D] p-4 rounded-xl">
          <span className="text-xs text-[#8B949E]">Edge-Case Test Coverage</span>
          <div className="text-2xl font-mono font-bold text-[#D29922] mt-1">
            {report.testing?.coverageRate || 22}%
          </div>
          <span className="text-[11px] text-[#8B949E]">7 edge cases missing</span>
        </div>
      </div>

      {/* Prioritized Critical Attention Section */}
      <div className="bg-[#111820] border border-[#21262D] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#F85149]" />
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#E6EDF3]">
              Critical Attention Items
            </h3>
          </div>
          <button
            onClick={() => onNavigateToTab('findings')}
            className="text-xs text-[#58A6FF] hover:underline flex items-center gap-1"
          >
            <span>View all findings ({findings.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {criticalFindings.slice(0, 4).map(finding => (
            <div
              key={finding.id}
              onClick={() => onSelectFinding(finding)}
              className="p-3.5 rounded-lg bg-[#161E27] hover:bg-[#1a2430] border border-[#21262D] hover:border-[#30363D] cursor-pointer transition flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    finding.severity === 'critical' ? 'bg-[#F85149]' : 'bg-[#D29922]'
                  }`} />
                  <span className="text-xs font-semibold text-[#E6EDF3]">{finding.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0B0F14] text-[#8B949E] border border-[#21262D]">
                    {finding.file}:{finding.line}
                  </span>
                </div>
                <p className="text-xs text-[#8B949E] line-clamp-1">
                  {finding.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#21262D] text-[#58A6FF]">
                  Gemini Ready
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#8B949E]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
