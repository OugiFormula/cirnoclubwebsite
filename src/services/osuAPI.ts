// osuAPI.ts
export interface OsuUser {
  id: number;
  username: string;
  avatar_url: string;
  country_code: string;
  pp?: number;
  playcount?: number;
  hit_accuracy?: number; // accuracy
  rankedScore?: number;
  totalScore?: number;
  grade_counts?: Record<string, number>; // ss, ssh, s, sh, a
  rank?: {
    global?: number;
    country?: number;
  };
}

const BASE_URL = "https://osu-proxy.crimsoncloudszerotwo.workers.dev";

async function fetchFromWorker(path: string) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch ${path}: ${res.status} ${text}`);
  }
  return res.json();
}

/**
 * Fetch osu! user by ID and mode
 */
export async function getUser(
  userId: number,
  mode: "osu" | "taiko" | "catch" | "mania"
): Promise<OsuUser> {
  const data = await fetchFromWorker(`/users/${userId}/${mode}`);
  const stats = data.statistics || {};

  return {
    id: data.id,
    username: data.username,
    avatar_url: data.avatar_url,
    country_code: data.country_code,
    pp: stats.pp,
    playcount: stats.play_count,
    hit_accuracy: stats.hit_accuracy,
    rankedScore: stats.ranked_score,
    totalScore: stats.total_score,
    grade_counts: stats.grade_counts,
    rank: {
      global: stats.global_rank,
      country: stats.rank?.country ?? stats.country_rank,
    },
  };
}

// Optional simple caching
const cache = new Map<string, OsuUser>();

export async function getUserCached(
  userId: number,
  mode: "osu" | "taiko" | "catch" | "mania"
) {
  const key = `${userId}-${mode}`;
  if (cache.has(key)) return cache.get(key)!;
  const user = await getUser(userId, mode);
  cache.set(key, user);
  return user;
}
