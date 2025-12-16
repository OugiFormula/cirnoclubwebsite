export interface BeatLeaderProfile {
  id: string;
  name: string;
  country: string;
  profilePicture: string;
  pp: number;          // Performance points
  rank: number;        // Global rank
  countryRank: number; // Rank within country
  scoresSaberStats?: {
    rankedScore: number;
    totalScore: number;
    playCount: number;
    averageRankedAccuracy: number; // now in 0–100 range
    grades: {
      ssp: number;
      ss: number;
      sp: number;
      s: number;
      a: number;
    };
  };
  externalProfileUrl: string; // BeatLeader profile URL
  ProfileUrl: string;
}

export async function fetchBeatLeaderPlayer(username: string): Promise<BeatLeaderProfile | null> {
  try {
    const response = await fetch(`https://api.beatleader.xyz/player/${encodeURIComponent(username)}`);
    if (!response.ok) return null;

    const data = await response.json();

    const profile: BeatLeaderProfile = {
      id: data.id ?? "",
      name: data.name ?? "Unknown Player",
      country: data.country ?? "??",
      profilePicture: data.avatar ?? "/assets/placeholder.jpg",
      pp: data.pp ?? 0,
      rank: data.rank ?? 0,
      countryRank: data.countryRank ?? 0,
      externalProfileUrl: data.externalProfileUrl ?? `https://beatleader.xyz/u/${data.id}`,
      ProfileUrl: `https://beatleader.xyz/u/${data.id}`,
      scoresSaberStats: data.scoreStats
        ? {
            rankedScore: data.scoreStats.totalRankedScore ?? 0,
            totalScore: data.scoreStats.totalScore ?? 0,
            playCount: data.scoreStats.rankedPlayCount ?? 0,
            // ✅ Convert from 0–1 to 0–100 percentage
            averageRankedAccuracy: (data.scoreStats.averageRankedAccuracy ?? 0) * 100,
            grades: {
              ssp: data.scoreStats.sspPlays ?? 0,
              ss: data.scoreStats.ssPlays ?? 0,
              sp: data.scoreStats.spPlays ?? 0,
              s: data.scoreStats.sPlays ?? 0,
              a: data.scoreStats.aPlays ?? 0,
            },
          }
        : undefined,
    };

    return profile;
  } catch (err) {
    console.error("Error fetching BeatLeader player:", err);
    return null;
  }
}
