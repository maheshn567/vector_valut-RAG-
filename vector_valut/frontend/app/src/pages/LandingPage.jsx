import { useState } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("query");

  // Sample data for the interactive developer console
  const codeExamples = {
    ingest: {
      url: "/v1/vault/ingest",
      method: "POST",
      color: "text-amber-400 bg-amber-400/10",
      code: `import vectorvault

vault = vectorvault.Client("api_key_...")

# Ingest any document with automated extraction
status = vault.ingest(
    vault_id="finance_docs",
    file_path="./q3_report.pdf",
    chunk_size=1000,
    overlap=200
)`,
      response: `{
  "success": true,
  "document_id": "doc-8b9a12cf",
  "chunks_created": 42,
  "status": "processing"
}`
    },
    query: {
      url: "/v1/vault/query",
      method: "POST",
      color: "text-[#6C5CE7] bg-[#6C5CE7]/10",
      code: `import vectorvault

vault = vectorvault.Client("api_key_...")

# Query with automatic citation handling
response = vault.query(
    vault_id="finance_docs",
    prompt="Explain our Q3 revenue",
    stream=True
)`,
      response: `{
  "answer": "Revenue grew 12% in Q3...",
  "citations": ["q3_report.pdf"],
  "latency_ms": 142
}`
    },
    status: {
      url: "/v1/vault/status",
      method: "GET",
      color: "text-emerald-400 bg-emerald-400/10",
      code: `import vectorvault

vault = vectorvault.Client("api_key_...")

# Check indexing health and segment status
health = vault.status(
    vault_id="finance_docs"
)`,
      response: `{
  "vault_id": "finance_docs",
  "indexed_chunks": 428192,
  "embedding_provider": "voyage",
  "status": "healthy"
}`
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-[#d5e4fa] font-['Inter']">
      
      {/* Background Grid & Ambient Glow Orbs */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-40" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px"
        }}
      />
      <div className="absolute top-1/4 -left-48 w-[500px] h-[500px] bg-[#6c5ce7]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-[500px] h-[500px] bg-[#00b894]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 pt-28 pb-20 px-8 text-center max-w-7xl mx-auto">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#122031] border border-white/10 mb-8 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-[#4BDDB7]"></span>
          <span className="text-xs font-semibold tracking-wider text-[#4BDDB7] font-['JetBrains_Mono'] uppercase">
            System Operational
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white font-['Hanken_Grotesk'] max-w-4xl mx-auto mb-6 leading-tight">
          Build <span className="bg-gradient-to-r from-[#e4deff] via-[#4bddb7] to-[#ffb77d] bg-clip-text text-transparent">production-grade RAG apps</span> in minutes.
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-[#d5e4fa]/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          Vector Vault provides the secure, enterprise-ready infrastructure to ingest, index, and query document knowledge bases with low-latency and auto-citations.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link 
            to="/signup" 
            className="w-full sm:w-auto bg-[#6C5CE7] hover:bg-[#5847d2] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-[#6C5CE7]/30 hover:-translate-y-[1px]"
          >
            Start building free
          </Link>
          <a 
            href="#features" 
            className="w-full sm:w-auto border border-white/10 hover:bg-white/5 text-white px-8 py-4 rounded-xl font-bold transition-all"
          >
            See how it works
          </a>
        </div>

        {/* Hero Chat Preview Mockup */}
        <div className="max-w-4xl mx-auto bg-[#11141c]/80 backdrop-blur-md rounded-2xl p-2 border border-white/5 shadow-2xl relative group overflow-hidden">
          <div className="bg-[#051424] rounded-xl overflow-hidden border border-white/5">
            <div className="bg-[#1d2b3c]/50 h-10 flex items-center px-4 border-b border-white/5 justify-between">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
              </div>
              <div className="bg-[#0e1c2d] px-4 py-0.5 rounded text-[11px] text-[#d5e4fa]/55 font-mono">
                https://vault.ai/chat/project-alpha
              </div>
              <div className="w-6"></div>
            </div>
            
            <div className="p-6 md:p-8 flex flex-col gap-6 text-left">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#6C5CE7]/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#6C5CE7] text-sm">smart_toy</span>
                </div>
                <div className="flex-grow space-y-3">
                  <p className="text-[#d5e4fa] text-base leading-relaxed">
                    Based on your uploaded document, multi-tenant database isolation is handled cryptographically at the vector namespace level, ensuring tenant <code className="bg-white/5 px-1 py-0.5 rounded text-[#ffb77d] font-mono text-xs">04X-91</code> cannot access any adjacent index partitions.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <div className="bg-[#11141c] px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs border border-[#6c5ce7]/20 text-[#4BDDB7]">
                      <span className="material-symbols-outlined text-sm">description</span>
                      tenant_policy.pdf
                    </div>
                    <div className="bg-[#11141c] px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs border border-[#6c5ce7]/20 text-[#4BDDB7]">
                      <span className="material-symbols-outlined text-sm">description</span>
                      auth_schema.json
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/5 pt-6">
                <div className="bg-[#11141c] border border-white/5 px-4 py-3 rounded-xl flex justify-between items-center text-[#d5e4fa]/40 text-sm">
                  <span>Ask a question about your knowledge store...</span>
                  <span className="material-symbols-outlined text-[#6C5CE7] cursor-pointer">send</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/5 bg-[#0e1c2d]/30 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center md:border-r border-white/10 last:border-0">
              <div className="text-3xl md:text-4xl font-extrabold text-[#6C5CE7] mb-1 font-['Hanken_Grotesk']">428k</div>
              <div className="text-xs text-[#d5e4fa]/50 font-semibold tracking-wider font-['JetBrains_Mono'] uppercase">Chunks Processed</div>
            </div>
            <div className="text-center md:border-r border-white/10 last:border-0">
              <div className="text-3xl md:text-4xl font-extrabold text-[#4BDDB7] mb-1 font-['Hanken_Grotesk']">99.9%</div>
              <div className="text-xs text-[#d5e4fa]/50 font-semibold tracking-wider font-['JetBrains_Mono'] uppercase">Uptime SLA</div>
            </div>
            <div className="text-center md:border-r border-white/10 last:border-0">
              <div className="text-3xl md:text-4xl font-extrabold text-[#ffb77d] mb-1 font-['Hanken_Grotesk']">184ms</div>
              <div className="text-xs text-[#d5e4fa]/50 font-semibold tracking-wider font-['JetBrains_Mono'] uppercase">Avg. Latency</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-white mb-1 font-['Hanken_Grotesk']">12+</div>
              <div className="text-xs text-[#d5e4fa]/50 font-semibold tracking-wider font-['JetBrains_Mono'] uppercase">Model Providers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 relative z-10 max-w-7xl mx-auto px-8">
        <div className="mb-16 text-left">
          <h2 className="text-3xl font-bold tracking-tight text-white font-['Hanken_Grotesk'] mb-4">
            Engineered for Reliability
          </h2>
          <p className="text-[#d5e4fa]/70 max-w-xl">
            Every component of the Vault is built to provide the security, precision, and performance your production environment demands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Card: Multi-tenant */}
          <div className="md:col-span-2 bg-[#11141c]/50 border border-white/5 backdrop-blur-sm p-8 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#6C5CE7] text-2xl">security</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-['Hanken_Grotesk']">Multi-tenant Isolation</h3>
              <p className="text-[#d5e4fa]/70 mb-8 max-w-md">
                Hardened data boundaries at the database level. Each user namespace resides in a separate segment, preventing cross-tenant information leakage.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] bg-[#051424] border border-white/5 p-4 rounded-lg self-start">
              <span className="bg-[#6C5CE7]/20 text-[#6C5CE7] px-2 py-0.5 rounded">App-Root</span>
              <span className="text-[#d5e4fa]/40">→</span>
              <span className="bg-[#ffb77d]/20 text-[#ffb77d] px-2 py-0.5 rounded">Project-Vault</span>
              <span className="text-[#d5e4fa]/40">→</span>
              <span className="bg-[#4BDDB7]/20 text-[#4BDDB7] px-2 py-0.5 rounded">Tenant-049</span>
            </div>
          </div>

          {/* Small Card 1: Two-stage retrieval */}
          <div className="bg-[#11141c]/50 border border-white/5 backdrop-blur-sm p-8 rounded-2xl hover:border-white/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#ffb77d]/10 border border-[#ffb77d]/20 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[#ffb77d] text-2xl">hub</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-['Hanken_Grotesk']">Two-Stage Retrieval</h3>
            <p className="text-sm text-[#d5e4fa]/70 leading-relaxed">
              Hybrid dense-sparse vector search combined with a cross-encoder Reranker pipeline to filter out low-relevance sources.
            </p>
          </div>

          {/* Small Card 2: Pluggable providers */}
          <div className="bg-[#11141c]/50 border border-white/5 backdrop-blur-sm p-8 rounded-2xl hover:border-white/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#4BDDB7]/10 border border-[#4BDDB7]/20 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[#4BDDB7] text-2xl">extension</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-['Hanken_Grotesk']">Pluggable Providers</h3>
            <p className="text-sm text-[#d5e4fa]/70 leading-relaxed">
              Seamlessly swap your backing language models or embedders—supporting OpenAI, VoyageAI, and high-performance NVIDIA models.
            </p>
          </div>

          {/* Small Card 3: Citations */}
          <div className="bg-[#11141c]/50 border border-white/5 backdrop-blur-sm p-8 rounded-2xl hover:border-white/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[#6C5CE7] text-2xl">verified</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-['Hanken_Grotesk']">Citation Tracking</h3>
            <p className="text-sm text-[#d5e4fa]/70 leading-relaxed">
              Never worry about hallucinations. Every generated fact includes real-time regex citation mapping pointing to source source IDs.
            </p>
          </div>

          {/* Small Card 4: Formats */}
          <div className="bg-[#11141c]/50 border border-white/5 backdrop-blur-sm p-8 rounded-2xl hover:border-white/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#ffb77d]/10 border border-[#ffb77d]/20 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[#ffb77d] text-2xl">upload_file</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-['Hanken_Grotesk']">Any File, Handled</h3>
            <div className="mt-4 w-full rounded-xl overflow-hidden bg-[#051424] border border-white/5 flex items-center justify-center p-2">
              <img 
                alt="Supported File Types" 
                className="w-full h-24 object-cover object-center rounded-lg opacity-85" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaZOaXei1NHram3iJxWfRxePxB6VJWBrFr7dA1Uia1BiWw-TlhHE1tPKJntpwWYu_yklyx483RGdo2cS0sPpRphefsTpBJifH1XAjeWLbH4hRSE2p39rPZpuOCEQp92EESB9bQmI7Bb2i0-BI6pocvPzT1CyHBYJmoS4bVtcwPti7KTsB-ZHZsUg8i7BFvZ7XCA578EZtNTBnpacKCg8U4ySAyvysedL8us0cAQMHK4Y8HoRtORukwM5WTSWv4xVO6vOg80e9R5dQ"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline Visualization */}
      <section className="py-24 bg-[#010f1f]/60 relative z-10 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white font-['Hanken_Grotesk'] mb-3">The Intelligent Pipeline</h2>
            <p className="text-[#d5e4fa]/60 max-w-md mx-auto">From raw unstructured file to queryable vector storage in milliseconds.</p>
          </div>

          <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 max-w-4xl mx-auto py-6">
            
            {/* Connection SVG Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full -translate-y-1/2 z-0 h-10">
              <svg width="100%" height="20" className="opacity-40">
                <path d="M0 10 C 150 10, 150 2, 300 2 C 450 2, 450 18, 600 18 C 750 18, 750 10, 900 10" stroke="url(#gradient)" strokeWidth="2" fill="none" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6C5CE7" />
                    <stop offset="50%" stopColor="#4BDDB7" />
                    <stop offset="100%" stopColor="#ffb77d" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Steps */}
            <div className="relative z-10 flex flex-col items-center gap-3 group">
              <div className="w-16 h-16 rounded-full bg-[#11141c] border border-[#6C5CE7] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#6C5CE7]/15">
                <span className="material-symbols-outlined text-[#6C5CE7] text-2xl">track_changes</span>
              </div>
              <span className="text-xs font-semibold tracking-wider font-['JetBrains_Mono'] uppercase">Extract</span>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3 group">
              <div className="w-16 h-16 rounded-full bg-[#11141c] border border-[#ffb77d] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#ffb77d]/15">
                <span className="material-symbols-outlined text-[#ffb77d] text-2xl">splitscreen</span>
              </div>
              <span className="text-xs font-semibold tracking-wider font-['JetBrains_Mono'] uppercase">Chunk</span>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3 group">
              <div className="w-16 h-16 rounded-full bg-[#11141c] border border-[#4BDDB7] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#4BDDB7]/15">
                <span className="material-symbols-outlined text-[#4BDDB7] text-2xl">view_in_ar</span>
              </div>
              <span className="text-xs font-semibold tracking-wider font-['JetBrains_Mono'] uppercase">Embed</span>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3 group">
              <div className="w-16 h-16 rounded-full bg-[#6C5CE7]/10 border border-[#6C5CE7] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#6C5CE7]/30">
                <span className="material-symbols-outlined text-[#4BDDB7] text-2xl">database</span>
              </div>
              <span className="text-xs font-semibold tracking-wider font-['JetBrains_Mono'] uppercase">Indexed</span>
            </div>

          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-24 relative z-10 max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <h2 className="text-3xl font-bold text-white font-['Hanken_Grotesk'] mb-6">
              Designed for Developers
            </h2>
            <p className="text-[#d5e4fa]/70 text-base leading-relaxed mb-8">
              Stop worrying about text splitting strategies, vector indexes, database pushes, and raw embedding formats. Our API handles all complexity so you can focus on building user experiences.
            </p>
            
            {/* Endpoint Tabs */}
            <div className="space-y-3 font-['JetBrains_Mono']">
              {Object.keys(codeExamples).map((key) => {
                const ex = codeExamples[key];
                return (
                  <div 
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${
                      activeTab === key 
                        ? "bg-[#122031] border-[#6c5ce7]/30" 
                        : "border-white/5 bg-[#11141c]/20 hover:bg-white/5"
                    }`}
                  >
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ex.color}`}>
                      {ex.method}
                    </span>
                    <span className="text-sm font-semibold text-[#d5e4fa]">{ex.url}</span>
                    <span className="material-symbols-outlined ml-auto text-sm text-[#d5e4fa]/30 group-hover:text-white transition-colors">
                      arrow_forward
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Code IDE Mockup */}
          <div className="bg-[#010f1f] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            <div className="bg-[#1d2b3c]/50 p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-white/10"></div>
                <div className="w-3 h-3 rounded-full bg-white/10"></div>
                <div className="w-3 h-3 rounded-full bg-white/10"></div>
              </div>
              <span className="text-xs font-semibold text-[#d5e4fa]/40 font-mono">
                {activeTab === "ingest" ? "ingest_document.py" : activeTab === "query" ? "query_vault.py" : "vault_health.py"}
              </span>
              <div className="w-6"></div>
            </div>
            
            <div className="p-6 font-mono text-xs leading-relaxed text-left">
              <pre className="text-[#c6bfff] overflow-x-auto whitespace-pre">
                {codeExamples[activeTab].code}
              </pre>
              
              <div className="mt-6 pt-6 border-t border-white/5">
                <div className="text-[10px] text-[#d5e4fa]/40 font-bold uppercase tracking-widest mb-3">
                  Response Payload
                </div>
                <pre className="text-[#ffb77d] overflow-x-auto whitespace-pre">
                  {codeExamples[activeTab].response}
                </pre>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-white font-['Hanken_Grotesk'] mb-3">
            Scalable Infrastructure
          </h2>
          <p className="text-[#d5e4fa]/60 mb-16">Simple, transparent pricing that grows with your load.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            {/* Starter */}
            <div className="bg-[#11141c]/50 border border-white/5 p-8 rounded-2xl flex flex-col hover:border-white/10 transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white font-['Hanken_Grotesk']">Starter</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-[#d5e4fa]/50 font-mono">/ forever</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-grow font-['Inter']">
                <li className="flex items-center gap-3 text-sm text-[#d5e4fa]/70">
                  <span className="material-symbols-outlined text-[#4BDDB7] text-sm">check_circle</span>
                  100k Context Chunks
                </li>
                <li className="flex items-center gap-3 text-sm text-[#d5e4fa]/70">
                  <span className="material-symbols-outlined text-[#4BDDB7] text-sm">check_circle</span>
                  2 Knowledge Vaults
                </li>
                <li className="flex items-center gap-3 text-sm text-[#d5e4fa]/70">
                  <span className="material-symbols-outlined text-[#4BDDB7] text-sm">check_circle</span>
                  Community Discord Support
                </li>
              </ul>
              <Link to="/signup" className="w-full text-center py-3 rounded-lg border border-white/10 hover:bg-white/5 font-bold transition-all text-sm">
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-[#122031] border border-[#6C5CE7]/30 p-8 rounded-2xl flex flex-col relative ring-2 ring-[#6C5CE7]/20 hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#6C5CE7] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white font-['Hanken_Grotesk']">Pro</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$49</span>
                  <span className="text-xs text-[#d5e4fa]/50 font-mono">/ month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-grow font-['Inter']">
                <li className="flex items-center gap-3 text-sm text-[#d5e4fa]">
                  <span className="material-symbols-outlined text-[#6C5CE7] text-sm">check_circle</span>
                  5M Vector Chunks
                </li>
                <li className="flex items-center gap-3 text-sm text-[#d5e4fa]">
                  <span className="material-symbols-outlined text-[#6C5CE7] text-sm">check_circle</span>
                  Unlimited Vaults
                </li>
                <li className="flex items-center gap-3 text-sm text-[#d5e4fa]">
                  <span className="material-symbols-outlined text-[#6C5CE7] text-sm">check_circle</span>
                  Advanced BGE Reranker
                </li>
                <li className="flex items-center gap-3 text-sm text-[#d5e4fa]">
                  <span className="material-symbols-outlined text-[#6C5CE7] text-sm">check_circle</span>
                  Priority Developer SLA
                </li>
              </ul>
              <Link to="/signup" className="w-full text-center py-3 rounded-lg bg-[#6C5CE7] hover:bg-[#5847d2] font-bold text-white transition-all text-sm shadow-lg shadow-[#6C5CE7]/20">
                Go Pro
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-[#11141c]/50 border border-white/5 p-8 rounded-2xl flex flex-col hover:border-white/10 transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white font-['Hanken_Grotesk']">Enterprise</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">Custom</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-grow font-['Inter']">
                <li className="flex items-center gap-3 text-sm text-[#d5e4fa]/70">
                  <span className="material-symbols-outlined text-[#d5e4fa]/30 text-sm">check_circle</span>
                  Unlimited Scale & Chunks
                </li>
                <li className="flex items-center gap-3 text-sm text-[#d5e4fa]/70">
                  <span className="material-symbols-outlined text-[#d5e4fa]/30 text-sm">check_circle</span>
                  VPC On-Premise Deployments
                </li>
                <li className="flex items-center gap-3 text-sm text-[#d5e4fa]/70">
                  <span className="material-symbols-outlined text-[#d5e4fa]/30 text-sm">check_circle</span>
                  Dedicated Solutions Engineer
                </li>
              </ul>
              <Link to="/contact" className="w-full text-center py-3 rounded-lg border border-white/10 hover:bg-white/5 font-bold transition-all text-sm">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative z-10 text-center px-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 font-['Hanken_Grotesk']">
            Your knowledge base, <span className="bg-gradient-to-r from-[#e4deff] via-[#6dfad2] to-[#ffb77d] bg-clip-text text-transparent">ready to answer.</span>
          </h2>
          <p className="text-base text-[#d5e4fa]/60 mb-12 max-w-xl mx-auto">
            Join 1,000+ developers building robust, citation-backed LLM applications on Vector Vault.
          </p>
          <Link to="/signup" className="inline-block bg-[#6C5CE7] hover:bg-[#5847d2] text-white px-10 py-5 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-[#6c5ce7]/10">
            Deploy Your First Vault
          </Link>
        </div>
      </section>

    </div>
  );
}