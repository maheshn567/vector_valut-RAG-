import { useState } from "react";
import { toast } from "sonner";

export default function TenAntApp({ tenantApp, onToggleStatus, onEdit, onDelete }) {

  return (
    <article className="bg-[#11141C] border border-white/5 rounded-xl p-6 flex flex-col relative group hover:border-[#6c5ce7]/30 transition-colors text-left">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-['Hanken_Grotesk'] text-base font-bold text-white group-hover:text-[#c6bfff] transition-colors truncate max-w-[180px]">
            {tenantApp.appName}
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-['JetBrains_Mono'] font-bold bg-[#4bddb7]/10 text-[#4bddb7] w-fit border border-[#4bddb7]/20 uppercase tracking-wider">
            {tenantApp.appType || "Support Bot"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Toggle */}
          <div className="relative inline-block w-8 align-middle select-none transition duration-200 ease-in">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox"
                checked={tenantApp.isActive}
                onChange={(e) => onToggleStatus(tenantApp.appId, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6c5ce7]"></div>
            </label>
          </div>

          {/* Options Dropdown */}
          <div className="relative group/menu">
            <button className="text-[#c8c4d7] hover:text-[#6c5ce7] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-lg">more_vert</span>
            </button>
            
            {/* Popover Action Menu */}
            <div className="absolute right-0 top-6 hidden group-hover/menu:block bg-[#122131] border border-white/5 rounded-lg py-1 w-24 shadow-xl z-20">
              <button 
                onClick={() => onEdit(tenantApp)}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                Edit App
              </button>
              <button 
                onClick={() => onDelete(tenantApp.appId)}
                className="w-full text-left px-3 py-1.5 text-xs text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="font-['Inter'] text-xs text-[#c8c4d7]/70 mb-6 flex-grow line-clamp-3">
        {tenantApp.appDescription || "No description provided."}
      </p>


    </article>
  );
}