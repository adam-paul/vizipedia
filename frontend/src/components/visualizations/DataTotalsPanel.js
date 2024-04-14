// DataTotalsPanel.js

import React, { useState, useEffect } from 'react';
import './DataTotalsPanel.css';

const useCountUpAnimation = (startValue, targetValue) => {
    const [animatedValue, setAnimatedValue] = useState(startValue);
    const duration = 1000; // Duration can be set as a constant inside the hook
    const step = (targetValue - startValue) / (duration / 25); // Calculate step size

    useEffect(() => {
      const interval = setInterval(() => {
        setAnimatedValue(prevValue => {
          const nextValue = prevValue + step;
          if ((step > 0 && nextValue < targetValue) || (step < 0 && nextValue > targetValue)) {
            return nextValue;
          } else {
            clearInterval(interval);
            return targetValue;
          }
        });
      }, 25);

      return () => clearInterval(interval);
    }, [targetValue, step]);

    return animatedValue;
};

const DataTotalsPanel = ({ sportName, navigate }) => {
    const [seasonTotal, setSeasonTotal] = useState(100);
    const [teamTotal, setTeamTotal] = useState(50); 
    const [playerTotal, setPlayerTotal] = useState(5000);

    // Fetching data totals from the API
    useEffect(() => {
      fetch(`/api/${sportName.toLowerCase()}/data_totals/`)
        .then(response => response.json())
        .then(data => {
          setSeasonTotal(data.num_seasons);
          setTeamTotal(data.num_teams);
          setPlayerTotal(data.num_players);
        })
        .catch(error => console.log('There was an error fetching data totals:', error));
    }, [sportName]);

    const animatedSeasonTotal = useCountUpAnimation(0, seasonTotal); 
    const animatedTeamTotal = useCountUpAnimation(0, teamTotal); 
    const animatedPlayerTotal = useCountUpAnimation(0, playerTotal);

    return (
      <div className="nhl-dashboard">
        <div className="panel" onClick={() => navigate(`/${sportName.toLowerCase()}/season/`)}>
          <div className="panel-description">
            <h2>Season Dashboard</h2>
            <h3>{Math.round(animatedSeasonTotal)} Seasons</h3>
            <p>Explore detailed season statistics</p>
          </div>
        </div>
        <div className="panel" onClick={() => navigate(`/${sportName.toLowerCase()}/team/`)}>
          <div className="panel-description">
            <h2>Team Dashboard</h2>
            <h3>{Math.round(animatedTeamTotal)} Teams</h3>
            <p>Deep dive into team performance</p>
          </div>
        </div>
        <div className="panel" onClick={() => navigate(`/${sportName.toLowerCase()}/player/`)}>
          <div className="panel-description">
            <h2>Player Dashboard</h2>
            <h3>{Math.round(animatedPlayerTotal)} Players</h3>
            <p>Analyze player stats and trends</p>
          </div>
        </div>
      </div>
    );
};

export default DataTotalsPanel;