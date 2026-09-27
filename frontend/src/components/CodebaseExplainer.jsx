import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  Terminal, 
  FolderTree, 
  Database, 
  KeyRound, 
  Globe, 
  FileCode, 
  ArrowRight,
  RefreshCw,
  Server,
  Monitor
} from 'lucide-react';

export default function CodebaseExplainer({ files = [], onSelectFile, apiKey }) {
  const [explainerData, setExplainerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCodebaseExplanation = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/explain-codebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files, apiKey })
      });
      const data = await res.json();
      setExplainerData(data);
    } catch (err) {
      console.error("Failed to load codebase explanation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCodebaseExplanation();
  }, [files, apiKey]);

  const fallbackData = {
    projectPurpose: "PulseCart Platform Core: A high-throughput e-commerce microservice handling authenticated customer workflows, regional tax calculations, and Stripe payment transactions.",
    frontendArchitecture: "React with modular functional components, controlled form state management, and modal overlays for checkout flows.",
    backendArchitecture: "Node.js with Express HTTP REST controllers, modular domain services (Auth, Payment, Order), and JSON payloads.",
    entryPoints: ["src/routes/api.js", "src/components/auth/Login.jsx", "src/config/firebase.js"],
    dataFlow: "User interaction in React views -> Service layer transaction builders -> Express REST routes -> External payment gateway (Stripe) and identity provider (Firebase)",
    authentication: "Stateless JWT bearer tokens issued upon validation, cached in browser localStorage, paired with Firebase Auth client SDK.",
    databaseUsage: "Stateful session persistence with Firebase user store and transactional order IDs dispatched to Stripe.",
    externalApis: ["Stripe API (Payment Intent creation)", "Firebase Auth Client SDK", "Axios (HTTP client)"],
    keyFiles: [
      { path: "src/config/firebase.js", role: "Firebase client initialization and credential bindings" },
      { path: "src/services/authService.js", role: "Client-side authentication logic and session storage" },
      { path: "src/services/paymentService.js", role: "Stripe payment intents and multi-state tax computations" },
      { path: "src/services/orderService.js", role: "Order placement orchestration and cart total aggregation" },
      { path: "src/routes/api.js", role: "Express backend endpoints for login and checkout handling" }
    ],
    majorFolders: [
      { path: "src/components/", desc: "React user interface components and modular views" },
      { path: "src/services/", desc: "Core business logic, transaction rules, and payment gateways" },
      { path: "src/routes/", desc: "Express HTTP controllers and REST endpoints" },
      { path: "src/config/", desc: "SDK configurations, credential drivers, and client instances" },
      { path: "tests/", desc: "Automated test suites and Jest specs" }
    ]
  };

  const data = explainerData || fallbackData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#58A6FF]" />
            <h2 className="text-xl font-bold tracking-tight text-[#E6EDF3]">Explain My Codebase</h2>
          </div>
          <p className="text-xs text-[#8B949E] mt-0.5">
            Gemini architectural breakdown of project purpose, data flows, boundaries, and critical entrypoints.
          </p>
        </div>

        <button
          onClick={fetchCodebaseExplanation}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#161E27] hover:bg-[#21262D] border border-[#21262D] text-[#58A6FF] transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Regenerate</span>
        </button>
      </div>

      {/* Purpose Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-[#161E27] to-[#111820] border border-[#58A6FF]/30 space-y-2">
        <div className="flex items-center gap-2 text-[#58A6FF]">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Project Purpose & Scope
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#E6EDF3] leading-relaxed">
          {data.projectPurpose}
        </p>
      </div>

      {/* Architecture Cards: Frontend & Backend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Frontend Architecture */}
        <div className="bg-[#111820] border border-[#21262D] rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-[#58A6FF]">
            <Monitor className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#E6EDF3]">
              Frontend Architecture
            </h3>
          </div>
          <p className="text-xs text-[#8B949E] leading-relaxed">
            {data.frontendArchitecture}
          </p>
        </div>

        {/* Backend Architecture */}
        <div className="bg-[#111820] border border-[#21262D] rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-[#3FB950]">
            <Server className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#E6EDF3]">
              Backend Architecture
            </h3>
          </div>
          <p className="text-xs text-[#8B949E] leading-relaxed">
            {data.backendArchitecture}
          </p>
        </div>
      </div>

      {/* Data Flow & Authentication */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Data Flow */}
        <div className="bg-[#111820] border border-[#21262D] rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-[#D29922]">
            <Layers className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#E6EDF3]">
              Data Movement & Flow
            </h3>
          </div>
          <p className="text-xs text-[#8B949E] leading-relaxed">
            {data.dataFlow}
          </p>
        </div>

        {/* Authentication */}
        <div className="bg-[#111820] border border-[#21262D] rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-indigo-400">
            <KeyRound className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#E6EDF3]">
              Authentication & Sessions
            </h3>
          </div>
          <p className="text-xs text-[#8B949E] leading-relaxed">
            {data.authentication}
          </p>
        </div>
      </div>

      {/* External APIs & Database */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* External APIs */}
        <div className="bg-[#111820] border border-[#21262D] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-[#58A6FF]">
            <Globe className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#E6EDF3]">
              External APIs & Integrations
            </h3>
          </div>
          <div className="space-y-1.5">
            {Array.isArray(data.externalApis) && data.externalApis.map((api, idx) => (
              <div key={idx} className="p-2 rounded bg-[#161E27] border border-[#21262D] text-xs text-[#E6EDF3] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#58A6FF]" />
                <span>{api}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Major Folders */}
        <div className="bg-[#111820] border border-[#21262D] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-[#3FB950]">
            <FolderTree className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#E6EDF3]">
              Major Folders & Responsibilities
            </h3>
          </div>
          <div className="space-y-1.5">
            {(data.majorFolders || fallbackData.majorFolders).map((f, idx) => (
              <div key={idx} className="p-2 rounded bg-[#161E27] border border-[#21262D] text-xs flex items-center justify-between">
                <span className="font-mono text-[#58A6FF]">{f.path}</span>
                <span className="text-[#8B949E] text-[11px] truncate max-w-[60%]">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Important Files & Entry Points */}
      <div className="bg-[#111820] border border-[#21262D] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#58A6FF]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#E6EDF3]">
              Key Files & Architectural Anchor Points
            </h3>
          </div>
          <span className="text-xs text-[#8B949E]">Click file to inspect in Code Viewer</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(data.keyFiles || fallbackData.keyFiles).map((kf) => (
            <div
              key={kf.path}
              onClick={() => onSelectFile && onSelectFile(kf.path)}
              className="p-3 rounded-lg bg-[#161E27] hover:bg-[#21262D] border border-[#21262D] hover:border-[#30363D] cursor-pointer transition space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#E6EDF3] truncate">{kf.path}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#58A6FF] shrink-0" />
              </div>
              <p className="text-[11px] text-[#8B949E] leading-snug">
                {kf.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
