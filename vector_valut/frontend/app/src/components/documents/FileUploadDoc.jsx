import { useState, useRef } from "react";
import { createRag } from "../../apis/rag.api";
import { toast } from "sonner";

export default function FileUploadCom({ groups, defaultGroupId, onUploadSuccess, onUploadStart }) {
  const [selectedGroup, setSelectedGroup] = useState(defaultGroupId || "");
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Sync state if defaultGroupId changes
  if (defaultGroupId && !selectedGroup && groups.some(g => g.groupId === defaultGroupId)) {
    setSelectedGroup(defaultGroupId);
  }

  // Handle Drag Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle Drop Event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      // Validate support type extensions
      const validFiles = droppedFiles.filter(file => {
        const ext = file.name.split('.').pop().toLowerCase();
        return ["pdf", "docx", "txt"].includes(ext);
      });

      if (validFiles.length !== droppedFiles.length) {
        toast.warning("Some files were skipped. Only PDF, DOCX, and TXT are supported.");
      }

      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  // Handle File Input Selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selected]);
    }
  };

  // Trigger File Dialog
  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  // Remove File from Queue
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Upload Queue handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGroup) {
      toast.error("Please select a target corpus group first.");
      return;
    }
    if (files.length === 0) {
      toast.error("Please select at least one document to ingest.");
      return;
    }

    setUploading(true);
    let successCount = 0;
    
    // Signal start to trigger pipeline animation view
    if (onUploadStart) {
      onUploadStart(files[0]);
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("groupId", selectedGroup);
      formData.append("docName", file.name);

      try {
        const res = await createRag(formData);
        if (res && res.success) {
          successCount++;
        } else {
          throw new Error(res.message || "Ingestion error");
        }
      } catch (err) {
        console.error(`Failed to ingest file ${file.name}:`, err);
        toast.error(`Failed to process: ${file.name}`);
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully ingested ${successCount}/${files.length} document(s).`);
      onUploadSuccess();
      setFiles([]);
    }
    setUploading(false);
  };

  return (
    <div className="lg:col-span-2 flex flex-col gap-4 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#11141c]/50 p-4 border border-white/5 rounded-xl">
        <div className="space-y-1">
          <h4 className="font-['JetBrains_Mono'] text-[10px] text-[#c8c4d7]/50 uppercase tracking-widest font-semibold">
            Target Corpus Group
          </h4>
          <p className="text-xs text-[#c8c4d7]/70">Choose which database scope the documents should index under.</p>
        </div>
        <select 
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="bg-[#122131] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#c6bfff] min-w-[200px]"
        >
          <option value="" disabled>-- Select RAG Corpus --</option>
          {groups.map(group => (
            <option key={group.groupId} value={group.groupId}>
              {group.groupName} ({group.parentAppName})
            </option>
          ))}
        </select>
      </div>

      {/* Drag & Drop Main Panel */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`bg-[#11141C]/70 backdrop-blur-xl border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden min-h-[220px] ${dragActive ? 'border-[#6c5ce7] bg-[#6c5ce7]/5' : 'border-[#c6bfff]/10 hover:border-[#c6bfff]/50'}`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          multiple
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          className="hidden" 
        />
        
        <div className="absolute inset-0 bg-[#c6bfff]/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-[#c6bfff]/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
            <span className="material-symbols-outlined text-[#c6bfff] text-3xl">cloud_upload</span>
          </div>
          <h3 className="font-['Hanken_Grotesk'] text-base font-bold text-white">Drag and drop documents</h3>
          <p className="font-body-sm text-[11px] text-[#c8c4d7]/70 mt-1">or click to browse from your local system</p>
          
          <div className="mt-6 flex gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#122131] rounded border border-white/5 text-[10px]">
              <span className="material-symbols-outlined text-xs text-red-400">picture_as_pdf</span>
              <span className="font-['JetBrains_Mono'] uppercase font-bold tracking-wider text-[#c8c4d7]">PDF</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#122131] rounded border border-white/5 text-[10px]">
              <span className="material-symbols-outlined text-xs text-blue-400">description</span>
              <span className="font-['JetBrains_Mono'] uppercase font-bold tracking-wider text-[#c8c4d7]">DOCX</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#122131] rounded border border-white/5 text-[10px]">
              <span className="material-symbols-outlined text-xs text-emerald-400">article</span>
              <span className="font-['JetBrains_Mono'] uppercase font-bold tracking-wider text-[#c8c4d7]">TXT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected File list queue */}
      {files.length > 0 && (
        <div className="bg-[#11141c]/40 border border-white/5 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-xs font-bold text-white">Upload Queue ({files.length} File{files.length > 1 ? 's' : ''})</span>
            <button 
              onClick={() => setFiles([])}
              className="text-[10px] font-bold text-[#ffb4ab] hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>
          
          <div className="max-h-36 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {files.map((file, idx) => (
              <div key={idx} className="flex justify-between items-center bg-[#122131]/60 px-3 py-2 rounded-lg border border-white/5 text-xs">
                <div className="flex items-center gap-2 truncate pr-4">
                  <span className="material-symbols-outlined text-sm text-[#c8c4d7]">
                    {file.name.endsWith('.pdf') ? 'picture_as_pdf' : file.name.endsWith('.docx') ? 'description' : 'article'}
                  </span>
                  <span className="truncate text-[#c8c4d7]">{file.name}</span>
                  <span className="text-[10px] text-[#c8c4d7]/40 font-mono">
                    ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
                <button 
                  onClick={() => removeFile(idx)}
                  className="text-[#ffb4ab] hover:text-[#ffdad6] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={uploading || !selectedGroup}
            className="w-full py-2.5 bg-[#6c5ce7] hover:bg-[#5847d2] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs font-['JetBrains_Mono'] uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#6c5ce7]/10"
          >
            {uploading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Ingesting Knowledge Source...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm font-bold">bolt</span>
                <span>Process & Ingest {files.length} Document{files.length > 1 ? 's' : ''}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}