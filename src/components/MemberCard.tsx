import React, { useEffect, useState } from "react";
import type { MemberData } from "../data/types";
import { fetchBeatLeaderPlayer } from "../services/beatleaderAPI";
import { fetchQuaverPlayerById } from "../services/quaverAPI";
import { fetchDiscordUser, getDiscordAvatarUrl } from "../services/discordAPI";
import { getUser } from "../services/osuAPI";

export interface MemberCardProps {
  member: MemberData;
  onClick: () => void;
}

const titleColors: Record<string, string> = {
  Leader: "is-danger",
  Admin: "is-warning",
  Mod: "is-primary",
  Member: "is-success",
};

const glowColors: Record<string, string> = {
  Leader: "rgba(255, 50, 50, 0.5)",
  Admin: "rgba(255, 200, 50, 0.4)",
  Mod: "rgba(50, 115, 255, 0.4)",
  Member: "rgba(50, 200, 100, 0.4)",
};

// Map Discord status to outline color
const discordStatusColor: Record<string, string> = {
  offline: "gray",
  online: "green",
  idle: "yellow",
  dnd: "red",
};

const MemberCard: React.FC<MemberCardProps> = ({ member, onClick }) => {
  const { username, profilePicture, countryFlag, title, games } = member;

  const [avatar, setAvatar] = useState<string>(profilePicture || "/assets/placeholder.jpg");
  const [statusColor, setStatusColor] = useState<string>("gray");

  // Fetch from APIs on mount
  useEffect(() => {
    const loadProfilePicture = async () => {
      try {
        // First, Discord
        if (games.discord) {
          const discordData = await fetchDiscordUser(games.discord);
          if (discordData) {
            setAvatar(getDiscordAvatarUrl(discordData.discord_user));
            setStatusColor(discordStatusColor[discordData.discord_status] || "gray");
            return;
          }
        }
        
      if (games.osu && games.osu.length > 0) {
        // pick the first osu account
        const osuAccount = games.osu[0];
        const osuProfile = await getUser(Number(osuAccount.id), "osu"); // fetch standard mode
        if (osuProfile?.avatar_url) {
          setAvatar(osuProfile.avatar_url);
          return;
        }
      }
        // Then Quaver
        if (games.quaver) {
          const quaverData = await fetchQuaverPlayerById(games.quaver);
          if (quaverData?.avatarUrl) {
            setAvatar(quaverData.avatarUrl);
            return;
          }
        }

        // Then BeatLeader
        if (games.beatleader) {
          const beatLeaderData = await fetchBeatLeaderPlayer(games.beatleader);
          if (beatLeaderData?.profilePicture) {
            setAvatar(beatLeaderData.profilePicture);
            return;
          }
        }

        // Default placeholder
        setStatusColor("gray");
      } catch (err) {
        console.error("Error loading profile picture:", err);
        setStatusColor("gray");
      }
    };

    loadProfilePicture();
  }, [games]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.style.transform = "translateY(-5px)";
    target.style.boxShadow = `0 8px 30px ${
      title ? glowColors[title] || "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.2)"
    }`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.style.transform = "translateY(0)";
    target.style.boxShadow = "0 2px 10px rgba(255, 255, 255, 0.1)";
  };

  return (
    <div
      className="card"
      style={{
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        overflow: "visible",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(255, 255, 255, 0.1)",
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Profile Image */}
      <div
        className="card-image"
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "1rem",
        }}
      >
        <figure
          className="image is-128x128"
          style={{
            borderRadius: "50%",
            padding: "2px",
            border: `3px solid ${statusColor}`, // Outline based on Discord status
          }}
        >
          <img
            src={avatar}
            alt={username}
            style={{ borderRadius: "50%" }}
          />
        </figure>
      </div>

      {/* Content */}
      <div className="card-content has-text-centered">
        <p className="title is-5">{username}</p>

        {title && (
          <span
            className={`tag ${titleColors[title] || "is-light"}`}
            style={{ marginBottom: "0.5rem", display: "inline-block" }}
          >
            {title}
          </span>
        )}

        <p>{countryFlag}</p>

        {/* Platforms */}
        <div
          className="icons"
          style={{
            marginTop: "0.5rem",
            display: "flex",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          {games.osu && (
            <img
              src="/assets/icons/osu.png"
              alt="osu"
              style={{ width: "24px", transition: "transform 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          )}
          {games.quaver && (
            <img
              src="/assets/icons/quaver.png"
              alt="quaver"
              style={{ width: "24px", transition: "transform 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          )}
          {games.beatleader && (
            <img
              src="/assets/icons/beatleader.png"
              alt="beatleader"
              style={{ width: "24px", transition: "transform 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
