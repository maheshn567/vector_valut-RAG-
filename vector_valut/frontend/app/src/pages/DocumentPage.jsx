import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuthHook";
import { getTenantApps } from "../apis/app.api";
import { getAppGroups } from "../apis/group.api";
import { getAllRag, getRag, deleteRag } from "../apis/rag.api";
import SideBar from "../layout/SideBar";
import FileUploadCom from "../components/documents/FileUploadDoc";
import PipelineAnimation from "../components/documents/PiplineAnimation";
import DocInfoComp from "../components/documents/DocInfoCom";
import { toast } from "sonner";

export default function DocumentsPage() {
  const { tenant, logout, isLoading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Route pre-selection filters
  const queryGroupId = searchParams.get("groupId") || "";

  // Workspace lists
  const [apps, setApps] = useState([]);
  const [groups, setGroups] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ingest progress indicators
  const [isUploading, setIsUploading] = useState(false);
  const [activeFile, setActiveFile] = useState(null);

  // Inspector Viewer Detail Modal
  const [viewingDoc, setViewingDoc] = useState(null);
  const [fetchingDoc, setFetchingDoc] = useState(false);

  const fetchWorkspaceData = async () => {
    try {
      // 1. Fetch apps
      const appsRes = await getTenantApps();
      const appsArray = appsRes && appsRes.success ? appsRes.data : [];
      setApps(appsArray);

      // 2. Fetch groups across all apps
      const groupsPromises = appsArray.map(app => 
        getAppGroups({ appId: app.appId })
          .then(res => (res && res.success ? res.data : []).map(group => ({
            ...group,
            parentAppName: app.appName,
          })))
          .catch(() => [])
      );

      const allGroupsResults = await Promise.all(groupsPromises);
      const flattenedGroups = allGroupsResults.flat();
      setGroups(flattenedGroups);

      // 3. Fetch documents
      const docsRes = await getAllRag();
      const docsArray = docsRes && docsRes.success ? docsRes.data : [];
      setDocuments(docsArray);
    } catch (err) {
      console.error("Failed to load Documents workspace data:", err);
      toast.error("Failed to load database documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !tenant) {
      navigate("/signin");
    } else if (tenant) {
      fetchWorkspaceData();
    }
  }, [tenant, authLoading, navigate]);

  // Upload trigger helpers
  const handleUploadStart = (file) => {
    setActiveFile(file);
    setIsUploading(true);
  };

  const handleUploadSuccess = () => {
    setIsUploading(false);
    setActiveFile(null);
    fetchWorkspaceData();
  };

  // Inspect database document chunks
  const handleViewDetails = async (docId) => {
    setFetchingDoc(true);
    try {
      const res = await getRag({ docId });
      if (res && res.success) {
        setViewingDoc(res.data);
      } else {
        throw new Error(res.message || "Failed to fetch details");
      }
    } catch (err) {
      toast.error("Could not load vector document chunks");
      console.error(err);
    } finally {
      setFetchingDoc(false);
    }
  };

  // Delete document
  const handleDeleteDoc = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document from the vector vault? All indexed chunks will be deleted.")) {
      return;
    }

    try {
      const res = await deleteRag(docId);
      if (res && res.success) {
        toast.success("Document removed successfully");
        fetchWorkspaceData();
      } else {
        throw new Error(res.message || "Delete failed");
      }
    } catch (err) {
      toast.error(err.message || "Failed to remove document");
    }
  };

  const getGroupName = (groupId) => {
    const found = groups.find(g => g.groupId === groupId);
    return found ? found.groupName : "RAG Pipeline";
  };

  // Auth Guard Spinner
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

  // Count file format aggregates
  const pdfCount = documents.filter(d => d.docName.toLowerCase().endsWith('.pdf')).length;
  const docxCount = documents.filter(d => d.docName.toLowerCase().endsWith('.docx')).length;
  const txtCount = documents.filter(d => d.docName.toLowerCase().endsWith('.txt')).length;

  return (
    <div className="min-h-screen bg-[#051424] text-[#d4e4fa] font-['Inter'] relative overflow-x-hidden selection:bg-[#6c5ce7]/30">
      
      {/* Background decoration glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-[#6c5ce7]/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-[#4bddb7]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "-2s" }}></div>
      </div>

      {/* Side Navigation Panel */}
      <SideBar />

      {/* Main Workspace Frame */}
      <main className="ml-64 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Top Header navbar */}
        <header className="h-16 px-12 flex justify-between items-center bg-[#051424]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
          <div className="flex items-center gap-8">
            <span className="font-['Hanken_Grotesk'] text-xl font-bold text-white tracking-tight">
              Vector <span className="text-[#6c5ce7]">Vault</span>
            </span>
            <nav className="hidden md:flex items-center gap-6">
              <a className="text-[#c8c4d7] hover:text-[#6c5ce7] transition-colors font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider" href="#docs">Docs</a>
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

            {/* Profile Initials */}
            <div className="w-8 h-8 rounded-full bg-[#122131] overflow-hidden ring-1 ring-white/10 flex items-center justify-center text-xs font-bold text-[#c6bfff]">
              {tenant.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Scrollable Content Canvas */}
        <div className="flex-1 overflow-y-auto px-12 py-8 custom-scrollbar">
          <div className="max-w-[1280px] mx-auto space-y-8 pb-20">
            
            {/* Header section title */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-left">
              <div>
                <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-[11px] text-[#c8c4d7]/50 mb-3">
                  <span className="opacity-60">{tenant.orgName || tenant.name}</span>
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                  <span className="text-[#6c5ce7] font-bold">Documents</span>
                </div>
                <h1 className="font-['Hanken_Grotesk'] text-2xl font-extrabold text-white tracking-tight mb-2">Document Management</h1>
                <p className="text-sm text-[#c8c4d7]/70 max-w-2xl">
                  Upload and manage your enterprise knowledge base. Supported files are automatically processed through our secure RAG pipeline.
                </p>
              </div>

              {/* Stats bubble count */}
              <div className="flex items-center gap-3 bg-[#11141c]/50 px-4 py-2 border border-white/5 rounded-xl">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full ring-1 ring-[#051424] bg-red-400/20 flex items-center justify-center text-[10px] text-red-400 font-bold">{pdfCount}</div>
                  <div className="w-7 h-7 rounded-full ring-1 ring-[#051424] bg-blue-400/20 flex items-center justify-center text-[10px] text-blue-400 font-bold">{docxCount}</div>
                  <div className="w-7 h-7 rounded-full ring-1 ring-[#051424] bg-emerald-400/20 flex items-center justify-center text-[10px] text-emerald-400 font-bold">{txtCount}</div>
                </div>
                <span className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-wider text-[#c8c4d7]/60">
                  Total formats parsed
                </span>
              </div>
            </div>

            {/* Ingestion Area Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <FileUploadCom 
                groups={groups}
                defaultGroupId={queryGroupId}
                onUploadStart={handleUploadStart}
                onUploadSuccess={handleUploadSuccess}
              />

              <div className="lg:col-span-1">
                <PipelineAnimation 
                  isUploading={isUploading}
                  activeFile={activeFile}
                />
              </div>

            </div>

            {/* List Row */}
            <DocInfoComp 
              documents={documents}
              groups={groups}
              onDeleteDoc={handleDeleteDoc}
              onViewDetails={handleViewDetails}
              loading={loading}
            />

          </div>
        </div>

      </main>

      {/* Ingestion inspector drawer modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className="bg-[#11141c]/95 border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative text-left animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2.5 truncate pr-6">
                <span className="material-symbols-outlined text-[#6c5ce7]">source</span>
                <h2 className="text-base font-bold text-white truncate">
                  {viewingDoc.docName}
                </h2>
              </div>
              <button 
                onClick={() => setViewingDoc(null)} 
                className="text-[#c8c4d7] hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Info Grid */}
            <div className="p-8 space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-white/5 p-4 rounded-xl border border-white/5">
                <div>
                  <span className="text-[#c8c4d7]/40 block uppercase tracking-wider font-mono text-[9px]">Format</span>
                  <span className="text-white font-bold uppercase font-mono">{viewingDoc.docType}</span>
                </div>
                <div>
                  <span className="text-[#c8c4d7]/40 block uppercase tracking-wider font-mono text-[9px]">Target Corpus</span>
                  <span className="text-[#c6bfff] font-bold truncate block">{getGroupName(viewingDoc.groupId)}</span>
                </div>
                <div>
                  <span className="text-[#c8c4d7]/40 block uppercase tracking-wider font-mono text-[9px]">Vector Chunks</span>
                  <span className="text-white font-bold font-mono">{viewingDoc.chunks?.length || 0}</span>
                </div>
                <div>
                  <span className="text-[#c8c4d7]/40 block uppercase tracking-wider font-mono text-[9px]">Uploaded On</span>
                  <span className="text-white font-bold">{new Date(viewingDoc.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Text Chunks Details */}
              <div className="space-y-4">
                <h4 className="font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-widest font-semibold">
                  Indexed Vector Chunks
                </h4>
                
                {(!viewingDoc.chunks || viewingDoc.chunks.length === 0) ? (
                  <p className="text-xs text-[#c8c4d7]/40 italic">No text chunks found for this document.</p>
                ) : (
                  <div className="space-y-3">
                    {viewingDoc.chunks.map((chunk, idx) => (
                      <div key={chunk.chunkId || idx} className="p-4 bg-[#0d1c2d] border border-white/5 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-[9px] font-mono text-[#4bddb7] border-b border-white/5 pb-1">
                          <span>CHUNK INDEX {idx + 1}</span>
                          <span>UUID: {chunk.chunkId}</span>
                        </div>
                        <p className="text-xs text-[#c8c4d7]/90 font-mono whitespace-pre-wrap leading-relaxed">
                          {chunk.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 bg-white/5 border-t border-white/5 flex justify-end">
              <button 
                onClick={() => setViewingDoc(null)} 
                className="px-6 py-2 rounded-xl bg-[#6c5ce7] text-white text-xs hover:bg-[#5847d2] font-['JetBrains_Mono'] uppercase tracking-wider cursor-pointer font-bold"
              >
                Close Viewer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Global Fetching Spinner for Document details */}
      {fetchingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-[#11141c] border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-3 shadow-2xl">
            <div className="w-8 h-8 border-2 border-[#6c5ce7]/20 border-t-[#6c5ce7] rounded-full animate-spin"></div>
            <p className="text-[10px] font-semibold tracking-wider font-['JetBrains_Mono'] text-[#c8c4d7]">
              RETRIEVING VECTOR CHUNKS...
            </p>
          </div>
        </div>
      )}

    </div>
  );
}