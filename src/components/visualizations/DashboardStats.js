// DashboardStats.js

import './DashboardStats.css';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const DashboardStats = ({ selectedSeason }) => {
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

    // Draw and populate the dashboard stats visualizations
    useEffect(() => {
      if (goalsPerGameData && gpgSvgRef.current) {
        // Clear any previous SVGs in the container
        d3.select(gpgSvgRef.current).selectAll("*").remove();

        // Create SVG element
        const svg = d3.select(gpgSvgRef.current)
                      .attr('class', 'gpg-svg')
        const svgWidth = gpgSvgRef.current.getBoundingClientRect().width;
        const margins = { top: 20, right: 10, bottom: 20, left: 20 };
        
        // Draw Goals Per Game box for selected season
        const boxSize = 120; // Size of the square box for Goals per Game
        const selectedSeasonData = goalsPerGameData.find(d => d.seasons === selectedSeason);
        const gpgX = 0; // X-coordinate for Goals per Game text
        const gpgY = 20; // Y-coordinate for Goals per Game text

        //// Draw "Goals per Game" text
        //svg.append('text')
        //    .attr('class', 'gpg-text')
        //    .attr('x', gpgX)
        //    .attr('y', gpgY)
        //    .attr('text-anchor', 'start')
        //    .text('Goals per Game \u25BC');
//
        //// Draw stat title underline
        //const textElement = svg.select('text'); 
        //const textWidth = textElement.node().getBBox().width;
        //const chartOffset = textWidth * 1.2;
//
        //svg.append('line')
        //    .attr('x1', gpgX - 3)
        //    .attr('y1', gpgY + 5) // Slightly below the text
        //    .attr('x2', gpgX + chartOffset) // Length of the line
        //    .attr('y2', gpgY + 5)
        //    .attr('stroke', 'black')
        //    .attr('stroke-width', 1);
//
        //// Draw value for "Goals per Game"
        //svg.append('text')
        //    .attr('x', gpgX + chartOffset - 2) // Right-justified
        //    .attr('y', gpgY + 20) // Below the line
        //    .attr('text-anchor', 'end')
        //    .text(selectedSeasonData ? selectedSeasonData.avgValue.toFixed(2) : 'N/A');

        // Draw the timeline for all seasons' goals per game
        const timelineHeight = boxSize * 0.8; // New height for the timeline
        const timelineWidth = svgWidth - boxSize - margins.right - margins.left; // Adjusted width
        const innerPadding = 8;

        // Scales for the line chart
        const xScale = d3.scaleBand()
                          .domain(goalsPerGameData.map(d => d.seasons))
                          .range([0 + innerPadding, timelineWidth - innerPadding])
                          .padding(0.1);

        const yScale = d3.scaleLinear()
                          .domain([0, d3.max(goalsPerGameData, d => d.avgValue)])
                          .range([timelineHeight - innerPadding, 0 + innerPadding]);

        // Line chart for average goals
        const line = d3.line()
                        .x(d => xScale(d.seasons) + xScale.bandwidth() / 2) // Center the line in the band
                        .y(d => yScale(d.avgValue));

        // Draw time series container
        svg.append('rect')
            .attr('width', timelineWidth)
            .attr('height', boxSize * 0.8)
            .attr('x', margins.right)
            .attr('y', 0)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('fill', 'white')
            .attr('stroke', 'black');

        svg.append('g')
            .attr('transform', `translate(${margins.right}, 0)`)
            .append('path')
            .datum(goalsPerGameData)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2)
            .attr('d', line);

        if (selectedSeasonData) {
          const timelineOffset = margins.right; // Total offset including the GPG box and margin
          const selectedSeasonX = xScale(selectedSeason) + timelineOffset;
          svg.append('rect')
              .attr('x', selectedSeasonX)
              .attr('width', 2) // Narrow width
              .attr('y', 0)
              .attr('height', timelineHeight)
              .attr('fill', 'rgba(255, 0, 0, 0.5)'); // Semi-transparent red
        }
      }
    }, [selectedSeason, selectedGpgStat, goalsPerGameData]);

    useEffect(() => {
      if (totalPointsData && tpSvgRef.current) {
        // Clear any previous SVGs in the container
        d3.select(tpSvgRef.current).selectAll("*").remove();

        // Create SVG element
        const svg = d3.select(tpSvgRef.current)
                      .attr('class', 'tp-svg')
        const svgWidth = tpSvgRef.current.getBoundingClientRect().width;
        const margins = { top: 20, right: 10, bottom: 20, left: 20 };
        const boxSize = 120; // Size of the square box for Total Points
        const timelineHeight = boxSize * 0.8; // New height for the timeline
        const timelineWidth = svgWidth - boxSize - margins.right - margins.left; // Adjusted width
        const innerPadding = 8;

        // x-y coordinates
        const statY = 20;

        // Draw Total Points box for selected season
        const selectedSeasonPoints = totalPointsData.find(d => d.seasons === selectedSeason);

        // Add "Total Points" text
        //svg.append('text')
        //    .attr('class', 'tp-text')
        //    .attr('x', 0)
        //    .attr('y', statY)
        //    .attr('text-anchor', 'start')
        //    .text('Shots per Game \u25BC');
//
        //// Draw stat title underline
        //const textElement = svg.select('text'); 
        //const textWidth = textElement.node().getBBox().width;
        //const chartOffset = textWidth * 1.2;
//
        //svg.append('line')
        //    .attr('x1', 0 - 3)
        //    .attr('y1', statY + 5) // Slightly below the text
        //    .attr('x2', chartOffset) // Length of the line
        //    .attr('y2', statY + 5)
        //    .attr('stroke', 'black')
        //    .attr('stroke-width', 1);
//
        //// Draw value for "Total Points"
        //svg.append('text')
        //    .attr('x', chartOffset - 2) // Right-justified
        //    .attr('y', statY + 20) // Below the line
        //    .attr('text-anchor', 'end')
        //    .text(selectedSeasonPoints ? selectedSeasonPoints.avgValue.toFixed(2) : 'N/A');
        
        // Set up the scales for the Total Points timeline
        const totalPointsXScale = d3.scaleBand()
                                    .domain(totalPointsData.map(d => d.seasons))
                                    .range([0 + innerPadding, timelineWidth - innerPadding])
                                    .padding(0.1);

        const totalPointsYScale = d3.scaleLinear()
                                    .domain([0, d3.max(totalPointsData, d => d.avgValue)])
                                    .range([timelineHeight - innerPadding, 0 + innerPadding]);

        // Draw the time series of total points
        svg.append('rect')
            .attr('width', timelineWidth)
            .attr('height', boxSize * 0.8)
            .attr('x', margins.right)
            .attr('y', 0)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('fill', 'white')
            .attr('stroke', 'black');

        // Draw the line for the Total Points time series
        svg.append('g')
            .attr('transform', `translate(${margins.right}, 0)`)
            .append('path')
            .datum(totalPointsData)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2)
            .attr('d', d3.line()
                .x(d => totalPointsXScale(d.seasons) + totalPointsXScale.bandwidth() / 2) // Center the line in the band
                .y(d => totalPointsYScale(d.avgValue))
            );

        // Add a semi-transparent red band for the selected season
        if (selectedSeasonPoints) {
          const selectedSeasonPointsX = totalPointsXScale(selectedSeason) + margins.right;
          svg.append('rect')
              .attr('x', selectedSeasonPointsX)
              .attr('width', 2) // Narrow width for the band
              .attr('y', 0)
              .attr('height', timelineHeight)
              .attr('fill', 'rgba(255, 0, 0, 0.5)'); // Semi-transparent red
        }
      }
    }, [selectedSeason, selectedTpStat, totalPointsData]);

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
          <div className="stat-value">{selectedGpgSeasonData ? selectedGpgSeasonData.avgValue.toFixed(2) : 'N/A'}</div>
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
          <div className="stat-value">{selectedTpSeasonData ? selectedTpSeasonData.avgValue.toFixed(2) : 'N/A'}</div>
        </div>
        <svg ref={tpSvgRef} />
      </div>
    );
  };

export default DashboardStats;