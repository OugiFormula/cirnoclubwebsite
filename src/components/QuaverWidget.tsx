import React from "react";
import type { QuaverModeStats } from "../services/quaverAPI";
import "../styles/Widgets.css";
import "../styles/QuaverGrades.css";

type QuaverModes = "4k" | "7k";

interface QuaverWidgetProps {
  stats: QuaverModeStats & {
    rankedScore?: number;
    totalScore?: number;
    grades?: Record<string, number>;
    countryRank?: number;
  };
  mode: QuaverModes;
  avatarUrl?: string;
  username?: string;
  country?: string;
  userId?: string;
}

const QuaverWidget: React.FC<QuaverWidgetProps> = ({
  stats,
  mode,
  avatarUrl,
  username,
  country,
  userId,
}) => {
  const profileUrl = `https://quavergame.com/user/${userId}`;

  return (
    <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="widget-link">
      <div className="widget widget-box">
        {/* Game Logo Centered */}
        <div className="section-title">
          <img src="/assets/icons/quaver.png" alt="Quaver" style={{ height: "75px" }} />
          <div>Quaver</div>
        </div>

        {/* Profile picture and username */}
        <div className="profile-row">
          <figure className="image is-64x64">
            <img
              src={avatarUrl || "/assets/placeholder.jpg"}
              alt={username}
              style={{ borderRadius: "50%" }}
            />
          </figure>
          <div>
            <div className="username">{username}</div>
            <div className="country">{country}</div>
          </div>
        </div>

        {/* Main stats row */}
        <div className="stats-row">
          <div><strong>Global Rank</strong><br />{stats.rank}</div>
          <div><strong>Country Rank</strong><br />{stats.countryRank ?? "-"}</div>
          <div><strong>Rating</strong><br />{Math.round(stats.pp)}</div>
          <div><strong>Accuracy</strong><br />{stats.accuracy.toFixed(2)}%</div>
          <div><strong>Mode</strong><br />{mode.toUpperCase()}</div>
        </div>

        {/* Scores row */}
        <div className="scores-row">
          <div><strong>Ranked Score</strong><br />{(stats.rankedScore ?? 0).toLocaleString()}</div>
          <div><strong>Total Score</strong><br />{(stats.totalScore ?? 0).toLocaleString()}</div>
        </div>

        {/* Grades row */}
        {stats.grades && (
          <div className="grades-row">
            {Object.entries(stats.grades).map(([grade, count]) => (
              <div key={grade} className="grade-item">
                <div className={`grade-circle grade-${grade.toLowerCase()}`}>{grade.toUpperCase()}</div>
                <span className="grade-count">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </a>
  );
};

export default QuaverWidget;
