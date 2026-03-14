import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  facultyGetStudents,
  facultyGetSummary,
} from "../api/facultyApi";

const getMedal = (rank) => {
  if (rank === 1) return { icon: "🥇", cls: "text-yellow-400" };
  if (rank === 2) return { icon: "🥈", cls: "text-slate-300" };
  if (rank === 3) return { icon: "🥉", cls: "text-orange-400" };
  return { icon: `#${rank}`, cls: "text-white/30" };
};

const SummaryCard = ({ icon, label, value, color = "#00d4ff" }) => (
  <div
    className="rounded-2xl p-5 border"
    style={{
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(12px)",
      borderColor: "rgba(255,255,255,0.07)",
    }}
  >
    <div className="flex items-center gap-2 mb-3">
      <span className="text-lg">{icon}</span>
      <span className="text-[10px] text-white/25 uppercase tracking-widest font-bold">
        {label}
      </span>
    </div>
    <div className="text-2xl font-bold" style={{ color }}>
      {value ?? "—"}
    </div>
  </div>
);

const GRID = "48px 1fr 120px 80px 70px 80px 70px 90px";

const FacultyPanel = () => {
  const navigate = useNavigate();

  const facultyName = localStorage.getItem("name");
  const department  = localStorage.getItem("department");

  // 🔥 Sanitize null strings from localStorage
  const rawSection = localStorage.getItem("section");
  const rawYear    = localStorage.getItem("year");
  const mySection  = rawSection && rawSection !== "null" && rawSection !== ""
    ? rawSection : null;
  const myYear     = rawYear && rawYear !== "null" && rawYear !== ""
    ? rawYear : null;

  const [view, setView]                   = useState(mySection ? "section" : "department");
  const [filterYear, setFilterYear]       = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [students, setStudents]           = useState([]);
  const [summary, setSummary]             = useState(null);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");

  useEffect(() => {
    const role  = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!token || role !== "FACULTY") {
      navigate("/faculty/login");
      return;
    }
    loadSummary();
  }, []);

  useEffect(() => {
    loadStudents();
  }, [view, filterYear, filterSection]);

  const loadSummary = async () => {
    try {
      const res = await facultyGetSummary(department);
      setSummary(res.data);
    } catch (err) {
      console.error("Summary error:", err);
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const sec  = view === "section" ? mySection : filterSection;
      const year = view === "section" ? myYear    : filterYear;
      const res  = await facultyGetStudents(department, sec, year);
      setStudents(res.data);
    } catch (err) {
      console.error("Students error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/faculty/login");
  };

  const filtered = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
    s.leetcodeUsername?.toLowerCase().includes(search.toLowerCase())
  );

  const sections = Array.from(
    { length: 22 }, (_, i) => String.fromCharCode(65 + i)
  );

  return (
    <div className="min-h-[calc(100vh-65px)] px-8 py-8 fade-in">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              Faculty Dashboard
            </h1>
            <div className="flex items-center gap-2 flex-wrap mt-2">
              <span className="text-white/30 text-sm">
                Welcome,{" "}
                <span className="text-violet-400 font-medium">
                  {facultyName}
                </span>
              </span>
              <span
                className="px-2 py-0.5 rounded-lg text-xs font-semibold"
                style={{
                  background: "rgba(99,102,241,0.12)",
                  color: "#a78bfa",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                {department}
              </span>
              {mySection && (
                <span
                  className="px-2 py-0.5 rounded-lg text-xs font-semibold"
                  style={{
                    background: "rgba(0,212,255,0.1)",
                    color: "#00d4ff",
                    border: "1px solid rgba(0,212,255,0.2)",
                  }}
                >
                  Class Incharge · Sec {mySection} · Y{myYear}
                </span>
              )}
            </div>
          </div>

          {/* ── Header Buttons ── */}
          <div className="flex gap-3 flex-wrap justify-end">
            <button
              onClick={() => navigate("/analytics")}
              className="px-4 py-2 rounded-xl text-sm font-semibold
                transition-all duration-200"
              style={{
                background: "rgba(52,211,153,0.08)",
                border: "1px solid rgba(52,211,153,0.2)",
                color: "#34d399",
              }}
            >
              📊 Analytics
            </button>

            <button
              onClick={() => navigate("/advanced")}
              className="px-4 py-2 rounded-xl text-sm font-semibold
                border border-white/10 text-white/40
                hover:border-white/20 hover:text-white/70
                transition-all duration-200"
            >
              Advanced View ↗
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-sm font-semibold
                border border-white/10 text-white/40
                hover:border-white/20 hover:text-white/70
                transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <SummaryCard icon="👥" label="Dept Students"
              value={summary.totalStudents} />
            <SummaryCard icon="✅" label="Total Solved"
              value={summary.totalSolved} color="#a78bfa" />
            <SummaryCard icon="📈" label="Avg Solved"
              value={summary.avgSolved} color="#34d399" />
            <SummaryCard icon="🔥" label="Hard Solved"
              value={summary.totalHard} color="#f87171" />
          </div>
        )}

        {/* ── View Toggle ── */}
        <div className="flex items-center gap-2 mb-5">
          {mySection && (
            <button
              onClick={() => {
                setView("section");
                setFilterYear("");
                setFilterSection("");
                setSearch("");
              }}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              style={
                view === "section"
                  ? {
                      background: "rgba(99,102,241,0.12)",
                      border: "1px solid rgba(99,102,241,0.25)",
                      color: "#a78bfa",
                    }
                  : {
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.4)",
                    }
              }
            >
              📋 My Section (Sec {mySection} · Y{myYear})
            </button>
          )}

          <button
            onClick={() => {
              setView("department");
              setFilterYear("");
              setFilterSection("");
              setSearch("");
            }}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
            style={
              view === "department"
                ? {
                    background: "rgba(0,212,255,0.1)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    color: "#00d4ff",
                  }
                : {
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.4)",
                  }
            }
          >
            🏫 Full Department
          </button>
        </div>

        {/* ── Dept Filters ── */}
        {view === "department" && (
          <div
            className="rounded-2xl p-5 border mb-6 flex flex-wrap gap-4 items-end"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <div>
              <label className="text-xs text-white/30 uppercase tracking-wider mb-1.5 block">
                Year
              </label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="select-glass px-4 py-2.5 rounded-xl text-sm"
              >
                <option value="">All Years</option>
                {[1, 2, 3, 4].map((y) => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-white/30 uppercase tracking-wider mb-1.5 block">
                Section
              </label>
              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="select-glass px-4 py-2.5 rounded-xl text-sm"
              >
                <option value="">All Sections</option>
                {sections.map((s) => (
                  <option key={s} value={s}>Sec {s}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setFilterYear("");
                setFilterSection("");
              }}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold
                border border-white/10 text-white/40
                hover:border-white/20 hover:text-white/60
                transition-all duration-200"
            >
              Clear
            </button>
          </div>
        )}

        {/* ── Student Table ── */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(16px)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          {/* Toolbar */}
          <div
            className="px-6 py-4 border-b flex items-center justify-between gap-4"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div>
              <h2 className="text-sm font-semibold text-white/60">
                {view === "section"
                  ? `My Section — Sec ${mySection} · Year ${myYear}`
                  : `${department} Department${filterSection ? ` · Sec ${filterSection}` : ""}${filterYear ? ` · Year ${filterYear}` : ""}`}
              </h2>
              <p className="text-xs text-white/25 mt-0.5">
                {filtered.length} student{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>

            <input
              type="text"
              placeholder="Search name, roll no, username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-glass px-4 py-2 rounded-xl text-sm w-64"
            />
          </div>

          {/* ── Column Headers ── */}
          <div
            className="grid gap-4 px-6 py-3 text-[10px] font-bold
              uppercase tracking-widest text-white/20"
            style={{
              gridTemplateColumns: GRID,
              background: "rgba(255,255,255,0.025)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="text-center">Rank</div>
            <div>Student</div>
            <div>Roll No</div>
            <div className="text-center">Total</div>
            <div className="text-center">Easy</div>
            <div className="text-center">Medium</div>
            <div className="text-center">Hard</div>
            <div className="text-center">LC Rank</div>
          </div>

          {/* ── Rows ── */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-white/20 text-sm">
              No students found.
            </div>
          ) : (
            filtered.map((student, idx) => {
              const { icon, cls } = getMedal(student.rank ?? idx + 1);
              const hasStats = student.totalSolved > 0;

              return (
                <div
                  key={student.studentId}
                  className="grid gap-4 px-6 py-4 items-center border-b
                    transition-all duration-150 hover:bg-white/[0.025]"
                  style={{
                    gridTemplateColumns: GRID,
                    borderColor: "rgba(255,255,255,0.04)",
                  }}
                >
                  <div className={`text-sm font-bold text-center ${cls}`}>
                    {icon}
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate">
                      {student.name}
                    </div>
                    <div className="text-xs text-white/25 mt-0.5 truncate">
                      {student.course} · Sec {student.section} · Y{student.year}
                    </div>
                    
                    <a  href={`https://leetcode.com/${student.leetcodeUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-white/20 hover:text-violet-400 transition-colors"
                    >
                      @{student.leetcodeUsername}
                    </a>
                  </div>

                  <div className="text-xs text-white/40 font-mono truncate">
                    {student.rollNumber}
                  </div>

                  <div className="text-center">
                    <span className={`text-sm font-bold ${hasStats ? "text-white" : "text-white/20"}`}>
                      {hasStats ? student.totalSolved : "—"}
                    </span>
                  </div>

                  <div className="text-center">
                    <span className={`text-sm font-medium ${hasStats ? "text-green-400" : "text-white/20"}`}>
                      {hasStats ? student.easySolved : "—"}
                    </span>
                  </div>

                  <div className="text-center">
                    <span className={`text-sm font-medium ${hasStats ? "text-yellow-400" : "text-white/20"}`}>
                      {hasStats ? student.mediumSolved : "—"}
                    </span>
                  </div>

                  <div className="text-center">
                    <span className={`text-sm font-medium ${hasStats ? "text-red-400" : "text-white/20"}`}>
                      {hasStats ? student.hardSolved : "—"}
                    </span>
                  </div>

                  <div className="text-center">
                    <span className={`text-sm font-medium ${hasStats ? "text-cyan-400" : "text-white/20"}`}>
                      {student.leetcodeRank > 0
                        ? student.leetcodeRank.toLocaleString()
                        : "—"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default FacultyPanel;