// SeasonDashboard.js
import React, { useState, useEffect } from 'react';
import StatPathViz from './visualizations/StatPathViz';

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

    // Fetch all unique seasons
    useEffect(() => {
      fetch(`/api/${sportName.toLowerCase()}/unique_seasons/`)
      .then(response => response.json())
      .then(data => {
          setSeasons(data.seasons);
          if (data.seasons.length > 0) {
              setSelectedSeason(data.seasons[data.seasons.length - 1]); // Default season
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
        console.log("Data fetched:", data);
        setFinalData(data.final_data);
        setWinningTeam(data.winning_team);
        setStatCols(data.stat_cols);
        console.log("finalData after set:", finalData);
        console.log("winningTeam after set:", winningTeam);
        console.log("statCols after set:", statCols);
      })
      .catch(error => console.log('There was an error fetching stat path data:', error));
    }, [selectedSeason, sportName]);

    return (
      <div>
        {/* Include season-specific visualizations */}
        {/* Dropdown to select the season */}
        <select value={selectedSeason} onChange={handleSeasonChange}>
            {seasons.map((season, index) => <option key={index} value={season}>{season}</option>)}
        </select>
        {/* Include the SVG element where the D3 visualization will be rendered */}
        <StatPathViz finalData={finalData} winningTeam={winningTeam} statCols={statCols} />
      </div>
    );
  };

export default SeasonDashboard;