import { Link } from "react-router-dom";
import { useAuth } from "../Hooks/useAuthHook";

export default function NavBar() {
  const { tenant, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 bg-[#051424]/80 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20">
      <div className="flex items-center gap-10">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity font-['Hanken_Grotesk']">
          Vector <span className="text-[#6C5CE7]">Vault</span>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center gap-8 font-['Inter']">
          <li>
            <Link to="/features" className="text-sm font-medium text-[#d4e4fa]/75 hover:text-white transition-colors">
              Features
            </Link>
          </li>
          <li>
            <Link to="/pipeline" className="text-sm font-medium text-[#d4e4fa]/75 hover:text-white transition-colors">
              Pipeline
            </Link>
          </li>
          <li>
            <Link to="/pricing" className="text-sm font-medium text-[#d4e4fa]/75 hover:text-white transition-colors">
              Pricing
            </Link>
          </li>
          <li>
            <Link to="/docs" className="text-sm font-medium text-[#d4e4fa]/75 hover:text-white transition-colors">
              Docs
            </Link>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-5 font-['Inter']">
        {tenant ? (
          <>
            <Link to="/dashboard" className="text-sm font-medium text-[#d4e4fa]/75 hover:text-white transition-colors px-3 py-2">
              Dashboard
            </Link>
            <button 
              onClick={logout}
              className="text-sm font-semibold text-white bg-[#6C5CE7] hover:bg-[#5847d2] px-4 py-2 rounded-lg transition-all duration-200 border border-white/10 shadow-lg shadow-[#6C5CE7]/20 hover:shadow-[#6C5CE7]/30 transform hover:-translate-y-[1px] cursor-pointer"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/signin" className="text-sm font-medium text-[#d4e4fa]/75 hover:text-white transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link to="/signin" className="text-sm font-semibold text-white bg-[#6C5CE7] hover:bg-[#5847d2] px-4 py-2 rounded-lg transition-all duration-200 border border-white/10 shadow-lg shadow-[#6C5CE7]/20 hover:shadow-[#6C5CE7]/30 transform hover:-translate-y-[1px]">
              Get Started Free
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

