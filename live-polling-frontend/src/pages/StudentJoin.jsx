import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import './StudentJoin.css';

const STORAGE_KEY = 'live-polling-student-name';

const StudentJoin = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if name exists in sessionStorage (unique per tab)
    const savedName = sessionStorage.getItem(STORAGE_KEY);
    if (savedName) {
      setName(savedName);
      navigate('/student/poll');
    }
    // Clean up socket on unmount
    return () => {
      if (socket.connected) socket.disconnect();
    };
  }, [navigate]);

  const handleContinue = (e) => {
    e.preventDefault();
    if (name.trim()) {
      sessionStorage.setItem(STORAGE_KEY, name.trim());
      // Connect and emit join event
      if (!socket.connected) socket.connect();
      socket.emit('student:join', { name: name.trim() });
      navigate('/student/poll');
    }
  };

  return (
    <div className="student-join-container">
      <div className="badge">Intervue Poll</div>
      <h2>Let's <span className="bold">Get Started</span></h2>
      <p className="subtitle">
        If you're a student, you'll be able to <b>submit your answers</b>, participate in live polls, and see how your responses compare with your classmates
      </p>
      <form className="student-join-form" onSubmit={handleContinue}>
        <label htmlFor="student-name">Enter your Name</label>
        <input
          id="student-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your Name"
          autoFocus
        />
        <button type="submit" className="continue-btn" disabled={!name.trim()}>
          Continue
        </button>
      </form>
    </div>
  );
};

export default StudentJoin; 