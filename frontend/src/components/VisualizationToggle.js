// src/components/VisualizationToggle.js
import React from 'react';

const VisualizationToggle = ({ visualizations, currentVisualization, setCurrentVisualization }) => {
  return (
    <div>
      {visualizations.map((viz, index) => (
        <button
          key={index}
          onClick={() => setCurrentVisualization(viz)}
          style={{ fontWeight: currentVisualization === viz ? 'bold' : 'normal' }}
        >
          {viz}
        </button>
      ))}
    </div>
  );
};

export default VisualizationToggle;
