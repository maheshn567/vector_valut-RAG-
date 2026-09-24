import { useState } from "react";
import { toast } from "sonner";

export default function RAGDefaults() {
  const [topK, setTopK] = useState(() => Number(localStorage.getItem("settings_topK") || 8));
  const [threshold, setThreshold] = useState(() => Number(localStorage.getItem("settings_threshold") || 0.60));
  const [reranker, setReranker] = useState(() => localStorage.getItem("settings_reranker") !== "false");
  const [format, setFormat] = useState(() => localStorage.getItem("settings_format") || "numbered");
  const [temp, setTemp] = useState(() => Number(localStorage.getItem("settings_temp") || 0.20));
  const [systemPrompt, setSystemPrompt] = useState(() => localStorage.getItem("settings_systemPrompt") || "You are a helpful assistant that answers questions based strictly on the provided context.");

  const handleSave = () => {
    localStorage.setItem("settings_topK", String(topK));
    localStorage.setItem("settings_threshold", String(threshold));
    localStorage.setItem("settings_reranker", String(reranker));
    localStorage.setItem("settings_format", format);
    localStorage.setItem("settings_temp", String(temp));
    localStorage.setItem("settings_systemPrompt", systemPrompt);
    toast.success("RAG system defaults saved successfully!");
  };

  return (
    <section className="settings-view text-left">
      <header className="flex justify-between items-start mb-10">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 font-label-md text-[10px] uppercase tracking-widest text-[#c9c5d0] mb-2 font-mono">
            <span>Settings</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-primary">RAG Defaults</span>
          </nav>
          <h2 className="font-headline-md text-headline-md text-2xl font-bold text-white">RAG Defaults</h2>
          <p className="font-body-sm text-sm text-[#c9c5d0] max-w-xl">Configure global parameters for retrieval-augmented generation. These values are used as system-wide defaults unless overridden at the request level.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-[#4029ba] hover:bg-[#2900a0] text-[#b4abff] border border-[#2900a0]/30 px-6 py-2.5 rounded-xl font-body-sm font-semibold shadow-lg hover:scale-95 active:opacity-80 transition-all flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider font-sans"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          Save changes
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Retrieval Box */}
        <section className="glass-card rounded-2xl p-6 flex flex-col gap-6 md:col-span-1">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#6dfad2]">search_insights</span>
            <h3 className="font-headline-md text-[18px] font-bold text-white">Retrieval</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <label className="font-label-md text-[#d5e4fa] text-[13px] font-semibold">Default TopK</label>
              <div className="flex items-center bg-[#010f1f] border border-white/10 rounded-lg p-1">
                <button 
                  onClick={() => setTopK(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors cursor-pointer text-[#c9c5d0]"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <span className="px-4 font-code-block text-primary text-sm font-mono font-bold select-none">{topK}</span>
                <button 
                  onClick={() => setTopK(prev => Math.min(50, prev + 1))}
                  className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors cursor-pointer text-[#c9c5d0]"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-[#d5e4fa] text-[13px] font-semibold">Similarity Threshold</label>
                <span className="font-code-block text-[#6dfad2] text-[13px] font-mono font-bold">{threshold.toFixed(2)}</span>
              </div>
              <input 
                className="w-full cursor-pointer accent-[#e4deff]" 
                max="1" 
                min="0" 
                step="0.01" 
                type="range" 
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
              />
            </div>
            
            <div className="flex justify-between items-center py-2 border-t border-white/5 pt-4">
              <div className="space-y-0.5">
                <label className="font-label-md text-[#d5e4fa] text-[13px] font-semibold">Reranker</label>
                <p className="font-body-sm text-[11px] text-[#c9c5d0]/70">Use second-pass cross-encoders</p>
              </div>
              <button 
                onClick={() => setReranker(!reranker)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  reranker ? "bg-[#e4deff]" : "bg-white/10"
                }`}
                type="button"
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#051424] shadow ring-0 transition duration-200 ease-in-out ${
                  reranker ? "translate-x-5" : "translate-x-0"
                }`}></span>
              </button>
            </div>
          </div>
        </section>

        {/* Citations Box */}
        <section className="glass-card rounded-2xl p-6 flex flex-col gap-6 md:col-span-1">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#c6bfff]">format_quote</span>
            <h3 className="font-headline-md text-[18px] font-bold text-white">Citations</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="font-label-md text-[#d5e4fa] text-[13px] font-semibold">Citation Format</label>
              <div className="grid grid-cols-3 bg-[#010f1f] rounded-xl p-1 gap-1 border border-white/5">
                <button 
                  onClick={() => setFormat("numbered")}
                  className={`py-2 rounded-lg font-label-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    format === "numbered" ? "bg-[#e4deff]/20 text-white" : "hover:bg-white/5 text-[#c9c5d0]/60"
                  }`}
                  type="button"
                >
                  Numbered [1]
                </button>
                <button 
                  onClick={() => setFormat("author")}
                  className={`py-2 rounded-lg font-label-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    format === "author" ? "bg-[#e4deff]/20 text-white" : "hover:bg-white/5 text-[#c9c5d0]/60"
                  }`}
                  type="button"
                >
                  Author (Yr)
                </button>
                <button 
                  onClick={() => setFormat("superscript")}
                  className={`py-2 rounded-lg font-label-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    format === "superscript" ? "bg-[#e4deff]/20 text-white" : "hover:bg-white/5 text-[#c9c5d0]/60"
                  }`}
                  type="button"
                >
                  Superscript ¹
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Generation Box */}
        <section className="glass-card rounded-2xl p-6 flex flex-col gap-6 md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            <h3 className="font-headline-md text-[18px] font-bold text-white">Generation</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="font-label-md text-[#d5e4fa] text-[13px] font-semibold">Temperature</label>
                  <span className="font-code-block text-primary text-[13px] font-mono font-bold">{temp.toFixed(2)}</span>
                </div>
                <input 
                  className="w-full cursor-pointer accent-[#e4deff]" 
                  max="2" 
                  min="0" 
                  step="0.05" 
                  type="range" 
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="font-label-md text-[#d5e4fa] text-[13px] block font-semibold">System Prompt</label>
              <textarea 
                className="w-full bg-[#010f1f] border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-[#c9c5d0] focus:border-primary outline-none transition-all resize-none" 
                rows="4"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
              />
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}