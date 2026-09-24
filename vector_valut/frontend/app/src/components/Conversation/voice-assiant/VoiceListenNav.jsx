import React from "react";

export default function VoiceListenNav({
  selectedApp,
  apps,
  setSelectedApp,
  showAppDropdown,
  setShowAppDropdown,
  selectedDoc,
  documents,
  setSelectedDoc,
  showDocDropdown,
  setShowDocDropdown,
  mode,
  setMode,
  onClose,
  panelMode,
  onToggleExpand
}) {
  if (panelMode === "live-transcript") {
    return (
      <header className="flex justify-between items-center py-4 h-16 w-full px-6 md:px-16 z-30 bg-[#051424]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          {/* Compact 40px pulsing orb button */}
          <button 
            onClick={onToggleExpand}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6dfad2] to-[#c6bfff] animate-pulse cursor-pointer flex items-center justify-center border border-[#6dfad2]/20 hover:scale-105 active:scale-95 transition-all shadow-md"
            title="Expand voice panel"
          >
            <span className="material-symbols-outlined text-sm text-[#160066] font-fill" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
          </button>
          <div className="flex flex-col text-left">
            <h1 className="text-sm md:text-base font-bold text-white leading-tight">Vector Vault Voice</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6dfad2] animate-ping"></span>
              <span className="text-[10px] font-semibold text-[#c9c5d0] uppercase tracking-wider">Live Voice Session</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer"
            title="End call"
          >
            <span className="material-symbols-outlined text-sm">call_end</span>
            End Call
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full flex justify-between items-start z-30 relative">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#e4deff] text-3xl font-fill" style={{ fontVariationSettings: "'FILL' 1" }}>
            psychology
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#e4deff]">Vector Vault Voice</h1>
        </div>

        {/* Interactive Scope Pills / Context Dropdowns */}
        <div className="flex items-center gap-2 relative">
          
          {/* App Selector Pill */}
          <div className="relative">
            <button 
              onClick={() => { setShowAppDropdown(!showAppDropdown); setShowDocDropdown(false); }}
              className="bg-[#1d2b3c]/85 hover:bg-[#283647] px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#6dfad2]">hub</span>
              <span className="text-sm font-medium text-[#d5e4fa]">
                {selectedApp ? selectedApp.name : "Select App"}
              </span>
              <span className="material-symbols-outlined text-xs">arrow_drop_down</span>
            </button>
            {showAppDropdown && (
              <div className="absolute top-10 left-0 w-52 glass-panel rounded-xl shadow-2xl p-2 flex flex-col gap-1 z-50">
                {apps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => { setSelectedApp(app); setShowAppDropdown(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors text-white"
                  >
                    {app.name}
                  </button>
                ))}
                {apps.length === 0 && <span className="text-xs text-white/40 p-2 block">No apps created</span>}
              </div>
            )}
          </div>

          {/* Doc Selector Pill */}
          <div className="relative">
            <button 
              onClick={() => { setShowDocDropdown(!showDocDropdown); setShowAppDropdown(false); }}
              className="bg-[#e4deff]/10 hover:bg-[#e4deff]/20 px-4 py-1.5 rounded-full border border-[#e4deff]/20 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#e4deff]">description</span>
              <span className="text-sm font-medium text-[#e4deff]">
                {selectedDoc ? selectedDoc.docName : "All Documents"}
              </span>
              <span className="material-symbols-outlined text-xs">arrow_drop_down</span>
            </button>
            {showDocDropdown && (
              <div className="absolute top-10 left-0 w-64 glass-panel rounded-xl shadow-2xl p-2 flex flex-col gap-1 z-50 max-h-60 overflow-y-auto">
                <button
                  onClick={() => { setSelectedDoc(null); setShowDocDropdown(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors text-white/60"
                >
                  All Documents
                </button>
                {documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => { setSelectedDoc(doc); setShowDocDropdown(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors text-white"
                  >
                    {doc.docName}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Action Settings Cluster */}
      <div className="flex items-center gap-3">
        {/* Mode switch */}
        <div className="bg-[#122031]/80 px-2 py-1 rounded-full border border-white/5 flex items-center gap-1">
          <button 
            onClick={() => setMode("transcribe")}
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              mode === "transcribe" ? "bg-[#c6bfff] text-[#160066]" : "text-white/60 hover:text-white"
            }`}
          >
            Transcribe
          </button>
          <button 
            onClick={() => setMode("translate")}
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              mode === "translate" ? "bg-[#6dfad2] text-[#002018]" : "text-white/60 hover:text-white"
            }`}
          >
            Translate
          </button>
        </div>
        <button className="w-12 h-12 flex items-center justify-center rounded-full glass-panel text-[#c9c5d0] hover:text-white transition-all active:scale-95 cursor-pointer">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <button 
          onClick={onClose}
          className="w-12 h-12 flex items-center justify-center rounded-full glass-panel text-[#c9c5d0] hover:text-white transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </header>
  );
}