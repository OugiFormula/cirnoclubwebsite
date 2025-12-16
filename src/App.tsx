import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MembersPage from "./pages/MembersPage";
import MemberPage from "./pages/MemberPage";
import MainPage from "./pages/MainPage";
import RadioPage from "./pages/RadioPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <Router>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // full viewport height
        }}
      >
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/radio" element={<RadioPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/members/:id" element={<MemberPage />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
