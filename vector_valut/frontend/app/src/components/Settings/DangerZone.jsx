import React from "react";
import { toast } from "sonner";

export default function DangerZone() {
  const handleDeleteAccount = () => {
    const confirmation = window.confirm("Are you absolutely sure you want to delete your corporate account? This action is irreversible and all workspace data, apps, and documents will be deleted permanently.");
    if (confirmation) {
      toast.error("Account delete request submitted. Please check your admin inbox for confirmation.");
    }
  };

  const handleResetWorkspace = () => {
    const confirmation = window.confirm("Are you absolutely sure you want to reset your workspace? This will delete all collections, index vectors, and document files.");
    if (confirmation) {
      toast.success("Workspace reset initiated successfully.");
    }
  };

  return (
    <section className="settings-view text-left">
      <div className="mb-10">
        <h2 className="font-headline-md text-2xl font-bold text-[#FFAB91] mb-2">Danger Zone</h2>
        <p className="text-[#c9c5d0] text-sm max-w-2xl">These actions are irreversible. Proceed with extreme caution.</p>
      </div>

      <div className="space-y-6">
        {/* Delete Account */}
        <div className="glass-card p-6 rounded-xl flex items-center justify-between border border-red-500/30">
          <div className="space-y-1 pr-4">
            <h3 className="font-headline-md text-lg font-bold text-red-400">Delete Account</h3>
            <p className="text-[#c9c5d0]/75 text-xs">Permanently remove your account, organization layout, and all associated workspace data.</p>
          </div>
          <button 
            onClick={handleDeleteAccount}
            className="whitespace-nowrap px-6 py-2.5 rounded-lg border border-red-500 text-red-400 hover:bg-red-500/10 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Delete account
          </button>
        </div>

        {/* Reset Workspace */}
        <div className="glass-card p-6 rounded-xl flex items-center justify-between border border-[#FFAB91]/30">
          <div className="space-y-1 pr-4">
            <h3 className="font-headline-md text-lg font-bold text-white">Reset Workspace</h3>
            <p className="text-[#c9c5d0]/75 text-xs">Wipe all current collections, indexes, vectors, and chunks, starting fresh.</p>
          </div>
          <button 
            onClick={handleResetWorkspace}
            className="whitespace-nowrap px-6 py-2.5 rounded-lg border border-[#FFAB91] text-[#FFAB91] hover:bg-[#FFAB91]/10 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Reset workspace
          </button>
        </div>
      </div>
    </section>
  );
}