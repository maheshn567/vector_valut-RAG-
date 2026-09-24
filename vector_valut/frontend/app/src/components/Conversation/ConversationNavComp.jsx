import React from "react";

export default function ConversationNavComp({
  apps = [],
  selectedApp,
  onAppChange,
  documents = [],
  selectedDocId,
  onDocChange,
  rerankerOn,
  onRerankerToggle,
  isHistoryOpen,
  onExpandHistory,
}) {
  return (
    <header className="h-16 bg-[#11141C]/75 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-15">
      {/* Dropdown Selectors on Left */}
      <div className="flex items-center gap-3">
        {!isHistoryOpen && (
          <button
            onClick={onExpandHistory}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-md transition-all cursor-pointer mr-1 flex items-center justify-center"
            title="Expand History"
          >
            <span className="material-symbols-outlined text-[20px]">history</span>
          </button>
        )}
        {/* App Selection Dropdown */}
        <div className="flex items-center gap-2 px-3 py-1 bg-[#122031] rounded-full border border-white/5 text-[12px] font-mono">
          <span className="material-symbols-outlined text-[16px] text-[#e4deff]">apps</span>
          <span className="text-[#d5e4fa]/50">App:</span>
          {apps.length === 0 ? (
            <span className="text-white/40">No Apps Created</span>
          ) : (
            <select
              value={selectedApp?.appId || ""}
              onChange={(e) => onAppChange(e.target.value)}
              className="bg-transparent border-none text-[#e4deff] font-bold focus:ring-0 cursor-pointer outline-none text-[12px] p-0"
            >
              {apps.map((app) => (
                <option key={app.appId} value={app.appId} className="bg-[#122031] text-[#d5e4fa]">
                  {app.appName}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Document Filter Dropdown */}
        <div className="flex items-center gap-2 px-3 py-1 bg-[#122031] rounded-full border border-white/5 text-[12px] font-mono">
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">description</span>
          <span className="text-[#d5e4fa]/50">Doc:</span>
          <select
            value={selectedDocId}
            onChange={(e) => onDocChange(e.target.value)}
            className="bg-transparent border-none text-[#d5e4fa] focus:ring-0 cursor-pointer outline-none text-[12px] p-0 max-w-[160px] truncate"
          >
            <option value="all" className="bg-[#122031] text-[#d5e4fa]">
              All Documents
            </option>
            {documents.map((doc) => (
              <option key={doc.docId} value={doc.docId} className="bg-[#122031] text-[#d5e4fa]">
                {doc.docName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reranker Toggle Controls on Right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant select-none">
            Reranker
          </span>
          <div
            onClick={onRerankerToggle}
            className={`w-10 h-5 rounded-full relative flex items-center p-0.5 border cursor-pointer transition-all duration-300 ${
              rerankerOn ? "bg-[#6dfad2]/20 border-[#6dfad2]/30" : "bg-white/10 border-white/20"
            }`}
            title="Toggle Reranker search boost"
          >
            <div
              className={`w-4 h-4 rounded-full transition-transform duration-300 ${
                rerankerOn ? "bg-[#6dfad2] translate-x-5" : "bg-white/40 translate-x-0"
              }`}
            ></div>
          </div>
          <span className={`text-[11px] font-bold uppercase font-mono ${rerankerOn ? "text-[#6dfad2]" : "text-white/40"}`}>
            {rerankerOn ? "ON" : "OFF"}
          </span>
        </div>
      </div>
    </header>
  );
}