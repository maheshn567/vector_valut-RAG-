import { useState } from "react";

export default function DocInfoComp({ documents, groups, onDeleteDoc, onViewDetails, loading }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroupFilter, setSelectedGroupFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter logic
  const filtered = documents.filter(doc => {
    const matchesSearch = doc.docName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroupFilter === "all" || doc.groupId === selectedGroupFilter;
    return matchesSearch && matchesGroup;
  });

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocs = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <span className="material-symbols-outlined text-red-400">picture_as_pdf</span>;
    if (ext === 'docx') return <span className="material-symbols-outlined text-blue-400">description</span>;
    return <span className="material-symbols-outlined text-[#c8c4d7]/70">article</span>;
  };

  const getGroupName = (groupId) => {
    const found = groups.find(g => g.groupId === groupId);
    return found ? found.groupName : "RAG Ingestion Space";
  };

  return (
    <div className="bg-[#11141C]/70 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden text-left">
      
      {/* Header and Filter bar */}
      <div className="px-8 py-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-white">Knowledge Base</h3>
          <p className="text-xs text-[#c8c4d7]/50 mt-0.5">View and manage documents uploaded to the vector store.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Dropdown Group Filter */}
          <select
            value={selectedGroupFilter}
            onChange={(e) => {
              setSelectedGroupFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#122131] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#c6bfff]"
          >
            <option value="all">All Corpora</option>
            {groups.map(g => (
              <option key={g.groupId} value={g.groupId}>{g.groupName}</option>
            ))}
          </select>

          {/* Text Filter Input */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c8c4d7]/40 text-sm">search</span>
            <input 
              type="text"
              placeholder="Filter documents..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#122131] border border-white/5 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:ring-1 focus:ring-[#c6bfff] focus:outline-none w-full md:w-56 placeholder:text-[#c8c4d7]/40"
            />
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto custom-scrollbar">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#6c5ce7]/20 border-t-[#6c5ce7] rounded-full animate-spin"></div>
            <p className="text-xs text-[#c8c4d7]/50 font-mono tracking-wider">RETRIEVING FILES...</p>
          </div>
        ) : paginatedDocs.length === 0 ? (
          <div className="py-20 text-center max-w-sm mx-auto space-y-4">
            <div className="w-12 h-12 bg-white/5 text-[#c8c4d7]/30 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">description</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">No documents found</h4>
              <p className="text-xs text-[#c8c4d7]/50 mt-1">
                {searchQuery || selectedGroupFilter !== "all" 
                  ? "Adjust search queries or filters."
                  : "Begin uploading documents above to build your secure knowledge base."}
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0d1c2d]/55 border-b border-white/5">
                <th className="px-8 py-3.5 font-['JetBrains_Mono'] text-[9px] uppercase tracking-wider text-[#c8c4d7]/50">Document Name</th>
                <th className="px-8 py-3.5 font-['JetBrains_Mono'] text-[9px] uppercase tracking-wider text-[#c8c4d7]/50">Corpus Group</th>
                <th className="px-8 py-3.5 font-['JetBrains_Mono'] text-[9px] uppercase tracking-wider text-[#c8c4d7]/50">Chunks</th>
                <th className="px-8 py-3.5 font-['JetBrains_Mono'] text-[9px] uppercase tracking-wider text-[#c8c4d7]/50">Status</th>
                <th className="px-8 py-3.5 font-['JetBrains_Mono'] text-[9px] uppercase tracking-wider text-[#c8c4d7]/50">Uploaded Date</th>
                <th className="px-8 py-3.5 font-['JetBrains_Mono'] text-[9px] uppercase tracking-wider text-[#c8c4d7]/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedDocs.map((doc) => (
                <tr key={doc.docId} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-4.5">
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.docName)}
                      <span className="font-medium text-white truncate max-w-[240px] group-hover:text-[#c6bfff] transition-colors">
                        {doc.docName}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-4.5">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-[#c8c4d7]/80 font-mono border border-white/5">
                      {getGroupName(doc.groupId)}
                    </span>
                  </td>
                  <td className="px-8 py-4.5">
                    <span className="font-mono text-xs text-[#c8c4d7] font-semibold">
                      {doc._count?.chunks || doc.chunks?.length || 0}
                    </span>
                  </td>
                  <td className="px-8 py-4.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#4bddb7]/10 text-[#4bddb7] font-['JetBrains_Mono'] text-[9px] border border-[#4bddb7]/20 font-bold uppercase tracking-wider">
                      <span className="w-1 h-1 rounded-full bg-[#4bddb7]"></span>
                      INDEXED
                    </span>
                  </td>
                  <td className="px-8 py-4.5 text-xs text-[#c8c4d7]/60">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-4.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onViewDetails(doc.docId)}
                        title="View Document Details"
                        className="p-1.5 hover:bg-[#122131] rounded text-[#c8c4d7] hover:text-[#c6bfff] transition-all cursor-pointer flex items-center"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                      </button>
                      <button 
                        onClick={() => onDeleteDoc(doc.docId)}
                        title="Delete Document"
                        className="p-1.5 hover:bg-[#ffb4ab]/10 rounded text-[#c8c4d7] hover:text-[#ffb4ab] transition-all cursor-pointer flex items-center"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {!loading && filtered.length > 0 && (
        <div className="px-8 py-4 bg-[#0d1c2d]/25 flex items-center justify-between border-t border-white/5">
          <span className="text-xs text-[#c8c4d7]/50">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} documents
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 border border-white/5 rounded bg-[#122131] text-[#c8c4d7] hover:bg-white/5 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <span className="text-xs font-mono text-[#c8c4d7] px-2">{currentPage} / {totalPages}</span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-white/5 rounded bg-[#122131] text-[#c8c4d7] hover:bg-white/5 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}