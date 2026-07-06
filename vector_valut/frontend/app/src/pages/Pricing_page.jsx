import { useState } from "react";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="relative min-h-screen text-[#d5e4fa] font-sans selection:bg-primary/30 pb-24">
      {/* Ambient background glow */}
      <div className="absolute inset-0 grid-texture pointer-events-none opacity-20 z-0"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#e4deff] opacity-[0.04] blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#4bddb7] opacity-[0.03] blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-[1200px] mx-auto pt-16 px-6 md:px-12 relative z-10">
        
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="font-display-lg text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
            Transparent pricing for scale
          </h1>
          <p className="text-base md:text-lg text-[#c9c5d0] max-w-2xl mx-auto leading-relaxed">
            Power your RAG infrastructure with high-performance vector retrieval. No hidden fees. Just pure, indexed performance at any scale.
          </p>
        </section>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center gap-4 mb-16">
          <span className="text-xs uppercase tracking-wider font-semibold font-mono text-[#c9c5d0]">Monthly</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-14 h-7 bg-[#283647] rounded-full transition-colors duration-300 focus:outline-none cursor-pointer"
            type="button"
          >
            <div 
              className={`absolute top-1 w-5 h-5 bg-[#e4deff] rounded-full transition-transform duration-300 shadow-sm ${
                isAnnual ? "translate-x-8" : "translate-x-1"
              }`}
            ></div>
          </button>
          <span className="text-xs uppercase tracking-wider font-semibold font-mono text-[#c9c5d0]">Annually</span>
          <span className="bg-[#4bddb7]/20 text-[#6dfad2] px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wide">
            Save 20%
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          
          {/* Starter Plan */}
          <div className="glass-card bg-[#11141c]/60 backdrop-blur-md border border-white/5 hover:border-[#c6bfff]/40 hover:-translate-y-2 transition-all duration-300 rounded-xl p-8 flex flex-col text-left">
            <div className="mb-8">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c6bfff]/60 mb-2 block">FOR PROTOTYPING</span>
              <h3 className="text-2xl font-bold text-white font-headline-md">Starter</h3>
            </div>
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-black text-white">$0</span>
                <span className="text-sm text-[#c9c5d0]/70">/mo</span>
              </div>
              <p className="text-xs text-[#c9c5d0]/70 mt-2">Perfect for side projects and proof of concepts.</p>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-xs">
                <span className="material-symbols-outlined text-[#e4deff] text-sm">check</span>
                <span>10k Vector Dimensions</span>
              </li>
              <li className="flex items-center gap-3 text-xs">
                <span className="material-symbols-outlined text-[#e4deff] text-sm">check</span>
                <span>1,000 Monthly Queries</span>
              </li>
              <li className="flex items-center gap-3 text-xs">
                <span className="material-symbols-outlined text-[#e4deff] text-sm">check</span>
                <span>HNSW Indexing</span>
              </li>
              <li className="flex items-center gap-3 text-xs">
                <span className="material-symbols-outlined text-[#e4deff] text-sm">check</span>
                <span>Standard Community Support</span>
              </li>
              <li className="flex items-center gap-3 text-xs opacity-40 line-through">
                <span className="material-symbols-outlined text-sm">check</span>
                <span>Custom Metadata Filtering</span>
              </li>
            </ul>
            <button className="w-full py-3 rounded-lg border border-[#e4deff]/30 hover:bg-[#e4deff]/5 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer">
              Start Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="glass-card bg-[#11141c]/60 backdrop-blur-md border border-[#c6bfff]/30 hover:border-[#c6bfff]/60 hover:-translate-y-2 transition-all duration-300 rounded-xl p-8 flex flex-col text-left relative overflow-hidden ring-1 ring-[#c6bfff]/10 shadow-lg shadow-[#c6bfff]/5">
            <div className="absolute top-0 right-0 bg-[#e4deff] text-[#2f295e] text-[9px] font-mono font-black px-4 py-1.5 rounded-bl-lg tracking-wider uppercase">
              POPULAR
            </div>
            <div className="mb-8">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c6bfff]/70 mb-2 block">FOR PRODUCTION</span>
              <h3 className="text-2xl font-bold text-white font-headline-md">Pro</h3>
            </div>
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-black text-white">
                  {isAnnual ? "$64" : "$79"}
                </span>
                <span className="text-sm text-[#c9c5d0]/70">/mo</span>
              </div>
              <p className="text-xs text-[#c9c5d0]/70 mt-2">Scale your production RAG applications with ease.</p>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-xs">
                <span className="material-symbols-outlined text-[#e4deff] text-sm">check</span>
                <span>1M Vector Dimensions</span>
              </li>
              <li className="flex items-center gap-3 text-xs">
                <span className="material-symbols-outlined text-[#e4deff] text-sm">check</span>
                <span>100,000 Monthly Queries</span>
              </li>
              <li className="flex items-center gap-3 text-xs">
                <span className="material-symbols-outlined text-[#e4deff] text-sm">check</span>
                <span>Advanced Metadata Filtering</span>
              </li>
              <li className="flex items-center gap-3 text-xs">
                <span className="material-symbols-outlined text-[#e4deff] text-sm">check</span>
                <span>Hybrid Search (Vector + Keyword)</span>
              </li>
              <li className="flex items-center gap-3 text-xs">
                <span className="material-symbols-outlined text-[#e4deff] text-sm">check</span>
                <span>Priority Email Support</span>
              </li>
              <li className="flex items-center gap-3 text-xs">
                <span className="material-symbols-outlined text-[#e4deff] text-sm">check</span>
                <span>Multi-tenant Isolation</span>
              </li>
            </ul>
            <button className="w-full py-3 rounded-lg bg-[#4029ba] hover:bg-[#2900a0] text-[#b4abff] font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#4029ba]/20 cursor-pointer">
              Go Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="glass-card bg-[#11141c]/60 backdrop-blur-md border border-white/5 hover:border-[#c6bfff]/40 hover:-translate-y-2 transition-all duration-300 rounded-xl p-8 flex flex-col text-left">
            <div className="mb-8">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#6dfad2] mb-2 block">FOR INFRASTRUCTURE</span>
              <h3 className="text-2xl font-bold text-white font-headline-md">Enterprise</h3>
            </div>
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-black text-white">Custom</span>
              </div>
              <p className="text-xs text-[#c9c5d0]/70 mt-2">Full control, isolation, and unlimited scalability.</p>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-xs">
                <span className="material-symbols-outlined text-[#e4deff] text-sm">check</span>
                <span>Unlimited Dimensions</span>
              </li>
              <li className="flex items-center gap-3 text-xs">
                <span className="material-symbols-outlined text-[#e4deff] text-sm">check</span>
                <span>On-premise Deployment</span>
              </li>
              <li className="flex items-center gap-3 text-xs">
                <span className="material-symbols-outlined text-[#e4deff] text-sm">check</span>
                <span>Custom SLA (99.99%)</span>
              </li>
              <li className="flex items-center gap-3 text-xs">
                <span className="material-symbols-outlined text-[#e4deff] text-sm">check</span>
                <span>Dedicated Solutions Engineer</span>
              </li>
              <li className="flex items-center gap-3 text-xs">
                <span className="material-symbols-outlined text-[#e4deff] text-sm">check</span>
                <span>SOC2 Type II Compliance</span>
              </li>
              <li className="flex items-center gap-3 text-xs">
                <span className="material-symbols-outlined text-[#e4deff] text-sm">check</span>
                <span>SSO / SAML Integration</span>
              </li>
            </ul>
            <button className="w-full py-3 rounded-lg border border-[#6dfad2]/40 hover:bg-[#6dfad2]/5 text-[#6dfad2] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer">
              Contact Sales
            </button>
          </div>

        </div>

        {/* Technical FAQ Section */}
        <section className="mt-32 border-t border-white/5 pt-20">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-white font-headline-md mb-2">Technical FAQ</h2>
            <p className="text-xs text-[#c9c5d0]/70">Answers to common engineering inquiries.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 text-left">
            <div>
              <h4 className="text-[#e4deff] font-semibold text-sm mb-3">How do you measure vector dimensions for billing?</h4>
              <p className="text-xs text-[#c9c5d0]/70 leading-relaxed">
                We calculate billing based on the average total dimensions stored across all active indexes during the billing cycle. We do not charge for transient vectors used during computation steps.
              </p>
            </div>
            <div>
              <h4 className="text-[#e4deff] font-semibold text-sm mb-3">Can I migrate my data from Pinecone or Weaviate?</h4>
              <p className="text-xs text-[#c9c5d0]/70 leading-relaxed">
                Yes, our <code className="font-mono text-[11px] bg-[#122031] text-[#6dfad2] px-2 py-0.5 rounded">v-migrate</code> CLI tool supports seamless one-click ingestion from most major vector databases with zero downtime.
              </p>
            </div>
            <div>
              <h4 className="text-[#e4deff] font-semibold text-sm mb-3">What distance metrics do you support?</h4>
              <p className="text-xs text-[#c9c5d0]/70 leading-relaxed">
                Vector Vault supports Euclidean (L2), Cosine Similarity, and Dot Product metrics. Distance metrics are configured at the index level and cannot be changed after creation.
              </p>
            </div>
            <div>
              <h4 className="text-[#e4deff] font-semibold text-sm mb-3">Is there a cold-start latency for the Starter plan?</h4>
              <p className="text-xs text-[#c9c5d0]/70 leading-relaxed">
                The Starter plan uses shared infrastructure which may experience minor cold-start latency (~200ms) after periods of inactivity. Pro and Enterprise plans enjoy warm, dedicated instances.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
