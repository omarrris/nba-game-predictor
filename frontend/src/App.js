import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import TeamStats from './components/TeamStats';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team-analysis" element={<TeamStats teamId={1} season="2023" />} /> {/* Example teamId and season */}
      </Routes>
    </Router>
  );
}

export default App;
