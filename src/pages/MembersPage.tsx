import React, { useState } from "react";
import MemberCard from "../components/MemberCard";
import { useNavigate } from "react-router-dom";
import membersDataJson from "../data/members.json";
import type { MemberData } from "../data/types";

const membersData: MemberData[] = membersDataJson as MemberData[];

const titleOrder = ["Leader", "Admin", "Mod", "Member"]; // sorting hierarchy

const MembersPage: React.FC = () => {
  const navigate = useNavigate();

  const [gameFilter, setGameFilter] = useState<string | null>(null);
  const [titleFilter, setTitleFilter] = useState<string | null>(null);

  // Filter by game and title
  const filteredMembers = membersData.filter((m) => {
    const matchesGame =
      !gameFilter ||
      (gameFilter === "osu" && m.games.osu) ||
      (gameFilter === "quaver" && m.games.quaver) ||
      (gameFilter === "beatleader" && m.games.beatleader);

    const matchesTitle = !titleFilter || m.title?.toLowerCase().includes(titleFilter.toLowerCase());

    return matchesGame && matchesTitle;
  });

  // Sort by title hierarchy
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const aIndex = a.title
      ? titleOrder.findIndex((t) => a.title!.toLowerCase() === t.toLowerCase())
      : -1;
    const bIndex = b.title
      ? titleOrder.findIndex((t) => b.title!.toLowerCase() === t.toLowerCase())
      : -1;

    const aScore = aIndex >= 0 ? aIndex : titleOrder.length;
    const bScore = bIndex >= 0 ? bIndex : titleOrder.length;

    return aScore - bScore;
  });

  return (
    <section
      className="section"
      style={{
        paddingTop: "6rem", // creates space below navbar
        paddingBottom: "4rem", // creates space above footer
      }}
    >
      <div className="container">
        <h1 className="title has-text-centered mb-5">Members</h1>

        {/* Game Filters */}
        <div className="buttons has-addons is-centered mb-4">
          <button
            className={`button ${gameFilter === null ? "is-link" : ""}`}
            onClick={() => setGameFilter(null)}
          >
            All Games
          </button>

          {[
            { id: "osu", label: "osu!", icon: "/assets/icons/osu.png" },
            { id: "quaver", label: "Quaver", icon: "/assets/icons/quaver.png" },
            { id: "beatleader", label: "BeatLeader", icon: "/assets/icons/beatleader.png" },
          ].map((game) => (
            <button
              key={game.id}
              className={`button ${gameFilter === game.id ? "is-link" : ""}`}
              onClick={() => setGameFilter(game.id)}
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              <img src={game.icon} alt={game.label} style={{ width: "20px", height: "20px" }} />
              {game.label}
            </button>
          ))}
        </div>

        {/* Title Filters */}
        <div className="buttons has-addons is-centered mb-6">
          <button
            className={`button ${titleFilter === null ? "is-link" : ""}`}
            onClick={() => setTitleFilter(null)}
          >
            All Titles
          </button>
          {titleOrder.map((t) => (
            <button
              key={t}
              className={`button ${titleFilter === t ? "is-link" : ""}`}
              onClick={() => setTitleFilter(t)}
            >
              {t}s
            </button>
          ))}
        </div>

        {/* Member Grid */}
        <div className="columns is-multiline is-variable is-4">
          {sortedMembers.map((member) => (
            <div className="column is-one-quarter-desktop is-half-tablet" key={member.id}>
              <MemberCard
                member={member}
                onClick={() => navigate(`/members/${member.id}`)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembersPage;
