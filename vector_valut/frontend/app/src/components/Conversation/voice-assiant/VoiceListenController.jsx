import React from "react";

export default function VoiceListenController({
  status,
  waveformHeights,
  onOrbClick,
  isMuted,
  setIsMuted,
  isSpeakerEnabled,
  setIsSpeakerEnabled,
  onEndCall,
  onTypeInstead
}) {
  return (
    <div className="w-full flex-grow flex flex-col justify-between items-center z-20">
      {/* Main Central Visualization */}
      <main className="flex-grow w-full flex flex-col items-center justify-center relative">
        
        {/* Animated Central Orb */}
        <div 
          onClick={onOrbClick}
          className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center cursor-pointer transition-all hover:scale-105"
        >
          {/* Atmospheric Glow Background */}
          <div className={`absolute inset-0 rounded-full blur-[80px] transition-all duration-700 ${
            status === "recording" ? "bg-red-500/25 animate-pulse" :
            status === "processing" ? "bg-[#c6bfff]/15 animate-pulse" : "bg-[#6C5CE7]/20"
          }`}></div>

          <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Rotating Ring */}
            <circle cx="100" cy="100" fill="none" r="95" stroke={status === "recording" ? "rgba(239, 68, 68, 0.15)" : "rgba(198,191,255,0.08)"} strokeDasharray="10 20" strokeWidth="2">
              <animateTransform attributeName="transform" dur="20s" from="0 100 100" repeatCount="infinite" to="360 100 100" type="rotate" />
            </circle>
            
            {/* Middle Reverse Rotating Ring */}
            <circle cx="100" cy="100" fill="none" r="78" stroke={status === "recording" ? "rgba(239, 68, 68, 0.25)" : "rgba(108,92,231,0.15)"} strokeDasharray="5 15" strokeWidth="2">
              <animateTransform attributeName="transform" dur="12s" from="360 100 100" repeatCount="infinite" to="0 100 100" type="rotate" />
            </circle>

            {/* Breathing Glow Sphere */}
            <defs>
              <radialGradient id="sphereGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={status === "recording" ? "#EF4444" : "#6C5CE7"} stopOpacity="0.65" />
                <stop offset="70%" stopColor={status === "recording" ? "#EF4444" : "#6C5CE7"} stopOpacity="0.15" />
                <stop offset="100%" stopColor={status === "recording" ? "#EF4444" : "#6C5CE7"} stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" fill="url(#sphereGlow)" r="60">
              <animate attributeName="r" calcMode="spline" dur="2.5s" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" repeatCount="infinite" values="55;64;55" />
              <animate attributeName="opacity" dur="2.5s" repeatCount="infinite" values="0.65;0.95;0.65" />
            </circle>

            {/* Core Pulsing Dot */}
            <circle cx="100" cy="100" fill={status === "recording" ? "#EF4444" : "#C6BFFF"} r="12">
              <animate attributeName="opacity" dur="1.5s" repeatCount="infinite" values="0.8;1;0.8" />
              <circle cx="100" cy="100" fill={status === "recording" ? "#EF4444" : "#C6BFFF"} opacity="0.4" r="12">
                <animate attributeName="r" dur="1.5s" repeatCount="infinite" values="12;24" />
                <animate attributeName="opacity" dur="1.5s" repeatCount="infinite" values="0.4;0" />
              </circle>
            </circle>
          </svg>
        </div>

        {/* Status Text Stack */}
        <div className="text-center mt-12 space-y-3 px-6 select-none">
          <h2 className="text-2xl font-bold text-white tracking-wide uppercase">
            {status === "listening" && "Mic is Ready"}
            {status === "recording" && "Listening..."}
            {status === "processing" && "Thinking..."}
          </h2>
          <p className="text-sm text-[#c9c5d0]/80">
            {status === "listening" && "Click the orb to start speaking"}
            {status === "recording" && "Click again when you finish speaking"}
            {status === "processing" && "Analyzing voice patterns and retrieving context"}
          </p>
        </div>

        {/* Audio Waveform Visualization */}
        <div className="mt-16 h-20 flex items-center justify-center gap-1.5 w-full max-w-lg px-8">
          {waveformHeights.map((height, i) => (
            <div 
              key={i}
              className={`w-1 rounded-full transition-all duration-100 ${
                status === "recording" 
                  ? "bg-gradient-to-t from-red-500 to-[#c6bfff]" 
                  : "bg-gradient-to-t from-[#c6bfff] to-[#6dfad2]"
              }`}
              style={{ height: `${height}px` }}
            ></div>
          ))}
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="w-full grid grid-cols-3 items-center mt-10">
        
        {/* Left Toggle buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="group flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className={`w-14 h-14 rounded-full glass-panel flex items-center justify-center transition-all ${
              isMuted ? "border-red-500 text-red-500 bg-red-500/10" : "text-white/70 hover:text-white"
            }`}>
              <span className="material-symbols-outlined text-[24px]">
                {isMuted ? "mic_off" : "mic"}
              </span>
            </div>
            <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">
              {isMuted ? "Muted" : "Mute"}
            </span>
          </button>

          <button 
            onClick={() => setIsSpeakerEnabled(!isSpeakerEnabled)}
            className="group flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className={`w-14 h-14 rounded-full glass-panel flex items-center justify-center transition-all ${
              !isSpeakerEnabled ? "border-red-500 text-red-500 bg-red-500/10" : "text-white/70 hover:text-white"
            }`}>
              <span className="material-symbols-outlined text-[24px]">
                {isSpeakerEnabled ? "volume_up" : "volume_off"}
              </span>
            </div>
            <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">
              Speaker
            </span>
          </button>
        </div>

        {/* Center: End Call Action */}
        <div className="flex justify-center">
          <button 
            onClick={onEndCall}
            className="btn-glow-error flex items-center gap-3 px-8 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-800 text-white font-bold text-base transition-transform active:scale-95 shadow-xl cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              call_end
            </span>
            <span>End Call</span>
          </button>
        </div>

        {/* Right Keyboard Shortcut Trigger */}
        <div className="flex justify-end">
          <button 
            onClick={onTypeInstead}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group cursor-pointer"
          >
            <span className="text-sm font-semibold">Type instead</span>
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
            <div className="ml-2 px-2.5 py-1 rounded bg-[#283647] border border-white/10 text-[11px] font-mono text-[#c9c5d0]">
              ⌘ K
            </div>
          </button>
        </div>
      </footer>
    </div>
  );
}