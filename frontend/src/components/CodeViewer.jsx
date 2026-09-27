import React, { useState, useEffect } from 'react';
import { 
  FileCode, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Copy, 
  Wrench, 
  RefreshCw 
} from 'lucide-react';

export default function CodeViewer({
  files = {},
  initialFile = null,
  highlightLine = null,
  findings = [],
  onApplyFixAndRescan
}) {
  const fileKeys = Object.keys(files || {});
  const [activeFile, setActiveFile] = useState(initialFile || fileKeys[0] || 'src/config/firebase.js');
  const [copiedFile, setCopiedFile] = useState(false);

  useEffect(() => {
    if (initialFile && files[initialFile]) {
      setActiveFile(initialFile);
    }
  }, [initialFile, files]);

  const currentContent = files[activeFile] || '// No content available';
  const lines = currentContent.split('\n');

  // Map findings that apply to the current active file
  const fileFindings = findings.filter(f => f.file === activeFile);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentContent);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  return (
    <div className="bg-[#111820] border border-[#21262D] rounded-xl flex flex-col h-[700px] overflow-hidden shadow-lg">
      {/* File Header Bar */}
      <div className="bg-[#161E27] border-b border-[#21262D] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-x-auto max-w-[65%]">
          <FileCode className="w-4 h-4 text-[#58A6FF] shrink-0" />
          <span className="font-mono text-xs font-semibold text-[#E6EDF3] truncate">
            {activeFile}
          </span>
          <span className="text-[11px] text-[#8B949E] shrink-0">
            ({lines.length} lines)
          </span>
          {fileFindings.length > 0 && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F85149]/20 text-[#F85149] font-bold shrink-0">
              {fileFindings.length} issue{fileFindings.length > 1 ? 's' : ''} detected
            </span>
          )}
        </div>

        {/* Action Controls & File Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-[#0B0F14] hover:bg-[#21262D] text-[#8B949E] hover:text-[#E6EDF3] border border-[#21262D] transition"
          >
            {copiedFile ? <Check className="w-3 h-3 text-[#3FB950]" /> : <Copy className="w-3 h-3" />}
            <span>{copiedFile ? 'Copied' : 'Copy'}</span>
          </button>

          <select
            value={activeFile}
            onChange={(e) => setActiveFile(e.target.value)}
            className="px-2.5 py-1 rounded bg-[#0B0F14] border border-[#21262D] text-xs font-mono text-[#E6EDF3] focus:outline-none focus:border-[#58A6FF]"
          >
            {fileKeys.map(fk => (
              <option key={fk} value={fk}>
                {fk}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main View Area: Code Lines + Attached Finding Callouts */}
      <div className="flex-1 overflow-auto bg-[#0B0F14] p-2 font-mono text-xs leading-relaxed select-text">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((lineText, idx) => {
              const lineNum = idx + 1;
              const lineFinding = fileFindings.find(f => f.line === lineNum);
              const isTargetLine = highlightLine === lineNum || Boolean(lineFinding);

              return (
                <React.Fragment key={`line-${lineNum}`}>
                  <tr className={`transition-colors ${
                    isTargetLine 
                      ? lineFinding?.severity === 'critical' 
                        ? 'bg-[#F85149]/15' 
                        : 'bg-[#58A6FF]/15'
                      : 'hover:bg-[#161E27]/40'
                  }`}>
                    {/* Line number gutter */}
                    <td className={`w-12 text-right pr-4 pl-2 py-0.5 select-none font-mono text-[11px] ${
                      isTargetLine ? 'text-[#58A6FF] font-bold' : 'text-[#8B949E]/60'
                    }`}>
                      {lineNum}
                    </td>

                    {/* Code text */}
                    <td className="py-0.5 pr-4 pl-1 text-[#E6EDF3] whitespace-pre font-mono text-[12px]">
                      {lineText}
                    </td>
                  </tr>

                  {/* Inline Finding Callout attached to this line */}
                  {lineFinding && (
                    <tr className="bg-[#161E27] border-y border-[#30363D]">
                      <td colSpan={2} className="p-3.5 pl-14">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-2.5">
                            <ShieldAlert className="w-4 h-4 text-[#F85149] shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#E6EDF3]">
                                  {lineFinding.title}
                                </span>
                                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-[#F85149]/20 text-[#F85149] font-bold">
                                  {lineFinding.severity}
                                </span>
                              </div>
                              <p className="text-xs text-[#8B949E]">
                                {lineFinding.description}
                              </p>
                              <div className="p-2 rounded bg-[#0B0F14] border border-[#21262D] text-[11px] text-[#3FB950] font-mono whitespace-pre-wrap">
                                <strong>Suggested Fix:</strong> {lineFinding.suggestedFix}
                              </div>
                            </div>
                          </div>

                          {onApplyFixAndRescan && (
                            <button
                              onClick={() => onApplyFixAndRescan(lineFinding.id)}
                              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3FB950] hover:bg-[#349c43] text-white text-xs font-semibold shadow-sm transition"
                            >
                              <Wrench className="w-3.5 h-3.5" />
                              <span>Apply Fix & Rescan</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
