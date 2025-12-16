import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import membersDataJson from "../data/members.json";
import type { MemberData } from "../data/types";

import { fetchBeatLeaderPlayer } from "../services/beatleaderAPI";
import type { BeatLeaderProfile } from "../services/beatleaderAPI";
import { fetchQuaverPlayerById } from "../services/quaverAPI";
import type { QuaverProfile, QuaverModeStats } from "../services/quaverAPI";
import type { DiscordData } from "../services/discordAPI";
import { fetchDiscordUser, getDiscordAvatarUrl } from "../services/discordAPI";
import { getUser } from "../services/osuAPI";

import QuaverWidget from "../components/QuaverWidget";
import BeatLeaderWidget from "../components/BeatLeaderWidget";
import DiscordWidget from "../components/DiscordWidget";
import OsuWidget from "../components/OsuWidget";

type QuaverModes = "4k" | "7k";

const membersData: MemberData[] = membersDataJson as MemberData[];

const discordStatusColor: Record<string, string> = {
  offline: "gray",
  online: "green",
  idle: "yellow",
  dnd: "red",
};

const MemberPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [beatLeaderProfile, setBeatLeaderProfile] = useState<BeatLeaderProfile | null>(null);
  const [quaverProfile, setQuaverProfile] = useState<QuaverProfile | null>(null);
  const [discordData, setDiscordData] = useState<DiscordData | null>(null);
  const [avatar, setAvatar] = useState<string>("/assets/placeholder.jpg");
  const [discordStatus, setDiscordStatus] = useState<string>("offline");
  const [loading, setLoading] = useState(true);

  const member = membersData.find((m) => m.id === id);

  useEffect(() => {
    if (!member) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const promises: Promise<any>[] = [];

        // Discord first for avatar
        if (member.games.discord) {
          promises.push(
            fetchDiscordUser(member.games.discord).then((data) => {
              if (data) {
                setDiscordData(data);
                setDiscordStatus(data.discord_status || "offline");
                setAvatar(getDiscordAvatarUrl(data.discord_user));
              }
            })
          );
        }
        //osu now
        if (member.games.osu && member.games.osu.length > 0){
          const osuAccount = member.games.osu[0];
          promises.push(
            getUser(Number(osuAccount.id),"osu").then((osuProfile) =>{
              if (
                !member.games.discord &&
                osuProfile?.avatar_url
              ){
                setAvatar(osuProfile.avatar_url);
              }
              }).catch((err) => console.error("Failed to fetch osu profile:", err))
            );
          }
        // Quaver next
        if (member.games.quaver) {
          promises.push(
            fetchQuaverPlayerById(member.games.quaver).then((data) => {
              setQuaverProfile(data);
              if (!member.games.discord && data?.avatarUrl) setAvatar(data.avatarUrl);
            })
          );
        }

        // BeatLeader last
        if (member.games.beatleader) {
          promises.push(
            fetchBeatLeaderPlayer(member.games.beatleader).then((data) => {
              setBeatLeaderProfile(data);
              if (!member.games.discord && !member.games.quaver && data?.profilePicture) {
                setAvatar(data.profilePicture);
              }
            })
          );
        }

        await Promise.all(promises);
      } catch (err) {
        console.error("Error fetching member data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [member]);

  if (loading) return <p className="has-text-centered">Loading...</p>;
  if (!member) return <p className="has-text-centered">Member not found</p>;
  if (!beatLeaderProfile && !quaverProfile && !discordData && !member.games.osu)
    return <p className="has-text-centered">No data found for {member.username}</p>;

  return (
    <div className="container">
      <div className="section">
        {/* Profile + Discord */}
        <div className="columns is-centered">
          <div className="column is-half has-text-centered">
            <figure
              className="image is-128x128 is-inline-block"
              style={{
                borderRadius: "50%",
                padding: "2px",
                border: `3px solid ${discordStatusColor[discordStatus] || "gray"}`,
              }}
            >
              <img src={avatar} alt={member.username} style={{ borderRadius: "50%" }} />
            </figure>

            <h1 className="title mt-3">{member.username}</h1>
            <p className="subtitle">
              {beatLeaderProfile?.country || quaverProfile?.country || member.countryFlag}
            </p>

            {discordData && <DiscordWidget data={discordData} />}
          </div>
        </div>

        {/* Stats Widgets */}
        <div className="columns is-multiline mt-5">
          {/* BeatLeader */}
          {beatLeaderProfile && (
            <div className="column is-full-mobile is-half-desktop">
              <BeatLeaderWidget profile={beatLeaderProfile} />
            </div>
          )}

          {/* Quaver */}
          {quaverProfile &&
            (["4k", "7k"] as QuaverModes[]).map((mode) => {
              const stats: QuaverModeStats | undefined = quaverProfile.modes[mode];
              if (!stats || stats.pp === 0) return null;
              return (
                <div key={mode} className="column is-full-mobile is-half-desktop">
                  <QuaverWidget
                    stats={stats}
                    mode={mode}
                    avatarUrl={quaverProfile.avatarUrl}
                    username={member.username}
                    country={quaverProfile.country}
                    userId={member.games.quaver!}
                  />
                </div>
              );
            })}

          {/* Osu! Widgets */}
          {member.games.osu?.map((osuEntry) =>
            (["standard", "taiko", "mania", "catch"] as const).map((modeKey) => {
              if (!osuEntry[modeKey]) return null;
              const mode = modeKey === "standard" ? "osu" : modeKey;
              return (
                <div key={`${osuEntry.id}-${mode}`} className="column is-full-mobile is-half-desktop">
                  <OsuWidget userId={osuEntry.id} mode={mode} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberPage;
