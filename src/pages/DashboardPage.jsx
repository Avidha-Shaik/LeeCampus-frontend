import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { year, course, department, section } = useParams();

  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const [selectedYear, setSelectedYear] = useState(year || "");
  const [selectedCourse, setSelectedCourse] = useState(course || "");
  const [selectedDepartment, setSelectedDepartment] = useState(department || "");
  const [selectedSection, setSelectedSection] = useState(section || "");

  useEffect(() => {
    let url = `http://localhost:8081/leecampus/dashboard`;
    if (year && course && department && section) {
      url += `/year/${year}/course/${course}/department/${department}/section/${section}`;
    } else if (year && course && department) {
      url += `/year/${year}/course/${course}/department/${department}/section/ALL`;
    } else if (year) url += `/year/${year}`;
    else if (course) url += `/course/${course}`;
    else if (department) url += `/department/${department}`;
    else url += `/overall`;

    axios.get(`${url}?page=${page}&size=10`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [year, course, department, section, page]);

  const handleApply = () => {
    let path = "/advanced";
    if (selectedYear && selectedCourse && selectedDepartment && selectedSection)
      path += `/year/${selectedYear}/course/${selectedCourse}/department/${selectedDepartment}/section/${selectedSection}`;
    else if (selectedYear && selectedCourse && selectedDepartment)
      path += `/year/${selectedYear}/course/${selectedCourse}/department/${selectedDepartment}`;
    else if (selectedYear) path += `/${selectedYear}`;
    setPage(0);
    navigate(path);
  };

  const loggedId = Number(localStorage.getItem("studentId"));

  const getMedal = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getMedalClass = (rank) => {
    if (rank === 1) return "rank-gold";
    if (rank === 2) return "rank-silver";
    if (rank === 3) return "rank-bronze";
    return "";
  };

  const selectClass = "select-glass w-full px-3 py-2.5 rounded-xl text-sm";

  if (!data) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="px-6 pb-16 fade-in">

      {/* Filters */}
      <div className="glass rounded-2xl p-6 mb-6 border border-white/8">
        <div className="grid md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="text-xs text-white/30 uppercase tracking-wider mb-1.5 block">Year</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className={selectClass}>
              <option value="">All Years</option>
              {[1,2,3,4].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-white/30 uppercase tracking-wider mb-1.5 block">Course</label>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className={selectClass}>
              <option value="">All Courses</option>
              {["BTech","MTech","MBA"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-white/30 uppercase tracking-wider mb-1.5 block">Department</label>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className={selectClass}>
              <option value="">All Depts</option>
              {["CSE","ECE","EEE","MECH"].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-white/30 uppercase tracking-wider mb-1.5 block">Section</label>
            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className={selectClass}>
              <option value="">All Sections</option>
              {Array.from({length:22},(_,i) => String.fromCharCode(65+i)).map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button onClick={handleApply} className="py-2.5 px-4 rounded-xl btn-glow font-semibold text-sm">
            Apply
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by username or roll number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-glass flex-1 px-4 py-3 rounded-xl text-sm"
        />
        <button
          onClick={() => {
            axios.get(`http://localhost:8081/leecampus/search?keyword=${search}`)
              .then(res => alert(`Rank: ${res.data.rank}`))
              .catch(() => alert("Student not found"));
          }}
          className="px-6 py-3 rounded-xl btn-glow font-semibold text-sm"
        >
          Search
        </button>
      </div>

      {/* Leaderboard */}
      <div className="glass rounded-2xl overflow-hidden border border-white/8">

        {/* Header row */}
        <div className="grid grid-cols-[60px_1fr_100px_70px_80px_70px_100px] gap-4 px-6 py-4 border-b border-white/8 text-xs font-semibold text-white/30 uppercase tracking-widest">
          <div>Rank</div>
          <div>Student</div>
          <div className="text-center">Total</div>
          <div className="text-center">Easy</div>
          <div className="text-center">Medium</div>
          <div className="text-center">Hard</div>
          <div className="text-center">LC Rank</div>
        </div>

        {data.leaderboard.map((student) => {
          const isMe = loggedId === student.studentId;
          return (
            <div
              key={student.rank}
              className={`grid grid-cols-[60px_1fr_100px_70px_80px_70px_100px] gap-4 px-6 py-4 border-b border-white/5 glass-hover items-center ${getMedalClass(student.rank)} ${isMe ? "border-l-2 border-l-cyan-500 bg-cyan-500/5" : ""}`}
            >
              <div className="font-bold text-base">{getMedal(student.rank)}</div>
              <div>
                <div className="font-semibold text-sm flex items-center gap-2">
                  {student.name}
                  {isMe && <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30">You</span>}
                </div>
                <div className="text-xs text-white/30 mt-0.5">
                  {student.course} • {student.department} • Sec {student.section} • Y{student.year}
                </div>
                <a href={`https://leetcode.com/${student.leetcodeUsername}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-white/25 hover:text-cyan-400 transition-colors">
                  @{student.leetcodeUsername}
                </a>
              </div>
              <div className="text-center font-bold">{student.totalSolved}</div>
              <div className="text-center text-green-400">{student.easySolved}</div>
              <div className="text-center text-yellow-400">{student.mediumSolved}</div>
              <div className="text-center text-red-400">{student.hardSolved}</div>
              <div className="text-center text-cyan-400 text-sm">{student.leetcodeRank?.toLocaleString()}</div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center items-center gap-4">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}
          className="px-5 py-2 rounded-lg glass glass-hover text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed">
          ← Prev
        </button>
        <span className="text-sm text-white/40">Page {data.currentPage + 1} of {data.totalPages}</span>
        <button disabled={page >= data.totalPages - 1} onClick={() => setPage(page + 1)}
          className="px-5 py-2 rounded-lg glass glass-hover text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed">
          Next →
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;