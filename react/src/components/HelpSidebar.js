// HelpSidebar.js

import React, { useEffect, useState } from 'react';
import MarkdownWithLatex from '../utils/MarkdownWithLatex';
import './HelpSidebar.css'; 

const HelpSidebar = ({ isOpen, markdownFileName, onClose }) => {
  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    // Construct the path to the Markdown file
    const markdownPath = `/static/${markdownFileName}`;

    // Fetch the Markdown content
    fetch(markdownPath)
      .then(response => response.text())
      .then(text => {
        setMarkdownContent(text);
      })
      .catch(error => console.error('Error fetching markdown content:', error));
  }, [markdownFileName]);

  return (
    <div className={`help-sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>X</button>
      <div className="about">
        <h2>About</h2>
      </div>
      <div className="help-content">
        <MarkdownWithLatex content={markdownContent} />
      </div>
    </div>
  );
};

export default HelpSidebar;