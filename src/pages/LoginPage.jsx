import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:8081/leecampus/login", form);
      localStorage.setItem("studentId", res.data.id);
      localStorage.setItem("name", res.data.name);
      navigate("/");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 fade-in">

      <div className="glass rounded-2xl p-10 w-full max-w-md border border-white/8">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold gradient-text">LeeCampus</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              placeholder="you@university.edu"
              className="input-glass w-full px-4 py-3 rounded-xl text-sm"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input-glass w-full px-4 py-3 rounded-xl text-sm"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm btn-glow disabled:opacity-50 mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-white/30 mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-cyan-400 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;