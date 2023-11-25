import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './StatPathViz.css';

const StatPathViz = ({ season }) => {
    const svgRef = useRef();  // Create a reference for the SVG element
    const [finalData, setFinalData] = useState([]);
    const [winningTeam, setWinningTeam] = useState('');
    const [statCols, setStatCols] = useState([]);

    // Fetch the stat path data for the selected season
    useEffect(() => {
      // Ensure that a season is selected before fetching
      if (season) {
          const formattedSeason = season.replace('-', ''); // Format the season for API endpoint

          fetch(`/api/nhl/stat_path_preprocess/${formattedSeason}/`)
          .then(response => response.json())
          .then(data => {
              setFinalData(data.final_data);
              setWinningTeam(data.winning_team);
              setStatCols(data.stat_cols);
          })
          .catch(error => console.log('There was an error fetching stat path data:', error));
      }
    }, [season]);

    useEffect(() => {
      const svg = d3.select(svgRef.current);
      const svgWidth = svgRef.current.getBoundingClientRect().width;
      const svgHeight = svgRef.current.getBoundingClientRect().height;
      const margins = { top: 60, right: 20, bottom: 60, left: 50 };
      const plotWidth = svgWidth - margins.left - margins.right;
      const plotHeight = svgHeight - margins.top - margins.bottom;
      
      // Interactive tooltips
      const tooltip = d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);
      
      // Clear the previous SVG content
      svg.selectAll("*").remove();

      if (finalData.length > 0 && statCols.length > 0) {
        // Create the axis scales
        const xScale = d3.scaleBand()
                         .domain(statCols)  // statCols contains the column names
                         .range([0, plotWidth])
                         .padding(0.1);  // This adds some padding between each band for clarity

        const yScale = d3.scaleLinear()
                         .domain([-1.1, 1.1])
                         .range([plotHeight, 0]);

        const colorScale = d3.scaleOrdinal()
                             .domain(finalData.map(d => d.team_id))
                             .range(d3.schemeCategory10);

        // Create the data points and plot them
        finalData.forEach(teamData => {
          statCols.forEach((stat, i) => {
            svg.append("circle")
               .attr("cx", xScale(stat) + xScale.bandwidth() / 2 + margins.left)
               .attr("cy", yScale(teamData[stat]) + margins.top)
               .attr("r", 3)
               .attr("fill", winningTeam === teamData.team_id ? "blue" : colorScale(teamData.team_id))
               .on("mouseover", function(d) {
                 tooltip.transition()
                        .duration(20)
                        .style("opacity", 0.9);
                 tooltip.html(`Team ID: ${teamData.team_id}<br/>Value: ${teamData[stat]}`)
                        .style("left", (d.pageX + 5) + "px")
                        .style("top", (d.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                  tooltip.transition()
                         .duration(50)
                         .style("opacity", 0);
                });
          });
        });

        // Define the winning-team line generator
        const line = d3.line()
                       .x((d, i) => xScale(statCols[i]) + xScale.bandwidth() / 2 + margins.left)
                       .y(d => yScale(d) + margins.top);

        // Get the data for the winning team
        const winningTeamData = finalData.find(team => team.team_id === winningTeam);

        if (winningTeamData) {
          svg.append("path")
              .datum(statCols.map(stat => winningTeamData[stat]))
              .attr("fill", "none")
              .attr("stroke", "blue")
              .attr("stroke-dasharray", "4,4")
              .attr("d", line);
        }

        // Create the X axis
        const xAxis = d3.axisBottom(xScale);

        // Append the X axis to the SVG
        svg.append("g")
           .attr("transform", `translate(${margins.left}, ${plotHeight + margins.top})`)
           .call(xAxis)
           .selectAll("text")
           .attr("dy", ".35em")
           .attr("text-anchor", "end")
           .attr("transform", "rotate(-65)");  // This rotates the x-axis labels for better readability

        // Create the Y axis
        const yAxis = d3.axisLeft(yScale);

        // Append the Y axis to the SVG
        svg.append("g")
           .attr("transform", `translate(${margins.left}, ${margins.top})`)
           .call(yAxis);

        svg.append("text")
           .attr("x", svgWidth / 2)
           .attr("y", margins.top / 2)
           .attr("text-anchor", "middle")
           .attr("font-size", "16px")
           .attr("font-weight", "bold")
           .text(`Stanley Cup winner (${winningTeam}) statistical path for ${season}`);
      }
    }, [finalData, winningTeam, statCols, season]); // Re-run this effect when finalData, winningTeam, statCols, or season changes

    return (
      <div className="stat-window">
        <svg ref={svgRef} width="100%" height="60vh"></svg>
      </div>
    );
};

export default StatPathViz;