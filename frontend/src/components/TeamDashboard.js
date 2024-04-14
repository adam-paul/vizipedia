// TeamDashboard.js

import './TeamDashboard.css';

const TeamDashboard = ( {dashboardTitle} ) => {
  return (
    <div className="team-dashboard">
      <h2 className="title">{dashboardTitle}</h2>
      {/* Include team-specific visualizations */}
      {/* ... */}
      <div className="uc-text">
        <center>
          <h3>Under Construction</h3>
          <p>Team dashboard coming soon!</p>
        </center>
      </div>
    </div>
  );
};

export default TeamDashboard;