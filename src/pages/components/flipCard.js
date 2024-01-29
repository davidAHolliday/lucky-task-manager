import { Card } from '@mui/material';
import React from 'react';
import AutorenewIcon from '@mui/icons-material/Autorenew';

export const FlipCardComponent = ({ children, flipTrigger, side, setFlipTrigger, index }) => {
  return (
    <div className="card-container" style={{ perspective: '1000px' }}>
      <div
        className="card"
        style={{
          transform: flipTrigger ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition:  '0.5s',
          transformStyle: 'preserve-3d' ,
        }}
      >
        {children}
      </div>
      <div style={{ width: '100%', backgroundColor: 'grey', pointerEvents: 'auto' }} className="flip-button-container">
        <span style={{ marginLeft: '10px' }}><AutorenewIcon onClick={() => setFlipTrigger((prev) => ({ ...prev, [index]: !prev[index] }))}/></span>
      </div>
    </div>
  );
};

export const FrontCard = ({ children }) => (
  <div style={{ marginBottom: '20px' }} className="front-card">
    <div>{children}</div>
  </div>
);

export const BackCard = ({ children }) => (
  <div className="back-card">
    <div style={{ transform: 'rotateY(180deg)' }}>{children}</div>
  </div>
);
