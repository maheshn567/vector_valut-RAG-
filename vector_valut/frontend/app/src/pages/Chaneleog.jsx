import { Link } from "react-router-dom";

export default function ChangelogPage() {
  const updates = [
    {
      version: "v1.2.0",
      date: "July 2026",
      title: "Voice Assistant & JWT Security Upgrades",
      description: "Major upgrade introducing a unified interactive voice chat session layout and transitioning all RAG retrieval endpoints to session-based JWT authorizations.",
      badges: ["Feature", "Security"],
      changes: [
        "Integrated central WebGL speech visualize orb (shrinks to 40px compact header).",
        "Wired a sliding tray panel for call transcriptions and ended-session timer modes.",
        "Removed legacy apiKey columns from Postgres database tables to secure all ask endpoints under verified user sessions.",
        "Cleaned up UI copy credentials and header interceptors."
      ]
    },
    {
      version: "v1.1.0",
      date: "June 2026",
      title: "Pgvector Hybrid Search & Reranker Controls",
      description: "Added core performance tweaks for high-dimensional vector calculations and custom cross-encoder rerankers.",
      badges: ["Performance", "Feature"],
      changes: [
        "Enabled Euclidean (L2), Cosine Similarity, and Dot Product distance metric metrics.",
        "Integrated cross-encoder rerankers for secondary-pass search relevance optimizations.",
        "Added global dashboard settings to customize TopK, similarity thresholds, and temperatures in real-time."
      ]
    },
    {
      version: "v1.0.0",
      date: "May 2026",
      title: "Vector Vault RAG Platform Launch",
      description: "Initial official release of our secure, scalable, multi-tenant Retrieval-Augmented Generation infrastructure.",
      badges: ["Release"],
      changes: [
        "Constructed automated text ingestion pipelines with recursive paragraph chunk splitters.",
        "Built multi-tenant isolation schemas separating apps, groups, and document corpora.",
        "Designed real-time conversation threads with cytoscape markdown citation widgets."
      ]
    }
  ];

  return (
    <div className="relative min-h-screen text-[#d5e4fa] font-sans selection:bg-[#6c5ce7]/30 pb-24">
      {/* Background grid overlay */}
      <div className="absolute inset-0 grid-texture pointer-events-none opacity-20 z-0"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#6c5ce7] opacity-[0.04] blur-[120px] rounded-full pointer-events-none z-0 animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#4bddb7] opacity-[0.03] blur-[120px] rounded-full pointer-events-none z-0 animate-pulse" style={{ animationDelay: "-3s" }}></div>

      <div className="max-w-[800px] mx-auto pt-16 px-6 relative z-10 text-left">
        
        {/* Header Hero */}
        <header className="mb-16 border-b border-white/5 pb-10">
          <span className="font-mono text-xs text-primary font-bold uppercase tracking-widest block mb-2">SYSTEM UPDATES</span>
          <h1 className="font-display-lg text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Changelog</h1>
          <p className="text-base text-[#c9c5d0] leading-relaxed max-w-xl">
            Stay up to date with the latest features, optimizations, and security improvements deployed to the Vector Vault platform.
          </p>
        </header>

        {/* Timeline updates list */}
        <div className="relative border-l border-white/10 pl-6 sm:pl-8 space-y-16 ml-2 sm:ml-4">
          
          {updates.map((update, idx) => (
            <article key={update.version} className="relative group">
              
              {/* Timeline dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#051424] border-2 border-[#6c5ce7] group-hover:bg-[#6c5ce7] transition-colors duration-200 z-10 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Version & Date */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="font-mono text-xs font-bold text-[#c6bfff] bg-[#6c5ce7]/10 border border-[#6c5ce7]/20 px-2.5 py-0.5 rounded-full">
                  {update.version}
                </span>
                <time className="font-mono text-xs text-[#c8c4d7]/50">{update.date}</time>
                <div className="flex gap-1.5">
                  {update.badges.map(b => (
                    <span 
                      key={b} 
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        b === 'Security' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        b === 'Feature' ? 'bg-[#4bddb7]/10 text-[#6dfad2] border border-[#4bddb7]/20' :
                        'bg-white/5 text-[#c8c4d7] border border-white/5'
                      }`}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Container */}
              <div className="glass-card bg-[#11141c]/45 backdrop-blur-md border border-white/5 rounded-xl p-6 sm:p-8 hover:border-[#6c5ce7]/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-2">{update.title}</h3>
                <p className="text-xs text-[#c9c5d0]/80 leading-relaxed mb-6">{update.description}</p>
                
                <h4 className="font-mono text-[10px] text-[#c8c4d7]/40 uppercase tracking-wider mb-3">Changes details</h4>
                <ul className="space-y-2.5 text-xs text-[#c9c5d0]/70">
                  {update.changes.map((change, cIdx) => (
                    <li key={cIdx} className="flex gap-3 items-start">
                      <span className="text-[#6c5ce7] select-none">•</span>
                      <span className="leading-relaxed">{change}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </article>
          ))}

        </div>

      </div>
    </div>
  );
}
