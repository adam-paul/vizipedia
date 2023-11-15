// DashboardStats.js

import './DashboardStats.css';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DashboardStats = ({ selectedSeason, gpgData, totalPointsData }) => {
  const d3Container = useRef();

  useEffect(() => {
    if (gpgData && d3Container.current) {
      // Clear any previous SVGs in the container
      d3.select(d3Container.current).selectAll("*").remove();
      
      const margin = { top: 20, right: 20, bottom: 20, left: 20 };
      const width = 600 - margin.left - margin.right; 
      const height = 300 - margin.top - margin.bottom; 

      // Create SVG element
      const svgWidth = (width + margin.left + margin.right) * 2;
      const svg = d3.select(d3Container.current)
                    .append('svg')
                    .attr('width', svgWidth)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`);
      
      // Draw Goals Per Game box for selected season
      const boxSize = 120; // Size of the square box for Goals per Game
      const selectedSeasonData = gpgData.find(d => d.seasons === selectedSeason);
      svg.append('rect')
          .attr('width', boxSize)
          .attr('height', (boxSize * 0.8))
          .attr('x', 0)
          .attr('y', 0)
          .attr('rx', 4)
          .attr('ry', 4)
          .attr('fill', 'white')
          .attr('stroke', 'black');

      // Add "Goals per Game" text
      svg.append('text')
          .attr('x', boxSize / 2)
          .attr('y', 20)
          .attr('text-anchor', 'middle')
          .text('Goals per Game');

      // Add the value for the selected season
      svg.append('text')
          .attr('x', boxSize / 2)
          .attr('y', boxSize / 2 + 5)
          .attr('text-anchor', 'middle')
          .text(selectedSeasonData ? selectedSeasonData.avgGoals.toFixed(2) : 'N/A');

      // Draw the timeline for all seasons' goals per game
      const timelineHeight = boxSize * 0.8; // New height for the timeline
      const timelineWidth = width - boxSize - margin.right - margin.left; // Adjusted width
      const innerPadding = 8;

      // Scales for the line chart
      const xScale = d3.scaleBand()
                        .domain(gpgData.map(d => d.seasons))
                        .range([0 + innerPadding, timelineWidth - innerPadding])
                        .padding(0.1);

      const yScale = d3.scaleLinear()
                        .domain([0, d3.max(gpgData, d => d.avgGoals)])
                        .range([timelineHeight - innerPadding, 0 + innerPadding]);

      // Line chart for average goals
      const line = d3.line()
                    .x(d => xScale(d.seasons) + xScale.bandwidth() / 2) // Center the line in the band
                    .y(d => yScale(d.avgGoals));

      // Draw time series container
      svg.append('rect')
          .attr('width', timelineWidth)
          .attr('height', boxSize * 0.8)
          .attr('x', boxSize + margin.right)
          .attr('y', 0)
          .attr('rx', 4)
          .attr('ry', 4)
          .attr('fill', 'white')
          .attr('stroke', 'black');

      svg.append('g')
          .attr('transform', `translate(${boxSize + margin.right}, 0)`)
          .append('path')
          .datum(gpgData)
          .attr('fill', 'none')
          .attr('stroke', 'steelblue')
          .attr('stroke-width', 2)
          .attr('d', line);

      if (selectedSeasonData) {
      const timelineOffset = boxSize + margin.right; // Total offset including the GPG box and margin
      const selectedSeasonX = xScale(selectedSeason) + timelineOffset;
        svg.append('rect')
            .attr('x', selectedSeasonX)
            .attr('width', 2) // Narrow width
            .attr('y', 0)
            .attr('height', timelineHeight)
            .attr('fill', 'rgba(255, 0, 0, 0.5)'); // Semi-transparent red
      }

      // Calculate the offset for the second box (Total Points)
      const spaceBetween = 175; 
      const totalPointsOffset = boxSize + timelineWidth + margin.right + spaceBetween;

      // Draw Total Points box for selected season
      const selectedSeasonPoints = totalPointsData.find(d => d.seasons === selectedSeason);
      svg.append('rect')
          .attr('width', boxSize)
          .attr('height', boxSize * 0.8)
          .attr('x', totalPointsOffset)
          .attr('y', 0)
          .attr('rx', 4)
          .attr('ry', 4)
          .attr('fill', 'white')
          .attr('stroke', 'black')

      // Add "Total Points" text
      svg.append('text')
          .attr('x', totalPointsOffset + boxSize / 2)
          .attr('y', 20)
          .attr('text-anchor', 'middle')
          .text('Total Points');

      // Add the value for the selected season
      svg.append('text')
          .attr('x', totalPointsOffset + boxSize / 2)
          .attr('y', boxSize / 2 + 5)
          .attr('text-anchor', 'middle')
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
          .attr('x', totalPointsOffset + boxSize + margin.right)
          .attr('y', 0)
          .attr('rx', 4)
          .attr('ry', 4)
          .attr('fill', 'white')
          .attr('stroke', 'black');

      // Draw the line for the Total Points time series
      svg.append('g')
          .attr('transform', `translate(${totalPointsOffset + boxSize + margin.right}, 0)`)
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
        const selectedSeasonPointsX = totalPointsXScale(selectedSeason) + totalPointsOffset + boxSize + margin.right;
        svg.append('rect')
            .attr('x', selectedSeasonPointsX)
            .attr('width', 2) // Narrow width for the band
            .attr('y', 0)
            .attr('height', timelineHeight)
            .attr('fill', 'rgba(255, 0, 0, 0.5)'); // Semi-transparent red
      }

    }
  }, [selectedSeason, gpgData, totalPointsData]);

  return (
      <div className="dashboard-stats">
          <svg ref={d3Container} />
      </div>
  );
};

export default DashboardStats;