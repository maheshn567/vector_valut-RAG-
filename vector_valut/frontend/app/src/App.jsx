import NavBar from "./layout/NavBar"
import Footer from "./layout/Footer"
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login"
import TenantDashboard from "./pages/Tenant-DashboardPage"
import TenantAppPage from "./pages/TenantAppPage"
import CorporaPage from "./pages/CorporaPage"
import DocumentsPage from "./pages/DocumentPage"
import ConversationPage from "./pages/ConversationPage"
import VoiceAssisantPage from "./pages/VoiceAssisantPage"
import SettingsPage from "./pages/SettingsPage"
import PricingPage from "./pages/Pricing_page"
import { Route, Routes, useLocation } from "react-router-dom"

export default function App() {
  const location = useLocation();
  const hideGlobalLayout = 
    location.pathname === "/signin" || 
    location.pathname === "/signup" || 
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/apps") ||
    location.pathname.startsWith("/corpora") ||
    location.pathname.startsWith("/documents") ||
    location.pathname.startsWith("/conversations") ||
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/voice-assistant");

  return (
    <div className="flex flex-col min-h-screen bg-[#051424]">
      {/* Global Navigation Bar */}
      {!hideGlobalLayout && <NavBar />}
      
      {/* Dynamic Content Views */}
      <main className={`flex-grow ${!hideGlobalLayout ? 'pt-20' : ''}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/dashboard" element={<TenantDashboard />} />
          <Route path="/apps" element={<TenantAppPage />} />
          <Route path="/corpora" element={<CorporaPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/conversations" element={<ConversationPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/voice-assistant" element={<VoiceAssisantPage />} />
        </Routes>
      </main>

      {/* Global Footer */}
      {!hideGlobalLayout && <Footer />}
    </div>
  )
}