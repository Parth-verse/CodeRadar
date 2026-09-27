import React, { useState } from 'react';
import { X, GitBranch, Upload, Terminal, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function ScanModal({
  isOpen,
  onClose,
  onScanDemo,
  onScanGitHub,
  onScanZip,
  isScanning
}) {
  const [activeTab, setActiveTab] = useState('demo');
  const [githubUrl, setGithubUrl] = useState('expressjs/express');
  const [githubToken, setGithubToken] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleGitHubSubmit = (e) => {
    e.preventDefault();
    if (!githubUrl.trim()) return;
    setError(null);
    onScanGitHub(githubUrl, githubToken);
  };

  const handleZipSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a .zip archive first.");
      return;
    }
    setError(null);
    onScanZip(selectedFile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111820] border border-[#21262D] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#21262D] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#161E27] border border-[#30363D] flex items-center justify-center text-[#58A6FF] font-mono text-xs font-bold">
              &lt;/&gt;
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#E6EDF3]">Scan Repository</h3>
              <p className="text-[11px] text-[#8B949E]">Ingest code for deterministic analysis and Gemini reasoning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#F85149]/10 border border-[#F85149]/30 text-xs text-[#F85149] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab selection */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setActiveTab('demo')}
            className={`p-2.5 rounded-lg text-xs font-medium border flex flex-col items-center gap-1.5 transition ${
              activeTab === 'demo'
                ? 'bg-[#161E27] border-[#58A6FF] text-[#58A6FF]'
                : 'bg-[#111820] border-[#21262D] text-[#8B949E] hover:text-[#E6EDF3]'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Try Demo Repo</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`p-2.5 rounded-lg text-xs font-medium border flex flex-col items-center gap-1.5 transition ${
              activeTab === 'github'
                ? 'bg-[#161E27] border-[#58A6FF] text-[#58A6FF]'
                : 'bg-[#111820] border-[#21262D] text-[#8B949E] hover:text-[#E6EDF3]'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>GitHub Repo</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`p-2.5 rounded-lg text-xs font-medium border flex flex-col items-center gap-1.5 transition ${
              activeTab === 'upload'
                ? 'bg-[#161E27] border-[#58A6FF] text-[#58A6FF]'
                : 'bg-[#111820] border-[#21262D] text-[#8B949E] hover:text-[#E6EDF3]'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload ZIP</span>
          </button>
        </div>

        {/* Content based on tab */}
        {activeTab === 'demo' && (
          <div className="space-y-4 pt-1">
            <div className="p-3.5 rounded-lg bg-[#161E27] border border-[#21262D] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#E6EDF3]">pulsecart/platform-core</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#3FB950]/15 text-[#3FB950]">Ready</span>
              </div>
              <p className="text-xs text-[#8B949E] leading-relaxed">
                Realistic multi-file e-commerce checkout & auth microservice with intentional detectable issues: hardcoded Firebase API key, unhandled exceptions, and testing gaps.
              </p>
              <div className="text-[11px] font-mono text-[#8B949E] pt-1">
                Files: 12 &bull; Stack: React, Express, Stripe, Firebase
              </div>
            </div>

            <button
              onClick={onScanDemo}
              disabled={isScanning}
              className="w-full py-2.5 rounded-lg font-semibold text-xs text-white bg-[#58A6FF] hover:bg-[#4094f7] disabled:bg-[#21262D] flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isScanning ? "Scanning Demo Repository..." : "Launch Demo Scan (1-Click)"}</span>
            </button>
          </div>
        )}

        {activeTab === 'github' && (
          <form onSubmit={handleGitHubSubmit} className="space-y-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs text-[#8B949E]">Repository URL or owner/repo</label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="e.g. facebook/react or https://github.com/owner/repo"
                className="w-full p-2.5 rounded-lg bg-[#0B0F14] border border-[#21262D] text-xs font-mono text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:border-[#58A6FF]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#8B949E]">GitHub Personal Access Token (Optional for higher rate limits)</label>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_************************"
                className="w-full p-2.5 rounded-lg bg-[#0B0F14] border border-[#21262D] text-xs font-mono text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:border-[#58A6FF]"
              />
            </div>

            <button
              type="submit"
              disabled={isScanning || !githubUrl.trim()}
              className="w-full py-2.5 rounded-lg font-semibold text-xs text-white bg-[#58A6FF] hover:bg-[#4094f7] disabled:bg-[#21262D] flex items-center justify-center gap-2 transition"
            >
              <GitBranch className="w-4 h-4" />
              <span>{isScanning ? "Fetching & Scanning GitHub..." : "Scan GitHub Repository"}</span>
            </button>
          </form>
        )}

        {activeTab === 'upload' && (
          <form onSubmit={handleZipSubmit} className="space-y-3 pt-1">
            <div className="border-2 border-dashed border-[#21262D] hover:border-[#30363D] rounded-xl p-6 text-center space-y-2 cursor-pointer bg-[#0B0F14]">
              <Upload className="w-6 h-6 text-[#58A6FF] mx-auto" />
              <div className="text-xs text-[#E6EDF3]">
                <label className="text-[#58A6FF] hover:underline cursor-pointer">
                  Choose a project ZIP
                  <input
                    type="file"
                    accept=".zip"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[11px] text-[#8B949E]">
                {selectedFile ? selectedFile.name : "ZIP archive containing code files up to 25MB"}
              </p>
            </div>

            <button
              type="submit"
              disabled={isScanning || !selectedFile}
              className="w-full py-2.5 rounded-lg font-semibold text-xs text-white bg-[#58A6FF] hover:bg-[#4094f7] disabled:bg-[#21262D] flex items-center justify-center gap-2 transition"
            >
              <Upload className="w-4 h-4" />
              <span>{isScanning ? "Extracting & Scanning..." : "Scan Uploaded Archive"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
