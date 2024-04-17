import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './StatPathViz.css';

const StatPathViz = ({ season, onHelpClick }) => {
    const svgRef = useRef();  // Create a reference for the SVG element
    const [finalData, setFinalData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [winningTeam, setWinningTeam] = useState('');
    const [winningTeamLogo, setWinningTeamLogo] = useState('');
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
            setOriginalData(data.original_data);
            setWinningTeam(data.winning_team);
            setWinningTeamLogo(data.winning_team_logo);
            setStatCols(data.stat_cols);
          })
          .catch(error => console.log('There was an error fetching stat path data:', error));
      }
    }, [season]);

    // Draw and populate the stat path visualization
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
            if (teamData.team_id !== winningTeam) {
              svg.append("circle")
                 .attr("cx", xScale(stat) + xScale.bandwidth() / 2 + margins.left)
                 .attr("cy", yScale(teamData[stat]) + margins.top)
                 .attr("r", 3)
                 .attr("fill", colorScale(teamData.team_id))
            }
          });
        });

        // Define the winning-team line generator
        const line = d3.line()
                       .x((d, i) => xScale(statCols[i]) + xScale.bandwidth() / 2 + margins.left)
                       .y(d => yScale(d) + margins.top);

        // Get the data for the winning team
        const winningTeamData = finalData.find(team => team.team_id === winningTeam);
        console.log("winning team imgur tag: ", winningTeamLogo);

        if (winningTeamData) {
          statCols.forEach((stat, i) => {
            const logoX = xScale(stat) + xScale.bandwidth() / 2 + margins.left - 10;
            const logoY = yScale(winningTeamData[stat]) + margins.top - 10;
        
            svg.append("image")
                .attr("class", "team-logo")
                .attr("href", `https://i.imgur.com/${winningTeamLogo}.png`)
                .attr("x", logoX)
                .attr("y", logoY)
                .attr("width", 20)
                .attr("height", 20)
                .on("mouseover", function(d) {
                  const svgRect = svgRef.current.getBoundingClientRect(); // SVG coords
                  const xPosition = svgRect.left + logoX + 25; 
                  const yPosition = svgRect.top + logoY - 20;
              
                  // Sort finalData based on the normalized value of the hovered stat
                  const sortedTeams = [...finalData].sort((a, b) => b[stat] - a[stat]);
              
                  let tooltipHtml = `<div style="font-size:12px;"><strong>${stat}</strong><ul style="list-style-type: none; padding: 0;">`;
                  sortedTeams.forEach(team => {
                    const teamStatValue = originalData[team.team_id][stat];
                    const isWinningTeam = team.team_id === winningTeam;
                    const listItemStyle = isWinningTeam ? 'font-weight:bold;' : '';
                    tooltipHtml += `<li style="${listItemStyle}">${team.team_id}: ${teamStatValue}</li>`;
                  });
                  tooltipHtml += `</ul></div>`;
              
                  tooltip.transition()
                          .duration(20)
                          .style("opacity", 0.9);
                  tooltip.html(tooltipHtml)
                          .style("left", xPosition + "px")
                          .style("top", yPosition + "px");
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                            .duration(50)
                            .style("opacity", 0);
                });
          });
        }

        if (winningTeamData) {
          svg.append("path")
              .datum(statCols.map(stat => winningTeamData[stat]))
              .attr("fill", "none")
              .attr("stroke", "steelblue")
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
           .attr("class", "stat-title")
           .attr("x", 0)
           .attr("y", margins.top / 2)
           .attr("text-anchor", "left")
           .text(`Cup winner statistical path`);

        const titleText = svg.select('.stat-title');
        const titleTextWidth = titleText.node().getBBox().width;
        const titleX = (margins.left / 2) - 3;
        
        // Drawing the underline for the title text
        const lineLength = titleTextWidth * 1.1; // Extend the line a bit longer than the text
        const lineY = margins.top / 2 + 5; // Position the line slightly below the text

        svg.append('text')
            .attr('class', 'help-icon')
            .attr('x', 0)
            .attr('y', lineY + 17)
            .attr('text-anchor', 'left')
            .text('?') 
            .on('click', function() {
              if (onHelpClick) {
                onHelpClick();
              }
            });

        svg.append('line')
          .attr('x1', -3)
          .attr('y1', lineY)
          .attr('x2', titleX + lineLength)
          .attr('y2', lineY)
          .attr('stroke', 'black')
          .attr('stroke-width', 1);

        // Draw value for "Goals per Game"
        svg.append('text')
          .attr('class', 'stat-title')
          .attr('x', titleX + lineLength - 2) // Right-justified
          .attr('y', lineY + 16) // Below the line
          .attr('text-anchor', 'end')
          .text(`${winningTeam}`);
      }
    }, [finalData, originalData, winningTeam, winningTeamLogo, statCols, season, onHelpClick]);

    return (
      <div className="stat-window">
        <svg ref={svgRef} width="100%" height="60vh"></svg>
      </div>
    );
};

export default StatPathViz;