import React, { useEffect, useState } from "react";
import type { OsuUser } from "../services/osuAPI";
import { getUser } from "../services/osuAPI";
import "../styles/Widgets.css";
import "../styles/OsuGrades.css";

interface OsuWidgetProps {
  userId: string;
  mode: "osu" | "taiko" | "catch" | "mania";
}

const OsuWidget: React.FC<OsuWidgetProps> = ({ userId, mode }) => {
  const [user, setUser] = useState<OsuUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const profileUrl = `https://osu.ppy.sh/users/${userId}`;

  useEffect(() => {
    setLoading(true);
    setError(null);

    getUser(Number(userId), mode)
      .then((data) => setUser(data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : String(err))
      )
      .finally(() => setLoading(false));
  }, [userId, mode]);

  if (loading) return <div>Loading osu!...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!user) return <div>No data</div>;

  return (
    <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="widget-link">
      <div className="widget widget-box">
        <div className="section-title">
          <img src="/assets/icons/osu.png" alt="osu!" style={{ height: "75px" }} />
          <div>osu!{mode !== "osu" ? `${mode}` : ""}</div>
        </div>

        <div className="profile-row">
          <figure className="image is-64x64">
            <img
              src={user.avatar_url || "/assets/placeholder.jpg"}
              alt={user.username}
              style={{ borderRadius: "50%" }}
            />
          </figure>
          <div>
            <div className="username">{user.username}</div>
            <div className="country">{user.country_code}</div>
          </div>
        </div>

        <div className="stats-row">
          <div>
            <strong>Global Rank</strong><br />
            {user.rank?.global?.toLocaleString() ?? "-"}
          </div>
          <div>
            <strong>Country Rank</strong><br />
            {user.rank?.country?.toLocaleString() ?? "-"}
          </div>
          <div>
            <strong>PP</strong><br />
            {user.pp?.toFixed(2) ?? "-"}
          </div>
          <div>
            <strong>Accuracy</strong><br />
            {user.hit_accuracy?.toFixed(2) ?? "-"}%
          </div>
        </div>

        <div className="scores-row">
          <div>
            <strong>Ranked Score</strong><br />
            {user.rankedScore?.toLocaleString() ?? "-"}
          </div>
          <div>
            <strong>Total Score</strong><br />
            {user.totalScore?.toLocaleString() ?? "-"}
          </div>
        </div>

        {user.grade_counts && (
          <div className="grades-row">
            {Object.entries(user.grade_counts).map(([grade, count]) => (
              <div key={grade} className="grade-item">
                <div className={`grade-circle grade-${grade.toLowerCase()}`}>
                  {grade.toUpperCase()}
                </div>
                <span className="grade-count">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </a>
  );
};

export default OsuWidget;
