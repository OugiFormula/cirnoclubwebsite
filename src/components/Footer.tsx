import React from "react";
import "../styles/footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-columns">
          <div className="footer-column">
            <h4>Pages</h4>
            <a href="/">Home</a>
            <a href="/members">Members</a>
          </div>
          <div className="footer-column">
            <h4>Games</h4>
            <a href="https://osu.ppy.sh/teams/5948" target="_blank" rel="noopener noreferrer">osu!</a>
            <a href="https://two.quavergame.com/clans/134" target="_blank" rel="noopener noreferrer">Quaver</a>
            <a href="https://beatleader.xyz/clan/CRNO" target="_blank" rel="noopener noreferrer">BeatLeader</a>
          </div>
          <div className="footer-column">
            <h4>Socials</h4>
            <a href="https://discord.gg/6VeVAHaXfN" target="_blank" rel="noopener noreferrer">Discord</a>
          </div>
        </div>

        <div className="footer-bottom">
          <img src="/assets/logo.gif" alt="Logo" className="footer-logo-img" />
          <div className="footer-copy">© 2025-{new Date().getFullYear()} YukioKoito</div>
          <div className="footer-version">v1.0.0</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
