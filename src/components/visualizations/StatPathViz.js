import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const StatPathViz = ({ finalData, winningTeam, statCols }) => {
    const svgRef = useRef();  // Create a reference for the SVG element

    useEffect(() => {
      const svg = d3.select(svgRef.current);
      
      // Clear the previous SVG content
      svg.selectAll("*").remove();

      if (finalData.length > 0 && statCols.length > 0) {
        // Add D3 visualization logic here, using finalData, winningTeam, and statCols
        
        const xScale = d3.scaleLinear()
                         .domain([0, finalData.length - 1])
                         .range([0, 300]);
        
        const yScale = d3.scaleLinear()
                         .domain([-1, 1])
                         .range([300, 0]);

        const circles = svg.selectAll("circle")
                            .data(finalData)
                            .enter()
                            .append("circle");

        circles.attr("cx", (d, i) => xScale(i))
               .attr("cy", d => yScale(d[statCols[0]]))
               .attr("r", 5)
               .attr("fill", d => winningTeam === d.team_id ? "red" : "blue");
      }

    }, [finalData, winningTeam, statCols]); // Re-run this effect when finalData, winningTeam, or statCols changes

    return <svg ref={svgRef} width="400" height="400"></svg>;
};

export default StatPathViz;