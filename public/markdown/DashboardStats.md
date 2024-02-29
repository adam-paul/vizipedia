## Season Statistics

This component presents a side-by-side comparison of two chosen statistics for the selected season. Statistics are averaged over all teams, showing a seasonal average for the league. A time series of each chosen average value is generated over all seasons, showing how the statistic has changed with time.

Available statistics: 

* `wins` &ndash; average number of games won across all teams for the selected regular season
  * this statistic is largely meaningless in the context of seasonal averages and is a function solely of games played
  * data begins from the `1917-1918` season
* `losses` &ndash; average number of games lost across all teams for the selected regular season
  * this statistic is largely meaningless in the context of seasonal averages and is a function solely of games played
  * data begins from the `1917-1918` season
* `ot` &ndash; average number of overtime wins across all teams for the selected regular season
  * data begins from the `1999-2000` season
* `pts` &ndash; average "league points" for the season (not player points, but points granted for winning games)
  * this is again just a static average that is not particularly meaningful, effectively tracking games played with negligible variance stemming from differing OT win totals
  * points are assigned as follows:
    * **2 points** for a win
    * **1 point** for an OT/shootout win
    * **0 points** for a loss
  * data begins from the `1917-1918` season
* `pt_pctg` &ndash; I don't know what this is, but it doesn't seem to matter very much
  * data begins from the `1917-1918` season
* `goals_per_game` &ndash; this is the first interesting statistic in this context, showing the average goals per game for the selected season
  * data begins from the `1917-1918` season
* `goals_against_per_game` &ndash; in a sane world, this is the same stat as `goals_per_game`, and yet the `1917-1918` season appears to exist as some kind of Gödel season
  * data begins from the `1917-1918` season
* `ev_ggaratio` &ndash; don't know what this is either
  * data begins from the `1959-1960` season
* `power_play_percentage` &ndash; I think this is the average % likelihood that a team scored during power plays? 
  * data begins from the `1977-1978` season
* `power_play_goals` &ndash; average number of power play goals scored in the selected season
  * data begins from the `1933-1934` season
* `power_play_goals_against` &ndash; the same stat in reverse, this time blessedly unaffected by the fundamental asymmetry introduced by the NHL's first season
  * data begins from the `1933-1934` season
* `power_play_opportunities` &ndash; average power play opportunities in the selected season
  * data begins from the `1977-1978` season
* `penalty_kill_percentage` &ndash; average percentage of penalties killed by teams in the selected season
  * data begins from the `1977-1978` season
* `shots_per_game` &ndash; average shots per game for the selected season
  * data begins from the `1955-1956` season
* `shots_allowed` &ndash; the same stat as above
  * data begins from the `1955-1956` season
* `win_score_first` &ndash; the average likelihood ($0 \leq P(E) \leq 1$) of a team winning after scoring first during the selected season
  * data begins from the `1917-1918` season
* `win_opp_score_first` &ndash; the average likelihood ($0 \leq P(E) \leq 1$) of a team winning after their opponent scores first during the selected season
  * data begins from the `1917-1918` season
* `win_lead_first_per` &ndash; the average likelihood ($0 \leq P(E) \leq 1$) during the selected season of a team winning when leading at the end of the first period
  * data begins from the `1917-1918` season
* `win_lead_second_per` &ndash; the average likelihood ($0 \leq P(E) \leq 1$) during the selected season of a team winning when leading at the end of the second period
  * data begins from the `1917-1918` season
* `win_outshoot_opp` &ndash; the average likelihood ($0 \leq P(E) \leq 1$) of a team winning if they outshot their opponent during the selected season
  * data begins from the `1955-1956` season
* `win_outshot_by_opp` &ndash; the average likelihood ($0 \leq P(E) \leq 1$) of a team winning if they were outshot by their opponent during the selected season
  * data begins from the `1955-1956` season
* `face_offs_taken` &ndash; the average number of face offs a team would take part in during the selected regular season
  * data begins from the `1997-1998` season
* `face_offs_won` &ndash; the average number of face offs won by a team during the selected regular season (identical in shape to `face_offs_taken`)
  * data begins from the `1997-1998` season
* `face_offs_lost` &ndash; the average number of face offs lost by a team during the selected regular season (identical in shape to `face_offs_taken`)
  * data begins from the `1997-1998` season
* `face_off_win_percentage` &ndash; the average face off win percentage during the selected season (this should be nearly exactly 50% every year or else something has gone cosmically wrong)
  * data begins from the `1997-1998` season
* `shooting_pctg` &ndash; average percent chance that a team's shots were converted to goals in the selected season (I think?)
  * data begins from the `1924-1925` season, when apparently nearly every shot was a goal
* `save_pctg` &ndash; average save percentage for the selected season
  * data begins from the `1955-1956` season