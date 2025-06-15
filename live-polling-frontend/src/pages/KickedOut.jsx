import React from 'react';
import './KickedOut.css';

const KickedOut = () => (
  <div className="kicked-out-container">
    <div className="badge">Intervue Poll</div>
    <div className="kicked-box">
      <h2>You've been <span className="bold">Kicked out !</span></h2>
      <p>Looks like the teacher has removed you from the poll system. Please try to join again later.</p>
    </div>
  </div>
);

export default KickedOut; 