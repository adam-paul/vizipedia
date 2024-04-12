## Statistical Path

This visualization presents an interactive chart of Stanley Cup winners and their statistical success from the 1917-1918 season through to 2022-2023. Visualized is the "statistical path" each team took through the season to end up winning the cup. 

Each numeric stat, e.g. `wins` or `goalsPerGame`, is weighted equally and its value is normalized and scaled relative to other teams, so that each team is ranked from -1 to 1 for that stat. The team who performed worst in a given stat for a particular season will receive a value of -1, while the team that performed best will be assigned a value of +1 for that stat. The rest of the teams will then range proportionally between -1 and +1 relative to their actual performance and rankings.

The transformation is given by the following formula:

$$
X_{\text{{scaled}}} = \frac{{X - X_{\text{{min}}}}}{{X_{\text{{max}}} - X_{\text{{min}}}}}  (\text{{max}} - \text{{min}}) + \text{{min}}
$$

where:
- $X$ is the original statistical value.
- $X_{\text{{min}}}$ is the minimum value of the featured statistic among all teams.
- $X_{\text{{max}}}$ is the maximum value of the featured statistic among all teams.
- $\text{{min}}$ and $\text{{max}}$ are the minimum and maximum values of the desired feature range (in this case, -1 and 1).

This transformation maintains the relative distances between the values, so it doesn't distort the relationships within the data, but it can be sensitive to outliers, since the minimum and maximum values determine the scaling.

The data allow for a path to be plotted from left to right (for readability) such that a perfect season would be represented by a horizontal line across the top of the plot. The x-labels correspond to the stats, and every team's scaled rank for the stat corresponding to any given x-tick is plotted vertically above it. The purpose is not to see the statistics of every team in the league, but rather to get an immediate visualization of how "well" the winning team did that year.  

### Advantages

* Readability
* Gives an at-a-glance understanding of winning team's statistical success for chosen season
* Scaling allows for comprehensive inclusion of stats that typically can't be compared
* Relative distance between statistical values is maintained, ensuring no distortion of data
* Fun

### Drawbacks

* Meaning and insight are largely qualitative, with little quantitative use
* Somewhat arbitrary with respect to which stats are included
* Equal weighting of statistics means there's no differentiation between, say, `wins` and `powerPlayOpportunities` -- one of which has a much more obvious impact on a team's success
* Normalization is sensitive to outliers at the high or low end, since the scaling keys on extrema