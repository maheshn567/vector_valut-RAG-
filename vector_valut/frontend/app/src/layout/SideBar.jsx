import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Hooks/useAuthHook";

export default function SideBar({ onCtaClick, ctaText }) {
  const { tenant, logout } = useAuth();
  const location = useLocation();

  const getLinkClass = (path) => {
    const isActive = location.pathname.startsWith(path);
    return isActive
      ? "bg-[#6c5ce7]/10 text-[#c6bfff] font-bold rounded-lg flex items-center gap-3 py-2.5 px-4 transition-all"
      : "flex items-center gap-3 py-2.5 px-4 text-[#c8c4d7] hover:bg-white/5 hover:text-white transition-all rounded-lg";
  };

  if (!tenant) return null;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0d1c2d] border-r border-white/5 flex flex-col py-6 px-4 gap-4 z-40 shadow-xl">
      {/* Branding Header */}
      <div className="flex items-center gap-3 px-2 mb-4">
        <div className="w-8 h-8 bg-[#6c5ce7] rounded flex items-center justify-center shadow-md shadow-[#6c5ce7]/20">
          <span className="material-symbols-outlined text-white text-lg">security</span>
        </div>
        <div className="text-left">
          <h1 className="font-['Hanken_Grotesk'] text-base font-bold text-white leading-none tracking-tight truncate max-w-[160px]">
            {tenant.orgName || tenant.name}
          </h1>
          <p className="font-['JetBrains_Mono'] text-[9px] text-[#4bddb7] tracking-widest mt-1 uppercase font-semibold">
            Developer Space
          </p>
        </div>
      </div>

      {/* Conditional CTA Button */}
      {ctaText && onCtaClick && (
        <button 
          onClick={onCtaClick}
          className="w-full py-2.5 px-4 bg-[#6c5ce7] hover:bg-[#5847d2] text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all mb-4 cursor-pointer text-sm font-['JetBrains_Mono'] uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-sm font-bold">add</span>
          <span>{ctaText}</span>
        </button>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 text-left">
        <Link to="/dashboard" className={getLinkClass("/dashboard")}>
          <span className="material-symbols-outlined text-base">dashboard</span>
          <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider">Dashboard</span>
        </Link>
        
        <Link to="/apps" className={getLinkClass("/apps")}>
          <span className="material-symbols-outlined text-base">apps</span>
          <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider">Apps</span>
        </Link>

        <Link to="/corpora" className={getLinkClass("/corpora")}>
          <span className="material-symbols-outlined text-base">database</span>
          <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider">Corpora / Groups</span>
        </Link>

        <Link to="/documents" className={getLinkClass("/documents")}>
          <span className="material-symbols-outlined text-base">description</span>
          <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider">Documents</span>
        </Link>

        <Link to="/conversations" className={getLinkClass("/conversations")}>
          <span className="material-symbols-outlined text-base">forum</span>
          <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider">Conversations</span>
        </Link>

        <Link to="/keys" className={getLinkClass("/keys")}>
          <span className="material-symbols-outlined text-base">vpn_key</span>
          <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider">API Keys</span>
        </Link>

        <Link to="/settings" className={getLinkClass("/settings")}>
          <span className="material-symbols-outlined text-base">settings</span>
          <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider">Settings</span>
        </Link>
      </nav>

      {/* Support & Logout */}
      <div className="pt-4 border-t border-white/5 space-y-1 text-left">
        <a href="#support" className="flex items-center gap-3 py-2 px-4 text-[#c8c4d7] hover:text-[#6c5ce7] transition-colors rounded-lg text-sm">
          <span className="material-symbols-outlined text-base">contact_support</span>
          <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider">Support</span>
        </a>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 py-2 px-4 text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors rounded-lg text-sm cursor-pointer text-left font-semibold font-['JetBrains_Mono'] uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-base">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}