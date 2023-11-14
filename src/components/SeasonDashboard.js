// SeasonDashboard.js

import './SeasonDashboard.css';

import React, { useState, useEffect } from 'react';
import SeasonTimeline from './visualizations/SeasonTimeline';
import DashboardStats from './visualizations/DashboardStats';
import StatPathViz from './visualizations/StatPathViz';

const MemoizedOption = React.memo(({ value }) => <option value={value}>{value}</option>);

const SeasonDashboard = ({ sportName }) => {
    const [selectedSeason, setSelectedSeason] = useState(''); // Default value
    const [seasons, setSeasons] = useState([]); // For holding all seasons
    const [goalsPerGameData, setGoalsPerGameData] = useState([]); // Goals per game data
    const [finalData, setFinalData] = useState([]);
    const [winningTeam, setWinningTeam] = useState('');
    const [winningTeams, setWinningTeams] = useState({});
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
 
    // Remove the hyphen from the selectedSeason
    const formattedSeason = selectedSeason.replace('-', '');

    // Generate winners dict
    useEffect(() => {
      fetch(`/api/${sportName.toLowerCase()}/stanley_cup_winners/`)
      .then(response => response.json())
      .then(data => {
        setWinningTeams(data);
      })
      .catch(error => console.log('There was an error fetching stanley cup winners:', error));
    }, [sportName]);

    // Fetch goals per game data for selected season
    useEffect(() => {
      fetch(`/api/${sportName.toLowerCase()}/seasons_gpg/`)
        .then(response => response.json())
        .then(data => {
          const formattedData = Object.entries(data).map(([season, avgGoals]) => ({
            seasons: season,
            avgGoals
          }));
          setGoalsPerGameData(formattedData);
        })
        .catch(error => console.log('There was an error fetching goals per game data:', error));
    }, [sportName]);

    // Fetch the stat path data for the selected season
    useEffect(() => {
      fetch(`/api/${sportName.toLowerCase()}/stat_path_preprocess/${formattedSeason}/`)
      .then(response => response.json())
      .then(data => {
        setFinalData(data.final_data);
        setWinningTeam(data.winning_team);
        setStatCols(data.stat_cols);
      })
      .catch(error => console.log('There was an error fetching stat path data:', error));
    }, [sportName, selectedSeason, formattedSeason]);

    return (
      <div className="season-dashboard">
        {/* Include season-specific visualizations */}
        {/* Dropdown to select the season */}
        <select className="season-select" value={selectedSeason} onChange={handleSeasonChange}>
          {seasons.map((season, index) => <MemoizedOption key={index} value={season} />)}
        </select>
        {/* d3 visualizations */}
        <SeasonTimeline 
          season={selectedSeason} 
          seasons={seasons}
          winningTeams={winningTeams} 
          onSeasonClick={handleSeasonChangeFromTimeline} 
        />
        <DashboardStats 
          seasonsData={goalsPerGameData} 
          selectedSeason={selectedSeason} 
        />        
        <StatPathViz 
          finalData={finalData} 
          winningTeam={winningTeam} 
          statCols={statCols} 
          season={selectedSeason} 
        />
      </div>
    );
  };

export default SeasonDashboard;