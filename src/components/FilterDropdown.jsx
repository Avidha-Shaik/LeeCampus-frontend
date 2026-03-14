import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const FilterDropdown = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const years = [1, 2, 3, 4];
  const courses = ["BTech", "MTech", "MBA"];
  const departments = ["CSE", "ECE", "EEE", "MECH"];
  const sections = Array.from({ length: 22 }, (_, i) => String.fromCharCode(65 + i));

  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");

  const selectClass = "select-glass w-full px-3 py-2.5 rounded-xl text-sm";

  const handleApply = () => {
    const base = location.pathname.includes("stats") ? "/stats" : "/advanced";
    let path = base;
    if (year) path += `/${year}`;
    if (course) path += `/${course}`;
    if (department) path += `/${department}`;
    if (section) path += `/${section}`;
    navigate(path);
  };

  const handleReset = () => {
    setYear(""); setCourse(""); setDepartment(""); setSection("");
    navigate("/advanced");
  };

  return (
    <div className="glass rounded-2xl p-6 border border-white/8 mb-6">
      <div className="grid md:grid-cols-5 gap-4 items-end">
        <div>
          <label className="text-xs text-white/30 uppercase tracking-wider mb-1.5 block">Year</label>
          <select value={year} onChange={(e) => setYear(e.target.value)} className={selectClass}>
            <option value="">All</option>
            {years.map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-white/30 uppercase tracking-wider mb-1.5 block">Course</label>
          <select value={course} onChange={(e) => setCourse(e.target.value)} className={selectClass}>
            <option value="">All</option>
            {courses.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-white/30 uppercase tracking-wider mb-1.5 block">Department</label>
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className={selectClass}>
            <option value="">All</option>
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-white/30 uppercase tracking-wider mb-1.5 block">Section</label>
          <select value={section} onChange={(e) => setSection(e.target.value)} className={selectClass}>
            <option value="">All</option>
            {sections.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={handleApply} className="flex-1 py-2.5 rounded-xl btn-glow font-semibold text-sm">Apply</button>
          <button onClick={handleReset} className="flex-1 py-2.5 rounded-xl glass glass-hover border border-white/10 text-white/50 text-sm font-semibold">Reset</button>
        </div>
      </div>
    </div>
  );
};

export default FilterDropdown;