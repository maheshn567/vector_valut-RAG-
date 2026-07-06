import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Hooks/useAuthHook";
import { getTenantApps, createApp, updateApp } from "../apis/app.api";
import TenAntApp from "../components/AppInfoComp";
import SideBar from "../layout/SideBar";
import { toast } from "sonner";

export default function TenantAppPage() {
  const { tenant, logout, isLoading: authLoading } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editAppId, setEditAppId] = useState(null); // Null for create, ID string for edit
  const [formAppName, setFormAppName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAppType, setFormAppType] = useState("Support Bot");
  const [submitting, setSubmitting] = useState(false);

  // Fetch all applications
  const fetchApps = async () => {
    try {
      const response = await getTenantApps();
      if (response && response.success) {
        setApps(response.data || []);
      } else {
        setApps([]);
      }
    } catch (err) {
      console.error("Error fetching apps list:", err);
      toast.error("Failed to load applications list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !tenant) {
      navigate("/signin");
    } else if (tenant) {
      fetchApps();
    }
  }, [tenant, authLoading, navigate]);

  // Handle active/inactive status toggle
  const handleToggleStatus = async (appId, checked) => {
    try {
      const response = await updateApp(appId, { isActive: checked });
      if (response && response.success) {
        toast.success(`Application ${checked ? "activated" : "deactivated"} successfully`);
        // Optimistic state update
        setApps(prev => prev.map(app => app.appId === appId ? { ...app, isActive: checked } : app));
      } else {
        throw new Error(response.message || "Failed to update state");
      }
    } catch (err) {
      toast.error(err.message || "Failed to change application status");
    }
  };

  // Open modal in create mode
  const handleOpenCreateModal = () => {
    setEditAppId(null);
    setFormAppName("");
    setFormDescription("");
    setFormAppType("Support Bot");
    setShowModal(true);
  };

  // Open modal in edit mode
  const handleOpenEditModal = (appItem) => {
    setEditAppId(appItem.appId);
    setFormAppName(appItem.appName || "");
    setFormDescription(appItem.appDescription || "");
    setFormAppType(appItem.appType || "Support Bot");
    setShowModal(true);
  };

  // Handle delete action (since backend cascades deleting, warn/notify)
  const handleDeleteWarning = () => {
    toast.info("Deleting applications is disabled for this tier. Toggle the status switch to disable it instead.");
  };

  // Form Submit (Handles both creation and updates)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formAppName.trim()) {
      toast.error("Application Name is required");
      return;
    }

    setSubmitting(true);
    try {
      if (editAppId) {
        // Edit mode API PATCH call
        const response = await updateApp(editAppId, {
          appName: formAppName,
          appDescription: formDescription,
          appType: formAppType,
        });

        if (response && response.success) {
          toast.success("Application details updated successfully!");
          fetchApps();
          setShowModal(false);
        } else {
          throw new Error(response.message || "Update request failed");
        }
      } else {
        // Create mode API POST call
        const response = await createApp({
          appName: formAppName,
          appDescription: formDescription,
          appType: formAppType,
        });

        if (response && response.success) {
          toast.success("Application created successfully!");
          fetchApps();
          setShowModal(false);
        } else {
          throw new Error(response.message || "Creation request failed");
        }
      }
    } catch (err) {
      toast.error(err.message || "Operation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Splash Screen loading
  if (authLoading || !tenant) {
    return (
      <div className="min-h-screen bg-[#051424] flex flex-col items-center justify-center gap-4 text-[#d4e4fa]">
        <div className="w-12 h-12 border-4 border-[#6c5ce7]/20 border-t-[#6c5ce7] rounded-full animate-spin"></div>
        <p className="text-sm font-semibold tracking-wider font-['JetBrains_Mono'] animate-pulse">
          RESOLVING SECURE VAULT ACCESS...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#051424] text-[#d4e4fa] font-['Inter'] relative overflow-x-hidden selection:bg-[#6c5ce7]/30">
      
      {/* Background glow animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-[#6c5ce7]/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-[#4bddb7]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "-2s" }}></div>
      </div>

      {/* Side Navigation Panel */}
      <SideBar onCtaClick={handleOpenCreateModal} ctaText="New Application" />

      {/* Main Workspace Canvas */}
      <main className="ml-64 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Top Header navbar */}
        <header className="h-16 px-12 flex justify-between items-center bg-[#051424]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
          <div className="flex items-center gap-8">
            <span className="font-['Hanken_Grotesk'] text-xl font-bold text-white tracking-tight">
              Vector <span className="text-[#6c5ce7]">Vault</span>
            </span>
            <nav className="hidden md:flex items-center gap-6">
              <Link className="text-[#c8c4d7] hover:text-[#6c5ce7] transition-colors font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider" to="/pricing">Pricing</Link>
              <Link className="text-[#c8c4d7] hover:text-[#6c5ce7] transition-colors font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider" to="/changelog">Changelog</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-[#c8c4d7] hover:text-[#6c5ce7] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-lg">notifications</span>
            </button>
            <button className="text-[#c8c4d7] hover:text-[#6c5ce7] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-lg">help</span>
            </button>
            
            <button className="px-4 py-1.5 rounded-full border border-white/10 text-xs text-[#c8c4d7] hover:bg-white/5 transition-all font-['JetBrains_Mono'] uppercase tracking-wider cursor-pointer">
              Feedback
            </button>

            {/* Profile Initials */}
            <div className="w-8 h-8 rounded-full bg-[#122131] overflow-hidden ring-1 ring-white/10 flex items-center justify-center text-xs font-bold text-[#c6bfff]">
              {tenant.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Scrollable workspace content */}
        <div className="flex-1 overflow-y-auto px-12 py-8 custom-scrollbar">
          <div className="max-w-[1280px] mx-auto space-y-8">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
              <div>
                <h1 className="font-['Hanken_Grotesk'] text-2xl font-extrabold text-white tracking-tight">Applications</h1>
                <p className="text-sm text-[#c8c4d7]/70 mt-1">Manage deployed conversational agents, databases, and custom API endpoints.</p>
              </div>
              <button 
                onClick={handleOpenCreateModal}
                className="bg-[#6c5ce7] hover:bg-[#5847d2] text-white px-6 py-2.5 rounded-lg font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg shadow-[#6c5ce7]/20 hover:shadow-[#6c5ce7]/30 transform active:scale-98 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-bold">add</span>
                Create App
              </button>
            </div>

            {/* Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-[#11141C] border border-white/5 rounded-xl p-6 h-56 flex flex-col justify-between animate-pulse">
                    <div className="space-y-3">
                      <div className="h-4 bg-white/10 w-2/3 rounded"></div>
                      <div className="h-3 bg-white/5 w-1/3 rounded"></div>
                    </div>
                    <div className="h-12 bg-white/5 w-full rounded"></div>
                  </div>
                ))}
              </div>
            ) : apps.length === 0 ? (
              <div className="bg-[#11141C]/40 border border-white/5 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-6 mt-12">
                <div className="w-16 h-16 bg-[#6c5ce7]/10 text-[#6c5ce7] rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl">smart_toy</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-white">No Applications Configured</h3>
                  <p className="text-sm text-[#c8c4d7]/60 max-w-sm mx-auto">
                    Initialize your first conversational LLM pipeline or custom API endpoint to get started.
                  </p>
                </div>
                <button 
                  onClick={handleOpenCreateModal}
                  className="bg-[#6c5ce7] hover:bg-[#5847d2] text-white px-6 py-2.5 rounded-lg font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm font-bold">add</span>
                  Create App Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apps.map((appItem) => (
                  <TenAntApp 
                    key={appItem.appId}
                    tenantApp={appItem}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteWarning}
                  />
                ))}
              </div>
            )}

          </div>
        </div>

      </main>

      {/* Creation & Editing Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className="bg-[#11141c]/90 border border-white/10 w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#c8c4d7] hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            {/* Title */}
            <div className="mb-6 text-left">
              <h3 className="font-['Hanken_Grotesk'] text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6c5ce7]">
                  {editAppId ? "edit_note" : "add_circle"}
                </span>
                {editAppId ? "Edit Application" : "Create Application"}
              </h3>
              <p className="text-xs text-[#c8c4d7]/60 mt-1">
                Configure your LLM agent attributes, context descriptions, and operational mode.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              {/* App Name */}
              <div className="space-y-1">
                <label className="font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-wider block font-semibold">
                  Application Name
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Customer Support Bot"
                  value={formAppName}
                  onChange={(e) => setFormAppName(e.target.value)}
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7] transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-wider block font-semibold">
                  Description
                </label>
                <textarea 
                  placeholder="Describe what this application does..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-white focus:outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7] transition-all resize-none"
                />
              </div>

              {/* Application Type */}
              <div className="space-y-1">
                <label className="font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-wider block font-semibold">
                  Application Type
                </label>
                <select 
                  value={formAppType}
                  onChange={(e) => setFormAppType(e.target.value)}
                  className="w-full h-11 bg-[#122131] border border-white/10 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7] transition-all"
                >
                  <option value="Support Bot">Support Bot</option>
                  <option value="Internal Wiki">Internal Wiki</option>
                  <option value="API Endpoint Only">API Endpoint Only</option>
                </select>
              </div>

              {/* CTA Actions */}
              <div className="flex gap-3 pt-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 h-11 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-all text-xs font-semibold font-['JetBrains_Mono'] uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 h-11 rounded-lg bg-[#6c5ce7] text-white hover:bg-[#5847d2] transition-all text-xs font-semibold font-['JetBrains_Mono'] uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : editAppId ? (
                    "Save Changes"
                  ) : (
                    "Create App"
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}