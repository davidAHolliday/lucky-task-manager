import { Card } from '@mui/material';
import React from 'react';

export const FlipCardComponent = ({ children, flipTrigger, side,setFlipTrigger }) => {
  return (
    <div className="card" style={{ marginTop: '20px', transition: 'transform 0.5s', transformStyle: 'preserve-3d' }}>
        <button onClick={()=>setFlipTrigger(prev=>!prev)}>Flip</button>
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
    </div>
  );
};


export const FrontCard = ({ children }) => (
    <div className='summary'>
      <Card style={{ marginTop: "10px" }}>
        {children}
      </Card>
    </div>
  );

  export const BackCard = ({ children }) => (
    <div className='summary'>
      <Card style={{ marginTop: "10px" }}>
       {children}
      </Card>
    </div>
  );
  
