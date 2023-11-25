// SeasonDashboard.js

import './SeasonDashboard.css';

import React, { useState, useEffect } from 'react';
import SeasonTimeline from './visualizations/SeasonTimeline';
import DashboardStats from './visualizations/DashboardStats';
import StatPathViz from './visualizations/StatPathViz';

// Memoized season select option
const MemoizedOption = React.memo(({ value }) => <option value={value}>{value}</option>);

const SeasonDashboard = ({ sportName }) => {
    const [selectedSeason, setSelectedSeason] = useState('');
    const [seasons, setSeasons] = useState([]); // Holds all seasons

    // Function to handle season selection
    const handleSeasonChange = (event) => {
      setSelectedSeason(event.target.value);
    };

    // Function to handle season selection from timeline
    const handleSeasonChangeFromTimeline = (newSeason) => {
      setSelectedSeason(newSeason);
    };

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
    }, [sportName]);

    return (
      <div className="season-dashboard">

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
        />
        <StatPathViz 
          season={selectedSeason} 
        />

        {/* Page footer */}
        <div class="footer">
          <img src="https://i.imgur.com/Aw9faWb.png" alt="NHL logo" width="7%" />
        </div>
      </div>
    );
  };

export default SeasonDashboard;
