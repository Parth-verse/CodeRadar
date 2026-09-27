import React from 'react';
import {
  LayoutDashboard,
  AlertTriangle,
  FileCode,
  Network,
  TestTube2,
  Package,
  ShieldAlert,
  GitPullRequest,
  Bug,
  Compass,
  MessageSquareCode,
  Layers,
  FileText
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  findingsCount = 0,
  criticalCount = 0,
  isOpen = false,
  onCloseMobile,
  onOpenExportReport
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'findings', label: 'Findings', icon: AlertTriangle, badge: findingsCount, badgeColor: criticalCount > 0 ? 'bg-[#F85149]' : 'bg-[#D29922]' },
    { id: 'code-viewer', label: 'Code Viewer', icon: FileCode },
    { id: 'explainer', label: 'Explain Codebase', icon: Layers, highlight: true },
    { id: 'architecture', label: 'Architecture', icon: Network },
    { id: 'testing', label: 'Testing Health', icon: TestTube2 },
    { id: 'dependencies', label: 'Dependencies', icon: Package },
    { id: 'security', label: 'Security Scan', icon: ShieldAlert },
    { id: 'debt', label: 'Technical Debt', icon: GitPullRequest },
    { id: 'investigate', label: 'Bug Investigator', icon: Bug },
    { id: 'onboarding', label: "I'm New Here", icon: Compass },
    { id: 'ask', label: 'Ask CodeRadar', icon: MessageSquareCode },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#111820] border-r border-[#21262D] flex flex-col justify-between shrink-0 select-none transition-transform duration-200 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="py-4 overflow-y-auto">
          <div className="px-4 mb-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8B949E]">
              Codebase Radar
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#161E27] text-[#58A6FF] border border-[#21262D]">
              v1.0
            </span>
          </div>

          <nav className="space-y-0.5 px-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#161E27] text-[#58A6FF] border border-[#30363D]'
                      : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#161E27]/60'
                  } ${item.highlight && !isActive ? 'text-indigo-400 hover:text-indigo-300' : ''}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#58A6FF]' : item.highlight ? 'text-indigo-400' : 'text-[#8B949E]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full text-white font-bold ${item.badgeColor || 'bg-[#21262D]'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Report Export & Engine Telemetry */}
        <div className="p-3 border-t border-[#21262D] space-y-2">
          {onOpenExportReport && (
            <button
              onClick={() => {
                onOpenExportReport();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-[#161E27] hover:bg-[#21262D] border border-[#21262D] text-xs text-[#E6EDF3] transition"
            >
              <FileText className="w-3.5 h-3.5 text-[#58A6FF]" />
              <span>Export Audit Report</span>
            </button>
          )}

          <div className="p-2.5 rounded-lg bg-[#161E27]/60 border border-[#21262D]">
            <div className="flex items-center gap-2 text-xs text-[#8B949E]">
              <span className="w-2 h-2 rounded-full bg-[#3FB950] animate-pulse" />
              <span className="font-mono text-[11px]">Gemini Reasoning Active</span>
            </div>
            <p className="text-[10px] text-[#8B949E] mt-1 leading-tight">
              Deterministic AST checks + Gemini pair intelligence
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
