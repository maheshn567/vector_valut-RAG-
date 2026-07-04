import React, { useState, useRef, useEffect } from "react";

export default function UserPromptBoxComp({
  onSend,
  isLoading,
  topK,
  setTopK,
  temp,
  setTemp,
  strategy,
  setStrategy,
}) {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize the textarea height based on content scroll height
  const adjustHeight = () => {
    const tx = textareaRef.current;
    if (tx) {
      tx.style.height = "auto";
      tx.style.height = `${Math.min(tx.scrollHeight, 200)}px`; // Cap max height to 200px
    }
  };

  const handleTextChange = (e) => {
    setPrompt(e.target.value);
    adjustHeight();
  };

  const handleSubmit = () => {
    if (!prompt.trim() || isLoading) return;
    onSend(prompt.trim());
    setPrompt("");
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "50px";
    }
  };

  const handleKeyDown = (e) => {
    // Send message on Enter key (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <footer className="absolute bottom-0 inset-x-0 p-6 flex justify-center pointer-events-none z-30">
      <div className="w-full max-w-[800px] glass-panel rounded-2xl p-4 pointer-events-auto shadow-2xl">
        {/* Model Hyperparameters Configurations */}
        <div className="flex items-center gap-4 mb-4 overflow-x-auto pb-1 scrollbar-none select-none">
          {/* TopK Parameter Selection */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-on-surface-variant">TopK:</span>
            <select
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="bg-[#051424] border border-white/10 rounded-md text-[11px] font-mono text-primary py-0.5 px-2 focus:ring-0 focus:border-[#6C5CE7]/40 outline-none cursor-pointer"
            >
              <option value={4} className="bg-[#051424]">4 Chunks</option>
              <option value={8} className="bg-[#051424]">8 Chunks</option>
              <option value={12} className="bg-[#051424]">12 Chunks</option>
            </select>
          </div>

          {/* Temperature Parameter Selection */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-on-surface-variant">Temp:</span>
            <select
              value={temp}
              onChange={(e) => setTemp(Number(e.target.value))}
              className="bg-[#051424] border border-white/10 rounded-md text-[11px] font-mono text-primary py-0.5 px-2 focus:ring-0 focus:border-[#6C5CE7]/40 outline-none cursor-pointer"
            >
              <option value={0.1} className="bg-[#051424]">0.1 (Strict)</option>
              <option value={0.7} className="bg-[#051424]">0.7 (Balanced)</option>
              <option value={1.2} className="bg-[#051424]">1.2 (Creative)</option>
            </select>
          </div>

          {/* Strategy Tabs Toggle */}
          <div className="flex items-center gap-2 shrink-0 border-l border-white/10 pl-4 ml-2">
            <span className="text-[11px] font-mono text-on-surface-variant">Strategy:</span>
            <div className="flex bg-[#051424] p-0.5 rounded-lg border border-white/10">
              <button
                onClick={() => setStrategy("rag")}
                className={`px-3 py-0.5 rounded text-[10px] font-bold font-mono transition-all cursor-pointer ${
                  strategy === "rag"
                    ? "bg-[#6C5CE7]/20 text-[#6C5CE7]"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                RAG
              </button>
              <button
                onClick={() => setStrategy("standard")}
                className={`px-3 py-0.5 rounded text-[10px] font-bold font-mono transition-all cursor-pointer ${
                  strategy === "standard"
                    ? "bg-[#6C5CE7]/20 text-[#6C5CE7]"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Standard
              </button>
            </div>
          </div>
        </div>

        {/* Text Input Row */}
        <div className="relative flex items-end gap-3">
          <textarea
            ref={textareaRef}
            rows={1}
            value={prompt}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            style={{ height: "50px" }}
            className="flex-1 bg-[#051424]/50 border border-white/10 rounded-xl py-3.5 px-4 text-[14px] font-sans text-[#d5e4fa] placeholder:text-on-surface-variant focus:outline-none focus:border-[#6C5CE7]/50 focus:ring-1 focus:ring-[#6C5CE7]/20 resize-none overflow-y-auto scrollbar-none"
            placeholder={
              isLoading
                ? "Synthesizing answer..."
                : "Ask a question about the documents..."
            }
            disabled={isLoading}
          />
          <div className="flex items-center gap-2 mb-1">
            <button
              type="button"
              className="p-2.5 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer rounded-lg hover:bg-white/5"
              title="Attach context file (mock)"
            >
              <span className="material-symbols-outlined text-[20px]">attach_file</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !prompt.trim()}
              className={`p-2.5 rounded-lg flex items-center justify-center transition-all shadow-lg cursor-pointer ${
                isLoading || !prompt.trim()
                  ? "bg-white/5 text-white/30 scale-95 pointer-events-none"
                  : "bg-[#6C5CE7] text-white hover:bg-[#6C5CE7]/90 active:scale-95"
              }`}
              title="Send query"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}