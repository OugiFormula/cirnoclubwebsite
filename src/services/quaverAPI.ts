export interface QuaverModeStats {
  pp: number;              // overall performance rating
  rank: number;            // global rank
  countryRank?: number;    // country rank
  playCount: number;       // play count
  accuracy: number;        // overall accuracy
  rankedScore?: number;    // ranked score
  totalScore?: number;     // total score
  grades?: Record<string, number>; // grade counts (x, ss, s, a, b, c, d)
}

export interface QuaverProfile {
  id: string;
  username: string;
  country: string;
  avatarUrl: string;
  modes: {
    "4k"?: QuaverModeStats;
    "7k"?: QuaverModeStats;
  };
}

// Fetch Quaver player by ID or username
export async function fetchQuaverPlayerById(quaverIdOrUsername: string): Promise<QuaverProfile | null> {
  try {
    const response = await fetch(`https://api.quavergame.com/v2/user/${encodeURIComponent(quaverIdOrUsername)}`);
    if (!response.ok) {
      console.error("Quaver API returned non-ok:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const user = data.user;
    if (!user) return null;

    const mapStats = (statsKey: any): QuaverModeStats => {
      if (!statsKey) return { pp: 0, rank: 0, playCount: 0, accuracy: 0 };
      return {
        pp: statsKey.overall_performance_rating ?? 0,
        rank: statsKey.ranks.global ?? 0,
        countryRank: statsKey.ranks.country ?? -1,
        playCount: statsKey.play_count ?? 0,
        accuracy: statsKey.overall_accuracy ?? 0,
        rankedScore: statsKey.ranked_score ?? 0,
        totalScore: statsKey.total_score ?? 0,
        grades: {
          x: statsKey.count_grade_x ?? 0,
          ss: statsKey.count_grade_ss ?? 0,
          s: statsKey.count_grade_s ?? 0,
          a: statsKey.count_grade_a ?? 0,
          b: statsKey.count_grade_b ?? 0
        },
      };
    };

    const profile: QuaverProfile = {
      id: String(user.id),
      username: user.username,
      country: user.country,
      avatarUrl: user.avatar_url || "/assets/placeholder.jpg",
      modes: {
        "4k": mapStats(user.stats_keys4),
        "7k": mapStats(user.stats_keys7),
      },
    };

    return profile;
  } catch (err) {
    console.error("Error fetching Quaver player:", err);
    return null;
  }
}
