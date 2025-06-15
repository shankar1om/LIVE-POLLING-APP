import React, { useEffect, useState } from 'react';
import socket from '../socket';
import { useNavigate } from 'react-router-dom';
import ChatParticipantsButton from '../components/ChatParticipantsButton';
import ChatParticipantsModal from '../components/ChatParticipantsModal';
import './StudentPoll.css';

const STORAGE_KEY = 'live-polling-student-name';

const StudentPoll = () => {
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(60);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const userName = sessionStorage.getItem(STORAGE_KEY) || '';

  useEffect(() => {
    if (!socket.connected) socket.connect();
    // Listen for poll events
    socket.on('poll:started', (pollData) => {
      setPoll(pollData);
      setTimer(pollData.timeLimit || 60);
      setSelected(null);
      setSubmitted(false);
      setShowResults(false);
      setResults([]);
    });
    socket.on('poll:update', (pollData) => {
      setPoll(pollData);
      setResults(pollData.options.map(opt => opt.votes));
    });
    socket.on('poll:ended', (pollData) => {
      setPoll(pollData);
      setShowResults(true);
      setResults(pollData.options.map(opt => opt.votes));
    });
    socket.on('kicked', () => {
      sessionStorage.removeItem(STORAGE_KEY);
      navigate('/kicked');
    });
    socket.on('participants:update', (list) => {
      setParticipants(list);
    });
    socket.on('chat:message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    // Request current poll on mount
    socket.emit('student:join', { name: userName });
    // Clean up
    return () => {
      socket.off('poll:started');
      socket.off('poll:update');
      socket.off('poll:ended');
      socket.off('kicked');
      socket.off('participants:update');
      socket.off('chat:message');
    };
  }, [navigate, userName]);

  useEffect(() => {
    if (timer > 0 && poll && !submitted && !showResults) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && poll && !submitted) {
      setShowResults(true);
    }
  }, [timer, poll, submitted, showResults]);

  const handleSubmit = e => {
    e.preventDefault();
    if (selected !== null && poll && !submitted) {
      setSubmitted(true);
      socket.emit('poll:vote', { optionIndex: selected });
    }
  };

  const handleSendMessage = (text) => {
    const msg = { name: userName, text };
    socket.emit('chat:message', msg);
    setMessages(prev => [...prev, msg]);
  };

  if (!poll) {
    return <div className="student-poll-container">Waiting for the teacher to start a poll...</div>;
  }

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0) || 1;
  const percentResults = poll.options.map(opt => Math.round((opt.votes / totalVotes) * 100));

  return (
    <div className="student-poll-container">
      <div className="poll-header">
        <span className="poll-title">Question</span>
        <span className={`poll-timer${timer <= 10 ? ' danger' : ''}`}>{timer > 0 ? `00:${timer.toString().padStart(2, '0')}` : '00:00'}</span>
      </div>
      <div className="poll-question">{poll.question}</div>
      {!showResults ? (
        <form className="poll-options" onSubmit={handleSubmit}>
          {poll.options.map((opt, idx) => (
            <label key={idx} className={`poll-option${selected === idx ? ' selected' : ''}`}>
              <input
                type="radio"
                name="option"
                value={idx}
                checked={selected === idx}
                onChange={() => setSelected(idx)}
                disabled={submitted}
              />
              <span>{opt.text}</span>
            </label>
          ))}
          <button className="submit-btn" type="submit" disabled={selected === null || submitted}>Submit</button>
        </form>
      ) : (
        <div className="poll-results">
          {poll.options.map((opt, idx) => {
            let resultClass = '';
            if (typeof poll.correctIndex === 'number') {
              if (idx === poll.correctIndex) resultClass = 'correct';
              else if (selected === idx && selected !== poll.correctIndex) resultClass = 'wrong';
            }
            return (
              <div className={`result-bar ${resultClass}`} key={idx}>
                <span>{opt.text}</span>
                <div className="bar-outer">
                  <div className="bar-inner" style={{ width: `${percentResults[idx]}%` }} />
                  <span className="bar-label">{percentResults[idx]}%</span>
                </div>
              </div>
            );
          })}
          <div className="wait-message">Wait for the teacher to ask a new question..</div>
        </div>
      )}
      <ChatParticipantsButton onClick={() => setModalOpen(true)} />
      <ChatParticipantsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        participants={participants}
        messages={messages}
        onSendMessage={handleSendMessage}
        userName={userName}
      />
    </div>
  );
};

export default StudentPoll; 