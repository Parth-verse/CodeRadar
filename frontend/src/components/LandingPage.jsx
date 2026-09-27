import React from 'react';
import { 
  ShieldAlert, 
  Bug, 
  Sparkles, 
  Terminal, 
  Network, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Package, 
  TestTube2,
  Cpu,
  Layers
} from 'lucide-react';

export default function LandingPage({ onStartScan, onTryDemo }) {
  const detectionCategories = [
    { name: "Potential Bugs", icon: Bug, desc: "Silent exception swallows, unhandled promises, and edge cases" },
    { name: "Security Concerns", icon: ShieldAlert, desc: "Masked hardcoded credentials, secret leaks, unprotected .gitignore" },
    { name: "Code Quality", icon: Sparkles, desc: "Arrow anti-patterns, deep nesting, duplicate logic, and code smells" },
    { name: "Testing Gaps", icon: TestTube2, desc: "Missing timeout assertions, boundary cases, and error recovery suites" },
    { name: "Dependencies", icon: Package, desc: "Heavy bundle bloat (e.g. moment.js) and vulnerable direct packages" },
    { name: "Architecture", icon: Network, desc: "Cyclic dependencies, tangled service coupling, and layer violations" },
    { name: "Technical Debt", icon: Layers, desc: "Prioritized actionable fixes grouped by risk and remediation effort" },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6EDF3] flex flex-col justify-between">
      {/* Top minimal header */}
      <header className="border-b border-[#21262D] bg-[#111820]/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#161E27] border border-[#30363D] flex items-center justify-center text-[#58A6FF] font-mono font-bold text-sm">
            &lt;/&gt;
          </div>
          <div>
            <span className="font-bold tracking-tight text-white text-base">CodeRadar</span>
            <span className="ml-2 text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#161E27] text-[#58A6FF] border border-[#21262D]">Hackathon Edition</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onTryDemo}
            className="text-xs px-3 py-1.5 rounded-md font-medium text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#161E27] transition"
          >
            See Demo
          </button>
          <button
            onClick={onStartScan}
            className="text-xs px-3.5 py-1.5 rounded-md font-semibold text-white bg-[#58A6FF] hover:bg-[#4a92e6] transition shadow-sm"
          >
            Scan a Repository
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 pt-16 pb-20">
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161E27] border border-[#30363D] text-xs text-[#58A6FF] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#3FB950] animate-pulse" />
            <span>Deterministic Analysis + Gemini AI Reasoning</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Scan your code. Spot the risks. <br />
            <span className="text-[#58A6FF]">Ship with confidence.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#8B949E] leading-relaxed max-w-2xl mx-auto">
            AI-powered codebase intelligence that helps developers understand what is happening inside their repositories, identify potential risks, and decide what to fix first.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={onStartScan}
              className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-sm text-white bg-[#58A6FF] hover:bg-[#4094f7] flex items-center justify-center gap-2 shadow-lg shadow-[#58A6FF]/20 transition"
            >
              <span>Scan a Repository</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onTryDemo}
              className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-sm text-[#E6EDF3] bg-[#161E27] hover:bg-[#21262D] border border-[#30363D] flex items-center justify-center gap-2 transition"
            >
              <Terminal className="w-4 h-4 text-[#58A6FF]" />
              <span>Try Demo Repository (1-Click)</span>
            </button>
          </div>
          <p className="text-xs text-[#8B949E]">
            Zero configuration required. Instant evaluation of multi-file codebase with intentional detectable flaws.
          </p>
        </div>

        {/* Visual Preview Card of the Dashboard */}
        <div className="mt-14 relative rounded-xl border border-[#21262D] bg-[#111820] shadow-2xl overflow-hidden">
          <div className="h-9 bg-[#161E27] border-b border-[#21262D] px-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#F85149]/60" />
              <div className="w-3 h-3 rounded-full bg-[#D29922]/60" />
              <div className="w-3 h-3 rounded-full bg-[#3FB950]/60" />
              <span className="ml-2 text-xs font-mono text-[#8B949E]">pulsecart/platform-core (main)</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#3FB950]">
              <span>Health: 71 / 100</span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Health preview badge */}
            <div className="bg-[#161E27] p-5 rounded-lg border border-[#21262D] text-center space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8B949E]">CodeRadar Health Score</span>
              <div className="text-5xl font-mono font-bold text-[#D29922]">71 <span className="text-xl text-[#8B949E]">/ 100</span></div>
              <div className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-[#D29922]/15 text-[#D29922] border border-[#D29922]/30">
                Needs Attention
              </div>
              <p className="text-[11px] text-[#8B949E] pt-1">
                Heuristic score weighted across security, test coverage, and reliability.
              </p>
            </div>

            {/* Radar Spoke Preview */}
            <div className="bg-[#161E27] p-5 rounded-lg border border-[#21262D] space-y-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8B949E]">Category Radar</span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-[#E6EDF3]">
                  <span>🔐 Security</span>
                  <span className="font-mono text-[#D29922]">70/100</span>
                </div>
                <div className="flex justify-between items-center text-[#E6EDF3]">
                  <span>🐛 Bugs</span>
                  <span className="font-mono text-[#D29922]">78/100</span>
                </div>
                <div className="flex justify-between items-center text-[#E6EDF3]">
                  <span>🧪 Testing</span>
                  <span className="font-mono text-[#F85149]">43/100</span>
                </div>
                <div className="flex justify-between items-center text-[#E6EDF3]">
                  <span>📦 Dependencies</span>
                  <span className="font-mono text-[#3FB950]">84/100</span>
                </div>
              </div>
            </div>

            {/* Sample Finding Snippet */}
            <div className="bg-[#161E27] p-5 rounded-lg border border-[#21262D] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F85149]">
                <ShieldAlert className="w-4 h-4" />
                <span>Critical Finding</span>
              </div>
              <p className="text-xs font-medium text-[#E6EDF3] leading-snug">
                Potential hardcoded API credential detected
              </p>
              <div className="bg-[#0B0F14] p-2 rounded text-[11px] font-mono text-[#8B949E] border border-[#21262D] truncate">
                apiKey: "AIzaSy************"
              </div>
              <p className="text-[11px] text-[#58A6FF] font-medium">
                Gemini: "Extract to runtime environment variable..."
              </p>
            </div>
          </div>
        </div>

        {/* What CodeRadar Detects Section */}
        <div className="mt-20">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-white">What CodeRadar Detects</h2>
            <p className="text-sm text-[#8B949E]">
              Deep diagnostic coverage combining static heuristics with generative reasoning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {detectionCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#111820] border border-[#21262D] hover:border-[#30363D] p-4 rounded-xl transition space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#161E27] border border-[#21262D] flex items-center justify-center text-[#58A6FF]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-[#E6EDF3]">{cat.name}</h3>
                  </div>
                  <p className="text-xs text-[#8B949E] leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dual Engine Explanation */}
        <div className="mt-16 p-6 rounded-xl bg-gradient-to-r from-[#111820] to-[#161E27] border border-[#21262D] text-center space-y-3">
          <h3 className="text-lg font-bold text-white">
            Powered by deterministic analysis + Gemini reasoning
          </h3>
          <p className="text-xs sm:text-sm text-[#8B949E] max-w-2xl mx-auto leading-relaxed">
            Deterministic rules extract exact syntax patterns, credential signatures, and file dependency graphs without hallucinations. Gemini provides contextual root-cause reasoning, onboarding mental models, and targeted test generation.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#21262D] py-6 px-6 text-center text-xs text-[#8B949E]">
        CodeRadar &copy; 2026 &mdash; Built for Google DeepMind Agentic Pair Programming Hackathon
      </footer>
    </div>
  );
}
