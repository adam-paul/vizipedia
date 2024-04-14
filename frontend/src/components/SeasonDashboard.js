// SeasonDashboard.js

import './SeasonDashboard.css';

import React, { useState, useEffect } from 'react';
import SeasonTimeline from './visualizations/SeasonTimeline';
import DashboardStats from './visualizations/DashboardStats';
import StatPathViz from './visualizations/StatPathViz';
import HelpSidebar from './HelpSidebar';

// Memoized season select option
const MemoizedOption = React.memo(({ value }) => <option value={value}>{value}</option>);

const SeasonDashboard = ({ sportName, dashboardTitle }) => {
    const [selectedSeason, setSelectedSeason] = useState('');
    const [seasons, setSeasons] = useState([]); // Holds all seasons
    const [isHelpSidebarOpen, setIsHelpSidebarOpen] = useState(false);
    const [helpContent, setHelpContent] = useState('');

    // Function to handle season selection
    const handleSeasonChange = (event) => {
      setSelectedSeason(event.target.value);
    };

    // Function to handle season selection from timeline
    const handleSeasonChangeFromTimeline = (newSeason) => {
      setSelectedSeason(newSeason);
    };

    // Function to open the help sidebar with specific content
    const openHelpSidebar = (content) => {
      setHelpContent(content);
      setIsHelpSidebarOpen(true);
    };

    // Function to close the help sidebar
    const closeHelpSidebar = () => {
      setIsHelpSidebarOpen(false);
    };

    // Event listener for ESC key
    useEffect(() => {
      const handleKeyDown = (event) => {
          // Check if ESC key is pressed
          if (event.keyCode === 27) {
              closeHelpSidebar();
          }
      };

      // Add event listener when the component mounts
      window.addEventListener('keydown', handleKeyDown);

      // Remove event listener on cleanup
      return () => {
          window.removeEventListener('keydown', handleKeyDown);
      };
    }, []);

    // Fetch all unique seasons
    useEffect(() => {
      fetch(`/api/${sportName.toLowerCase()}/unique_seasons/`)
      .then(response => response.json())
      .then(data => {
        setSeasons(data.seasons);
        if (data.seasons.length > 0) {
          setSelectedSeason(data.seasons[data.seasons.length - 1]); // Default to present season
        }
      })
      .catch(error => console.log('There was an error fetching seasons:', error));
    }, [sportName, dashboardTitle]);

    return (
      <div className="season-dashboard">

        <h2 className="title">{dashboardTitle}</h2>

        {/* Season select dropdown */}
        <select className="season-select" value={selectedSeason} onChange={handleSeasonChange}>
          {seasons.map((season, index) => <MemoizedOption key={index} value={season} />)}
        </select>

        {/* d3 visualizations */}
        <SeasonTimeline 
          season={selectedSeason} 
          seasons={seasons} 
          onSeasonClick={handleSeasonChangeFromTimeline} 
        />
        <DashboardStats 
          selectedSeason={selectedSeason} 
          onHelpClick={() => openHelpSidebar("DashboardStats.md")}
        />
        <StatPathViz 
          season={selectedSeason} 
          onHelpClick={() => openHelpSidebar("StatPathViz.md")}
        />

        {/* Help sidebar */}
        <HelpSidebar
          isOpen={isHelpSidebarOpen}
          markdownFileName={helpContent}
          onClose={closeHelpSidebar}
        />

        {/* Page footer */}
        <div class="footer">
          <img src="https://i.imgur.com/Aw9faWb.png" alt="NHL logo" width="7%" />
        </div>
      </div>
    );
  };

export default SeasonDashboard;
