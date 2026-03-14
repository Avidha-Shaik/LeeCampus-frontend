import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (...paths) => paths.includes(location.pathname);

  return (
    <nav
      className="border-b px-8 py-4 flex justify-between items-center sticky top-0 z-50"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      {/* Logo */}
      <Link to="/" className="text-xl font-bold gradient-text tracking-tight">
        LeeCampus
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1">

        <Link
          to="/"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${isActive("/")
              ? "bg-white/10 text-white"
              : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
        >
          Home
        </Link>

        <Link
          to="/advanced"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${isActive("/advanced")
              ? "bg-white/10 text-white"
              : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
        >
          Advanced
        </Link>

        {/* Admin nav */}
        {role === "ADMIN" && (
          <>
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive("/admin", "/faculty/register")
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                  : "text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/10"
                }`}
            >
              Panel
            </Link>

            <Link
              to="/analytics"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive("/analytics")
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-500/10"
                }`}
            >
              Analytics
            </Link>
          </>
        )}

        {/* Faculty nav */}
        {role === "FACULTY" && (
          <>
            <Link
              to="/faculty"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive("/faculty")
                  ? "bg-violet-500/15 text-violet-400 border border-violet-500/30"
                  : "text-violet-400/60 hover:text-violet-400 hover:bg-violet-500/10"
                }`}
            >
              Dashboard
            </Link>

            <Link
              to="/analytics"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive("/analytics")
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-500/10"
                }`}
            >
              Analytics
            </Link>
          </>
        )}

        {/* User section */}
        {username ? (
          <>
            {role === "FACULTY" ? (
              <span
                className="px-3 py-1.5 rounded-lg text-sm font-medium ml-1"
                style={{
                  background: "rgba(167,139,250,0.08)",
                  border: "1px solid rgba(167,139,250,0.15)",
                  color: "#a78bfa",
                }}
              >
                {username}
              </span>
            ) : role === "ADMIN" ? (
              <span
                className="px-3 py-1.5 rounded-lg text-sm font-medium ml-1"
                style={{
                  background: "rgba(0,212,255,0.06)",
                  border: "1px solid rgba(0,212,255,0.12)",
                  color: "rgba(0,212,255,0.7)",
                }}
              >
                {username}
              </span>
            ) : (
              <button
                onClick={() => navigate("/profile")}
                className="px-4 py-2 rounded-lg text-sm font-medium text-cyan-400
                  hover:bg-white/5 transition-all duration-200 ml-1"
              >
                {username}
              </button>
            )}

            <button
              onClick={handleLogout}
              className="ml-1 px-4 py-2 rounded-lg text-sm font-medium
                border border-white/10 text-white/40
                hover:text-white hover:border-white/20
                transition-all duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="ml-2 px-4 py-2 rounded-lg text-sm font-medium btn-glow"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;