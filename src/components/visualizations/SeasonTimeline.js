// SeasonTimeline.js

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './SeasonTimeline.css';

const SeasonTimeline = ({ season, seasons, onSeasonClick }) => {
    const svgRef = useRef();  // Create a reference for the SVG element
    const seasonWidth = 100; // Width for each season including padding
    const totalWidth = seasons.length * seasonWidth;

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

    useEffect(() => {
        // Check if the data is ready
        if (seasons.length === 0 || !seasons.includes(season)) {
          return;  // Exit the effect early if the data isn't ready
        }

        // Function to handle season selection
        const handleSeasonClick = (newSeason) => {
            if (onSeasonClick) {
              onSeasonClick(newSeason);
            }
          };

        const svg = d3.select(svgRef.current);
        const margins = { top: 20, right: 20, bottom: 20, left: 20 };
        const viewportWidth = svgRef.current.parentElement.clientWidth;

        // Clear the previous SVG content
        svg.selectAll("*").remove();

        // Create the axis scale
        const xScale = d3.scaleBand()
                         .domain(seasons)
                         .range([0, totalWidth])
                         .padding(0.1);

        // Create the X axis
        const xAxis = d3.axisTop(xScale);

        // Append the X axis to the SVG
        svg.append("g")
           .attr("transform", `translate(${margins.left}, ${margins.top})`)
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

        svg.selectAll(".tick")
           .style("cursor", "pointer")
           .on("click", function(d) {
              const selectedSeason = d3.select(this).text();
              handleSeasonClick(selectedSeason);
            });

        // Calculate the x-coordinate of the selected season
        const seasonX = xScale(season);
        // Find the centering offset, which is half of the timeline viewport width
        const centerOffset = viewportWidth / 2 - seasonWidth / 2;
        // Set the scroll position
        // svgRef.current.parentElement.scrollLeft = seasonX - centerOffset;
        smoothScrollTo(svgRef.current.parentElement, seasonX - centerOffset, 200);

    }, [seasons, season, onSeasonClick]);  // Re-run this effect when seasons or the selected season changes

    return (
      <div className="svg-container">
          <svg ref={svgRef} width={totalWidth} height="50%"></svg>
      </div>
    );
};

export default SeasonTimeline;