// SeasonDashboard.js
import React, { useState, useEffect } from 'react';

const SeasonDashboard = ({ sportName }) => {
    const [selectedSeason, setSelectedSeason] = useState(''); // Default value
    const [seasons, setSeasons] = useState([]); // For holding all seasons
    const [teamData, setTeamData] = useState([]);

    // Fetch all unique seasons
    useEffect(() => {
      fetch(`/api/${sportName.toLowerCase()}/unique_seasons/`)
      .then(response => response.json())
      .then(data => {
          setSeasons(data.seasons);
          if (data.seasons.length > 0) {
              setSelectedSeason(data.seasons[0]); // Set the first season as default
          }
      })
      .catch(error => console.log('There was an error fetching seasons:', error));
    }, [sportName]);

    // Fetch data for the selected season
    useEffect(() => {
        fetch(`/api/${sportName.toLowerCase()}/team/?season=${selectedSeason}`)
        .then(response => response.json())
        .then(data => setTeamData(data))
        .catch(error => console.log('There was an error fetching data:', error));
    }, [selectedSeason, sportName]); // Re-run this effect when selectedSeason or sportName changes

    // Function to handle season selection
    const handleSeasonChange = (event) => {
      setSelectedSeason(event.target.value);
    };

    return (
      <div>
        <h2></h2>
        {/* Include season-specific visualizations */}
        {/* Dropdown to select the season */}
        <select value={selectedSeason} onChange={handleSeasonChange}>
            {seasons.map((season, index) => <option key={index} value={season}>{season}</option>)}
        </select>
      </div>
    );
  };

export default SeasonDashboard;