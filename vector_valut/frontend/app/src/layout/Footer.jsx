import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-[#051424] border-t border-white/5 py-16 px-8 mt-auto font-['Inter']">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Brand Section */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <Link to="/" className="text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity font-['Hanken_Grotesk']">
            Vector <span className="text-[#6C5CE7]">Vault</span>
          </Link>
          <p className="text-sm text-[#d4e4fa]/60 max-w-xs leading-relaxed">
            The definitive platform for secure, high-performance RAG infrastructure and vector orchestration.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-3 mt-2">
            <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#6C5CE7]/20 hover:border-[#6C5CE7]/50 transition-all duration-200 cursor-pointer">
              <span className="text-white/60 text-xs font-semibold">𝕏</span>
            </span>
            <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#6C5CE7]/20 hover:border-[#6C5CE7]/50 transition-all duration-200 cursor-pointer">
              <span className="text-white/60 text-xs font-semibold">Git</span>
            </span>
            <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#6C5CE7]/20 hover:border-[#6C5CE7]/50 transition-all duration-200 cursor-pointer">
              <span className="text-white/60 text-xs font-semibold">Dc</span>
            </span>
          </div>
        </div>

        {/* Links Grid */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
          
          {/* Column 1: Product */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6C5CE7] font-['JetBrains_Mono']">
              Product
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link to="/pipeline" className="text-[#d4e4fa]/70 hover:text-white transition-colors">
                  Pipeline
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-[#d4e4fa]/70 hover:text-white transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link to="/changelog" className="text-[#d4e4fa]/70 hover:text-white transition-colors">
                  Changelog
                </Link>
              </li>
              <li>
                <Link to="/status" className="text-[#d4e4fa]/70 hover:text-white transition-colors">
                  Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Developers */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6C5CE7] font-['JetBrains_Mono']">
              Developers
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link to="/docs" className="text-[#d4e4fa]/70 hover:text-white transition-colors">
                  Docs
                </Link>
              </li>
              <li>
                <Link to="/github" className="text-[#d4e4fa]/70 hover:text-white transition-colors">
                  GitHub
                </Link>
              </li>
              <li>
                <Link to="/discord" className="text-[#d4e4fa]/70 hover:text-white transition-colors">
                  Discord
                </Link>
              </li>
              <li>
                <Link to="/apikeys" className="text-[#d4e4fa]/70 hover:text-white transition-colors">
                  API Keys
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6C5CE7] font-['JetBrains_Mono']">
              Company
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link to="/about" className="text-[#d4e4fa]/70 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-[#d4e4fa]/70 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-[#d4e4fa]/70 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-[#d4e4fa]/70 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#d4e4fa]/40">
        <p>&copy; {new Date().getFullYear()} Vector Vault. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link to="/security" className="hover:text-white transition-colors">
            Security Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}