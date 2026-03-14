import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminRegisterFaculty } from "../api/adminApi";

const DEPARTMENTS = ["CSE", "ECE", "EEE", "MECH"];
const SECTIONS = Array.from({ length: 22 }, (_, i) =>
  String.fromCharCode(65 + i)
);

const FacultyRegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    section: "",
    year: "",
  });

  const [isClassIncharge, setIsClassIncharge] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔥 Guard — only admin can access this page
  const role = localStorage.getItem("role");
  if (role !== "ADMIN") {
    navigate("/admin/login");
    return null;
  }

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password || !form.department) {
      setError("Name, email, password and department are required.");
      return;
    }

    if (isClassIncharge && (!form.section || !form.year)) {
      setError("Section and year are required for class incharge.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        section: isClassIncharge ? form.section : null,
        year: isClassIncharge ? parseInt(form.year) : null,
      };

      await adminRegisterFaculty(payload);
      setSuccess(`Faculty "${form.name}" registered successfully!`);

      // Reset form
      setForm({
        name: "", email: "", password: "",
        department: "", section: "", year: "",
      });
      setIsClassIncharge(false);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-12 fade-in">
      <div className="w-full max-w-lg">

        {/* Card */}
        <div
          className="rounded-2xl p-10 border"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Register Faculty
              </h1>
              <p className="text-white/30 text-sm mt-1">
                Create a new faculty account
              </p>
            </div>

            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 rounded-xl text-sm font-semibold
                border border-white/10 text-white/40
                hover:border-white/20 hover:text-white/70
                transition-all duration-200"
            >
              ← Back
            </button>
          </div>

          <div className="space-y-4">

            {/* Name */}
            <div>
              <label className="text-xs text-white/30 font-semibold uppercase tracking-widest block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Dr. John Smith"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-glass w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-white/30 font-semibold uppercase tracking-widest block mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="faculty@leecampus.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-glass w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-white/30 font-semibold uppercase tracking-widest block mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="input-glass w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>

            {/* Department */}
            <div>
              <label className="text-xs text-white/30 font-semibold uppercase tracking-widest block mb-1.5">
                Department
              </label>
              <select
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                className="select-glass w-full px-4 py-3 rounded-xl text-sm"
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Class Incharge Toggle */}
            <div
              className="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200"
              style={{
                background: isClassIncharge
                  ? "rgba(0,212,255,0.06)"
                  : "rgba(255,255,255,0.02)",
                borderColor: isClassIncharge
                  ? "rgba(0,212,255,0.2)"
                  : "rgba(255,255,255,0.07)",
              }}
              onClick={() => setIsClassIncharge(!isClassIncharge)}
            >
              <div>
                <p className="text-sm font-semibold text-white/70">
                  Class Incharge
                </p>
                <p className="text-xs text-white/30 mt-0.5">
                  Assign a section and year to this faculty
                </p>
              </div>

              {/* Toggle switch */}
              <div
                className="w-10 h-5 rounded-full transition-all duration-200 relative flex-shrink-0"
                style={{
                  background: isClassIncharge
                    ? "rgba(0,212,255,0.4)"
                    : "rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
                  style={{
                    background: isClassIncharge ? "#00d4ff" : "#ffffff40",
                    left: isClassIncharge ? "22px" : "2px",
                  }}
                />
              </div>
            </div>

            {/* Section + Year (only if class incharge) */}
            {isClassIncharge && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/30 font-semibold uppercase tracking-widest block mb-1.5">
                    Section
                  </label>
                  <select
                    value={form.section}
                    onChange={(e) =>
                      setForm({ ...form, section: e.target.value })
                    }
                    className="select-glass w-full px-4 py-3 rounded-xl text-sm"
                  >
                    <option value="">Select</option>
                    {SECTIONS.map((s) => (
                      <option key={s} value={s}>Sec {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/30 font-semibold uppercase tracking-widest block mb-1.5">
                    Year
                  </label>
                  <select
                    value={form.year}
                    onChange={(e) =>
                      setForm({ ...form, year: e.target.value })
                    }
                    className="select-glass w-full px-4 py-3 rounded-xl text-sm"
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4].map((y) => (
                      <option key={y} value={y}>Year {y}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Error / Success */}
            {error && (
              <div
                className="px-4 py-3 rounded-xl text-sm text-center"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#f87171",
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className="px-4 py-3 rounded-xl text-sm text-center"
                style={{
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  color: "#4ade80",
                }}
              >
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm
                transition-all duration-200 disabled:opacity-50 mt-2"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,212,255,0.12), rgba(99,102,241,0.12))",
                border: "1px solid rgba(0,212,255,0.25)",
                color: "#00d4ff",
              }}
            >
              {loading ? "Registering..." : "Register Faculty"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyRegisterPage;