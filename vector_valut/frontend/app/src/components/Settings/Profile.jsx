import { useState } from "react";
import { toast } from "sonner";

export default function Profile({ tenant }) {
  const [fullName, setFullName] = useState(tenant?.name || "Sarah Johnson");
  const email = tenant?.email || "sarah.j@acmecorp.com";

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Profile saved successfully!");
  };

  return (
    <section className="settings-view text-left">
      <div className="space-y-1 mb-10">
        <h2 className="font-headline-md text-2xl font-bold text-primary">Profile Settings</h2>
        <p className="font-body-sm text-sm text-[#c9c5d0]">Update your photo and personal details to keep your account current.</p>
      </div>

      <form onSubmit={handleSave} className="glass-card rounded-xl p-8 space-y-12">
        {/* Profile photo block */}
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 rounded-full border-2 border-[#e4deff]/20 overflow-hidden ring-4 ring-white/5 bg-[#1d2b3c] flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-[#c6bfff]/80 select-none">person</span>
          </div>
          <div className="space-y-1">
            <div className="flex gap-4">
              <button type="button" className="font-label-md text-xs font-semibold text-primary hover:underline cursor-pointer">Change photo</button>
              <button type="button" className="font-label-md text-xs font-semibold text-red-400 hover:underline cursor-pointer">Remove</button>
            </div>
            <p className="text-[11px] text-[#c9c5d0]/60">JPG, GIF or PNG. Max size of 800K.</p>
          </div>
        </div>

        {/* Info inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <label className="font-label-md text-xs font-semibold uppercase tracking-wider text-[#c9c5d0] block">Full Name</label>
            <input 
              className="w-full bg-[#051424] border border-white/10 rounded-lg px-4 py-3 font-body-sm text-sm text-white focus:outline-none focus:border-[#6c5ce7]/60 focus:ring-1 focus:ring-[#6c5ce7]/30 transition-all" 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 opacity-80">
            <label className="font-label-md text-xs font-semibold uppercase tracking-wider text-[#c9c5d0] flex items-center gap-1.5">
              Work Email 
              <span className="material-symbols-outlined text-[14px]">lock</span>
            </label>
            <input 
              className="w-full bg-[#1d2b3c]/20 border border-white/5 rounded-lg px-4 py-3 font-body-sm text-sm text-[#c9c5d0]/60 cursor-not-allowed" 
              readOnly 
              type="email" 
              value={email}
            />
          </div>
        </div>

        <div className="flex justify-end pt-8">
          <button 
            type="submit" 
            className="px-8 py-3 bg-[#6c5ce7] hover:bg-[#5b4cc4] text-white rounded-xl font-label-md font-semibold text-xs uppercase tracking-wider shadow-lg hover:scale-95 active:opacity-80 transition-all duration-200 cursor-pointer"
          >
            Save profile
          </button>
        </div>
      </form>
    </section>
  );
}