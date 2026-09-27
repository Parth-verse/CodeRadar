import React, { useState } from 'react';
import { 
  Network, 
  Layers, 
  ArrowRight, 
  FileCode, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export default function ArchitectureExplorer({ architecture = {}, files = [], apiKey }) {
  const [selectedFile, setSelectedFile] = useState('src/services/authService.js');
  const [executionFlow, setExecutionFlow] = useState(null);
  const [isLoadingFlow, setIsLoadingFlow] = useState(false);
  const [flowTopic, setFlowTopic] = useState('What happens when a user logs in?');

  const { dependencyMap = {}, layers = [] } = architecture;
  const currentModule = dependencyMap[selectedFile] || {
    path: selectedFile,
    layer: 'Business Services',
    imports: [],
    importedBy: []
  };

  const handleRunExecutionFlow = async (topic) => {
    setIsLoadingFlow(true);
    setFlowTopic(topic);
    try {
      const res = await fetch('/api/gemini/explain-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, files, apiKey })
      });
      const data = await res.json();
      setExecutionFlow(data);
    } catch (e) {
      console.error("Execution flow failed:", e);
    } finally {
      setIsLoadingFlow(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#E6EDF3]">Architecture & Dependency Explorer</h2>
        <p className="text-xs text-[#8B949E] mt-0.5">
          Deterministic module dependency graph combined with Gemini execution flow tracing.
        </p>
      </div>

      {/* Tiered Architectural Layers Flow */}
      <div className="bg-[#111820] border border-[#21262D] rounded-xl p-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8B949E] block mb-3">
          Architecture Topology
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {layers.map((layer, idx) => (
            <div
              key={layer.id}
              className="p-3.5 rounded-lg bg-[#161E27] border border-[#21262D] space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-[#58A6FF] uppercase">Step 0{idx + 1}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0B0F14] text-[#8B949E]">
                    {layer.files?.length || 0} files
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#E6EDF3]">{layer.name}</h4>
                <p className="text-[11px] text-[#8B949E] mt-1 leading-snug">{layer.description}</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#21262D]">
                {layer.files?.slice(0, 3).map(f => (
                  <button
                    key={f.path}
                    onClick={() => setSelectedFile(f.path)}
                    className={`w-full text-left font-mono text-[10px] px-1.5 py-1 rounded truncate transition ${
                      selectedFile === f.path 
                        ? 'bg-[#58A6FF]/20 text-[#58A6FF] font-semibold border border-[#58A6FF]/40' 
                        : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D]'
                    }`}
                  >
                    {f.path.split('/').pop()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Module Inspector + Gemini Execution Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Selected File Dependency Inspector */}
        <div className="lg:col-span-5 bg-[#111820] border border-[#21262D] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8B949E]">
              Module Inspector
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#161E27] text-[#58A6FF] font-mono">
              {currentModule.layer}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#161E27] border border-[#21262D] flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#58A6FF]" />
            <span className="font-mono text-xs font-bold text-[#E6EDF3] truncate">
              {selectedFile}
            </span>
          </div>

          {/* Used By */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#8B949E] uppercase tracking-wider block">
              Used By (Downstream Consumers):
            </span>
            <div className="space-y-1">
              {currentModule.importedBy && currentModule.importedBy.length > 0 ? (
                currentModule.importedBy.map(dep => (
                  <button
                    key={dep}
                    onClick={() => setSelectedFile(dep)}
                    className="w-full text-left font-mono text-xs px-2.5 py-1.5 rounded bg-[#161E27] hover:bg-[#21262D] text-[#E6EDF3] border border-[#21262D] flex items-center justify-between transition"
                  >
                    <span>{dep}</span>
                    <ArrowRight className="w-3 h-3 text-[#8B949E]" />
                  </button>
                ))
              ) : (
                <div className="text-xs text-[#8B949E] italic p-2 bg-[#161E27] rounded border border-[#21262D]">
                  No direct internal consumers detected (likely root entry or test)
                </div>
              )}
            </div>
          </div>

          {/* Imports */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#8B949E] uppercase tracking-wider block">
              Imports (Upstream Dependencies):
            </span>
            <div className="space-y-1">
              {currentModule.imports && currentModule.imports.length > 0 ? (
                currentModule.imports.map(imp => {
                  const isNpm = imp.startsWith('npm:');
                  return (
                    <div
                      key={imp}
                      onClick={() => !isNpm && setSelectedFile(imp)}
                      className={`font-mono text-xs px-2.5 py-1.5 rounded flex items-center justify-between border ${
                        isNpm 
                          ? 'bg-[#0B0F14] text-[#8B949E] border-[#21262D]' 
                          : 'bg-[#161E27] hover:bg-[#21262D] text-[#58A6FF] border-[#21262D] cursor-pointer'
                      }`}
                    >
                      <span>{imp}</span>
                      {isNpm ? (
                        <span className="text-[10px] px-1 rounded bg-[#21262D] text-[#8B949E]">vendor</span>
                      ) : (
                        <ArrowRight className="w-3 h-3 text-[#58A6FF]" />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-[#8B949E] italic p-2 bg-[#161E27] rounded border border-[#21262D]">
                  No imports detected.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Gemini Execution Flow Explainer */}
        <div className="lg:col-span-7 bg-[#111820] border border-[#21262D] rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#58A6FF]">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Gemini Execution Flow Engine
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161E27] text-[#58A6FF] border border-[#21262D]">
                Flow Reasoning
              </span>
            </div>

            {/* Quick Flow Triggers */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleRunExecutionFlow("What happens when a user logs in?")}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#161E27] hover:bg-[#21262D] border border-[#30363D] text-[#E6EDF3] transition flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 text-[#58A6FF]" />
                <span>Explain: User Login Flow</span>
              </button>
              <button
                onClick={() => handleRunExecutionFlow("What happens during order checkout & payment?")}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#161E27] hover:bg-[#21262D] border border-[#30363D] text-[#E6EDF3] transition flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 text-[#58A6FF]" />
                <span>Explain: Order Checkout Flow</span>
              </button>
            </div>

            {/* Flow Narrative Display */}
            {isLoadingFlow ? (
              <div className="p-8 text-center text-[#8B949E] space-y-2 animate-pulse">
                <Sparkles className="w-6 h-6 text-[#58A6FF] mx-auto" />
                <p className="text-xs">Gemini is tracing execution flows across modules...</p>
              </div>
            ) : executionFlow ? (
              <div className="p-4 rounded-lg bg-[#0B0F14] border border-[#21262D] text-xs text-[#E6EDF3] space-y-3 leading-relaxed max-h-[400px] overflow-y-auto whitespace-pre-line">
                {executionFlow.narrative}
              </div>
            ) : (
              <div className="p-8 text-center text-[#8B949E] bg-[#161E27]/40 rounded-lg border border-[#21262D] space-y-2">
                <p className="text-xs">
                  Select a workflow above to generate a complete execution flow trace powered by Gemini.
                </p>
                <button
                  onClick={() => handleRunExecutionFlow("What happens when a user logs in?")}
                  className="text-xs font-semibold text-[#58A6FF] hover:underline"
                >
                  Generate User Login Flow &rarr;
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
