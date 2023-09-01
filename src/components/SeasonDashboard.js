// SeasonDashboard.js
import React, { useState, useEffect } from 'react';

const SeasonDashboard = ({ sportName }) => {
    const [selectedSeason, setSelectedSeason] = useState('20182019'); // Default value
    const [teamData, setTeamData] = useState([]);

    // Function to handle season selection
    const handleSeasonChange = (event) => {
        setSelectedSeason(event.target.value);
    };

    // Fetch data for the selected season
    useEffect(() => {
        fetch(`/api/${sportName.toLowerCase()}/team/?season=${selectedSeason}`)
        .then(response => response.json())
        .then(data => setTeamData(data))
        .catch(error => console.log('There was an error fetching data:', error));
    }, [selectedSeason, sportName]); // Re-run this effect when selectedSeason or sportName changes

    return (
      <div>
        <h2></h2>
        {/* Include team-specific visualizations */}
        {/* Dropdown to select the season */}
        <select value={selectedSeason} onChange={handleSeasonChange}>
            <option value="20182019">2018-2019</option>
            <option value="20192020">2019-2020</option>
            {/* ... other options ... */}
        </select>
      </div>
    );
  };

export default SeasonDashboard;