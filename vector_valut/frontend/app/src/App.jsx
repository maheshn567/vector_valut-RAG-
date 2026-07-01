import NavBar from "./layout/NavBar"
import Footer from "./layout/Footer"
import LandingPage from "./pages/LandingPage"
import { Route, Routes } from "react-router-dom"

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#051424]">
      {/* Global Navigation Bar */}
      <NavBar />
      
      {/* Dynamic Content Views */}
      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  )
}