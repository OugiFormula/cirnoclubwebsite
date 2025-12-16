import React from "react";
import "../styles/MainPage.css";
import MemberCard from "../components/MemberCard";
import membersData from "../data/members.json";
import type { MemberData } from "../data/types";
import { useNavigate } from "react-router-dom";

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  // Founders
  const founderIds = ["Manu", "YukioKoito"];
  const founders: MemberData[] = membersData.filter((member) =>
    founderIds.includes(member.id)
  );

  return (
    <div className="mainpage">
      {/* ==== HERO SECTION ==== */}
      <section className="hero-section">
        <video
          className="hero-video"
          src="/assets/hero-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <img src="/assets/logo.gif" alt="Logo" className="hero-logo" />
          <h1 className="hero-title">Cirno Appreciation Club</h1>
          <p className="hero-subtext">
            A rhythm gaming community who love cirno ⑨, touhou ☯ and fumos ᗜˬᗜ
          </p>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* ==== ABOUT SECTION ==== */}
      <section className="about-section">
        <h2>About Us</h2>
        <p className="about-intro">
          Cirno Appreciation Club is a rhythm gaming community built by passionate players.
          We organize game clans, host community events, and create silly things like our
          Discord bot Collect Fumos!
        </p>

        <div className="about-grid is-2">
          <div className="about-card">
            <img src="/assets/icons/osu.png" alt="osu!" />
            <h3>osu! Team</h3>
            <p>Join our osu! team and climb the ranks together!</p>
            <a
              href="https://osu.ppy.sh/teams/5948"
              target="_blank"
              rel="noopener noreferrer"
              className="about-button"
            >
              Visit osu!
            </a>
          </div>

          <div className="about-card">
            <img src="/assets/icons/quaver.png" alt="Quaver" />
            <h3>Quaver Clan</h3>
            <p>Collaborate with our Quaver players to improve your charts and skills.</p>
            <a
              href="https://two.quavergame.com/clans/134"
              target="_blank"
              rel="noopener noreferrer"
              className="about-button"
            >
              Visit Quaver
            </a>
          </div>

          <div className="about-card">
            <img src="/assets/icons/beatleader.png" alt="BeatLeader" />
            <h3>BeatLeader Clan</h3>
            <p>Play, improve, and represent us in the Beat Saber community.</p>
            <a
              href="https://beatleader.xyz/clan/CRNO"
              target="_blank"
              rel="noopener noreferrer"
              className="about-button"
            >
              Visit BeatLeader
            </a>
          </div>

          <div className="about-card">
            <img src="/assets/placeholder.jpg" alt="Collect Fumos!" />
            <h3>Collect Fumos!</h3>
            <p>Our Discord bot where you collect, trade, and show off your favorite Fumos!</p>
            <a
              href="https://doog.cool/CollectFumos/"
              target="_blank"
              rel="noopener noreferrer"
              className="about-button"
            >
              Add to Discord
            </a>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* ==== FOUNDERS SECTION ==== */}
      <section className="about-section">
        <h2>Founders</h2>
        <p className="about-intro">
          Everything started when one silly guy decided to make a Beat Leader clan and asked people to send him a funky song.
          After getting a funky song from shuu, we decided to expand the clan into a community for people who enjoy rhythm games
          and appreciate Cirno.
        </p>
        <div className="founders-grid">
          {founders.map((member) => (
            <div
              key={member.id}
              className="founder-card-wrapper"
              onClick={() => navigate(`/members/${member.id}`)}
            >
              <MemberCard
                member={member}
                onClick={() => navigate(`/members/${member.id}`)}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider"></div>

      {/* ==== DISCORD SECTION ==== */}
      <section className="discord-section">
        <div className="discord-card">
          <h2>Join Our Discord</h2>
          <p>
            Be part of our growing community. meet players, join events,
            and collaborate on projects.
          </p>
          <a
            href="https://discord.gg/6VeVAHaXfN"
            target="_blank"
            rel="noopener noreferrer"
            className="discord-button"
          >
            Join Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default MainPage;
