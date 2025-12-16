import React from "react";
import type { BeatLeaderProfile } from "../services/beatleaderAPI";
import "../styles/Widgets.css";
import "../styles/BeatLeaderGrades.css";

interface BeatLeaderWidgetProps {
  profile: BeatLeaderProfile;
}

const BeatLeaderWidget: React.FC<BeatLeaderWidgetProps> = ({ profile }) => {
  const { scoresSaberStats } = profile;
  const profileUrl = profile.ProfileUrl;
  return (
    <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="widget-link">
    <div className="widget widget-box">
      {/* Game Logo */}
      <div className="section-title">
        <img src="/assets/icons/beatleader.png" alt="BeatLeader" style={{ height: "75px" }} />
        <div>BeatLeader</div>
      </div>

      {/* Profile picture and username */}
      <div className="profile-row">
        <figure className="image is-64x64">
          <img
            src={profile.profilePicture || "/assets/placeholder.jpg"}
            alt={profile.name}
            style={{ borderRadius: "50%" }}
          />
        </figure>
        <div>
          <div className="username">{profile.name}</div>
          <div className="country">{profile.country}</div>
        </div>
      </div>

      {/* Main stats row */}
      <div className="stats-row">
        <div><strong>Global Rank</strong><br />{profile.rank}</div>
        <div><strong>Country Rank</strong><br />{profile.countryRank}</div>
        <div><strong>PP</strong><br />{Math.round(profile.pp)}</div>
        <div><strong>Accuracy</strong><br />{scoresSaberStats?.averageRankedAccuracy.toFixed(2)}%</div>
      </div>

      {/* Scores row */}
      {scoresSaberStats && (
        <div className="scores-row">
          <div><strong>Ranked Score</strong><br />{scoresSaberStats ? scoresSaberStats.rankedScore.toLocaleString(): "N/A"}</div>
          <div><strong>Total Score</strong><br />{scoresSaberStats ? scoresSaberStats.totalScore.toLocaleString(): "N/A"}</div>
          <div><strong>Play Count</strong><br />{scoresSaberStats.playCount}</div>
        </div>
      )}

      {/* Grades row */}
      {scoresSaberStats && (
        <div className="grades-row">
          {Object.entries(scoresSaberStats.grades).map(([grade, count]) => (
            <div key={grade} className="grade-item">
              <div className={`grade-circle grade-${grade.toLowerCase()}`}>{grade.toUpperCase()}</div>
              <span className="grade-count">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div></a>
  );
};

export default BeatLeaderWidget;
