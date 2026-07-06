import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuthHook";
import { getTenantApps } from "../apis/app.api";
import { getAllRag } from "../apis/rag.api";
import SideBar from "../layout/SideBar";
import { updateTenant } from "../apis/tenant.api";
import { toast } from "sonner";

export default function TenantDashboard() {
  const { tenant, logout, checkAuth, isLoading: authLoading } = useAuth();
  const [apps, setApps] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();

  // Onboarding Configuration States
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [orgNameInput, setOrgNameInput] = useState("");
  const [bucketInput, setBucketInput] = useState("");
  const [isOnboardingSubmit, setIsOnboardingSubmit] = useState(false);

  // Load backend stats and details
  const fetchDashboardData = async () => {
    try {
      const [appsList, docsList] = await Promise.all([
        getTenantApps(),
        getAllRag(),
      ]);
      
      const appsArray = appsList && appsList.success ? appsList.data : [];
      const docsArray = docsList && docsList.success ? docsList.data : [];

      setApps(appsArray);
      setDocuments(docsArray);
    } catch (err) {
      console.error("Error fetching dashboard statistics:", err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !tenant) {
      navigate("/signin");
    } else if (tenant) {
      fetchDashboardData();

      // Prompt custom workspace configuration if details are default values
      const isDefaultOrg = 
        tenant.orgName === tenant.name || 
        tenant.orgName === `${tenant.name}'s Org` || 
        !tenant.orgName;

      const hasDismissedOnboarding = sessionStorage.getItem("dismissedOnboarding");

      if (isDefaultOrg && !hasDismissedOnboarding) {
        setOrgNameInput(tenant.orgName || "");
        setBucketInput(tenant.s3BucketName || "");
        setShowOnboardingModal(true);
      }
    }
  }, [tenant, authLoading, navigate]);

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    if (!orgNameInput.trim()) {
      toast.error("Organization Name is required");
      return;
    }

    // Validate S3 bucket regulations if customized
    if (bucketInput) {
      const s3Pattern = /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/;
      if (!s3Pattern.test(bucketInput)) {
        toast.error("Invalid S3 format. Lowercase alphanumeric, dots, or hyphens only.");
        return;
      }
      if (bucketInput.includes("..")) {
        toast.error("S3 Bucket name cannot contain consecutive periods.");
        return;
      }
    }

    setIsOnboardingSubmit(true);
    try {
      const response = await updateTenant({
        orgName: orgNameInput,
        s3BucketName: bucketInput || undefined,
      });

      if (response && response.success) {
        toast.success("Workspace successfully configured!");
        await checkAuth(); // Sync settings with Auth Context
        setShowOnboardingModal(false);
      } else {
        throw new Error(response.message || "Failed to update configuration");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update organization space");
    } finally {
      setIsOnboardingSubmit(false);
    }
  };

  const handleDismissOnboarding = () => {
    sessionStorage.setItem("dismissedOnboarding", "true");
    setShowOnboardingModal(false);
  };

  // Loading Splash Screen
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
      
      {/* Ambient background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-[#6c5ce7]/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-[#4bddb7]/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "-2s" }}></div>
      </div>

      {/* Side Navigation Panel */}
      <SideBar onCtaClick={() => navigate("/apps/create")} ctaText="New Application" />

      {/* Main Workspace Frame */}
      <main className="ml-64 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Top Navbar */}
        <header className="h-16 px-12 flex justify-between items-center bg-[#051424]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
          <div className="flex items-center gap-8">
            <span className="font-['Hanken_Grotesk'] text-xl font-bold text-white tracking-tight">
              Vector <span className="text-[#6c5ce7]">Vault</span>
            </span>
            <nav className="hidden md:flex items-center gap-6">
              <a className="text-[#6c5ce7] border-b-2 border-[#6c5ce7] pb-1 font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider" href="#docs">Docs</a>
              <a className="text-[#c8c4d7] hover:text-[#6c5ce7] transition-colors font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider" href="#pricing">Pricing</a>
              <a className="text-[#c8c4d7] hover:text-[#6c5ce7] transition-colors font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider" href="#changelog">Changelog</a>
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

            {/* User Profile Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#122131] overflow-hidden ring-1 ring-white/10 flex items-center justify-center text-xs font-bold text-[#c6bfff]">
              {tenant.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Scrollable workspace content */}
        <div className="flex-1 overflow-y-auto px-12 py-8 custom-scrollbar">
          <div className="max-w-[1280px] mx-auto space-y-8">
            
            {/* Quick Operations Area */}
            <section className="text-left">
              <h2 className="font-['JetBrains_Mono'] text-xs font-semibold text-[#c8c4d7]/50 mb-4 uppercase tracking-[0.2em]">Quick Operations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <button 
                  onClick={() => navigate("/apps/create")}
                  className="bg-[#11141c]/40 backdrop-blur-xl border border-white/5 px-6 py-4 rounded-xl flex items-center gap-4 hover:bg-[#1c2b3c] transition-all cursor-pointer group text-left"
                >
                  <div className="w-10 h-10 rounded bg-[#6c5ce7]/10 flex items-center justify-center text-[#6c5ce7] group-hover:bg-[#6c5ce7] group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-lg">rocket_launch</span>
                  </div>
                  <div>
                    <p className="font-['Hanken_Grotesk'] text-sm font-bold text-white">Create App</p>
                    <p className="text-xs text-[#c8c4d7]/60">Deploy a new LLM instance</p>
                  </div>
                </button>

                <button 
                  onClick={() => navigate("/documents/upload")}
                  className="bg-[#11141c]/40 backdrop-blur-xl border border-white/5 px-6 py-4 rounded-xl flex items-center gap-4 hover:bg-[#1c2b3c] transition-all cursor-pointer group text-left"
                >
                  <div className="w-10 h-10 rounded bg-[#4bddb7]/10 flex items-center justify-center text-[#4bddb7] group-hover:bg-[#4bddb7] group-hover:text-black transition-all">
                    <span className="material-symbols-outlined text-lg">upload_file</span>
                  </div>
                  <div>
                    <p className="font-['Hanken_Grotesk'] text-sm font-bold text-white">Upload Document</p>
                    <p className="text-xs text-[#c8c4d7]/60">Index local files to vault</p>
                  </div>
                </button>

                <a 
                  href="#api-docs"
                  className="bg-[#11141c]/40 backdrop-blur-xl border border-white/5 px-6 py-4 rounded-xl flex items-center gap-4 hover:bg-[#1c2b3c] transition-all cursor-pointer group text-left"
                >
                  <div className="w-10 h-10 rounded bg-[#ffb77d]/10 flex items-center justify-center text-[#ffb77d] group-hover:bg-[#ffb77d] group-hover:text-black transition-all">
                    <span className="material-symbols-outlined text-lg">api</span>
                  </div>
                  <div>
                    <p className="font-['Hanken_Grotesk'] text-sm font-bold text-white">View API Docs</p>
                    <p className="text-xs text-[#c8c4d7]/60">Integration guidelines</p>
                  </div>
                </a>

              </div>
            </section>

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
              
              <div className="bg-[#11141c]/40 backdrop-blur-xl border border-white/5 p-6 rounded-xl relative overflow-hidden">
                <p className="font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-widest mb-2">Total Apps</p>
                <div className="flex items-end justify-between">
                  <p className="font-['Hanken_Grotesk'] text-3xl font-extrabold text-white leading-none">{apps.length}</p>
                  <span className="text-[#4bddb7] text-[10px] font-bold font-mono">Apps Deployed</span>
                </div>
                <div className="absolute -bottom-2 -right-2 opacity-5 pointer-events-none">
                  <span className="material-symbols-outlined text-6xl">apps</span>
                </div>
              </div>

              <div className="bg-[#11141c]/40 backdrop-blur-xl border border-white/5 p-6 rounded-xl relative overflow-hidden">
                <p className="font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-widest mb-2">Documents</p>
                <div className="flex items-end justify-between">
                  <p className="font-['Hanken_Grotesk'] text-3xl font-extrabold text-white leading-none">{documents.length}</p>
                  <span className="text-[#4bddb7] text-[10px] font-bold font-mono">Indexed</span>
                </div>
                <div className="absolute -bottom-2 -right-2 opacity-5 pointer-events-none">
                  <span className="material-symbols-outlined text-6xl">description</span>
                </div>
              </div>

              <div className="bg-[#11141c]/40 backdrop-blur-xl border border-white/5 p-6 rounded-xl relative overflow-hidden">
                <p className="font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-widest mb-2">Total Chunks</p>
                <div className="flex items-end justify-between">
                  <p className="font-['Hanken_Grotesk'] text-3xl font-extrabold text-white leading-none">
                    {dataLoading ? "..." : `${documents.length * 12}`}
                  </p>
                  <span className="text-[#c6bfff] text-[10px] font-bold font-mono">Vectorized</span>
                </div>
                <div className="absolute -bottom-2 -right-2 opacity-5 pointer-events-none">
                  <span className="material-symbols-outlined text-6xl">hub</span>
                </div>
              </div>

              <div className="bg-[#11141c]/40 backdrop-blur-xl border border-white/5 p-6 rounded-xl relative overflow-hidden">
                <p className="font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-widest mb-2">Conversations</p>
                <div className="flex items-end justify-between">
                  <p className="font-['Hanken_Grotesk'] text-3xl font-extrabold text-white leading-none">84</p>
                  <span className="text-[#4bddb7] text-[10px] font-bold font-mono">↑ 12% wk</span>
                </div>
                <div className="absolute -bottom-2 -right-2 opacity-5 pointer-events-none">
                  <span className="material-symbols-outlined text-6xl">forum</span>
                </div>
              </div>

              <div className="bg-[#11141c]/40 backdrop-blur-xl border border-white/5 p-6 rounded-xl relative overflow-hidden border-[#6c5ce7]/20">
                <p className="font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-widest mb-2">Avg. Latency</p>
                <div className="flex items-end justify-between">
                  <p className="font-['Hanken_Grotesk'] text-3xl font-extrabold text-[#c6bfff] leading-none">184ms</p>
                  <span className="text-[#c6bfff] text-[10px] font-bold font-mono">Optimized</span>
                </div>
                <div className="absolute -bottom-2 -right-2 opacity-5 pointer-events-none">
                  <span className="material-symbols-outlined text-6xl">speed</span>
                </div>
              </div>

            </div>

            {/* Main Analytics Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
              
              {/* Usage Chart card */}
              <div className="lg:col-span-2 bg-[#11141c]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-white">Queries Over Time</h3>
                    <p className="text-xs text-[#c8c4d7]/60">Last 24 hours of inference activity</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-2 text-xs font-['JetBrains_Mono'] text-[#c6bfff] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-[#6c5ce7]"></span> Production Gateway
                    </span>
                  </div>
                </div>
                
                {/* Custom SVG Line Chart */}
                <div className="h-64 w-full relative">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#6c5ce7" stopOpacity="0.25"></stop>
                        <stop offset="100%" stopColor="#6c5ce7" stopOpacity="0"></stop>
                      </linearGradient>
                    </defs>
                    <path d="M0,180 Q100,160 200,100 T400,140 T600,60 T800,100 V200 H0 Z" fill="url(#chartGradient)"></path>
                    <path d="M0,180 Q100,160 200,100 T400,140 T600,60 T800,100" fill="none" stroke="#6c5ce7" strokeWidth="3"></path>
                    <circle cx="200" cy="100" fill="#6c5ce7" r="4"></circle>
                    <circle cx="600" cy="60" fill="#6c5ce7" r="4"></circle>
                  </svg>
                  
                  {/* Chart Labels */}
                  <div className="flex justify-between mt-4 font-['JetBrains_Mono'] text-[9px] text-[#c8c4d7]/40 uppercase tracking-wider">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>Active Gateway</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-[#11141c]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-white mb-6">Recent Activity</h3>
                  <div className="space-y-6">
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-[#4bddb7]/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#4bddb7] text-sm">upload</span>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-white">Document Ingested</p>
                        <p className="text-xs text-[#c8c4d7]/70">"knowledge_base_2026.pdf"</p>
                        <p className="text-[10px] text-[#c8c4d7]/30 font-mono">10 mins ago</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-[#6c5ce7]/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#c6bfff] text-sm">auto_awesome</span>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-white">RAG Quota Check</p>
                        <p className="text-xs text-[#c8c4d7]/70">Vector engine reports healthy sync</p>
                        <p className="text-[10px] text-[#c8c4d7]/30 font-mono">45 mins ago</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                        <span className="material-symbols-outlined text-[#c8c4d7]/70 text-sm">key</span>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-white">Credentials Check</p>
                        <p className="text-xs text-[#c8c4d7]/70">OAuth validation verified</p>
                        <p className="text-[10px] text-[#c8c4d7]/30 font-mono">2 hours ago</p>
                      </div>
                    </div>

                  </div>
                </div>

                <button className="mt-6 w-full py-2 font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/40 border border-white/5 rounded-lg hover:bg-white/5 transition-colors uppercase tracking-wider cursor-pointer">
                  View Full History
                </button>
              </div>

            </div>

            {/* Active Systems Table */}
            <section className="bg-[#11141c]/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden text-left">
              
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-white">Active Applications</h3>
                <span className="px-3 py-1 bg-[#4bddb7]/10 text-[#4bddb7] text-[10px] font-['JetBrains_Mono'] font-bold rounded-full border border-[#4bddb7]/20 uppercase tracking-wider">
                  Operational
                </span>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead className="bg-[#0d1c2d]/50 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-widest">Name</th>
                      <th className="px-6 py-4 font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-widest">Type</th>
                      <th className="px-6 py-4 font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-widest text-right">Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {dataLoading ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-sm text-[#c8c4d7]/40 font-mono">
                          FETCHING TENANT APPLICATIONS FROM SECURE REGISTRY...
                        </td>
                      </tr>
                    ) : apps.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-sm text-[#c8c4d7]/40 font-mono">
                          NO APPLICATIONS CREATED YET. CLICK "NEW APPLICATION" TO GET STARTED.
                        </td>
                      </tr>
                    ) : (
                      apps.map((appItem) => (
                        <tr key={appItem.appId} className="hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-[#6c5ce7]">inventory_2</span>
                              <span className="font-bold text-sm text-white">{appItem.appName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-[#c8c4d7]/70 uppercase">
                            {appItem.appType || "Standard RAG"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${appItem.isActive ? 'bg-[#4bddb7]' : 'bg-[#ffb4ab]'}`}></span>
                              <span className="text-xs">{appItem.isActive ? "Active" : "Disabled"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-right text-[#c8c4d7]/50 font-mono">
                            {new Date(appItem.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </section>

          </div>
        </div>

      </main>

      {/* Onboarding Configuration Overlay Modal */}
      {showOnboardingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className="bg-[#11141c]/90 border border-white/10 w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="mb-6 text-left">
              <h3 className="font-['Hanken_Grotesk'] text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6c5ce7]">settings_suggest</span>
                Initialize Workspace
              </h3>
              <p className="text-xs text-[#c8c4d7]/60 mt-1">
                Customize your organization name and storage bucket to configure your workspace credentials.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleOnboardingSubmit} className="space-y-4 text-left">
              
              {/* Org Name */}
              <div className="space-y-1">
                <label className="font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-wider block">
                  Organization Name
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Acme Corporation"
                  value={orgNameInput}
                  onChange={(e) => setOrgNameInput(e.target.value)}
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7] transition-all"
                />
              </div>

              {/* S3 Storage Bucket */}
              <div className="space-y-1">
                <label className="font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-wider block">
                  S3 Storage Bucket Name
                </label>
                <input 
                  type="text"
                  placeholder="e.g. acme-vault-storage"
                  value={bucketInput}
                  onChange={(e) => setBucketInput(e.target.value)}
                  className="w-full h-11 bg-white/5 border border-[#c8c4d7]/20 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7] transition-all"
                />
                <span className="text-[10px] text-[#c8c4d7]/40 block leading-tight">
                  Lowercase letters, numbers, dots, and hyphens only. Must start/end with a letter or number.
                </span>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleDismissOnboarding}
                  className="flex-1 h-11 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-all text-xs font-semibold font-['JetBrains_Mono'] uppercase tracking-wider cursor-pointer"
                >
                  Configure Later
                </button>
                <button
                  type="submit"
                  disabled={isOnboardingSubmit}
                  className="flex-1 h-11 rounded-lg bg-[#6c5ce7] text-white hover:bg-[#5847d2] transition-all text-xs font-semibold font-['JetBrains_Mono'] uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                >
                  {isOnboardingSubmit ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Save & Continue"
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
