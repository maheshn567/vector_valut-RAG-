import React from "react";
import { Link } from "react-router-dom";

export default function FeaturesPage() {
  const coreFeatures = [
    {
      icon: "hub",
      title: "Semantic Parsing & Chunking",
      description: "Reject naive character split limits. Our system partitions text by logical sentence groupings and semantic headers, preserving context boundary rules for maximum LLM accuracy.",
      glowColor: "from-[#6c5ce7]/20 to-transparent",
      accentText: "Context Preserving"
    },
    {
      icon: "shield",
      title: "Multi-Tenant Isolation",
      description: "Enterprise-grade database isolation. Every organization is partitioned at the database schema and S3 bucket levels, preventing coordinate overlap or vector leakages.",
      glowColor: "from-[#4bddb7]/20 to-transparent",
      accentText: "SOC2 Compliance Ready"
    },
    {
      icon: "graphic_eq",
      title: "Voice AI & Live Transcripts",
      description: "Talk directly to your vectorized documents. Includes a WebGL speech visualize orb, live calls durations, call state machines, and sliding real-time transcription panels.",
      glowColor: "from-[#c6bfff]/20 to-transparent",
      accentText: "Dual-Channel Audio"
    },
    {
      icon: "database",
      title: "Pgvector Hybrid Search",
      description: "Combines sparse exact keyword matching with dense pgvector semantic coordinates. Configure cosine similarity, Euclidean distance, or dot product metrics instantly.",
      glowColor: "from-[#ffb77d]/20 to-transparent",
      accentText: "Sub-10ms Retrieval"
    },
    {
      icon: "integration_instructions",
      title: "Secure API Access",
      description: "Fully decoupled request controllers. Secured using HTTPOnly JWT session authentications, eliminating legacy static credentials in favor of temporary, rotating validation states.",
      glowColor: "from-[#6dfad2]/20 to-transparent",
      accentText: "JWT Encrypted"
    },
    {
      icon: "rocket_launch",
      title: "Automatic Re-Indexing",
      description: "Upload local files or connect cloud databases. Our pipeline automatically detects raw text additions, splits new paragraphs, calculates tokens, and pushes indices.",
      glowColor: "from-[#6c5ce7]/20 to-transparent",
      accentText: "HNSW Optimized"
    }
  ];

  return (
    <div className="relative min-h-screen text-[#d5e4fa] font-sans selection:bg-primary/30 pb-24">
      {/* Background Grid Layer */}
      <div className="absolute inset-0 grid-texture pointer-events-none opacity-20 z-0"></div>
      
      {/* Atmospheric Glow Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#6c5ce7] opacity-[0.04] blur-[140px] rounded-full pointer-events-none z-0 animate-pulse"></div>
      <div className="fixed bottom-[-15%] right-[-5%] w-[500px] h-[500px] bg-[#4bddb7] opacity-[0.03] blur-[140px] rounded-full pointer-events-none z-0 animate-pulse" style={{ animationDelay: "-3s" }}></div>

      <div className="max-w-[1200px] mx-auto pt-16 px-6 md:px-12 relative z-10 text-left">
        
        {/* Hero Section */}
        <section className="text-center mb-24 max-w-3xl mx-auto">
          <span className="font-mono text-xs text-[#c6bfff] font-bold uppercase tracking-widest block mb-3">PRODUCT CAPABILITIES</span>
          <h1 className="font-display-lg text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
            Next-gen RAG infrastructure, built to scale
          </h1>
          <p className="text-base md:text-lg text-[#c9c5d0] leading-relaxed">
            Vector Vault delivers high-fidelity semantic partition, vector proximity indexes, and multi-tenant security layers to power custom retrieval-augmented generation models.
          </p>
        </section>

        {/* Features Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {coreFeatures.map((feat, idx) => (
            <div 
              key={idx}
              className="glass-card bg-[#11141c]/55 backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#c6bfff]/30 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Corner accent glow */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feat.glowColor} blur-2xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>

              <div className="space-y-6">
                {/* Icon wrapper */}
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#c6bfff] group-hover:bg-[#6c5ce7] group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-xl">{feat.icon}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">{feat.title}</h3>
                  <p className="text-xs text-[#c9c5d0]/75 leading-relaxed">{feat.description}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 mt-6 flex justify-between items-center">
                <span className="font-mono text-[9px] font-bold text-[#c6bfff] uppercase tracking-widest bg-[#6c5ce7]/10 px-2 py-0.5 rounded border border-[#6c5ce7]/20">
                  {feat.accentText}
                </span>
                <span className="material-symbols-outlined text-xs text-[#c8c4d7]/40 group-hover:translate-x-1 group-hover:text-[#c6bfff] transition-all">
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <section className="glass-card bg-gradient-to-r from-[#11141c]/80 to-[#122031]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          {/* Subtle decoration lines */}
          <div className="absolute inset-0 grid-texture opacity-10 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white font-headline-md tracking-tight">
              Ready to vectorize your organization's memory?
            </h2>
            <p className="text-xs sm:text-sm text-[#c9c5d0]/80 leading-relaxed">
              Integrate Vector Vault in minutes. Build isolated collections, upload local files, and hook up LLM query interfaces with complete semantic retrieval control.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link 
                to="/signin" 
                className="px-8 py-3 bg-[#6c5ce7] hover:bg-[#5b4cc4] text-white rounded-xl font-semibold text-xs uppercase tracking-wider shadow-lg shadow-[#6c5ce7]/20 hover:scale-95 transition-all duration-200 cursor-pointer"
              >
                Get Started Free
              </Link>
              <Link 
                to="/pricing" 
                className="px-8 py-3 border border-white/10 hover:bg-white/5 text-white rounded-xl font-semibold text-xs uppercase tracking-wider hover:scale-95 transition-all duration-200 cursor-pointer"
              >
                View Pricing Tiers
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
