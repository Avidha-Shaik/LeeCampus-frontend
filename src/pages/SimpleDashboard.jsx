import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { searchStudents, getMyRank } from "../api/dashboardApi";

const SimpleDashboard = () => {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [filterType, setFilterType] = useState("overall");
  const [filterValue, setFilterValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [jumpLoading, setJumpLoading] = useState(false);
  const [pulseMe, setPulseMe] = useState(false);

  const myRowRef = useRef(null);
  const mainRef = useRef(null);

  const loggedId = Number(localStorage.getItem("studentId"));
  const isStudent = !!loggedId;

  // ── Data fetching ───────────────────────────────────────────────
  useEffect(() => {
    setData(null);

    if (activeSearch.trim()) {
      searchStudents(activeSearch.trim(), page)
        .then((res) => setData(res.data))
        .catch((err) => console.error(err));
      return;
    }

    let url = "https://leecampus-backend.onrender.com/leecampus/dashboard";
    if (filterType === "year" && filterValue)            url += `/year/${filterValue}`;
    else if (filterType === "department" && filterValue) url += `/department/${filterValue}`;
    else if (filterType === "course" && filterValue)     url += `/course/${filterValue}`;
    else                                                 url += "/overall";

    axios
      .get(`${url}?page=${page}&size=10`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [filterType, filterValue, page, activeSearch]);

  // ── Scroll to my row once data loads after a jump ───────────────
  useEffect(() => {
    if (!pulseMe) return;
    if (!myRowRef.current) return;

    const t = setTimeout(() => {
      myRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => setPulseMe(false), 1400);
    }, 120);
    return () => clearTimeout(t);
  }, [data, pulseMe]);

  // ── Jump to my rank ─────────────────────────────────────────────
  const handleJumpToMyRank = useCallback(async () => {
    if (!loggedId) return;
    setJumpLoading(true);
    try {
      const res = await getMyRank(loggedId, filterType, String(filterValue));
      const { rank, page: targetPage } = res.data;

      if (rank === -1) {
        alert("You are not ranked in this filter. Try switching to Overall.");
        return;
      }

      setPulseMe(true);

      if (targetPage === page) {
        setTimeout(() => {
          myRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => setPulseMe(false), 1400);
        }, 50);
      } else {
        setPage(targetPage);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setJumpLoading(false);
    }
  }, [loggedId, filterType, filterValue, page]);

  // ── Filter handlers ─────────────────────────────────────────────
  const handleSelect = (type, value) => {
    setFilterType(type);
    setFilterValue(value);
    setActiveSearch("");
    setSearchInput("");
    setPage(0);
    setPulseMe(false);
  };

  const handleClear = () => {
    setFilterType("overall");
    setFilterValue("");
    setActiveSearch("");
    setSearchInput("");
    setPage(0);
    setPulseMe(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setFilterType("overall");
    setFilterValue("");
    setPage(0);
    setPulseMe(false);
    setActiveSearch(searchInput.trim());
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setActiveSearch("");
    setPage(0);
    setPulseMe(false);
  };

  // ── Helpers ──────────────────────────────────────────────────────
  const SidebarButton = ({ label, type, value = "" }) => {
    const active =
      !activeSearch &&
      filterType === type &&
      String(filterValue) === String(value);
    return (
      <button
        onClick={() =>
          type === "overall" ? handleClear() : handleSelect(type, value)
        }
        className={`
          w-full text-left px-3 py-2 rounded-lg text-sm font-medium
          transition-all duration-200 border
          ${active
            ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(0,212,255,0.1)]"
            : "border-transparent text-white/40 hover:text-white/80 hover:bg-white/5"
          }
        `}
      >
        {label}
      </button>
    );
  };

  const getMedal = (rank) => {
    if (rank === 1) return { icon: "🥇", cls: "text-yellow-400" };
    if (rank === 2) return { icon: "🥈", cls: "text-slate-300" };
    if (rank === 3) return { icon: "🥉", cls: "text-orange-400" };
    return { icon: `#${rank}`, cls: "text-white/40" };
  };

  const getRowGlow = (rank) => {
    if (rank === 1) return "border-yellow-500/20 bg-yellow-500/5 hover:border-yellow-500/30";
    if (rank === 2) return "border-slate-400/20 bg-slate-400/5 hover:border-slate-400/30";
    if (rank === 3) return "border-orange-500/20 bg-orange-500/5 hover:border-orange-500/30";
    return "border-white/5 hover:border-white/10 hover:bg-white/[0.03]";
  };

  // ── Loading state ────────────────────────────────────────────────
  if (!data)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-65px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/30 text-sm">Loading leaderboard...</p>
        </div>
      </div>
    );

  return (
    <div className="flex h-[calc(100vh-65px)] fade-in overflow-hidden">

      {/* ── SIDEBAR ── */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="px-5 pt-6 pb-4 border-b border-white/5">
          <p className="text-xs font-semibold text-white/25 uppercase tracking-[0.15em]">
            Filter by
          </p>
        </div>

        <div className="flex-1 px-3 py-4 space-y-6">
          <div>
            <SidebarButton label="🌐  Overall" type="overall" value="" />
          </div>

          <div>
            <p className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.15em] px-3 mb-2">
              Year
            </p>
            <div className="space-y-0.5">
              {[1, 2, 3, 4].map((y) => (
                <SidebarButton key={y} label={`Year ${y}`} type="year" value={y} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.15em] px-3 mb-2">
              Department
            </p>
            <div className="space-y-0.5">
              {["CSE", "ECE", "EEE", "MECH"].map((d) => (
                <SidebarButton key={d} label={d} type="department" value={d} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.15em] px-3 mb-2">
              Course
            </p>
            <div className="space-y-0.5">
              {["BTech", "MTech", "MBA"].map((c) => (
                <SidebarButton key={c} label={c} type="course" value={c} />
              ))}
            </div>
          </div>
        </div>

        {(filterValue || activeSearch) && (
          <div className="px-4 py-4 border-t border-white/5">
            <button
              onClick={handleClear}
              className="w-full py-2 rounded-lg text-xs font-semibold text-white/40
                border border-white/10 hover:border-white/20 hover:text-white/70
                transition-all duration-200"
            >
              ✕ Clear filter
            </button>
          </div>
        )}
      </aside>

      {/* ── MAIN ── */}
      <main ref={mainRef} className="flex-1 overflow-y-auto px-8 py-8">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="gradient-text">Leaderboard</span>
            </h1>
            <p className="text-white/30 text-sm mt-1">
              {activeSearch
                ? <>Results for <span className="text-cyan-400 font-medium">"{activeSearch}"</span></>
                : filterType === "overall"
                  ? "Showing all campus rankings"
                  : <>Filtered by {filterType} · <span className="text-cyan-400 font-medium">{filterValue}</span></>
              }
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-sm pointer-events-none">
                🔍
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Name, roll no, @username..."
                className="input-glass pl-9 pr-8 py-2 rounded-xl text-sm w-64"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleSearchClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25
                    hover:text-white/60 transition-colors text-xs"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80"
              style={{
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.2)",
                color: "#00d4ff",
              }}
            >
              Search
            </button>
          </form>

          {/* Right side: Jump to rank + page pill */}
          <div className="flex items-center gap-3">
            {isStudent && !activeSearch && (
              <button
                onClick={handleJumpToMyRank}
                disabled={jumpLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  hover:opacity-80 active:scale-95"
                style={{
                  background: "rgba(0,212,255,0.08)",
                  border: "1px solid rgba(0,212,255,0.25)",
                  color: "#00d4ff",
                }}
              >
                {jumpLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    Finding...
                  </>
                ) : (
                  <>📍 My Rank</>
                )}
              </button>
            )}

            <div className="text-xs text-white/25 bg-white/5 border border-white/8 px-4 py-1.5 rounded-full">
              Page {data.currentPage + 1} / {data.totalPages}
            </div>
          </div>
        </div>

        {/* Table header */}
        <div
          className="grid items-center gap-4 px-5 py-3 mb-2 rounded-xl text-[10px]
            font-bold uppercase tracking-[0.12em] text-white/25"
          style={{
            gridTemplateColumns: "48px 1fr 90px 70px 80px 70px 100px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div>Rank</div>
          <div>Student</div>
          <div className="text-center">Total</div>
          <div className="text-center">Easy</div>
          <div className="text-center">Med</div>
          <div className="text-center">Hard</div>
          <div className="text-center">LC Rank</div>
        </div>

        {/* Rows */}
        <div className="space-y-1.5">
          {data.leaderboard.map((student, index) => {
            // !! ensures 0 becomes false so React doesn't render "0" in JSX
            const isMe = !!loggedId && loggedId === student.studentId;
            const { icon, cls } = getMedal(student.rank);
            const rowGlow = getRowGlow(student.rank);

            return (
              <div
                key={`${student.rank}-${student.studentId}`}
                ref={isMe ? myRowRef : null}
                className={`
                  grid items-center gap-4 px-5 py-3.5 rounded-xl border
                  transition-all duration-300 backdrop-blur-sm
                  ${rowGlow}
                  ${isMe
                    ? "!border-cyan-500/30 !bg-cyan-500/[0.08] shadow-[0_0_20px_rgba(0,212,255,0.08)]"
                    : ""
                  }
                  ${isMe && pulseMe ? "animate-pulse-once" : ""}
                `}
                style={{
                  gridTemplateColumns: "48px 1fr 90px 70px 80px 70px 100px",
                  animation: `rowSlideIn 0.3s ease forwards`,
                  animationDelay: `${index * 40}ms`,
                  opacity: 0,
                }}
              >
                <div className={`text-base font-bold text-center ${cls}`}>
                  {icon}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-white truncate">
                      {student.name}
                    </span>
                    {isMe && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full
                        bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 tracking-wider">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-white/30 mt-0.5 truncate">
                    {student.department} · {student.course} · Sec {student.section} · Y{student.year}
                  </div>
                  
                <a    href={`https://leetcode.com/${student.leetcodeUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-white/20 hover:text-cyan-400 transition-colors"
                  >
                    @{student.leetcodeUsername}
                  </a>
                </div>

                <div className="text-center">
                  <p className="font-bold text-sm text-white">{student.totalSolved}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-green-400">{student.easySolved}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-yellow-400">{student.mediumSolved}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-red-400">{student.hardSolved}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-cyan-400/80">
                    {student.leetcodeRank?.toLocaleString() ?? "—"}
                  </p>
                </div>
              </div>
            );
          })}

          {data.leaderboard.length === 0 && (
            <div className="py-24 text-center text-white/20 text-sm">
              {activeSearch
                ? `No results found for "${activeSearch}"`
                : "No students found for this filter."}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-10 flex justify-center items-center gap-3">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="px-5 py-2 rounded-xl text-sm font-medium border border-white/8
              text-white/40 hover:border-white/20 hover:text-white/80 hover:bg-white/5
              disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
          >
            ← Prev
          </button>

          <div className="flex gap-1.5">
            {Array.from({ length: data.totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200
                  ${i === page
                    ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-400"
                    : "border border-white/8 text-white/25 hover:border-white/20 hover:text-white/60"
                  }
                `}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={page >= data.totalPages - 1}
            onClick={() => setPage(page + 1)}
            className="px-5 py-2 rounded-xl text-sm font-medium border border-white/8
              text-white/40 hover:border-white/20 hover:text-white/80 hover:bg-white/5
              disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next →
          </button>
        </div>
      </main>
    </div>
  );
};

export default SimpleDashboard;