import React from "react";

export default function SettingsPageSideBar({ activeView, setActiveView }) {
  const links = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security & Auth" },
    { id: "rag-defaults", label: "RAG Defaults" },
  ];

  return (
    <aside className="w-[240px] bg-[#0B0E17] border-r border-white/5 flex flex-col py-8 z-10 shrink-0 text-left">
      <h3 className="px-6 mb-6 font-label-md text-[11px] uppercase tracking-widest text-[#c9c5d0]/60 font-mono">
        Configuration
      </h3>
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const isActive = activeView === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveView(link.id)}
              className={`w-full text-left flex items-center px-4 py-2.5 rounded-lg transition-all text-xs font-semibold tracking-wider font-sans cursor-pointer ${
                isActive
                  ? "bg-[#6c5ce7]/12 border-l-4 border-[#6c5ce7] text-[#c6bfff] pl-3"
                  : "text-[#c8c4d7] border-l-4 border-transparent hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </button>
          );
        })}
        <div className="pt-4 mt-4 border-t border-white/5">
          <button
            onClick={() => setActiveView("danger-zone")}
            className={`w-full text-left flex items-center px-4 py-2.5 rounded-lg transition-all text-xs font-semibold tracking-wider font-sans cursor-pointer ${
              activeView === "danger-zone"
                ? "bg-red-500/10 border-l-4 border-red-500 text-red-400 pl-3"
                : "text-red-400/70 border-l-4 border-transparent hover:bg-red-500/5 hover:text-red-400"
            }`}
          >
            Danger Zone
          </button>
        </div>
      </nav>
    </aside>
  );
}