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
        <Route path="/nhl/*" element={<Dashboard sportName="NHL" />} />
        <Route path="/mlb/*" element={<Dashboard sportName="MLB" />} />
        <Route path="/nba/*" element={<Dashboard sportName="NBA" />} />
        <Route path="/nfl/*" element={<Dashboard sportName="NFL" />} />
      </Routes>
    </Router>
  );
};

export default App;