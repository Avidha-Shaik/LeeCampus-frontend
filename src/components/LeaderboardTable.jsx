const LeaderboardTable = ({ leaderboard }) => {
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

  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/8">
      <div className="grid grid-cols-[60px_1fr_100px_70px_80px_70px_100px] gap-4 px-6 py-4 border-b border-white/8 text-xs font-semibold text-white/30 uppercase tracking-widest">
        <div>Rank</div>
        <div>Student</div>
        <div className="text-center">Total</div>
        <div className="text-center">Easy</div>
        <div className="text-center">Medium</div>
        <div className="text-center">Hard</div>
        <div className="text-center">LC Rank</div>
      </div>

      {leaderboard.map((student, index) => (
        <div
          key={index}
          className={`grid grid-cols-[60px_1fr_100px_70px_80px_70px_100px] gap-4 px-6 py-4 border-b border-white/5 glass-hover items-center ${getMedalClass(student.rank)}`}
        >
          <div className="font-bold text-base">{getMedal(student.rank)}</div>
          <div>
            <div className="font-semibold text-sm">{student.name}</div>
            <div className="text-xs text-white/30">{student.department}</div>
          </div>
          <div className="text-center font-bold">{student.totalSolved}</div>
          <div className="text-center text-green-400">{student.easySolved}</div>
          <div className="text-center text-yellow-400">{student.mediumSolved}</div>
          <div className="text-center text-red-400">{student.hardSolved}</div>
          <div className="text-center text-cyan-400 text-sm">{student.leetcodeRank?.toLocaleString()}</div>
        </div>
      ))}

      {leaderboard.length === 0 && (
        <div className="py-16 text-center text-white/20 text-sm">No students found.</div>
      )}
    </div>
  );
};

export default LeaderboardTable;