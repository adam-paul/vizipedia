// Dashboard.js

// React imports
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

// Local imports
import './Dashboard.css';
import SeasonDashboard from './SeasonDashboard';
import TeamDashboard from './TeamDashboard';
import PlayerDashboard from './PlayerDashboard';
import DataTotalsPanel from './visualizations/DataTotalsPanel';


// Create the dashboard
const Dashboard = ({ sportName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardTitle, setDashboardTitle] = useState(`${sportName} Dashboard`);
  const [inputValue, setInputValue] = useState('');

  const handleVizipediaClick = () => {
    navigate('/');
  }

  const handleHomeDataClick = () => {
    navigate(`/${sportName.toLowerCase()}/`);
  }

  const handleSeasonalDataClick = () => {
    navigate(`/${sportName.toLowerCase()}/season/`);
  }

  const handleTeamDataClick = () => {
    navigate(`/${sportName.toLowerCase()}/team/`);
  }

  const handlePlayerDataClick = () => {
    navigate(`/${sportName.toLowerCase()}/player/`);
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleInputSubmit = (event) => {
    event.preventDefault();  // Prevent the form from being submitted
    console.log(`User input: ${inputValue}`);
    setInputValue('');  // Clear the input field
  }

  const isMainNHLPage = sportName === 'NHL' && location.pathname === `/${sportName.toLowerCase()}/`;

  useEffect(() => {
    // Dynamically set the title based on the current route
    const path = location.pathname;
    if (path.includes('/season/')) {
      setDashboardTitle('Season');
    } else if (path.includes('/team/')) {
      setDashboardTitle('Team');
    } else if (path.includes('/player/')) {
      setDashboardTitle('Player');
    } else {
      setDashboardTitle('');
    }
  }, [location, sportName]);

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

      {/* Dashboard content */}
      <div className="content">

        <Routes>
          <Route path={`season/*`} 
                  element={<SeasonDashboard 
                  sportName={sportName} 
                  dashboardTitle={dashboardTitle} />} />
          <Route path={`team/*`} 
                  element={<TeamDashboard 
                  dashboardTitle={dashboardTitle} />} />
          <Route path={`player/*`} 
                  element={<PlayerDashboard 
                  dashboardTitle={dashboardTitle} />} />
        </Routes>

        {isMainNHLPage && <DataTotalsPanel sportName={sportName} navigate={navigate} />}

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