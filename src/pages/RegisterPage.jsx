import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const FIELDS = [
  { key: "name", label: "Full Name", placeholder: "John Doe", type: "text" },
  { key: "email", label: "Email", placeholder: "you@university.edu", type: "email" },
  { key: "password", label: "Password", placeholder: "••••••••", type: "password" },
  { key: "rollNumber", label: "Roll Number", placeholder: "21BCE1234", type: "text" },
  { key: "leetcodeUsername", label: "LeetCode Username", placeholder: "johndoe_lc", type: "text" },
];

const SELECT_FIELDS = [
  { key: "year", label: "Year", options: ["1", "2", "3", "4"] },
  { key: "course", label: "Course", options: ["BTech", "MTech", "MBA"] },
  { key: "department", label: "Department", options: ["CSE", "ECE", "EEE", "MECH"] },
  {
    key: "section", label: "Section",
    options: Array.from({ length: 22 }, (_, i) => String.fromCharCode(65 + i)),
  },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", rollNumber: "",
    leetcodeUsername: "", year: "", department: "", course: "", section: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const register = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:8081/leecampus/register", form);
      navigate("/login");
    } catch {
      setError("Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-12 fade-in">

      <div className="glass rounded-2xl p-10 w-full max-w-lg border border-white/8">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold gradient-text">Create Account</h1>
          <p className="text-white/40 text-sm mt-1">Join LeeCampus today</p>
        </div>

        <div className="space-y-4">

          {FIELDS.map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="input-glass w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            {SELECT_FIELDS.map(({ key, label, options }) => (
              <div key={key}>
                <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
                  {label}
                </label>
                <select
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="select-glass w-full px-4 py-3 rounded-xl text-sm"
                >
                  <option value="">Select {label}</option>
                  {options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            onClick={register}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm btn-glow disabled:opacity-50 mt-2"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-white/30 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 hover:underline">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;