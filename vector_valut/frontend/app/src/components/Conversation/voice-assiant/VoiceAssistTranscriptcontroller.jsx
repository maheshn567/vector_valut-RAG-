import React from "react";

export default function VoiceAssitTranscriptController({
  onClear,
  onMicClick,
  onExit,
  onExport,
  onShare
}) {
  return (
    <footer className="w-full z-40 bg-[#010f1f]/95 border-t border-white/5 px-6 md:px-16 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
          
          {/* Left info pill */}
          <div className="hidden md:flex flex-col select-none">
            <span className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Current Focus</span>
            <span className="text-xs text-[#6dfad2] font-semibold italic">"Analyzing downsizing clauses..."</span>
          </div>

          {/* Center Call / Restart Actions */}
          <div className="flex items-center gap-6 mx-auto md:mx-0">
            <button 
              onClick={onClear}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all hover:scale-105 active:scale-95 text-white/60 cursor-pointer"
              title="Clear history"
            >
              <span className="material-symbols-outlined">delete_sweep</span>
            </button>
            
            {/* Central Call Trigger */}
            <button 
              onClick={onMicClick}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#e4dfff] to-[#6dfad2] flex items-center justify-center orb-glow hover:scale-110 active:scale-90 transition-all duration-300 shadow-2xl cursor-pointer"
              title="Restart voice call"
            >
              <span className="material-symbols-outlined text-[#2900a0] text-3xl font-fill" style={{ fontVariationSettings: "'FILL' 1" }}>
                graphic_eq
              </span>
            </button>

            <button 
              onClick={onExit}
              className="px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center gap-2 hover:bg-red-500/20 transition-all hover:scale-105 active:scale-95 text-red-400 font-semibold text-xs uppercase tracking-wider cursor-pointer"
              title="Back to chat"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              Back to Chat
            </button>
          </div>

          {/* Right Export / Share Buttons */}
          <div className="hidden md:flex gap-3">
            <button 
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 hover:text-white text-white/80 transition-all text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Export
            </button>
            <button 
              onClick={onShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#c6bfff] text-[#160066] font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">share</span>
              Share
            </button>
          </div>

        </div>
    </footer>
  );
}