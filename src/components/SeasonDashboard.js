// SeasonDashboard.js

import './SeasonDashboard.css';

import React, { useState, useEffect } from 'react';
import StatPathViz from './visualizations/StatPathViz';
import SeasonTimeline from './visualizations/SeasonTimeline';

const MemoizedOption = React.memo(({ value }) => <option value={value}>{value}</option>);

const SeasonDashboard = ({ sportName }) => {
    const [selectedSeason, setSelectedSeason] = useState(''); // Default value
    const [seasons, setSeasons] = useState([]); // For holding all seasons
    const [finalData, setFinalData] = useState([]);
    const [winningTeam, setWinningTeam] = useState(null);
    const [statCols, setStatCols] = useState([]);

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

    useEffect(() => {
      // Remove the hyphen from the selectedSeason
      const formattedSeason = selectedSeason.replace('-', '');
      fetch(`/api/${sportName.toLowerCase()}/stat_path_preprocess/${formattedSeason}/`)
      .then(response => response.json())
      .then(data => {
        setFinalData(data.final_data);
        setWinningTeam(data.winning_team);
        setStatCols(data.stat_cols);
      })
      .catch(error => console.log('There was an error fetching stat path data:', error));
    }, [selectedSeason, sportName]);

    return (
      <div className="season-dashboard">
        {/* Include season-specific visualizations */}
        {/* Dropdown to select the season */}
        <select className="season-select" value={selectedSeason} onChange={handleSeasonChange}>
          {seasons.map((season, index) => <MemoizedOption key={index} value={season} />)}
        </select>
        {/* d3 visualizations */}
        <SeasonTimeline season={selectedSeason} seasons={seasons} onSeasonClick={handleSeasonChangeFromTimeline} />
        <StatPathViz finalData={finalData} winningTeam={winningTeam} statCols={statCols} season={selectedSeason} />
      </div>
    );
  };

export default SeasonDashboard;