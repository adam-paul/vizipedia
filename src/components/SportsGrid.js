// SportsGrid.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import the useHistory hook
import './SportsGrid.css';

const SportsGrid = () => {
    const sports = [
        {
          name: 'MLB',
          logo: 'https://i.imgur.com/GE5Cb1Q.png',
          backgroundImage: 'https://i.imgur.com/cQcPTQl.jpg',
          hueOpacity: 0.5,
        },
        {
          name: 'NBA',
          logo: 'https://i.imgur.com/UHxNjhi.png',
          backgroundImage: 'https://i.imgur.com/3ywYYtx.jpg',
          hueOpacity: 0.2,
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
          hueOpacity: 0.4,
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

  // Create a history object
  const navigate = useNavigate();

  const handlePanelClick = (sportName) => {
    console.log(`${sportName} panel clicked`);
    console.log(`Connecting to ${sportName} database...`);
      
    // Navigate to the sport's data visualization page when its panel is clicked
    navigate(`/${sportName.toLowerCase()}`);
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