import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuthHook";
import { getTenantApps } from "../apis/app.api";
import { getAllRag } from "../apis/rag.api";
import { createGroup, updateGroup, getAppGroups, deleteGroup } from "../apis/group.api";
import SideBar from "../layout/SideBar";
import CorporaComp from "../components/CorporaComp";
import { toast } from "sonner";

export default function CorporaPage() {
  const { tenant, logout, isLoading: authLoading } = useAuth();
  const [apps, setApps] = useState([]);
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [allDocs, setAllDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Filters & Search
  const [selectedAppId, setSelectedAppId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editGroupId, setEditGroupId] = useState(null); // Null for create, ID string for edit
  const [formGroupName, setFormGroupName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formParentAppId, setFormParentAppId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load apps, documents, and groups in parallel
  const fetchCorporaData = async () => {
    try {
      const [appsRes, docsRes] = await Promise.all([
        getTenantApps(),
        getAllRag(),
      ]);

      const appsArray = appsRes && appsRes.success ? appsRes.data : [];
      const docsArray = docsRes && docsRes.success ? docsRes.data : [];
      
      setApps(appsArray);
      setAllDocs(docsArray);

      // Create a document counter mapping to speed up state injection
      const docCounts = {};
      docsArray.forEach(doc => {
        if (doc.groupId) {
          docCounts[doc.groupId] = (docCounts[doc.groupId] || 0) + 1;
        }
      });

      // Query groups for each tenant app in parallel
      const groupsPromises = appsArray.map(app => 
        getAppGroups({ appId: app.appId })
          .then(res => {
            const list = res && res.success ? res.data : [];
            return list.map(group => ({
              ...group,
              parentAppName: app.appName,
              docCount: docCounts[group.groupId] || 0,
              chunkCount: (docCounts[group.groupId] || 0) * 12, // Mock index chunk estimates
            }));
          })
          .catch(err => {
            console.error(`Error querying groups for app ${app.appId}:`, err);
            return [];
          })
      );

      const allGroupsResults = await Promise.all(groupsPromises);
      const flattenedGroups = allGroupsResults.flat();
      
      setGroups(flattenedGroups);
      applyFiltersAndSearch(flattenedGroups, selectedAppId, searchQuery);
    } catch (err) {
      console.error("Failed to load corpora workspace data:", err);
      toast.error("Failed to retrieve groups database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !tenant) {
      navigate("/signin");
    } else if (tenant) {
      fetchCorporaData();
    }
  }, [tenant, authLoading, navigate]);

  // Apply filters and searches locally
  const applyFiltersAndSearch = (list, appId, search) => {
    let result = [...list];

    // Filter by App
    if (appId !== "all") {
      result = result.filter(group => group.appId === appId);
    }

    // Filter by Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(group => 
        group.groupName.toLowerCase().includes(q) || 
        (group.groupDescription && group.groupDescription.toLowerCase().includes(q))
      );
    }

    setFilteredGroups(result);
  };

  const handleAppFilterChange = (appId) => {
    setSelectedAppId(appId);
    applyFiltersAndSearch(groups, appId, searchQuery);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    applyFiltersAndSearch(groups, selectedAppId, val);
  };

  // Open modal in create mode
  const handleOpenCreateModal = () => {
    setEditGroupId(null);
    setFormGroupName("");
    setFormDescription("");
    setFormParentAppId(apps.length > 0 ? apps[0].appId : "");
    setShowModal(true);
  };

  // Open modal in edit mode
  const handleOpenEditModal = (groupItem) => {
    setEditGroupId(groupItem.groupId);
    setFormGroupName(groupItem.groupName || "");
    setFormDescription(groupItem.groupDescription || "");
    setFormParentAppId(groupItem.appId || "");
    setShowModal(true);
  };

  // Delete Group logic
  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group? This will un-assign all associated documents.")) {
      return;
    }

    try {
      const response = await deleteGroup(groupId);
      if (response && response.success) {
        toast.success("Group deleted successfully");
        fetchCorporaData();
      } else {
        throw new Error(response.message || "Delete failed");
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete group");
    }
  };

  // View documents for specific group
  const handleViewDocs = (groupId) => {
    navigate(`/documents?groupId=${groupId}`);
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formGroupName.trim()) {
      toast.error("Group name is required");
      return;
    }
    if (!formParentAppId) {
      toast.error("Please select a parent application");
      return;
    }

    setSubmitting(true);
    try {
      if (editGroupId) {
        // Edit mode PATCH API request
        const response = await updateGroup(editGroupId, {
          groupName: formGroupName,
          groupDescription: formDescription,
          appId: formParentAppId,
        });

        if (response && response.success) {
          toast.success("Group details updated successfully!");
          fetchCorporaData();
          setShowModal(false);
        } else {
          throw new Error(response.message || "Update failed");
        }
      } else {
        // Create mode POST API request
        const response = await createGroup({
          groupName: formGroupName,
          groupDescription: formDescription,
          appId: formParentAppId,
        });

        if (response && response.success) {
          toast.success("New group corpus created successfully!");
          fetchCorporaData();
          setShowModal(false);
        } else {
          throw new Error(response.message || "Creation failed");
        }
      }
    } catch (err) {
      toast.error(err.message || "Operation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Splash Screen Loading
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
      
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-[#6c5ce7]/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-[#4bddb7]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "-2s" }}></div>
      </div>

      {/* Side Navigation Panel */}
      <SideBar onCtaClick={handleOpenCreateModal} ctaText="New Group" />

      {/* Main Workspace Frame */}
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
        

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-12 py-8 custom-scrollbar">
          <div className="max-w-[1280px] mx-auto space-y-8">
            
            {/* Header Title Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-left">
              <div>
                <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-[11px] text-[#c8c4d7]/50 mb-3">
                  <span className="opacity-60">{tenant.orgName || tenant.name}</span>
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                  <span className="text-[#6c5ce7] font-bold">Groups</span>
                </div>
                <h1 className="font-['Hanken_Grotesk'] text-2xl font-extrabold text-white tracking-tight mb-2">Groups / Corpora</h1>
                <p className="text-sm text-[#c8c4d7]/70 max-w-2xl">
                  Organize your documents into queryable corpora. Each group defines the retrieval scope for your RAG apps.
                </p>
              </div>
              <button 
                onClick={handleOpenCreateModal}
                className="bg-[#6c5ce7] hover:bg-[#5847d2] text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-98 shadow-lg shadow-[#6c5ce7]/20 cursor-pointer text-xs font-['JetBrains_Mono'] uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-sm font-bold">add_circle</span>
                <span>Create Group</span>
              </button>
            </div>

            {/* Stats Bento Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              
              <div className="bg-[#11141C]/70 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#6c5ce7]/10 flex items-center justify-center text-[#6c5ce7]">
                  <span className="material-symbols-outlined text-lg">folder</span>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{groups.length}</p>
                  <p className="text-[9px] uppercase tracking-widest text-[#c8c4d7]/50 font-['JetBrains_Mono']">Groups</p>
                </div>
              </div>

              <div className="bg-[#11141C]/70 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#4bddb7]/10 flex items-center justify-center text-[#4bddb7]">
                  <span className="material-symbols-outlined text-lg">description</span>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{allDocs.length}</p>
                  <p className="text-[9px] uppercase tracking-widest text-[#c8c4d7]/50 font-['JetBrains_Mono']">Documents</p>
                </div>
              </div>

              <div className="bg-[#11141C]/70 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#6c5ce7]/10 flex items-center justify-center text-[#c6bfff]">
                  <span className="material-symbols-outlined text-lg">segment</span>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{allDocs.length * 12}</p>
                  <p className="text-[9px] uppercase tracking-widest text-[#c8c4d7]/50 font-['JetBrains_Mono']">Chunks</p>
                </div>
              </div>

              <div className="bg-[#11141C]/70 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#ffb77d]/10 flex items-center justify-center text-[#ffb77d]">
                  <span className="material-symbols-outlined text-lg">query_stats</span>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">1,240</p>
                  <p className="text-[9px] uppercase tracking-widest text-[#c8c4d7]/50 font-['JetBrains_Mono']">Queries</p>
                </div>
              </div>

            </div>

            {/* Filter and Search Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/5 pt-6">
              
              {/* App Filter Selector */}
              <div className="flex items-center gap-4 flex-wrap text-left">
                <span className="text-xs text-[#c8c4d7]/70 font-semibold">Showing groups for:</span>
                <div className="flex gap-1.5 bg-[#010f1f] p-1 rounded-xl border border-white/5 flex-wrap">
                  <button 
                    onClick={() => handleAppFilterChange("all")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${selectedAppId === "all" ? 'bg-[#273647] text-white' : 'text-[#c8c4d7]/60 hover:text-white'}`}
                  >
                    All Apps
                  </button>
                  {apps.map((appItem) => (
                    <button
                      key={appItem.appId}
                      onClick={() => handleAppFilterChange(appItem.appId)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${selectedAppId === appItem.appId ? 'bg-[#273647] text-white' : 'text-[#c8c4d7]/60 hover:text-white'}`}
                    >
                      {appItem.appName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Search field */}
              <div className="relative w-full sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c8c4d7]/40 text-sm">search</span>
                <input 
                  type="text"
                  placeholder="Search groups..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-[#0d1c2d] border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-[#6c5ce7] focus:border-[#6c5ce7] focus:outline-none transition-all text-white"
                />
              </div>

            </div>

            {/* Groups Grid layout */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-[#11141C]/70 border border-white/5 rounded-2xl p-6 h-60 flex flex-col justify-between animate-pulse">
                    <div className="space-y-4">
                      <div className="h-4 bg-white/10 w-1/3 rounded"></div>
                      <div className="h-6 bg-white/5 w-2/3 rounded"></div>
                      <div className="h-3 bg-white/5 w-full rounded"></div>
                    </div>
                    <div className="h-10 bg-white/5 w-full rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="bg-[#11141C]/40 border border-white/5 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-6 mt-6">
                <div className="w-16 h-16 bg-[#6c5ce7]/10 text-[#6c5ce7] rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl">database</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-white">No Groups Found</h3>
                  <p className="text-sm text-[#c8c4d7]/60 max-w-sm mx-auto">
                    {searchQuery || selectedAppId !== "all" 
                      ? "Try adjusting your search query or parent app filter settings."
                      : "Create your first group corpus to start indexing and organizing RAG content."}
                  </p>
                </div>
                {apps.length === 0 ? (
                  <button 
                    onClick={() => navigate("/apps")}
                    className="bg-[#6c5ce7] hover:bg-[#5847d2] text-white px-6 py-2.5 rounded-lg font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    Create App First
                  </button>
                ) : (
                  <button 
                    onClick={handleOpenCreateModal}
                    className="bg-[#6c5ce7] hover:bg-[#5847d2] text-white px-6 py-2.5 rounded-lg font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">add_circle</span>
                    Create Group Now
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((groupItem) => (
                  <CorporaComp 
                    key={groupItem.groupId}
                    group={groupItem}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteGroup}
                    onViewDocs={handleViewDocs}
                  />
                ))}
                
                {/* Dashed Create Group helper card */}
                <button 
                  onClick={handleOpenCreateModal}
                  className="border-2 border-dashed border-white/10 hover:border-[#6c5ce7]/50 hover:bg-[#6c5ce7]/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 group transition-all duration-300 min-h-[220px] cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#6c5ce7]/20 transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-[#c6bfff] text-base font-bold transition-colors">add</span>
                  </div>
                  <p className="text-xs font-semibold font-[#c8c4d7]/70 group-hover:text-white uppercase tracking-wider font-['JetBrains_Mono']">
                    Create new group
                  </p>
                </button>
              </div>
            )}

          </div>
        </div>

      </main>

      {/* Creation & Editing Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className="bg-[#11141c]/90 border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center text-left">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6c5ce7]">
                  {editGroupId ? "drive_file_rename_outline" : "add_circle"}
                </span>
                {editGroupId ? "Edit Group Details" : "Create New Group"}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-[#c8c4d7] hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Scrollable Body */}
            <form onSubmit={handleSubmit}>
              <div className="p-8 space-y-5 text-left">
                
                {/* Group Name */}
                <div className="space-y-1">
                  <label className="block font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-widest font-semibold">
                    Group Name
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Q4 Financial Reports"
                    value={formGroupName}
                    onChange={(e) => setFormGroupName(e.target.value)}
                    className="w-full bg-[#0d1c2d] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7] transition-all"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="block font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-widest font-semibold">
                    Description
                  </label>
                  <textarea 
                    placeholder="What kind of documents will be in this corpus?"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-[#0d1c2d] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7] transition-all h-24 resize-none"
                  />
                </div>

                {/* Parent App Selector */}
                <div className="space-y-1">
                  <label className="block font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-widest font-semibold">
                    Parent App (Scope)
                  </label>
                  {apps.length === 0 ? (
                    <div className="text-xs text-[#ffb4ab] border border-[#ffb4ab]/20 bg-[#ffb4ab]/5 rounded-xl p-3">
                      No applications created yet. Please create an application first under the Apps tab.
                    </div>
                  ) : (
                    <select 
                      value={formParentAppId}
                      onChange={(e) => setFormParentAppId(e.target.value)}
                      className="w-full bg-[#122131] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7] transition-all"
                    >
                      <option value="" disabled>-- Select Parent Application --</option>
                      {apps.map((appItem) => (
                        <option key={appItem.appId} value={appItem.appId}>
                          {appItem.appName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Advanced Retreival accordion */}
                <div className="pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-[#6c5ce7] hover:text-[#5847d2] font-bold text-xs cursor-pointer font-['JetBrains_Mono'] uppercase tracking-wider"
                  >
                    <span className="material-symbols-outlined text-sm">settings</span>
                    <span>Advanced Retrieval Settings</span>
                    <span className="material-symbols-outlined text-xs">
                      {showAdvanced ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                  
                  {showAdvanced && (
                    <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5 space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#c8c4d7]/70">Embedding Model</span>
                        <span className="font-mono text-[#4bddb7]">text-embedding-3-large</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#c8c4d7]/70">Chunk Size (Tokens)</span>
                        <span className="font-mono text-[#c6bfff]">512 Tokens</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-white/5 border-t border-white/5 flex gap-3 justify-end rounded-b-3xl">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 rounded-xl text-[#c8c4d7] font-bold hover:bg-white/5 transition-colors cursor-pointer text-xs font-['JetBrains_Mono'] uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting || apps.length === 0}
                  className="px-8 py-2.5 rounded-xl bg-[#6c5ce7] text-white hover:bg-[#5847d2] active:scale-95 transition-all cursor-pointer text-xs font-['JetBrains_Mono'] uppercase tracking-wider font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : editGroupId ? (
                    "Save Changes"
                  ) : (
                    "Create Corpus"
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