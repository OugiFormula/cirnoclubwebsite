export interface OsuGameEntry {
  id: string;
  standard: boolean;
  taiko: boolean;
  mania: boolean;
  catch: boolean;
}

export interface MemberData {
  id: string;
  username: string;
  title?: string;
  countryFlag: string;
  profilePicture?: string;
  games: {
    osu?: OsuGameEntry[];
    quaver?: string;
    beatleader?: string;
    discord?: string;
  };
}
