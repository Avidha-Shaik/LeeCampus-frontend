import { useState } from "react";
import DashboardPage from "./DashboardPage";
import StatsPage from "./StatsPage";

const AdvancedPage = () => {
  const [view, setView] = useState("leaderboard");

  return (
    <div className="px-6 py-8 fade-in">

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setView("leaderboard")}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            view === "leaderboard"
              ? "btn-glow"
              : "glass glass-hover text-white/50 border border-white/8"
          }`}
        >
          🏆 Leaderboard
        </button>

        <button
          onClick={() => setView("stats")}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            view === "stats"
              ? "btn-glow"
              : "glass glass-hover text-white/50 border border-white/8"
          }`}
        >
          📊 Statistics
        </button>
      </div>

      {view === "leaderboard" ? <DashboardPage /> : <StatsPage />}
    </div>
  );
};

export default AdvancedPage;