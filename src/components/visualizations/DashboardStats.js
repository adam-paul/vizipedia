// DashboardStats.js

import './DashboardStats.css';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const DashboardStats = ({ selectedSeason }) => {
    const gpgSvgRef = useRef();
    const tpSvgRef = useRef();    
    const [goalsPerGameData, setGoalsPerGameData] = useState([]); 
    const [totalPointsData, setTotalPointsData] = useState([]); 

    // Fetch goals per game data for selected season
    useEffect(() => {
      fetch(`/api/nhl/seasons_gpg/`)
        .then(response => response.json())
        .then(data => {
          const formattedData = Object.entries(data).map(([season, avgGoals]) => ({
            seasons: season,
            avgGoals
          }));
          setGoalsPerGameData(formattedData);
        })
        .catch(error => console.log('There was an error fetching goals per game data:', error));
    }, [selectedSeason]);

    // Fetch total points data for selected season
    useEffect(() => {
      fetch(`/api/nhl/total_points/`)
        .then(response => response.json())
        .then(data => {
          const formattedData = Object.entries(data).map(([season, totalPoints]) => ({
            seasons: season,
            totalPoints
          }));
          setTotalPointsData(formattedData);
        })
        .catch(error => console.log('There was an error fetching total points data:', error));
    }, [selectedSeason]);

    // Draw and populate the dashboard stats visualizations
    useEffect(() => {
      if (goalsPerGameData && gpgSvgRef.current) {
        // Clear any previous SVGs in the container
        d3.select(gpgSvgRef.current).selectAll("*").remove();

        // Create SVG element
        const svg = d3.select(gpgSvgRef.current)
                      .attr('class', 'gpg-svg')
        const svgWidth = gpgSvgRef.current.getBoundingClientRect().width;
        const svgHeight = gpgSvgRef.current.getBoundingClientRect().height;
        const margins = { top: 20, right: 10, bottom: 20, left: 20 };
        
        // Draw Goals Per Game box for selected season
        const boxSize = 120; // Size of the square box for Goals per Game
        const selectedSeasonData = goalsPerGameData.find(d => d.seasons === selectedSeason);
        const gpgX = 0; // X-coordinate for Goals per Game text
        const gpgY = 20; // Y-coordinate for Goals per Game text

        // Draw "Goals per Game" text
        svg.append('text')
            .attr('x', gpgX)
            .attr('y', gpgY)
            .attr('text-anchor', 'start')
            .text('Goals per Game');

        // Draw stat title underline
        const textElement = svg.select('text'); 
        const textWidth = textElement.node().getBBox().width;
        const chartOffset = textWidth * 1.2;

        svg.append('line')
            .attr('x1', gpgX - 3)
            .attr('y1', gpgY + 5) // Slightly below the text
            .attr('x2', gpgX + chartOffset) // Length of the line
            .attr('y2', gpgY + 5)
            .attr('stroke', 'black')
            .attr('stroke-width', 1);

        // Draw value for "Goals per Game"
        svg.append('text')
            .attr('x', gpgX + chartOffset - 2) // Right-justified
            .attr('y', gpgY + 20) // Below the line
            .attr('text-anchor', 'end')
            .text(selectedSeasonData ? selectedSeasonData.avgGoals.toFixed(2) : 'N/A');

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
                          .domain([0, d3.max(goalsPerGameData, d => d.avgGoals)])
                          .range([timelineHeight - innerPadding, 0 + innerPadding]);

        // Line chart for average goals
        const line = d3.line()
                        .x(d => xScale(d.seasons) + xScale.bandwidth() / 2) // Center the line in the band
                        .y(d => yScale(d.avgGoals));

        // Draw time series container
        svg.append('rect')
            .attr('width', timelineWidth)
            .attr('height', boxSize * 0.8)
            .attr('x', chartOffset + margins.right)
            .attr('y', 0)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('fill', 'white')
            .attr('stroke', 'black');

        svg.append('g')
            .attr('transform', `translate(${chartOffset + margins.right}, 0)`)
            .append('path')
            .datum(goalsPerGameData)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2)
            .attr('d', line);

        if (selectedSeasonData) {
          const timelineOffset = chartOffset + margins.right; // Total offset including the GPG box and margin
          const selectedSeasonX = xScale(selectedSeason) + timelineOffset;
          svg.append('rect')
              .attr('x', selectedSeasonX)
              .attr('width', 2) // Narrow width
              .attr('y', 0)
              .attr('height', timelineHeight)
              .attr('fill', 'rgba(255, 0, 0, 0.5)'); // Semi-transparent red
        }
      }
    }, [selectedSeason, goalsPerGameData]);

    useEffect(() => {
      if (totalPointsData && tpSvgRef.current) {
        // Clear any previous SVGs in the container
        d3.select(tpSvgRef.current).selectAll("*").remove();

        // Create SVG element
        const svg = d3.select(tpSvgRef.current)
                      .attr('class', 'tp-svg')
        const svgWidth = tpSvgRef.current.getBoundingClientRect().width;
        const svgHeight = tpSvgRef.current.getBoundingClientRect().height;
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
        svg.append('text')
            .attr('x', 0)
            .attr('y', statY)
            .attr('text-anchor', 'start')
            .text('Total Points');

        // Draw stat title underline
        const textElement = svg.select('text'); 
        const textWidth = textElement.node().getBBox().width;
        const chartOffset = textWidth * 1.2;

        svg.append('line')
            .attr('x1', 0 - 3)
            .attr('y1', statY + 5) // Slightly below the text
            .attr('x2', chartOffset) // Length of the line
            .attr('y2', statY + 5)
            .attr('stroke', 'black')
            .attr('stroke-width', 1);

        // Draw value for "Total Points"
        svg.append('text')
            .attr('x', chartOffset - 2) // Right-justified
            .attr('y', statY + 20) // Below the line
            .attr('text-anchor', 'end')
            .text(selectedSeasonPoints ? selectedSeasonPoints.totalPoints : 'N/A');
        
        // Set up the scales for the Total Points timeline
        const totalPointsXScale = d3.scaleBand()
                                    .domain(totalPointsData.map(d => d.seasons))
                                    .range([0 + innerPadding, timelineWidth - innerPadding])
                                    .padding(0.1);

        const totalPointsYScale = d3.scaleLinear()
                                    .domain([0, d3.max(totalPointsData, d => d.totalPoints)])
                                    .range([timelineHeight - innerPadding, 0 + innerPadding]);

        // Draw the time series of total points
        svg.append('rect')
            .attr('width', timelineWidth)
            .attr('height', boxSize * 0.8)
            .attr('x', chartOffset + margins.right)
            .attr('y', 0)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('fill', 'white')
            .attr('stroke', 'black');

        // Draw the line for the Total Points time series
        svg.append('g')
            .attr('transform', `translate(${chartOffset + margins.right}, 0)`)
            .append('path')
            .datum(totalPointsData)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2)
            .attr('d', d3.line()
                .x(d => totalPointsXScale(d.seasons) + totalPointsXScale.bandwidth() / 2) // Center the line in the band
                .y(d => totalPointsYScale(d.totalPoints))
            );

        // Add a semi-transparent red band for the selected season
        if (selectedSeasonPoints) {
          const selectedSeasonPointsX = totalPointsXScale(selectedSeason) + chartOffset + margins.right;
          svg.append('rect')
              .attr('x', selectedSeasonPointsX)
              .attr('width', 2) // Narrow width for the band
              .attr('y', 0)
              .attr('height', timelineHeight)
              .attr('fill', 'rgba(255, 0, 0, 0.5)'); // Semi-transparent red
        }
      }
    }, [selectedSeason, totalPointsData]);

    return (
      <div className="dashboard-stats">
        <svg ref={gpgSvgRef} />
        <svg ref={tpSvgRef} />
      </div>
    );
  };

export default DashboardStats;