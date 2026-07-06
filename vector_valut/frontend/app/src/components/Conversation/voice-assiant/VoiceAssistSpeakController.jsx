import React from "react";

export default function VoiceAssistSpeakController({
  status,
  aiResponseText,
  selectedDoc,
  onOrbClick,
  onEndCall,
  onTabChange
}) {
  return (
    <div className="w-full flex-grow flex flex-col justify-between items-center z-20">
      {/* Main Central Visualization */}
      <main className="flex-grow w-full flex flex-col items-center justify-center relative">
        
        {/* Central Orb Container */}
        <div className="relative group">
          {/* Radial Glow Background */}
          <div className="absolute inset-0 bg-[#4BDDB7]/20 blur-[60px] rounded-full scale-110 opacity-50 animate-pulse"></div>
          
          {/* Main Animated Orb */}
          <div 
            onClick={onOrbClick}
            className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center cursor-pointer hover:scale-105 transition-all"
            title="Click to interrupt"
          >
            <svg className="w-full h-full scale-125" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              {/* Outer Rotating Ring */}
              <circle cx="100" cy="100" fill="none" r="95" stroke="rgba(75,221,183,0.15)" strokeDasharray="10 20" strokeWidth="2">
                <animateTransform attributeName="transform" dur="15s" from="0 100 100" repeatCount="infinite" to="360 100 100" type="rotate" />
              </circle>
              
              {/* Middle Reverse Rotating Ring */}
              <circle cx="100" cy="100" fill="none" r="78" stroke="rgba(75,221,183,0.25)" strokeDasharray="5 15" strokeWidth="2">
                <animateTransform attributeName="transform" dur="10s" from="360 100 100" repeatCount="infinite" to="0 100 100" type="rotate" />
              </circle>

              {/* Breathing Glow Sphere */}
              <defs>
                <radialGradient id="sphereGlowTeal" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#4BDDB7" stopOpacity="0.75" />
                  <stop offset="70%" stopColor="#4BDDB7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4BDDB7" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" fill="url(#sphereGlowTeal)" r="60">
                <animate attributeName="r" calcMode="spline" dur="1.8s" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" repeatCount="infinite" values="55;68;55" />
                <animate attributeName="opacity" dur="1.8s" repeatCount="infinite" values="0.7;1;0.7" />
              </circle>

              {/* Core Pulsing Dot */}
              <circle cx="100" cy="100" fill="#4BDDB7" r="12">
                <animate attributeName="opacity" dur="1s" repeatCount="infinite" values="0.8;1;0.8" />
                <circle cx="100" cy="100" fill="#4BDDB7" opacity="0.4" r="12">
                  <animate attributeName="r" dur="1s" repeatCount="infinite" values="12;28" />
                  <animate attributeName="opacity" dur="1s" repeatCount="infinite" values="0.5;0" />
                </circle>
              </circle>
            </svg>
          </div>

          {/* Symmetrical Waveform Overlay */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1.5 h-12 z-30 pointer-events-none">
            <div className="waveform-bar w-1 rounded-full bg-[#4BDDB7]" style={{ animationDelay: "0.1s", height: "12px" }}></div>
            <div className="waveform-bar w-1 rounded-full bg-[#4BDDB7]" style={{ animationDelay: "0.3s", height: "24px" }}></div>
            <div className="waveform-bar w-1 rounded-full bg-[#4BDDB7]" style={{ animationDelay: "0.5s", height: "32px" }}></div>
            <div className="waveform-bar w-1 rounded-full bg-[#4BDDB7]" style={{ animationDelay: "0.2s", height: "20px" }}></div>
            <div className="waveform-bar w-1 rounded-full bg-[#4BDDB7]" style={{ animationDelay: "0.4s", height: "28px" }}></div>
            <div className="waveform-bar w-1 rounded-full bg-[#4BDDB7]" style={{ animationDelay: "0.6s", height: "16px" }}></div>
          </div>
        </div>

        {/* AI Status Header & Response Text */}
        <div className="space-y-6 mt-12 text-center max-w-xl px-6">
          <p className="text-xs text-[#4BDDB7] font-semibold uppercase tracking-widest flex items-center justify-center gap-3 select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4BDDB7] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4BDDB7]"></span>
            </span>
            Speaking...
          </p>

          <div className="p-6 glass-panel rounded-2xl border border-white/10 text-left shadow-2xl relative">
            <h2 className="text-base text-white font-medium leading-relaxed">
              {aiResponseText}
            </h2>
            
            {/* Citation Pills */}
            {selectedDoc && (
              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-white/5">
                <div className="glass-panel px-3 py-1.5 rounded-full flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#6dfad2]">description</span>
                  <span className="text-xs text-[#c9c5d0]">
                    {selectedDoc.docName}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Symmetrical Bottom Control Bar */}
      <nav className="fixed bottom-0 left-0 w-full px-6 md:px-10 py-8 z-50 flex flex-col items-center gap-6">
        
        {/* Interrupt Session Trigger */}
        <button 
          onClick={onOrbClick}
          className="bg-[#283647]/80 hover:bg-[#283647] border border-white/10 backdrop-blur-md px-6 py-2.5 rounded-full flex items-center gap-2 group active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">pan_tool</span>
          <span className="text-xs font-semibold text-white uppercase tracking-wider">Interrupt Session</span>
        </button>

        {/* Console Navigation Bar Tabs */}
        <div className="glass-panel rounded-full px-4 py-3 flex items-center gap-2 w-full max-w-md shadow-2xl z-30">
          <button 
            onClick={() => onTabChange("conversations")}
            className="flex-grow flex flex-col items-center py-1 gap-1 text-[#c9c5d0] hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">psychology</span>
            <span className="text-[10px] uppercase tracking-tighter">Neural</span>
          </button>
          
          <button 
            onClick={() => onTabChange("voice-assistant")}
            className="flex-grow flex flex-col items-center py-1 gap-1 text-[#e4deff] font-bold transition-colors cursor-pointer"
          >
            <div className="bg-[#e4deff]/10 px-4 py-1 rounded-full flex flex-col items-center">
              <span className="material-symbols-outlined fill-icon" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
              <span className="text-[10px] uppercase tracking-tighter">Voice</span>
            </div>
          </button>
          
          <button 
            onClick={() => onTabChange("corpora")}
            className="flex-grow flex flex-col items-center py-1 gap-1 text-[#c9c5d0] hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">hub</span>
            <span className="text-[10px] uppercase tracking-tighter">Vectors</span>
          </button>
          
          <button 
            onClick={() => onTabChange("documents")}
            className="flex-grow flex flex-col items-center py-1 gap-1 text-[#c9c5d0] hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">database</span>
            <span className="text-[10px] uppercase tracking-tighter">Vault</span>
          </button>
        </div>
      </nav>
    </div>
  );
}