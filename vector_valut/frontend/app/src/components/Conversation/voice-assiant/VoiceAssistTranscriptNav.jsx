import React from "react";

export default function VoiceAssistTranscriptNav({ sessionTime, onClose }) {
  return (
    <header className="flex justify-between items-center py-4 h-16 w-full px-6 md:px-16 z-30 bg-[#051424]/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6dfad2] to-[#c6bfff] animate-pulse orb-glow"></div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-white leading-tight">Conversation Transcript</h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6dfad2] animate-ping"></span>
            <span className="text-[10px] font-semibold text-[#c9c5d0] uppercase tracking-wider">Session Ended</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="bg-[#122031]/50 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          <span className="text-xs font-mono font-bold text-[#6dfad2] tracking-widest">{sessionTime}</span>
        </div>
        <button className="material-symbols-outlined text-[#c9c5d0] hover:text-white transition-colors cursor-pointer">
          settings
        </button>
        <button 
          onClick={onClose}
          className="material-symbols-outlined text-[#c9c5d0] hover:text-red-400 transition-colors cursor-pointer"
        >
          close
        </button>
      </div>
    </header>
  );
}