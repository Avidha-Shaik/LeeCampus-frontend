import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { facultyLogin, facultyGetProfile } from "../api/facultyApi";

const FacultyLoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await facultyLogin(form);

      localStorage.clear();
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("facultyId", res.data.id);

      // Fetch profile to get department + section
      const profile = await facultyGetProfile(res.data.id);

      // 🔥 Never store "null" string — use empty string fallback
      localStorage.setItem("department", profile.data.department ?? "");
      localStorage.setItem("section", profile.data.section ?? "");
      localStorage.setItem("year",
        profile.data.year != null ? String(profile.data.year) : ""
      );

      navigate("/faculty");
    } catch {
      setError("Invalid faculty credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 fade-in">
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl p-10 border"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))",
                border: "1px solid rgba(99,102,241,0.25)",
              }}
            >
              🎓
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Faculty Portal</h1>
            <p className="text-white/30 text-sm mt-1">
              Sign in with your faculty credentials
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/30 font-semibold uppercase tracking-widest block mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="faculty@leecampus.com"
                className="input-glass w-full px-4 py-3 rounded-xl text-sm"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs text-white/30 font-semibold uppercase tracking-widest block mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-glass w-full px-4 py-3 rounded-xl text-sm"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm
                transition-all duration-200 disabled:opacity-50"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))",
                border: "1px solid rgba(99,102,241,0.25)",
                color: "#a78bfa",
              }}
            >
              {loading ? "Signing in..." : "Sign In as Faculty"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyLoginPage;