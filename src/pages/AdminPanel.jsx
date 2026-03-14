import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminGetStudents,
  adminDeleteStudent,
  adminRefreshStats,
  adminRefreshAll,
  adminGetStats,
} from "../api/adminApi";

const StatCard = ({ icon, label, value, color = "#00d4ff" }) => (
  <div
    className="rounded-2xl p-6 border"
    style={{
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(12px)",
      borderColor: "rgba(255,255,255,0.07)",
    }}
  >
    <div className="flex items-center gap-3 mb-3">
      <span className="text-xl">{icon}</span>
      <span className="text-xs text-white/30 uppercase tracking-widest font-semibold">
        {label}
      </span>
    </div>
    <div className="text-3xl font-bold" style={{ color }}>
      {value ?? "—"}
    </div>
  </div>
);

const AdminPanel = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshingId, setRefreshingId] = useState(null);
  const [refreshingAll, setRefreshingAll] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const adminName = localStorage.getItem("name");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [studRes, statRes] = await Promise.all([
        adminGetStudents(),
        adminGetStats(),
      ]);
      setStudents(studRes.data);
      setStats(statRes.data);
    } catch (err) {
      if (err.response?.status === 403) navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!token || role !== "ADMIN") {
      navigate("/admin/login");
      return;
    }
    loadData();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      await adminDeleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      showToast(`✓ ${name} deleted`);
    } catch {
      showToast("✗ Delete failed");
    }
  };

  const handleRefresh = async (id, name) => {
    setRefreshingId(id);
    try {
      await adminRefreshStats(id);
      showToast(`✓ Stats refreshed for ${name}`);
    } catch {
      showToast("✗ Refresh failed");
    } finally {
      setRefreshingId(null);
    }
  };

  const handleRefreshAll = async () => {
    setRefreshingAll(true);
    try {
      await adminRefreshAll();
      showToast("✓ All stats refreshed");
    } catch {
      showToast("✗ Refresh all failed");
    } finally {
      setRefreshingAll(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
      s.leetcodeUsername?.toLowerCase().includes(search.toLowerCase()) ||
      s.department?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-65px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/30 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-65px)] px-8 py-8 fade-in">

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-lg"
          style={{
            background: toast.startsWith("✓")
              ? "rgba(34,197,94,0.15)"
              : "rgba(239,68,68,0.15)",
            border: toast.startsWith("✓")
              ? "1px solid rgba(34,197,94,0.3)"
              : "1px solid rgba(239,68,68,0.3)",
            color: toast.startsWith("✓") ? "#4ade80" : "#f87171",
            backdropFilter: "blur(12px)",
          }}
        >
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Admin Panel</h1>
            <p className="text-white/30 text-sm mt-1">
              Welcome back,{" "}
              <span className="text-cyan-400 font-medium">{adminName}</span>
            </p>
          </div>

          {/* ── Action buttons — single clean row ── */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/faculty/register")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80"
              style={{
                background: "rgba(167,139,250,0.08)",
                border: "1px solid rgba(167,139,250,0.2)",
                color: "#a78bfa",
              }}
            >
              + Add Faculty
            </button>

            <button
              onClick={() => navigate("/analytics")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80"
              style={{
                background: "rgba(52,211,153,0.08)",
                border: "1px solid rgba(52,211,153,0.2)",
                color: "#34d399",
              }}
            >
              📊 Analytics
            </button>

            <button
              onClick={handleRefreshAll}
              disabled={refreshingAll}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 hover:opacity-80"
              style={{
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.2)",
                color: "#00d4ff",
              }}
            >
              {refreshingAll ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin inline-block" />
                  Refreshing...
                </span>
              ) : (
                "↻ Refresh All"
              )}
            </button>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard icon="👥" label="Total Students" value={stats?.totalStudents} />
          <StatCard
            icon="🏫"
            label="Departments"
            value={[...new Set(students.map((s) => s.department))].length}
            color="#a78bfa"
          />
          <StatCard
            icon="📚"
            label="Courses"
            value={[...new Set(students.map((s) => s.course))].length}
            color="#34d399"
          />
          <StatCard
            icon="📋"
            label="Showing"
            value={filtered.length}
            color="#f59e0b"
          />
        </div>

        {/* ── Students Table ── */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(16px)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="px-6 py-4 border-b flex items-center justify-between gap-4"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <h2 className="text-sm font-semibold text-white/60">All Students</h2>
            <input
              type="text"
              placeholder="Search by name, roll no, username, dept..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-glass px-4 py-2 rounded-xl text-sm w-72"
            />
          </div>

          {/* Table header */}
          <div
            className="grid gap-4 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white/20"
            style={{
              gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 100px",
              background: "rgba(255,255,255,0.02)",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <div>Student</div>
            <div>Roll No</div>
            <div>Dept</div>
            <div>Course</div>
            <div>Year</div>
            <div>Section</div>
            <div className="text-center">Actions</div>
          </div>

          {/* Rows */}
          <div>
            {filtered.map((student) => (
              <div
                key={student.id}
                className="grid gap-4 px-6 py-4 items-center border-b transition-all duration-150 hover:bg-white/[0.02]"
                style={{
                  gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 100px",
                  borderColor: "rgba(255,255,255,0.04)",
                }}
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">
                    {student.name}
                  </div>
                  <div className="text-xs text-white/25 truncate mt-0.5">
                    {student.email}
                  </div>
                  
                   <a href={`https://leetcode.com/${student.leetcodeUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/20 hover:text-cyan-400 transition-colors"
                  >
                    @{student.leetcodeUsername}
                  </a>
                </div>

                <div className="text-sm text-white/50 font-mono">
                  {student.rollNumber}
                </div>
                <div className="text-sm text-white/40">{student.department}</div>
                <div className="text-sm text-white/40">{student.course}</div>
                <div className="text-sm text-white/40">Y{student.year}</div>
                <div className="text-sm text-white/40">Sec {student.section}</div>

                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleRefresh(student.id, student.name)}
                    disabled={refreshingId === student.id}
                    title="Refresh stats"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-150 disabled:opacity-30"
                    style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {refreshingId === student.id ? (
                      <span className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin inline-block" />
                    ) : "↻"}
                  </button>

                  <button
                    onClick={() => handleDelete(student.id, student.name)}
                    title="Delete student"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150"
                    style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-20 text-center text-white/20 text-sm">
                No students found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;