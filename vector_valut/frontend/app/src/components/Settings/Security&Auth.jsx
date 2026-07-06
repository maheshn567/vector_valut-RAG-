import { useState } from "react";
import { toast } from "sonner";

export default function Security_Auth() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <section className="settings-view text-left">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-primary font-label-md text-xs font-semibold mb-2">
          <span className="material-symbols-outlined text-sm">shield</span>
          <span className="uppercase tracking-[0.2em] font-mono text-[10px]">Security Protocol</span>
        </div>
        <h2 className="font-headline-md text-2xl font-bold text-primary mb-2">Security &amp; Auth</h2>
        <p className="text-[#c9c5d0] text-sm max-w-xl">Manage your identity verification methods and credentials.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Password update form */}
        <form onSubmit={handleUpdatePassword} className="col-span-12 md:col-span-7 glass-card p-8 rounded-xl space-y-6 flex flex-col justify-between">
          <h3 className="font-headline-md text-lg font-bold text-white mb-2">Password Management</h3>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="font-label-md text-[#c9c5d0]/70 uppercase tracking-widest text-[9px] font-mono">Current Password</label>
              <input 
                className="w-full bg-[#051424] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#6c5ce7]/60 text-white" 
                placeholder="••••••••••••" 
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-[#c9c5d0]/70 uppercase tracking-widest text-[9px] font-mono">New Password</label>
              <input 
                className="w-full bg-[#051424] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#6c5ce7]/60 text-white" 
                placeholder="••••••••••••" 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-[#c9c5d0]/70 uppercase tracking-widest text-[9px] font-mono">Confirm New Password</label>
              <input 
                className="w-full bg-[#051424] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#6c5ce7]/60 text-white" 
                placeholder="••••••••••••" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-fit mt-4 px-6 py-2.5 bg-[#6c5ce7] hover:bg-[#5b4cc4] text-white font-semibold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:scale-95 active:opacity-85 transition-all cursor-pointer"
          >
            Update Password
          </button>
        </form>

        {/* 2FA block */}
        <div className="col-span-12 md:col-span-5 glass-card p-8 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="font-headline-md text-lg font-bold text-white mb-4">Two-Factor Auth</h3>
            <p className="text-xs text-[#c9c5d0]/70 mb-6">Secure your corporate account with multi-factor authentication codes.</p>
          </div>
          
          <div className="space-y-3 mt-auto">
            <button 
              onClick={() => toast.info("Two-Factor Authentication configuration modal coming soon.")}
              className="w-full py-3 bg-[#1d2b3c] hover:bg-[#283647] border border-white/10 text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer"
            >
              Manage 2FA
            </button>
            <button 
              onClick={() => toast.warning("2FA is currently disabled.")}
              className="w-full py-2.5 text-red-400/80 hover:text-red-400 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Disable 2FA
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}