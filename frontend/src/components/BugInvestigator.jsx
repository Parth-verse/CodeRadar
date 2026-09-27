import React, { useState } from 'react';
import { Bug, Sparkles, Terminal, FileCode, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function BugInvestigator({ files = [], apiKey }) {
  const [errorLog, setErrorLog] = useState(
    'Error: Request failed with status code 401\n    at loginUser (src/services/authService.js:23:11)\n    at handleSubmit (src/components/auth/Login.jsx:16:21)'
  );
  const [stackTrace, setStackTrace] = useState(
    'AxiosError: Request failed with status code 401\n    at settle (axios/lib/core/settle.js:19:12)\n    at XMLHttpRequest.handleLoad (axios/lib/adapters/xhr.js:128:7)'
  );
  const [investigation, setInvestigation] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sampleBugs = [
    {
      title: "Authentication Silent Failure (HTTP 401 / Timeout)",
      error: "Error: Request failed with status code 401 in authService",
      trace: "at loginUser (src/services/authService.js:23:11)\nat handleSubmit (src/components/auth/Login.jsx:16:21)"
    },
    {
      title: "Checkout Null Pointer in paymentService",
      error: "TypeError: Cannot read properties of undefined (reading 'billingAddress')",
      trace: "at processPaymentTransaction (src/services/paymentService.js:15:20)\nat placeOrder (src/services/orderService.js:24:26)"
    }
  ];

  const handleRunInvestigation = async (err, trace) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          errorLog: err || errorLog,
          stackTrace: trace || stackTrace,
          files,
          apiKey
        })
      });
      const data = await res.json();
      setInvestigation(data);
    } catch (e) {
      console.error("Bug investigation failed:", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#E6EDF3]">Bug Root-Cause Investigator</h2>
        <p className="text-xs text-[#8B949E] mt-0.5">
          Correlate runtime stack traces and production errors directly against repository context with Gemini.
        </p>
      </div>

      {/* Preset Incident Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-[#8B949E]">Load sample incident:</span>
        {sampleBugs.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => {
              setErrorLog(sample.error);
              setStackTrace(sample.trace);
              handleRunInvestigation(sample.error, sample.trace);
            }}
            className="text-xs px-2.5 py-1 rounded bg-[#161E27] hover:bg-[#21262D] text-[#58A6FF] border border-[#21262D] transition"
          >
            {sample.title}
          </button>
        ))}
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Log and Stack Trace */}
        <div className="lg:col-span-5 bg-[#111820] border border-[#21262D] rounded-xl p-5 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8B949E] block">
            Incident Telemetry
          </span>

          <div className="space-y-1.5">
            <label className="text-xs text-[#8B949E] font-medium">Error Message / Symptom</label>
            <textarea
              rows={3}
              value={errorLog}
              onChange={(e) => setErrorLog(e.target.value)}
              placeholder="Paste error message or console log..."
              className="w-full p-2.5 rounded-lg bg-[#0B0F14] border border-[#21262D] font-mono text-xs text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:border-[#58A6FF]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[#8B949E] font-medium">Stack Trace</label>
            <textarea
              rows={5}
              value={stackTrace}
              onChange={(e) => setStackTrace(e.target.value)}
              placeholder="Paste stack trace..."
              className="w-full p-2.5 rounded-lg bg-[#0B0F14] border border-[#21262D] font-mono text-xs text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:border-[#58A6FF]"
            />
          </div>

          <button
            onClick={() => handleRunInvestigation()}
            disabled={isAnalyzing || !errorLog}
            className="w-full py-2.5 rounded-lg font-semibold text-xs text-white bg-[#58A6FF] hover:bg-[#4094f7] disabled:bg-[#21262D] disabled:text-[#8B949E] flex items-center justify-center gap-2 transition"
          >
            <Bug className="w-4 h-4" />
            <span>{isAnalyzing ? "Gemini Investigating Repository..." : "Investigate This Issue"}</span>
          </button>
        </div>

        {/* Right: Gemini Diagnosis Output */}
        <div className="lg:col-span-7 bg-[#111820] border border-[#21262D] rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#58A6FF]">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Gemini Diagnostic Findings
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161E27] text-[#58A6FF] border border-[#21262D]">
                Context Correlated
              </span>
            </div>

            {isAnalyzing ? (
              <div className="p-12 text-center text-[#8B949E] space-y-2 animate-pulse">
                <Sparkles className="w-6 h-6 text-[#58A6FF] mx-auto" />
                <p className="text-xs">Correlating stack trace with service definitions and error boundaries...</p>
              </div>
            ) : investigation ? (
              <div className="p-4 rounded-lg bg-[#0B0F14] border border-[#21262D] text-xs text-[#E6EDF3] space-y-3 leading-relaxed max-h-[460px] overflow-y-auto whitespace-pre-line font-mono">
                {investigation.analysis}
              </div>
            ) : (
              <div className="p-12 text-center text-[#8B949E] bg-[#161E27]/40 rounded-lg border border-[#21262D] space-y-2">
                <Bug className="w-8 h-8 text-[#8B949E] mx-auto" />
                <h4 className="text-sm font-semibold text-[#E6EDF3]">Ready to investigate</h4>
                <p className="text-xs">
                  Click "Investigate This Issue" or select a sample incident to trigger root-cause analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
