// SeasonTimeline.js

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './SeasonTimeline.css';

const SeasonTimeline = ({ season, seasons, onSeasonClick }) => {
    const svgRef = useRef();  // Create a reference for the SVG element
    const seasonWidth = 100; // Width for each season including padding
    const totalWidth = seasons.length * seasonWidth; // Total width of the timeline
    const [winningTeams, setWinningTeams] = useState({});

    // Generate winners dict to populate the timeline
    useEffect(() => {
      fetch(`/api/nhl/stanley_cup_winners/`)
      .then(response => response.json())
      .then(data => {
        setWinningTeams(data);
      })
      .catch(error => console.log('There was an error fetching stanley cup winners:', error));
    }, [season]);

    // Draw and populate the season timeline
    useEffect(() => {
      // Check if data is ready
      if (seasons.length === 0 || !seasons.includes(season)) {
        return;  // Exit early if not
      }

      // Check if winningTeams data is ready and contains current season
      if (Object.keys(winningTeams).length === 0 || !winningTeams.hasOwnProperty(season)) {
        return;  // Exit early if not
      }

      // Function to handle season selection
      const handleSeasonClick = (newSeason) => {
        console.log("Type of newSeason:", typeof newSeason); // Log the type
        console.log("Value of newSeason:", newSeason); // Log the value
        if (onSeasonClick) {
          onSeasonClick(newSeason);
        }
      };

      // Function to allow smooth scrolling to selected season
      const smoothScrollTo = (element, target, duration) => {
        const start = element.scrollLeft;
        const change = target - start;
        let startTime = null;
    
        const animateScroll = (currentTime) => {
          if (!startTime) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          element.scrollLeft = start + change * progress;
          
          if (progress < 1) {
            window.requestAnimationFrame(animateScroll);
          }
        };
    
        window.requestAnimationFrame(animateScroll);
      };

      // Create the SVG element
      const svg = d3.select(svgRef.current);
      const margins = { top: 20, right: 20, bottom: 20, left: 20 };
      const viewportWidth = svgRef.current.parentElement.clientWidth;
      const svgHeight = svgRef.current.parentElement.getBoundingClientRect().height;
      const plotHeight = svgHeight - margins.top - margins.bottom;  

      // Update existing elements
      const ticks = svg.selectAll(".tick").data(seasons);
      ticks.exit().remove();
      ticks.enter().append("g").attr("class", "tick");

      // Create the axis scale
      const xScale = d3.scaleBand()
                        .domain(seasons)
                        .range([0, totalWidth])
                        .padding(0.1);

      // Create the X axis
      const xAxis = d3.axisBottom(xScale);

      // Append the X axis to the SVG
      svg.append("g")
          .attr("transform", `translate(${margins.left}, ${plotHeight})`)
          .call(xAxis)
          .selectAll("text")
          .attr("dy", ".35em")
          .attr("text-anchor", "middle");

      // Highlight the currently selected season:
      svg.selectAll(".tick")
          .filter(d => d === season)
          .select("text")
          .style("font-weight", "bold")
          .style("font-size", "1.1em");

      // Add click event listener to the season ticks/logos
      svg.selectAll(".tick")
          .style("cursor", "pointer")
          .on("click", function(d) {
            const selectedSeason = d3.select(this).text();
            handleSeasonClick(selectedSeason);
          });

      // Add images for winning teams above the ticks
      svg.selectAll(".team-logo").data(seasons)
          .enter()
          .append("image")
          .attr("class", "team-logo")
          .attr("href", d => `https://i.imgur.com/${winningTeams[d][1]}.png`)
          .attr("x", d => xScale(d) + (xScale.bandwidth() / 2)) // Center the logo above the tick; adjust as needed
          .attr("y", plotHeight - 45) 
          .attr("width", 40) 
          .attr("height", 40)
          .style("cursor", "pointer")
          .on("click", function(d) {
            const clickedSeason = d3.select(this).datum();
            handleSeasonClick(clickedSeason);
          });

      // Calculate the x-coordinate of the selected season
      const seasonX = xScale(season);
      // Find the centering offset, which is half of the timeline viewport width
      const centerOffset = viewportWidth / 2 - seasonWidth / 2;
      // Set the scroll position
      smoothScrollTo(svgRef.current.parentElement, seasonX - centerOffset, 200);

    }, [season, seasons, winningTeams, onSeasonClick, totalWidth]);

    return (
      <div className="svg-container">
        <svg ref={svgRef} width={totalWidth} height="10vh"></svg>
      </div>
    );
};

export default SeasonTimeline;