import { Card } from '@mui/material';
import React from 'react';
import AutorenewIcon from '@mui/icons-material/Autorenew';

export const FlipCardComponent = ({ children, flipTrigger, side, setFlipTrigger, index }) => {
  return (
    <div className="card" style={{ marginTop: '60px', transition: 'transform 0.5s', transformStyle: 'preserve-3d' }}>
      <div
        className="content"
        style={{
          transition: flipTrigger ? '0.5s' : '',
          transform: flipTrigger ? 'rotateY(0deg)' : 'rotateY(180deg)',
        }}
      >
        <div className={side} style={{ backfaceVisibility: 'hidden' }}>
          <div
            className={`card-container ${flipTrigger ? 'front' : 'back'}`}
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s',
            }}
          >
            <div className="card" style={{ transform: flipTrigger ? 'rotateY(0deg)' : 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
              {children}
            </div>
          </div>
        </div>
      </div>
      <div style={{width:"100%",backgroundColor:"grey"}}className="flip-button-container">
        <span style={{marginLeft:"10px"}}><AutorenewIcon onClick={() => setFlipTrigger((prev) => ({ ...prev, [index]: !prev[index] }))}/></span>
      </div>
    </div>
  );
};

export const FrontCard = ({ children }) => (
  <div className="">
    <div>{children}</div>
  </div>
);

export const BackCard = ({ children }) => (
  <div className="">
    <div>{children}</div>
  </div>
);
