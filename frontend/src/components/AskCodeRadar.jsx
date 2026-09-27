import React, { useState } from 'react';
import { 
  MessageSquareCode, 
  Send, 
  Sparkles, 
  FileCode, 
  ArrowRight, 
  CornerDownLeft, 
  Bot, 
  User 
} from 'lucide-react';

export default function AskCodeRadar({ files = [], onSelectFile, initialQuestion = '', apiKey }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I'm CodeRadar's repository-aware assistant. I have full context on the scanned modules, dependencies, and architecture. How can I help you navigate or refactor this codebase?`,
      citedFiles: ['src/routes/api.js', 'src/services/authService.js', 'src/services/orderService.js']
    }
  ]);
  const [inputQuery, setInputQuery] = useState(initialQuestion);
  const [isQuerying, setIsQuerying] = useState(false);

  const suggestedQuestions = [
    "What does this project do?",
    "Where is authentication handled?",
    "What happens when a user logs in?",
    "Why might the authentication API fail?",
    "What should I fix first?",
    "What important behavior isn't tested?"
  ];

  const handleSendMessage = async (queryToSend) => {
    const q = (queryToSend || inputQuery).trim();
    if (!q || isQuerying) return;

    setInputQuery('');
    setMessages(prev => [...prev, { sender: 'user', text: q }]);
    setIsQuerying(true);

    try {
      const res = await fetch('/api/gemini/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          files,
          apiKey
        })
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: data.answer || "I was unable to retrieve a response from the model.",
          citedFiles: data.citedFiles || []
        }
      ]);
    } catch (err) {
      console.error("Ask CodeRadar error:", err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "An error occurred connecting to the repository intelligence service.",
          citedFiles: []
        }
      ]);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#58A6FF]" />
          <h2 className="text-xl font-bold tracking-tight text-[#E6EDF3]">Ask CodeRadar</h2>
        </div>
        <p className="text-xs text-[#8B949E] mt-0.5">
          Repository-aware AI assistance with selective AST context and file citations.
        </p>
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-[#8B949E]">Quick queries:</span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isQuerying}
            className="text-xs px-2.5 py-1 rounded bg-[#161E27] hover:bg-[#21262D] text-[#58A6FF] border border-[#21262D] transition disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-[#111820] border border-[#21262D] rounded-xl flex flex-col h-[520px] overflow-hidden">
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${isAI ? 'self-start' : 'self-end ml-auto'}`}
              >
                {isAI && (
                  <div className="w-7 h-7 rounded-lg bg-[#58A6FF]/15 border border-[#58A6FF]/30 flex items-center justify-center text-[#58A6FF] shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div className={`p-4 rounded-xl space-y-2 text-xs leading-relaxed ${
                  isAI
                    ? 'bg-[#161E27] text-[#E6EDF3] border border-[#21262D]'
                    : 'bg-[#58A6FF] text-white font-medium ml-auto'
                }`}>
                  <div className="whitespace-pre-line font-mono text-[12px]">
                    {msg.text}
                  </div>

                  {/* Cited Files Pills */}
                  {isAI && msg.citedFiles && msg.citedFiles.length > 0 && (
                    <div className="pt-2 border-t border-[#21262D] flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-[#8B949E] uppercase font-semibold">Cited:</span>
                      {msg.citedFiles.map(cf => (
                        <button
                          key={cf}
                          onClick={() => onSelectFile && onSelectFile(cf)}
                          className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B0F14] text-[#58A6FF] hover:bg-[#21262D] border border-[#21262D] transition"
                        >
                          <FileCode className="w-3 h-3" />
                          <span>{cf}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {!isAI && (
                  <div className="w-7 h-7 rounded-lg bg-[#21262D] flex items-center justify-center text-[#8B949E] shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isQuerying && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-7 h-7 rounded-lg bg-[#58A6FF]/15 border border-[#58A6FF]/30 flex items-center justify-center text-[#58A6FF] shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-xl bg-[#161E27] border border-[#21262D] text-xs text-[#8B949E] animate-pulse">
                Gemini reasoning over codebase files...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#161E27] border-t border-[#21262D]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about this repository (e.g. 'Where is authentication handled?')..."
              className="flex-1 bg-[#0B0F14] border border-[#21262D] rounded-lg px-3.5 py-2.5 text-xs text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:border-[#58A6FF]"
            />
            <button
              type="submit"
              disabled={isQuerying || !inputQuery.trim()}
              className="px-4 py-2.5 rounded-lg bg-[#58A6FF] hover:bg-[#4094f7] disabled:bg-[#21262D] disabled:text-[#8B949E] text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
