import { useState } from "react";
import { useAuth } from "../Hooks/useAuthHook";
import SideBar from "../layout/SideBar";
import SettingsPageSideBar from "../components/Settings/SettingsPageSideBar";
import Profile from "../components/Settings/Profile";
import Security_Auth from "../components/Settings/Security&Auth";
import RAGDefaults from "../components/Settings/RAGDefaults";
import DangerZone from "../components/Settings/DangerZone";

export default function SettingsPage() {
  const { tenant } = useAuth();
  
  // Tab state: 'profile' | 'security' | 'rag-defaults' | 'danger-zone'
  const [activeView, setActiveView] = useState("profile");

  // Fallback avatar image
  const avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuB37Dl7rbG10yrjVTIDEvV-bR1qzu9G-zRAO5KJ1hv4Zb6gjewSjbnyiZ6NhTUy-HQ_BpKWmj7XcEzOzoersWvEmiu0qIG4vmpyoePopP8n55BbfFtN6Q8PbJYAXn050BuR0EhD1NWOZ1TWKjoO4DWvSjrcfUAsxoiW69DDYbtA_a93YrI6y9i1c3XxE6saqJTjvYXUcxDrW_xs8--VxP9Ww8jj-vqf5AglhL-F0qs1jXgmQwwUghfdSxUDyevNgh7oRMuC6qgrANg";

  return (
    <div className="bg-[#051424] text-[#d5e4fa] h-screen w-screen overflow-hidden flex relative selection:bg-primary/30 font-sans">
      {/* 1. Ambient Background Grid Texture */}
      <div className="absolute inset-0 grid-texture pointer-events-none opacity-20 z-0"></div>
      
      {/* Glow Orbs */}
      <div className="fixed top-[-10%] left-[10%] w-[45%] h-[45%] bg-[#6c5ce7] opacity-[0.03] blur-[120px] rounded-full z-0 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-[#6dfad2] opacity-[0.02] blur-[120px] rounded-full z-0 pointer-events-none animate-pulse" style={{ animationDuration: '10s' }}></div>

      {/* 2. Global primary SideBar Navigation */}
      <SideBar />

      {/* 3. Main Workspace Container offset by SideBar (ml-64) */}
      <div className="flex flex-1 ml-64 h-full relative z-10 overflow-hidden">
        
        {/* Settings Secondary Navigation */}
        <SettingsPageSideBar 
          activeView={activeView} 
          setActiveView={setActiveView} 
        />

        {/* Content canvas with fixed header and scrollable body */}
        <main className="flex-1 h-full overflow-y-auto flex flex-col z-10 bg-[#051424]/40">
          
          {/* Top Settings Bar */}
          <header className="h-16 flex justify-between items-center px-10 border-b border-white/5 bg-[#051424]/85 backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-4">
              <span className="font-headline-md text-headline-md font-bold text-white select-none">Settings</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-xl">notifications</span>
              </button>
              <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-xl">help</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-surface-container-high border border-white/10 overflow-hidden select-none">
                <img 
                  alt="User Profile" 
                  className="w-full h-full object-cover" 
                  src={avatarUrl}
                />
              </div>
            </div>
          </header>

          {/* Form Content Area */}
          <div className="max-w-[900px] w-full mx-auto py-10 px-8 flex-grow pb-16">
            {activeView === "profile" && <Profile tenant={tenant} />}
            {activeView === "security" && <Security_Auth />}
            {activeView === "rag-defaults" && <RAGDefaults />}
            {activeView === "danger-zone" && <DangerZone />}
          </div>

        </main>

      </div>
    </div>
  );
}