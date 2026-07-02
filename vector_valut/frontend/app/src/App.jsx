import NavBar from "./layout/NavBar"
import Footer from "./layout/Footer"
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login"
import { Route, Routes, useLocation } from "react-router-dom"

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/signin" || location.pathname === "/signup";

  return (
    <div className="flex flex-col min-h-screen bg-[#051424]">
      {/* Global Navigation Bar */}
      {!isAuthPage && <NavBar />}
      
      {/* Dynamic Content Views */}
      <main className={`flex-grow ${!isAuthPage ? 'pt-20' : ''}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<Login />} />
        </Routes>
      </main>

      {/* Global Footer */}
      {!isAuthPage && <Footer />}
    </div>
  )
}