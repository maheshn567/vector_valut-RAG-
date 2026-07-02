import NavBar from "./layout/NavBar"
import Footer from "./layout/Footer"
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login"
import TenantDashboard from "./pages/Tenant-DashboardPage"
import { Route, Routes, useLocation } from "react-router-dom"

export default function App() {
  const location = useLocation();
  const hideGlobalLayout = 
    location.pathname === "/signin" || 
    location.pathname === "/signup" || 
    location.pathname.startsWith("/dashboard");

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
        </Routes>
      </main>

      {/* Global Footer */}
      {!hideGlobalLayout && <Footer />}
    </div>
  )
}