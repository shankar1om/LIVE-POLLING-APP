import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="role-selection-container">
      <div className="badge">Intervue Poll</div>
      <h2>Welcome to the <span className="bold">Live Polling System</span></h2>
      <p className="subtitle">Please select the role that best describes you to begin using the live polling system</p>
      <div className="role-cards">
        <div className="role-card" onClick={() => navigate('/student/join')} tabIndex={0}>
          <div className="role-title">I'm a Student</div>
          <div className="role-desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</div>
        </div>
        <div className="role-card" onClick={() => navigate('/teacher')} tabIndex={0}>
          <div className="role-title">I'm a Teacher</div>
          <div className="role-desc">Submit answers and view live poll results in real-time.</div>
        </div>
      </div>
      <button className="continue-btn" disabled>Continue</button>
    </div>
  );
};

export default RoleSelection; 