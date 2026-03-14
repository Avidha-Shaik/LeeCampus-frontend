import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SimpleDashboard from "./pages/SimpleDashboard";
import AdvancedPage from "./pages/AdvancedPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPanel from "./pages/AdminPanel";
import FacultyLoginPage from "./pages/FacultyLoginPage";
import FacultyPanel from "./pages/FacultyPanel";
import FacultyRegisterPage from "./pages/FacultyRegisterPage";
import AnalyticsPage from "./pages/AnalyticsPage";

// Add inside <Routes>:

function App() {
  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "radial-gradient(ellipse at top, #0f0f1a 0%, #0a0a0f 100%)",
      }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, #00d4ff, transparent)",
            top: "-100px", left: "-100px",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, #6366f1, transparent)",
            bottom: "-100px", right: "-100px",
          }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Routes>
          {/* Student */}
          <Route path="/" element={<SimpleDashboard />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/advanced" element={<AdvancedPage />} />
          <Route path="/advanced/:year" element={<AdvancedPage />} />
          <Route path="/advanced/:year/:course" element={<AdvancedPage />} />
          <Route path="/advanced/:year/:course/:department" element={<AdvancedPage />} />
          <Route path="/advanced/:year/:course/:department/:section" element={<AdvancedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminPanel />} />

          {/* Faculty */}
          <Route path="/faculty/login" element={<FacultyLoginPage />} />
          <Route path="/faculty" element={<FacultyPanel />} />
          <Route path="/faculty/register" element={<FacultyRegisterPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;