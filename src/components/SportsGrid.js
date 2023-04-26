// SportsGrid.js
import React, { useState } from 'react';
import './SportsGrid.css';

const SportsGrid = () => {
    const sports = [
        {
          name: 'MLB',
          logo: 'https://i.imgur.com/baXlUao.png',
          backgroundImage: 'https://i.imgur.com/cQcPTQl.jpg',
          hueOpacity: 0.6,
        },
        {
          name: 'NBA',
          logo: 'https://i.imgur.com/UHxNjhi.png',
          backgroundImage: 'https://i.imgur.com/mXA4pVx.jpg',
          hueOpacity: 0.8,
        },
        {
          name: 'NFL',
          logo: 'https://i.imgur.com/majPZ1v.png',
          backgroundImage: 'https://i.imgur.com/HIYtx4u.jpg',
          hueOpacity: 0.6,
        },
        {
          name: 'NHL',
          logo: 'https://i.imgur.com/Aw9faWb.png',
          backgroundImage: 'https://i.imgur.com/ax3GfQs.jpg',
          hueOpacity: 0.8,
        },
      ];

  const [hoveredSport, setHoveredSport] = useState(null);

  const getLogoClassName = (sportName) => {
    if (sportName === 'MLB') return 'mlb-logo';
    if (sportName === 'NBA') return 'nba-logo';
    if (sportName === 'NFL') return 'nfl-logo';
    if (sportName === 'NHL') return 'nhl-logo';
    return '';
  };

  const handlePanelClick = (sportName) => {
    console.log(`${sportName} panel clicked`);

    // Connect to the database and switch to the Dash page
    // Replace this console.log with your actual logic to connect and switch
    console.log(`Connecting to ${sportName} database...`);
    // window.location.href = '/dash';
  };

  return (
    <div className="row">
      {sports.map((sport) => (
        <div
          key={sport.name}
          className={`column ${hoveredSport === sport.name ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredSport(sport.name)}
          onMouseLeave={() => setHoveredSport(null)}
          onClick={() => handlePanelClick(sport.name)}
        >
          <div
            className={`background-container ${
              sport.name === 'NBA' ? 'nba-background' : sport.name === 'NFL' ? 'nfl-background' : ''
            }`}
            style={{
              backgroundImage: `url(${sport.backgroundImage})`,
              backgroundColor: `rgba(135, 206, 235, ${sport.hueOpacity})`,
            }}
          ></div>
          <div className="center-content">
            <center>
              <img
                className={`logo ${getLogoClassName(sport.name)}`}
                src={sport.logo}
                alt={`${sport.name} logo`}
              />
            </center>
          </div>  
        </div>
      ))}
    </div>
  );
};

export default SportsGrid;