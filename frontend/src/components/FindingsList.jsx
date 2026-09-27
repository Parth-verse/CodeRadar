import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Bug, 
  Sparkles, 
  TestTube2, 
  Package, 
  Network, 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckCircle,
  FileCode
} from 'lucide-react';

export default function FindingsList({
  findings = [],
  selectedCategory,
  onSelectCategory,
  onSelectFinding,
  resolvedFindingIds = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All Findings' },
    { id: 'security', label: '🔐 Security' },
    { id: 'bugs', label: '🐛 Bugs' },
    { id: 'quality', label: '🧹 Quality' },
    { id: 'testing', label: '🧪 Testing' },
    { id: 'architecture', label: '🏗 Architecture' },
    { id: 'dependencies', label: '📦 Dependencies' }
  ];

  const filtered = findings.filter(f => {
    // Category match
    if (selectedCategory && selectedCategory !== 'all' && f.category !== selectedCategory) {
      return false;
    }
    // Severity match
    if (severityFilter !== 'all' && f.severity !== severityFilter) {
      return false;
    }
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        f.title.toLowerCase().includes(q) ||
        f.file.toLowerCase().includes(q) ||
        (f.description && f.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#E6EDF3]">Repository Findings</h2>
          <p className="text-xs text-[#8B949E] mt-0.5">
            Static heuristic detections enriched with Gemini root-cause explanations.
          </p>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8B949E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search findings or files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg bg-[#161E27] border border-[#21262D] text-xs text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:border-[#58A6FF] w-64"
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#161E27] border border-[#21262D] text-xs text-[#E6EDF3] focus:outline-none focus:border-[#58A6FF]"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[#21262D]">
        {categories.map(cat => {
          const isActive = (selectedCategory || 'all') === cat.id;
          const count = cat.id === 'all' 
            ? findings.length 
            : findings.filter(f => f.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-medium border-b-2 transition whitespace-nowrap ${
                isActive
                  ? 'border-[#58A6FF] text-[#58A6FF] bg-[#161E27]'
                  : 'border-transparent text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#161E27]/50'
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#21262D] text-[#8B949E]">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Findings Cards List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-[#111820] border border-[#21262D] rounded-xl">
            <CheckCircle className="w-8 h-8 text-[#3FB950] mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-[#E6EDF3]">No findings in this view</h4>
            <p className="text-xs text-[#8B949E] mt-1">
              Either this category passed inspection or search filters excluded matches.
            </p>
          </div>
        ) : (
          filtered.map(finding => {
            const isResolved = resolvedFindingIds.includes(finding.id);

            return (
              <div
                key={finding.id}
                onClick={() => onSelectFinding(finding)}
                className={`p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isResolved
                    ? 'bg-[#111820]/50 border-[#21262D] opacity-60'
                    : 'bg-[#111820] hover:bg-[#161E27] border-[#21262D] hover:border-[#30363D]'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Severity Pill */}
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                      finding.severity === 'critical'
                        ? 'bg-[#F85149]/15 text-[#F85149] border border-[#F85149]/30'
                        : finding.severity === 'high'
                        ? 'bg-[#D29922]/15 text-[#D29922] border border-[#D29922]/30'
                        : finding.severity === 'medium'
                        ? 'bg-[#58A6FF]/15 text-[#58A6FF] border border-[#58A6FF]/30'
                        : 'bg-[#8B949E]/15 text-[#8B949E] border border-[#8B949E]/30'
                    }`}>
                      {finding.severity}
                    </span>

                    {/* File location */}
                    <div className="flex items-center gap-1 text-xs font-mono text-[#8B949E] bg-[#0B0F14] px-2 py-0.5 rounded border border-[#21262D]">
                      <FileCode className="w-3 h-3 text-[#58A6FF]" />
                      <span>{finding.file}:{finding.line}</span>
                    </div>

                    {isResolved && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3FB950]/15 text-[#3FB950] border border-[#3FB950]/30 font-bold">
                        Resolved
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-[#E6EDF3] leading-snug">
                    {finding.title}
                  </h3>

                  <p className="text-xs text-[#8B949E] line-clamp-2">
                    {finding.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs font-medium text-[#58A6FF] hover:underline flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
