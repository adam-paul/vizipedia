// DashboardStats.js

import './DashboardStats.css';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const DashboardStats = ({ selectedSeason, onHelpClick }) => {
    const gpgSvgRef = useRef();
    const tpSvgRef = useRef(); 
    const [numericStats, setNumericStats] = useState([]);
    const [goalsPerGameData, setGoalsPerGameData] = useState([]); 
    const [totalPointsData, setTotalPointsData] = useState([]); 
    const [selectedGpgStat, setSelectedGpgStat] = useState('goals_per_game');
    const [selectedTpStat, setSelectedTpStat] = useState('shots_per_game'); 
    const [selectedGpgSeasonData, setSelectedGpgSeasonData] = useState(null);
    const [selectedTpSeasonData, setSelectedTpSeasonData] = useState(null);

    // Functions to handle dropdown selection
    const handleGpgStatChange = (event) => {
      setSelectedGpgStat(event.target.value);
    };

    const handleTpStatChange = (event) => {
      setSelectedTpStat(event.target.value);
    };

    // Fetch numeric stats for selected season
    useEffect(() => {
      const formattedSeason = selectedSeason.replace('-', ''); // Format the season for API endpoint
      fetch(`/api/nhl/stat_path_preprocess/${formattedSeason}/`)
        .then(response => response.json())
        .then(data => {
          setNumericStats(data.stat_cols);
        })
        .catch(error => console.log('There was an error fetching numeric stats:', error));
    }, [selectedSeason]);

    // useEffect for fetching data based on selected stats
    useEffect(() => {
      const fetchData = async (stat, setData, setSelectedSeasonData) => {
        try {
          const response = await fetch(`/api/nhl/stat_avgs/${stat}/`);
          const data = await response.json();
          const formattedData = Object.entries(data).map(([season, avgValue]) => ({
            seasons: season,
            avgValue
          }));
          setData(formattedData);
      
          // Find and set the data for the selected season
          const seasonData = formattedData.find(d => d.seasons === selectedSeason);
          setSelectedSeasonData(seasonData);  // Use the appropriate setter for each stat
        } catch (error) {
          console.log(`There was an error fetching ${stat} data:`, error);
        }
      };
      
      fetchData(selectedGpgStat, setGoalsPerGameData, setSelectedGpgSeasonData);
      fetchData(selectedTpStat, setTotalPointsData, setSelectedTpSeasonData);
    }, [selectedSeason, selectedGpgStat, selectedTpStat]);

    const drawStatChart = (svgRef, data, config, selectedSeason) => {
      const { xDomain, yMax, color } = config;
      const svgElement = d3.select(svgRef.current)
                           .attr('class', 'gpg-svg');
      const svgWidth = svgRef.current.getBoundingClientRect().width;
      const margins = { top: 20, right: 10, bottom: 20, left: 20 };
      const boxSize = 120;
      const timelineHeight = boxSize * 0.8;
      const timelineWidth = svgWidth - margins.right - margins.left;
      const innerPadding = 8;
    
      // Clear previous SVG content
      svgElement.selectAll("*").remove();
    
      // Set up scales
      const xScale = d3.scaleBand()
                        .domain(xDomain)
                        .range([0 + innerPadding, timelineWidth - innerPadding])
                        .padding(0.1);
    
      const yScale = d3.scaleLinear()
                        .domain([0, yMax])
                        .range([timelineHeight - innerPadding, 0 + innerPadding]);
    
      // Draw the container
      svgElement.append('rect')
          .attr('width', timelineWidth)
          .attr('height', boxSize * 0.8)
          .attr('x', margins.right)
          .attr('y', 0)
          .attr('rx', 4)
          .attr('ry', 4)
          .attr('fill', 'white')
          .attr('stroke', 'black');
    
      // Line chart for average values
      const line = d3.line()
                      .x(d => xScale(d.seasons) + xScale.bandwidth() / 2)
                      .y(d => yScale(d.avgValue));
    
      // Draw the line
      svgElement.append('g')
          .attr('transform', `translate(${margins.right}, 0)`)
          .append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', 2)
          .attr('d', line);
    
      // Add the red line overlay for the selected season
      const selectedData = data.find(d => d.seasons === selectedSeason);
      if (selectedData) {
        const selectedX = xScale(selectedSeason) + margins.right;
        svgElement.append('rect')
            .attr('x', selectedX)
            .attr('width', 2)
            .attr('y', 0)
            .attr('height', timelineHeight)
            .attr('fill', 'rgba(255, 0, 0, 0.5)');
      }
    };    

    useEffect(() => {
      if (goalsPerGameData && gpgSvgRef.current) {
        drawStatChart(gpgSvgRef, goalsPerGameData, {
          xDomain: goalsPerGameData.map(d => d.seasons),
          yMax: d3.max(goalsPerGameData, d => d.avgValue),
          color: 'steelblue'
        }, selectedSeason);
      }
    
      if (totalPointsData && tpSvgRef.current) {
        drawStatChart(tpSvgRef, totalPointsData, {
          xDomain: totalPointsData.map(d => d.seasons),
          yMax: d3.max(totalPointsData, d => d.avgValue),
          color: 'steelblue'
        }, selectedSeason);
      }
    }, [goalsPerGameData, totalPointsData, selectedSeason]);

    return (
      <div className="dashboard-stats">
        <div className="stat-dropdown-container">
          <select 
            className="stat-dropdown" 
            value={selectedGpgStat} 
            onChange={handleGpgStatChange}
          >
            {numericStats.map((stat, index) => (
              <option key={index} value={stat}>{stat.replace(/_/g, ' ').toUpperCase()}</option>
            ))}
          </select>
          <div className="stat-header">
            <div className="help-button" onClick={() => onHelpClick()}>?</div>
            <div className="stat-value">{selectedGpgSeasonData ? selectedGpgSeasonData.avgValue.toFixed(2) : 'N/A'}</div>
          </div>
          <div className="seasonal-average-text">Season Average</div>
        </div>
        <svg ref={gpgSvgRef} />
        <div className="stat-dropdown-container">
          <select 
            className="stat-dropdown" 
            value={selectedTpStat} 
            onChange={handleTpStatChange}
          >
            {numericStats.map((stat, index) => (
              <option key={index} value={stat}>{stat.replace(/_/g, ' ').toUpperCase()}</option>
            ))}
          </select>
          <div className="stat-header">
            <div className="help-button" onClick={() => onHelpClick()}>?</div>
            <div className="stat-value">{selectedTpSeasonData ? selectedTpSeasonData.avgValue.toFixed(2) : 'N/A'}</div>
          </div>
          <div className="seasonal-average-text">Season Average</div>
        </div>
        <svg ref={tpSvgRef} />
      </div>
    );
  };

export default DashboardStats;