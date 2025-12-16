export interface DiscordActivity {
  id: string;
  type: number;
  name: string;
  details?: string;
  state?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  application_id?: string; // <-- Added this line
}

export interface DiscordSpotify {
  track_id: string;
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  timestamps: {
    start: number;
    end: number;
  };
}

export interface DiscordUserData {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null; // Discord avatar hash can be null
}

export interface DiscordData {
  discord_user: DiscordUserData;
  discord_status: "online" | "idle" | "dnd" | "offline";
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  listening_to_spotify: boolean;
  spotify?: DiscordSpotify | null;
  activities: DiscordActivity[];
}

export async function fetchDiscordUser(userId: string): Promise<DiscordData | null> {
  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
    if (!response.ok) return null;

    const data = await response.json();
    if (!data.success) return null;

    return data.data as DiscordData;
  } catch (err) {
    console.error("Error fetching Discord user via Lanyard:", err);
    return null;
  }
}

// Helper to get avatar URL
export function getDiscordAvatarUrl(discordUser: DiscordUserData): string {
  if (!discordUser.avatar) {
    // default Discord avatar if none
    const defaultAvatarIndex = parseInt(discordUser.discriminator) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
  }

  const isAnimated = discordUser.avatar.startsWith("a_");
  return `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${isAnimated ? "gif" : "png"}?size=128`;
}
