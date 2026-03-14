import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { adminGetAnalytics } from "../api/adminApi";

// ── Custom Tooltip for Bar Chart ──
const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-4 py-3 rounded-xl text-sm"
      style={{
        background: "rgba(8,8,14,0.97)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <p className="font-bold text-white mb-2 text-xs uppercase tracking-widest">
        {label}
      </p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mt-1">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: p.color }}
          />
          <span className="text-white/50 text-xs">{p.name}:</span>
          <span className="font-semibold text-xs" style={{ color: p.color }}>
            {p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── Custom Tooltip for Pie Chart ──
const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div
      className="px-4 py-3 rounded-xl text-sm"
      style={{
        background: "rgba(8,8,14,0.97)",
        border: `1px solid ${item.payload.color}40`,
        backdropFilter: "blur(16px)",
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${item.payload.color}15`,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: item.payload.color }}
        />
        <p style={{ color: item.payload.color }} className="font-bold text-xs uppercase tracking-widest">
          {item.name}
        </p>
      </div>
      <p className="text-white font-bold text-lg">
        {item.value.toLocaleString()}
        <span className="text-white/30 text-xs font-normal ml-1">solved</span>
      </p>
    </div>
  );
};

// ── Stat Card ──
const StatCard = ({ icon, label, value, color = "#00d4ff" }) => (
  <div
    className="rounded-2xl p-5 border transition-all duration-200 hover:scale-[1.02]"
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
      {value?.toLocaleString() ?? "—"}
    </div>
  </div>
);

// ── Chart Card wrapper ──
const ChartCard = ({ title, subtitle, children }) => (
  <div
    className="rounded-2xl border p-6"
    style={{
      background: "rgba(255,255,255,0.02)",
      backdropFilter: "blur(16px)",
      borderColor: "rgba(255,255,255,0.06)",
    }}
  >
    <div className="mb-6">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      {subtitle && (
        <p className="text-xs text-white/30 mt-0.5">{subtitle}</p>
      )}
    </div>
    {children}
  </div>
);

const YEAR_COLORS = ["#00d4ff", "#6366f1", "#a78bfa", "#f472b6"];

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [activeDept, setActiveDept] = useState(null);
  const [deptView, setDeptView]     = useState("total");

  const role = localStorage.getItem("role");

  // ── Resolve faculty scope ──
  const facultyDept = localStorage.getItem("department");
  const rawFacSec   = localStorage.getItem("section");
  const rawFacYear  = localStorage.getItem("year");
  const facultySection = rawFacSec  && rawFacSec  !== "null" && rawFacSec  !== "" ? rawFacSec  : null;
  const facultyYear    = rawFacYear && rawFacYear !== "null" && rawFacYear !== "" ? rawFacYear : null;

  // ── Human-readable scope label shown in header ──
  const scopeLabel = role === "FACULTY"
    ? facultySection
      ? `${facultyDept} · Sec ${facultySection} · Year ${facultyYear}`
      : facultyDept ?? "Your Department"
    : "All Departments";

  const scopeColor = role === "FACULTY" ? "#a78bfa" : "#00d4ff";

  useEffect(() => {
    if (role !== "ADMIN" && role !== "FACULTY") {
      navigate("/");
      return;
    }

    const params = {};
    if (role === "FACULTY") {
      if (facultyDept)    params.department = facultyDept;
      if (facultySection) params.section    = facultySection;
      if (facultyYear)    params.year       = facultyYear;
    }

    adminGetAnalytics(params)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-[calc(100vh-65px)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-white/30 text-sm">Loading analytics...</p>
      </div>
    </div>
  );

  if (!data) return null;

  const depts        = Object.keys(data.topFivePerDept);
  const selectedDept = activeDept || depts[0];

  return (
    <div className="min-h-[calc(100vh-65px)] px-8 py-8 fade-in">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Analytics</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <p className="text-white/30 text-sm">LeetCode performance for</p>
              {/* 🔥 Scope badge — shows exactly what data is being viewed */}
              <span
                className="px-2.5 py-0.5 rounded-lg text-xs font-semibold"
                style={{
                  background: `${scopeColor}12`,
                  border: `1px solid ${scopeColor}30`,
                  color: scopeColor,
                }}
              >
                {scopeLabel}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate(role === "ADMIN" ? "/admin" : "/faculty")}
            className="px-4 py-2 rounded-xl text-sm font-semibold
              border border-white/10 text-white/40
              hover:border-white/20 hover:text-white/70
              transition-all duration-200"
          >
            ← Back
          </button>
        </div>

        {/* ── Overview Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard icon="👥" label="Total Students"
            value={data.totalStudents} color="#ffffff" />
          <StatCard icon="✅" label="Total Solved"
            value={data.totalSolved} color="#00d4ff" />
          <StatCard icon="🟢" label="Easy Solved"
            value={data.totalEasy} color="#4ade80" />
          <StatCard icon="🟡" label="Medium Solved"
            value={data.totalMedium} color="#facc15" />
          <StatCard icon="🔴" label="Hard Solved"
            value={data.totalHard} color="#f87171" />
        </div>

        {/* ── Row 1: Dept Bar + Donut ── */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">

          {/* Dept Bar Chart */}
          <div className="md:col-span-2">
            <ChartCard
              title="Department Performance"
              subtitle="Problems solved by department"
            >
              <div className="flex gap-2 mb-5">
                {[
                  { key: "total",     label: "Total" },
                  { key: "avg",       label: "Avg / Student" },
                  { key: "breakdown", label: "Breakdown" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setDeptView(key)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                    style={
                      deptView === key
                        ? {
                            background: "rgba(0,212,255,0.12)",
                            border: "1px solid rgba(0,212,255,0.25)",
                            color: "#00d4ff",
                          }
                        : {
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.35)",
                          }
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={data.deptChart}
                  margin={{ top: 4, right: 10, left: -10, bottom: 0 }}
                  barCategoryGap="35%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="dept"
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<CustomBarTooltip />}
                    cursor={{ fill: "rgba(255,255,255,0.03)", radius: 4 }}
                  />
                  {deptView === "total" && (
                    <Bar dataKey="totalSolved" name="Total Solved"
                      fill="#00d4ff" fillOpacity={0.75} radius={[5, 5, 0, 0]}
                      activeBar={{ fill: "#00d4ff", fillOpacity: 1,
                        filter: "drop-shadow(0 0 10px rgba(0,212,255,0.7))" }}
                    />
                  )}
                  {deptView === "avg" && (
                    <Bar dataKey="avgSolved" name="Avg Solved"
                      fill="#a78bfa" fillOpacity={0.75} radius={[5, 5, 0, 0]}
                      activeBar={{ fill: "#a78bfa", fillOpacity: 1,
                        filter: "drop-shadow(0 0 10px rgba(167,139,250,0.7))" }}
                    />
                  )}
                  {deptView === "breakdown" && (
                    <>
                      <Bar dataKey="easy" name="Easy"
                        fill="#4ade80" fillOpacity={0.8}
                        radius={[0, 0, 0, 0]} stackId="a"
                        activeBar={{ fill: "#4ade80", fillOpacity: 1 }} />
                      <Bar dataKey="medium" name="Medium"
                        fill="#facc15" fillOpacity={0.8} stackId="a"
                        activeBar={{ fill: "#facc15", fillOpacity: 1 }} />
                      <Bar dataKey="hard" name="Hard"
                        fill="#f87171" fillOpacity={0.8}
                        radius={[5, 5, 0, 0]} stackId="a"
                        activeBar={{ fill: "#f87171", fillOpacity: 1 }} />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Difficulty Donut */}
          <ChartCard
            title="Difficulty Breakdown"
            subtitle="Easy / Medium / Hard split"
          >
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data.difficultyChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.difficultyChart.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                      fillOpacity={0.85}
                      stroke="transparent"
                      style={{ cursor: "pointer", outline: "none" }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  formatter={(value) => (
                    <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-3 gap-2 text-center mt-1">
              {data.difficultyChart.map((d) => (
                <div
                  key={d.name}
                  className="rounded-xl py-2 px-1"
                  style={{
                    background: `${d.color}0d`,
                    border: `1px solid ${d.color}25`,
                  }}
                >
                  <div className="text-base font-bold" style={{ color: d.color }}>
                    {d.value.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-white/25 uppercase tracking-wider mt-0.5">
                    {d.name}
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* ── Row 2: Year Bar Chart ── */}
        <div className="mb-6">
          <ChartCard
            title="Year-wise Performance"
            subtitle="Total solved and average per student by year"
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={data.yearChart}
                margin={{ top: 4, right: 10, left: -10, bottom: 0 }}
                barCategoryGap="40%"
                barGap={4}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.03)", radius: 4 }}
                />
                <Bar
                  dataKey="totalSolved"
                  name="Total Solved"
                  radius={[5, 5, 0, 0]}
                  fillOpacity={0.8}
                >
                  {data.yearChart.map((_, index) => (
                    <Cell
                      key={index}
                      fill={YEAR_COLORS[index % 4]}
                      fillOpacity={0.75}
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="avgSolved"
                  name="Avg / Student"
                  fill="#34d399"
                  fillOpacity={0.6}
                  radius={[5, 5, 0, 0]}
                  activeBar={{
                    fill: "#34d399",
                    fillOpacity: 1,
                    filter: "drop-shadow(0 0 10px rgba(52,211,153,0.7))",
                  }}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="flex gap-3 mt-4 flex-wrap">
              {data.yearChart.map((y, i) => (
                <div key={y.year} className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: YEAR_COLORS[i % 4] }}
                  />
                  <span className="text-xs text-white/35">{y.year}</span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: YEAR_COLORS[i % 4] }}
                  >
                    {y.totalSolved.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-white/35">Avg / Student</span>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* ── Row 3: Top 5 Per Dept ── */}
        <ChartCard
          title="Top 5 Per Department"
          subtitle="Best performers in each department"
        >
          <div className="flex flex-wrap gap-2 mb-6">
            {depts.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                style={
                  selectedDept === dept
                    ? {
                        background: "rgba(99,102,241,0.15)",
                        border: "1px solid rgba(99,102,241,0.3)",
                        color: "#a78bfa",
                      }
                    : {
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.35)",
                      }
                }
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Column headers */}
          <div
            className="grid gap-4 px-4 py-2.5 mb-1 text-[10px] font-bold
              uppercase tracking-widest text-white/20 rounded-lg"
            style={{
              gridTemplateColumns: "36px 1fr 90px 70px 80px 70px",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <div className="text-center">#</div>
            <div>Student</div>
            <div className="text-center">Total</div>
            <div className="text-center">Easy</div>
            <div className="text-center">Medium</div>
            <div className="text-center">Hard</div>
          </div>

          {/* Rows */}
          <div className="space-y-1 mt-1">
            {(data.topFivePerDept[selectedDept] || []).map((student, idx) => {
              const medals       = ["🥇", "🥈", "🥉"];
              const rowColors    = ["rgba(255,200,0,0.04)", "rgba(180,180,180,0.04)", "rgba(180,100,40,0.04)"];
              const borderColors = ["rgba(255,200,0,0.15)", "rgba(180,180,180,0.15)", "rgba(180,100,40,0.15)"];

              return (
                <div
                  key={idx}
                  className="grid gap-4 px-4 py-3 rounded-xl items-center transition-all duration-150"
                  style={{
                    gridTemplateColumns: "36px 1fr 90px 70px 80px 70px",
                    background: idx < 3 ? rowColors[idx] : "transparent",
                    border: idx < 3
                      ? `1px solid ${borderColors[idx]}`
                      : "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (idx >= 3)
                      e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                  }}
                  onMouseLeave={(e) => {
                    if (idx >= 3)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div className="text-base font-bold text-center">
                    {medals[idx] ?? (
                      <span className="text-white/25 text-sm font-semibold">
                        #{idx + 1}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-white">
                      {student.name}
                    </div>
                    
                  <a    href={`https://leetcode.com/${student.leetcodeUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-white/20 hover:text-cyan-400 transition-colors"
                    >
                      @{student.leetcodeUsername}
                    </a>
                  </div>

                  <div className="text-center font-bold text-white">
                    {student.totalSolved}
                  </div>
                  <div className="text-center text-green-400 text-sm font-medium">
                    {student.easySolved}
                  </div>
                  <div className="text-center text-yellow-400 text-sm font-medium">
                    {student.mediumSolved}
                  </div>
                  <div className="text-center text-red-400 text-sm font-medium">
                    {student.hardSolved}
                  </div>
                </div>
              );
            })}

            {(data.topFivePerDept[selectedDept] || []).length === 0 && (
              <div className="py-12 text-center text-white/20 text-sm">
                No data for {selectedDept}
              </div>
            )}
          </div>
        </ChartCard>

      </div>
    </div>
  );
};

export default AnalyticsPage;