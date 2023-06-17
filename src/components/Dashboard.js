// Dashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { select } from 'd3';
import './Dashboard.css';

const Dashboard = ({ sportName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardTitle, setDashboardTitle] = useState(`${sportName} Dashboard Landing Page`);
  const [inputValue, setInputValue] = useState('');
  const [endpoint, setEndpoint] = useState(`/${sportName.toLowerCase()}/`);

  // Define new state and refs for D3 and table names
  const [tableNames, setTableNames] = useState([]);
  const d3Container = useRef(null);

  useEffect(() => {
    console.log(`Fetching data from ${location.pathname}`);
    fetch(`/api${location.pathname}`)

      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(`Received data from server at ${location.pathname}:`, data);
        console.log(`Data type: ${typeof data}`);
        if (Array.isArray(data)) {
          setTableNames(data);
        } else {
          console.log('Non-array data branch triggered');
          if (data.message) {
            console.log('Received a message from the server:', data.message);
            setTableNames([data.message]);
          }
        }
      })
      .catch(error => {
        console.log('There was an error fetching data:', error);
      });
  }, [location.pathname]);

  useEffect(() => {
    // Use D3 to display table names
    if (tableNames.length > 0 && d3Container.current) {
      console.log(`Populating d3 container with table names: ${tableNames}`);
      const svg = select(d3Container.current);
      
      svg.selectAll('text')
        .data(tableNames)
        .join('text')
        .attr('y', (d, i) => `${i * 20}px`)
        .text(d => d);
    }
  }, [tableNames]);

  const handleVizipediaClick = () => {
    navigate('/');
  }

  const handleHomeDataClick = () => {
    navigate(`/${sportName.toLowerCase()}/`);
    setEndpoint(`/${sportName.toLowerCase()}/`);
    setDashboardTitle(`${sportName} Dashboard Landing Page`);
  }

  const handleSeasonalDataClick = () => {
    navigate(`/${sportName.toLowerCase()}/season/`);
    setEndpoint(`/${sportName.toLowerCase()}/season/`);
    setDashboardTitle('Seasonal Data Dashboard');
  }

  const handleTeamDataClick = () => {
    navigate(`/${sportName.toLowerCase()}/team/`);
    setEndpoint(`/${sportName.toLowerCase()}/team/`);
    setDashboardTitle('Team Data Dashboard');
  }

  const handlePlayerDataClick = () => {
    navigate(`/${sportName.toLowerCase()}/player/`);
    setEndpoint(`/${sportName.toLowerCase()}/player/`);
    setDashboardTitle('Player Data Dashboard');
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleInputSubmit = (event) => {
    event.preventDefault();  // Prevent the form from being submitted
    console.log(`User input: ${inputValue}`);
    setInputValue('');  // Clear the input field
  }

  return (
    <div className="container">
      <div className="header">
      <h1 onClick={handleVizipediaClick} style={{ cursor: 'pointer' }}>Vizipedia</h1>
      </div>
      <div className="sidebar">
        <button className="button" onClick={handleHomeDataClick}>{sportName} Home Dashboard</button>
        <button className="button" onClick={handleSeasonalDataClick}>Season Dashboard</button>
        <button className="button" onClick={handleTeamDataClick}>Team Dashboard</button>
        <button className="button" onClick={handlePlayerDataClick}>Player Dashboard</button>
      </div>
      <div className="content">
        <h2>{dashboardTitle}</h2>
        {/* Your D3.js code will go here */}
        <svg ref={d3Container} className="svg-container" />
        <form onSubmit={handleInputSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="...what would you like to see?"
          />
        </form>
      </div>
    </div>
  );
};

export default Dashboard;