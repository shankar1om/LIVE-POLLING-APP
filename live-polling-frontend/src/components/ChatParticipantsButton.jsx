import React from 'react';
import './ChatParticipantsButton.css';

const ChatParticipantsButton = ({ onClick }) => (
  <button className="chat-participants-btn" onClick={onClick} aria-label="Open chat and participants">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="var(--primary-3)" />
      <path d="M8 10h8M8 14h5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
);

export default ChatParticipantsButton; 