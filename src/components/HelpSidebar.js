// HelpSidebar.js

import React from 'react';
import './HelpSidebar.css'; 

const HelpSidebar = ({ isOpen, content, onClose }) => {
  return (
    <div className={`help-sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>X</button>
      <div className="content">
        {content}
      </div>
    </div>
  );
};

export default HelpSidebar;