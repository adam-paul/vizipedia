// TeamDashboard.js

import './PlayerDashboard.css';

const PlayerDashboard = ( {dashboardTitle} ) => {
  return (
    <div className="player-dashboard">
      <h2 className="title">{dashboardTitle}</h2>
      {/* Include player-specific visualizations */}
      {/* ... */}
      <div className="uc-text">
        <center>
          <h3>Under Construction</h3>
          <p>Player dashboard coming soon!</p>
        </center>
      </div>
    </div>
  );
};

export default PlayerDashboard;