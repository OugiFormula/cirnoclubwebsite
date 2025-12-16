import { useEffect, useRef, useState } from "react";
import "../styles/RadioPage.css";

const STREAM_URL = "https://stream.zeno.fm/em1ua1fsqvcvv";
const METADATA_URL =
  "https://api.zeno.fm/mounts/metadata/subscribe/em1ua1fsqvcvv";

interface SongInfo {
  title: string;
  artist: string;
  album: string;
  cover?: string;
}

export default function RadioPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [songInfo, setSongInfo] = useState<SongInfo>({
    title: "Loading...",
    artist: "",
    album: "",
    cover: "",
  });

  useEffect(() => {
    const evt = new EventSource(METADATA_URL);
    evt.onmessage = (e) => {
      try {
        const song = parseSSEData(e.data);
        setSongInfo({ ...song, cover: "" });
        fetchDeezerCover(song.artist, song.title);
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };
    return () => evt.close();
  }, []);

  const fetchDeezerCover = async (artist: string, title: string) => {
    try {
      const query = encodeURIComponent(`${artist} ${title}`);
      const url = `https://corsproxy.io/?url=${encodeURIComponent(
        `https://api.deezer.com/search?q=${query}&limit=1`
      )}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.data?.length > 0) {
        setSongInfo((prev) => ({
          ...prev,
          cover: data.data[0].album.cover_big,
        }));
      } else {
        setSongInfo((prev) => ({
          ...prev,
          cover: "/assets/placeholder.jpg",
        }));
      }
    } catch (err) {
      console.error("Deezer cover fetch error:", err);
      setSongInfo((prev) => ({
        ...prev,
        cover: "/assets/placeholder.jpg",
      }));
    }
  };

  const parseSSEData = (sseData: string) => {
    try {
      const json = JSON.parse(sseData);
      const streamTitle = json.streamTitle || "";
      let artist = "";
      let title = streamTitle;

      if (streamTitle.includes(" - ")) {
        const parts = streamTitle.split(" - ").map((s: string) => s.trim());
        artist = parts[0] || "";
        title = parts[1] || streamTitle;
      }

      let album = "";
      if (json.streamUrl) {
        const params = new URLSearchParams(json.streamUrl);
        if (params.has("album")) album = decodeURIComponent(params.get("album")!);
        if (!artist && params.has("artist")) artist = decodeURIComponent(params.get("artist")!);
      }

      return { artist, title, album };
    } catch {
      return { artist: "", title: sseData, album: "" };
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (!isPlaying) {
      try {
        if (audioRef.current.src !== STREAM_URL) audioRef.current.src = STREAM_URL;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Play interrupted:", err);
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const searchSpotify = () => {
    const query = encodeURIComponent(`${songInfo.artist} ${songInfo.title}`);
    window.open(`https://open.spotify.com/search/${query}`, "_blank");
  };

  const searchYouTubeMusic = () => {
    const query = encodeURIComponent(`${songInfo.artist} ${songInfo.title}`);
    window.open(`https://music.youtube.com/search?q=${query}`, "_blank");
  };

  return (
    <div className="radio-page">
      <div
        className="background"
        style={{
          backgroundImage: songInfo.cover
            ? `url(${songInfo.cover})`
            : `url(/assets/placeholder.jpg)`,
        }}
      ></div>

      <div className="radio-content">
        <div className="cover-container" style={{ "--volume": volume } as any}>
          {/* Ring showing volume */}
          <div className="volume-ring"></div>

          <img
            src={songInfo.cover || "/assets/placeholder.jpg"}
            alt="cover"
            className={`radio-cover ${isPlaying ? "cover-animate" : ""}`}
          />

          {/* Hidden slider for interaction */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={changeVolume}
            className="volume-slider"
          />
        </div>

        <div className="info-container">
          <h2 className="song-title">{songInfo.title}</h2>
          <h3 className="artist">{songInfo.artist}</h3>
          {songInfo.album && <h4 className="album">{songInfo.album}</h4>}

          <div className="controls">
            <button className="play-btn" onClick={togglePlay}>
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div>

          <div className="search-buttons">
            <button onClick={searchSpotify} className="search-btn spotify">
              <img src="/assets/icons/spotify.png" alt="Spotify" className="icon" />
              Spotify
            </button>
            <button onClick={searchYouTubeMusic} className="search-btn youtube">
              <img src="/assets/icons/youtube.png" alt="YouTube" className="icon" />
              YouTube
            </button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} preload="none" />
    </div>
  );
}
