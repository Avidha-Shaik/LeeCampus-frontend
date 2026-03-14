import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const StatCard = ({ title, value, color = "text-white" }) => (
  <div className="glass rounded-xl p-6 border border-white/8 text-center glass-hover">
    <div className="text-xs text-white/30 uppercase tracking-widest mb-2">{title}</div>
    <div className={`text-3xl font-bold ${color}`}>{value ?? "—"}</div>
  </div>
);

const StatsPage = () => {
  const { year, course, department, section } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    let url = "https://leecampus-backend.onrender.com/leecampus/stats";
    if (year) url += `/${year}`;
    if (course) url += `/${course}`;
    if (department) url += `/${department}`;
    if (section) url += `/${section}`;

    axios.get(url)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [year, course, department, section]);

  if (!data) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="px-6 pb-16 fade-in">

      <h2 className="text-2xl font-bold gradient-text mb-6">Statistics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Students" value={data.totalStudents} color="text-white" />
        <StatCard title="Total Solved" value={data.totalSolved} color="gradient-text" />
        <StatCard title="Easy Solved" value={data.totalEasy} color="text-green-400" />
        <StatCard title="Medium Solved" value={data.totalMedium} color="text-yellow-400" />
        <StatCard title="Hard Solved" value={data.totalHard} color="text-red-400" />
      </div>

      {/* Top 5 */}
      <div className="glass rounded-2xl border border-white/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h3 className="text-base font-semibold">🔥 Top 5 Students</h3>
        </div>

        {data.topFive?.map((student, index) => (
          <div
            key={index}
            className="flex justify-between items-center px-6 py-4 border-b border-white/5 glass-hover"
          >
            <div>
              <div className="font-semibold text-sm">
                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                {" "}{student.name}
              </div>
              <div className="text-xs text-white/30 mt-0.5">
                {student.course} • {student.department} • Year {student.year}
              </div>
            </div>
            <div className="text-cyan-400 font-bold">{student.totalSolved}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsPage;