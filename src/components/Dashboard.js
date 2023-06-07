import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ sportName }) => {
  const navigate = useNavigate();
  const [dashboardTitle, setDashboardTitle] = useState(`${sportName} Dashboard Landing Page`);
  const [inputValue, setInputValue] = useState('');

  const handleVizipediaClick = () => {
    navigate('/');
  }

  const handleHomeDataClick = () => {
    setDashboardTitle(`${sportName} Dashboard Landing Page`);
  }

  const handleSeasonalDataClick = () => {
    setDashboardTitle('Season Data Dashboard');
  }

  const handlePlayerDataClick = () => {
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
      <div className="header">
      <h1 onClick={handleVizipediaClick} style={{ cursor: 'pointer' }}>Vizipedia</h1>
      </div>
      <div className="sidebar">
        <button className="button" onClick={handleHomeDataClick}>{sportName} Home Dashboard</button>
        <button className="button" onClick={handleSeasonalDataClick}>Season Dashboard</button>
        <button className="button" onClick={handlePlayerDataClick}>Player Dashboard</button>
      </div>
      <div className="content">
        <h2>{dashboardTitle}</h2>
        {/* Your D3.js code will go here */}
        <form onSubmit={handleInputSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="...what would you like to see?"
          />
        </form>
      </div>
    </div>
  );
};

export default Dashboard;