import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  MessageSquare, 
  Settings, 
  GitBranch, 
  Terminal, 
  FileText, 
  Menu,
  Palette,
  Check
} from 'lucide-react';

export default function Navbar({
  repoInfo = {},
  isScanning = false,
  onRescan,
  onOpenAskRadar,
  onOpenSettings,
  onOpenScanModal,
  onOpenExportReport,
  onToggleMobileMenu
}) {
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem('coderadar_theme') || 'cyber-cyan'
  );
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('coderadar_theme', currentTheme);
  }, [currentTheme]);

  const themes = [
    { id: 'cyber-cyan', name: 'Cyber Cyan', dotColor: '#00E5FF' },
    { id: 'emerald', name: 'Radar Emerald', dotColor: '#10B981' },
    { id: 'violet', name: 'Cosmic Violet', dotColor: '#A855F7' },
    { id: 'amber', name: 'Cyber Amber', dotColor: '#F59E0B' },
  ];

  return (
    <header className="h-14 border-b border-[#1F2A3C] bg-[#0C121B] px-4 flex items-center justify-between select-none sticky top-0 z-30">
      {/* Brand & Repository Context */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded-md text-[#8E9BAE] hover:text-[#F0F6FC] hover:bg-[#131B27] md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          onClick={onOpenScanModal}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition"
        >
          {/* Logo: minimalist crosshair with code bracket */}
          <div className="w-8 h-8 rounded-lg bg-[#131B27] border border-[#2C3C54] flex items-center justify-center text-[var(--accent)] shadow-inner font-mono font-bold text-sm">
            &lt;/&gt;
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-white text-base">CodeRadar</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#131B27] text-[var(--accent)] border border-[#1F2A3C]">v1.0</span>
            </div>
            <p className="text-[10px] text-[#8E9BAE] hidden sm:block">Codebase Health & Risk Radar</p>
          </div>
        </div>

        {repoInfo.name && (
          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-[#1F2A3C]">
            <div className="flex items-center gap-1.5 text-xs text-[#F0F6FC] font-medium bg-[#131B27] px-2.5 py-1 rounded border border-[#1F2A3C]">
              <span className="w-2 h-2 rounded-full bg-[#34D399]" />
              <span className="font-mono">{repoInfo.name}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#8E9BAE] bg-[#131B27] px-2 py-1 rounded border border-[#1F2A3C]">
              <GitBranch className="w-3 h-3 text-[#8E9BAE]" />
              <span className="font-mono">{repoInfo.branch || 'main'}</span>
            </div>
            <span className="text-[11px] text-[#8E9BAE]">
              Scanned just now
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Theme Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            title="Change Theme Color"
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md text-[#8E9BAE] hover:text-[#F0F6FC] bg-[#131B27] hover:bg-[#1A2536] border border-[#1F2A3C] transition"
          >
            <Palette className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themes.find(t => t.id === currentTheme)?.dotColor }} />
          </button>

          {isThemeMenuOpen && (
            <div className="absolute right-0 mt-1 w-44 rounded-xl bg-[#0C121B] border border-[#2C3C54] shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95">
              <div className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-[#8E9BAE]">
                Select UI Theme
              </div>
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setCurrentTheme(t.id);
                    setIsThemeMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    currentTheme === t.id
                      ? 'bg-[#131B27] text-[var(--accent)]'
                      : 'text-[#8E9BAE] hover:text-[#F0F6FC] hover:bg-[#131B27]/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.dotColor }} />
                    <span>{t.name}</span>
                  </div>
                  {currentTheme === t.id && <Check className="w-3.5 h-3.5 text-[var(--accent)]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onOpenExportReport}
          className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md text-[#8E9BAE] hover:text-[#F0F6FC] bg-[#131B27] hover:bg-[#1A2536] border border-[#1F2A3C] transition"
        >
          <FileText className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Export</span>
        </button>

        <button
          onClick={onOpenScanModal}
          className="hidden md:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md text-[#F0F6FC] bg-[#131B27] hover:bg-[#1A2536] border border-[#2C3C54] transition"
        >
          <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Switch Repo</span>
        </button>

        <button
          onClick={onRescan}
          disabled={isScanning}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition ${
            isScanning 
              ? 'bg-[#1F2A3C] text-[#8E9BAE] cursor-not-allowed' 
              : 'bg-[#131B27] hover:bg-[#1A2536] text-[#F0F6FC] border border-[#2C3C54]'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[var(--accent)] ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Rescanning...' : 'Rescan'}</span>
        </button>

        <button
          onClick={onOpenAskRadar}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium text-white bg-[var(--accent)]/15 hover:bg-[var(--accent)]/25 border border-[var(--accent)]/40 text-[var(--accent)] transition"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask CodeRadar</span>
          <span className="sm:hidden">Ask</span>
        </button>

        <button
          onClick={onOpenSettings}
          title="Settings & Gemini API"
          className="p-1.5 rounded-md text-[#8E9BAE] hover:text-[#F0F6FC] hover:bg-[#131B27] border border-transparent hover:border-[#2C3C54] transition"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
