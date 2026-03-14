import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StatCard = ({ label, value, color = "text-white" }) => (
  <div className="glass rounded-xl p-6 border border-white/8 text-center glass-hover">
    <div className="text-xs text-white/30 uppercase tracking-widest mb-2">{label}</div>
    <div className={`text-3xl font-bold ${color}`}>{value ?? "—"}</div>
  </div>
);

const ProfilePage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const studentId = localStorage.getItem("studentId");
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  useEffect(() => {
    // 🔥 Admin and faculty have no profile page — redirect them
    if (role === "ADMIN") {
      navigate("/admin");
      return;
    }
    if (role === "FACULTY") {
      navigate("/faculty");
      return;
    }

    // 🔥 No studentId means not logged in
    if (!studentId || studentId === "null") {
      navigate("/login");
      return;
    }

    axios
      .get(`https://leecampus-backend.onrender.com/leecampus/leetcode-stats/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 403 || err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          setError("Failed to load profile.");
        }
      });
  }, []);

  if (!data && !error) return (
    <div className="flex justify-center items-center h-[calc(100vh-65px)]">
      <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-[calc(100vh-65px)]">
      <p className="text-white/30 text-sm">{error}</p>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-65px)] px-6 py-12 fade-in">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="glass rounded-2xl p-8 mb-8 border border-white/8 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center text-2xl font-bold">
            {name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-white/40 text-sm mt-0.5">LeetCode Profile</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <StatCard label="Total Solved" value={data.totalSolved} color="gradient-text" />
          <StatCard label="LeetCode Rank" value={data.leetcodeRank?.toLocaleString()} color="text-cyan-400" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Easy" value={data.easySolved} color="text-green-400" />
          <StatCard label="Medium" value={data.mediumSolved} color="text-yellow-400" />
          <StatCard label="Hard" value={data.hardSolved} color="text-red-400" />
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;