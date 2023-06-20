// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SportsGrid from './components/SportsGrid';
import Dashboard from './components/Dashboard';  // The Dashboard component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SportsGrid />} />
        <Route path="/nhl" element={<Dashboard sportName="NHL" />} />
        <Route path="/nhl/season" element={<Dashboard sportName="NHL" />} />
        <Route path="/nhl/team" element={<Dashboard sportName="NHL" />} />
        <Route path="/nhl/player" element={<Dashboard sportName="NHL" />} />
        <Route path="/mlb" element={<Dashboard sportName="MLB" />} />
        <Route path="/mlb/season" element={<Dashboard sportName="MLB" />} />
        <Route path="/mlb/team" element={<Dashboard sportName="MLB" />} />
        <Route path="/mlb/player" element={<Dashboard sportName="MLB" />} />
        <Route path="/nba" element={<Dashboard sportName="NBA" />} />
        <Route path="/nba/season" element={<Dashboard sportName="NBA" />} />
        <Route path="/nba/team" element={<Dashboard sportName="NBA" />} />
        <Route path="/nba/player" element={<Dashboard sportName="NBA" />} />
        <Route path="/nfl" element={<Dashboard sportName="NFL" />} />
        <Route path="/nfl/season" element={<Dashboard sportName="NFL" />} />
        <Route path="/nfl/team" element={<Dashboard sportName="NFL" />} />
        <Route path="/nfl/player" element={<Dashboard sportName="NFL" />} />
        <Route path="/nhl" element={<Dashboard sportName="NHL" />} />
        <Route path="/nhl/season" element={<Dashboard sportName="NHL" />} />
        <Route path="/nhl/team" element={<Dashboard sportName="NHL" />} />
        <Route path="/nhl/player" element={<Dashboard sportName="NHL" />} />
      </Routes>
    </Router>
  );
};

export default App;