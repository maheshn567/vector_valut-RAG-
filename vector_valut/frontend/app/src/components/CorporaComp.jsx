export default function CorporaComp({ group, onEdit, onDelete, onViewDocs }) {
  return (
    <div className="bg-[#11141C]/70 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col group hover:-translate-y-1 transition-all duration-300 relative text-left">
      
      {/* Header Tags */}
      <div className="flex justify-between items-center mb-4">
        <span className="px-2.5 py-1 rounded bg-[#6C5CE7]/10 text-[#c6bfff] font-['JetBrains_Mono'] text-[9px] uppercase tracking-wider font-bold">
          {group.parentAppName || "RAG Pipeline"}
        </span>
        <div className="flex items-center gap-1.5 text-xs text-[#4bddb7]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4bddb7] animate-pulse"></span>
          <span className="font-['JetBrains_Mono'] text-[10px] font-semibold uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Body Info */}
      <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-[#c6bfff] transition-colors">
        {group.groupName}
      </h3>
      <p className="text-xs text-[#c8c4d7]/70 mb-6 flex-grow line-clamp-3 leading-relaxed">
        {group.groupDescription || "No description provided."}
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 border-t border-white/5 pt-4">
        <div>
          <p className="text-base font-bold text-white">{group.docCount || 0}</p>
          <p className="text-[9px] font-['JetBrains_Mono'] uppercase tracking-widest text-[#c8c4d7]/40">Documents</p>
        </div>
        <div>
          <p className="text-base font-bold text-white">
            {group.chunkCount || 0}
          </p>
          <p className="text-[9px] font-['JetBrains_Mono'] uppercase tracking-widest text-[#c8c4d7]/40">Chunks</p>
        </div>
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-[10px] text-[#c8c4d7]/40 font-mono">
          Updated {new Date(group.updatedAt || group.createdAt).toLocaleDateString()}
        </span>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onViewDocs(group.groupId)}
            className="text-[#6c5ce7] text-xs font-bold hover:underline cursor-pointer"
          >
            View Documents
          </button>
          
          {/* Options Dropdown */}
          <div className="relative group/menu">
            <button className="text-[#c8c4d7] hover:text-[#6c5ce7] transition-colors cursor-pointer flex items-center">
              <span className="material-symbols-outlined text-base">more_horiz</span>
            </button>
            <div className="absolute right-0 bottom-6 hidden group-hover/menu:block bg-[#122131] border border-white/5 rounded-lg py-1 w-24 shadow-xl z-20">
              <button 
                onClick={() => onEdit(group)}
                className="w-full text-left px-3 py-1.5 text-[11px] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(group.groupId)}
                className="w-full text-left px-3 py-1.5 text-[11px] text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}