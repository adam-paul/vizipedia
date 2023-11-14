// DashboardStats.js

import './DashboardStats.css';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DashboardStats = ({ seasonsData, selectedSeason }) => {
  const d3Container = useRef();

  useEffect(() => {
    if (seasonsData && d3Container.current) {
      // Clear any previous SVGs in the container
      d3.select(d3Container.current).selectAll("*").remove();
      
      const margin = { top: 20, right: 20, bottom: 20, left: 20 };
      const width = 600 - margin.left - margin.right; 
      const height = 300 - margin.top - margin.bottom; 

      // Create SVG element
      const svg = d3.select(d3Container.current)
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`);
      
      // Draw Goals Per Game box for selected season
      const boxSize = 120; // Size of the square box for Goals per Game
      const selectedSeasonData = seasonsData.find(d => d.seasons === selectedSeason);
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
                        .domain(seasonsData.map(d => d.seasons))
                        .range([0 + innerPadding, timelineWidth - innerPadding])
                        .padding(0.1);

      const yScale = d3.scaleLinear()
                        .domain([0, d3.max(seasonsData, d => d.avgGoals)])
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
          .datum(seasonsData)
          .attr('fill', 'none')
          .attr('stroke', 'steelblue')
          .attr('stroke-width', 2)
          .attr('d', line);

      // Semi-transparent bar for the selected season
      //if (selectedSeasonData) {
        //svg.append('rect')
            //.attr('x', xScale(selectedSeason) + boxSize + margin.right)
            //.attr('width', xScale.bandwidth())
            //.attr('y', 0)
            //.attr('height', timelineHeight)
            //.attr('fill', 'rgba(255, 0, 0, 0.5)');
      //}
    }
  }, [seasonsData, selectedSeason]);

  return (
      <div className="dashboard-stats">
          <svg ref={d3Container} />
      </div>
  );
};

export default DashboardStats;