// Dashboard.js

// React imports
import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

// Local imports
import './Dashboard.css';
import SeasonDashboard from './SeasonDashboard';
import TeamDashboard from './TeamDashboard';
import PlayerDashboard from './PlayerDashboard';

// Create the dashboard
const Dashboard = ({ sportName }) => {
  const navigate = useNavigate();
  const [dashboardTitle, setDashboardTitle] = useState(`${sportName} Dashboard Landing Page`);
  const [inputValue, setInputValue] = useState('');

  const handleVizipediaClick = () => {
    navigate('/');
  }

  const handleHomeDataClick = () => {
    navigate(`/${sportName.toLowerCase()}/`);
    setDashboardTitle(`${sportName} Dashboard Landing Page`);
  }

  const handleSeasonalDataClick = () => {
    navigate(`/${sportName.toLowerCase()}/season/`);
    setDashboardTitle('Seasonal Data Dashboard');
  }

  const handleTeamDataClick = () => {
    navigate(`/${sportName.toLowerCase()}/team/`);
    setDashboardTitle('Team Data Dashboard');
  }

  const handlePlayerDataClick = () => {
    navigate(`/${sportName.toLowerCase()}/player/`);
    setDashboardTitle('Player Data Dashboard');
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleInputSubmit = (event) => {
    event.preventDefault();  // Prevent the form from being submitted
    console.log(`User input: ${inputValue}`);
    setInputValue('');  // Clear the input field
  }

  return (
    <div className="container">

      {/* Sidebar header button */}
      <div className="header">
        <h1 onClick={handleVizipediaClick} style={{ cursor: 'pointer' }}>Vizipedia</h1>
      </div>

      {/* Persistent sidebar */}
      <div className="sidebar">
        <img src="https://i.imgur.com/GE5Cb1Q.png" alt="" className="sidebar-img" />
        <img src="https://i.imgur.com/UHxNjhi.png" alt="" className="sidebar-img" />
        <img src="https://i.imgur.com/majPZ1v.png" alt="" className="sidebar-img" />
        <img src="https://i.imgur.com/Aw9faWb.png" alt="" className="sidebar-img" />
        <div className="sidebar-buttons">
          <button className="button" onClick={handleHomeDataClick}>{sportName} Dashboard</button>
          <button className="button" onClick={handleSeasonalDataClick}>Season Dashboard</button>
          <button className="button" onClick={handleTeamDataClick}>Team Dashboard</button>
          <button className="button" onClick={handlePlayerDataClick}>Player Dashboard</button>
        </div>
      </div>

      {/* Dashboard content (infinite scroll) */}
      <div className="content">
        <h2>{dashboardTitle}</h2>

        <Routes>
          <Route path={`season/*`} element={<SeasonDashboard sportName={sportName} />} />
          <Route path={`team/*`} element={<TeamDashboard sportName={sportName} />} />
          <Route path={`player/*`} element={<PlayerDashboard sportName={sportName} />} />
        </Routes>

        {/* D3.js code will go here */}
        <svg className="svg-container" />

        {/* Input form for NLP search */}
        <form className="input-form" onSubmit={handleInputSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="...what would you like to see?"
          />
          <button type="submit" className="send-button">
            <FontAwesomeIcon icon={faRightToBracket} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;