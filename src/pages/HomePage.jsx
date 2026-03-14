import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center px-6 fade-in">

      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-extrabold gradient-text mb-4 tracking-tight">
          LeeCampus
        </h1>
        <p className="text-white/40 text-lg max-w-md mx-auto">
          Track your LeetCode progress. Compete with your campus. Rise through the ranks.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl mb-12">
        <button
          onClick={() => navigate("/")}
          className="glass glass-hover rounded-2xl p-8 text-left border border-white/8 group"
        >
          <div className="text-2xl mb-3">🏆</div>
          <h2 className="text-lg font-semibold mb-1">Leaderboard</h2>
          <p className="text-white/40 text-sm">
            View university-wide rankings and filter by year, department, or course.
          </p>
        </button>

        <button
          onClick={() => navigate("/advanced")}
          className="glass glass-hover rounded-2xl p-8 text-left border border-white/8 group"
        >
          <div className="text-2xl mb-3">📊</div>
          <h2 className="text-lg font-semibold mb-1">Advanced View</h2>
          <p className="text-white/40 text-sm">
            Deep-dive analytics, stats breakdowns, and advanced filtering options.
          </p>
        </button>
      </div>

      {/* CTA */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3 rounded-xl font-semibold text-sm btn-glow"
        >
          Sign In
        </button>
        <button
          onClick={() => navigate("/register")}
          className="px-8 py-3 rounded-xl font-semibold text-sm glass glass-hover border border-white/10 text-white/70"
        >
          Register
        </button>
      </div>

    </div>
  );
};

export default HomePage;