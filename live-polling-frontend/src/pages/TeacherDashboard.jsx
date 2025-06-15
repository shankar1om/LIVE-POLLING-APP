import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import ChatParticipantsButton from '../components/ChatParticipantsButton';
import ChatParticipantsModal from '../components/ChatParticipantsModal';
import './TeacherDashboard.css';

const DEFAULT_OPTIONS = ['', ''];

const TeacherDashboard = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [timeLimit, setTimeLimit] = useState(60);
  const [isPollActive, setIsPollActive] = useState(false);
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const navigate = useNavigate();
  const userName = 'Teacher';

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit('teacher:join');
    socket.on('poll:started', (pollData) => {
      setPoll(pollData);
      setIsPollActive(true);
      setResults(null);
    });
    socket.on('poll:update', (pollData) => {
      setPoll(pollData);
      setResults(pollData.options.map(opt => opt.votes));
    });
    socket.on('poll:ended', (pollData) => {
      setPoll(pollData);
      setIsPollActive(false);
      setResults(pollData.options.map(opt => opt.votes));
    });
    socket.on('participants:update', (list) => {
      setParticipants(list);
    });
    socket.on('chat:message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => {
      socket.off('poll:started');
      socket.off('poll:update');
      socket.off('poll:ended');
      socket.off('participants:update');
      socket.off('chat:message');
    };
  }, []);

  const handleOptionChange = (idx, value) => {
    setOptions(opts => opts.map((opt, i) => (i === idx ? value : opt)));
  };

  const handleAddOption = () => {
    setOptions(opts => [...opts, '']);
  };

  const handleStartPoll = e => {
    e.preventDefault();
    if (question.trim() && options.every(opt => opt.trim())) {
      socket.emit('poll:create', {
        question: question.trim(),
        options: options.map(opt => opt.trim()),
        timeLimit,
        createdBy: 'teacher',
        correctIndex,
      });
      setQuestion('');
      setOptions(DEFAULT_OPTIONS);
      setTimeLimit(60);
      setCorrectIndex(0);
    }
  };

  const handleEndPoll = () => {
    // End poll by setting time to 0 (handled by backend timeout or all students answered)
    // Optionally, you can emit a custom event if backend supports it
    // For now, just wait for backend to emit poll:ended
  };

  const handleKick = (id) => {
    socket.emit('teacher:kick', id);
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const handleSendMessage = (text) => {
    const msg = { name: userName, text };
    socket.emit('chat:message', msg);
    setMessages(prev => [...prev, msg]);
  };

  const totalVotes = poll && poll.options.reduce((sum, opt) => sum + opt.votes, 0) || 1;
  const percentResults = poll ? poll.options.map(opt => Math.round((opt.votes / totalVotes) * 100)) : [];

  // Filter out teacher from participants list for modal
  const studentParticipants = participants.filter(p => p.name !== 'Teacher');

  return (
    <div className="teacher-dashboard-container">
      <div className="dashboard-header">
        <div className="badge">Intervue Poll</div>
        <button className="history-btn" onClick={() => navigate('/teacher/history')}>View Poll History</button>
      </div>
      <h2>Let's <span className="bold">Get Started</span></h2>
      <p className="subtitle">
        You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
      </p>
      {!isPollActive && !results && (
        <form className="poll-form" onSubmit={handleStartPoll}>
          <label htmlFor="poll-question">Enter your question</label>
          <textarea
            id="poll-question"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            maxLength={100}
            placeholder="Type your question here..."
          />
          <div className="poll-options-edit">
            <span>Edit Options</span>
            {options.map((opt, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="text"
                  value={opt}
                  onChange={e => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  maxLength={40}
                />
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctIndex === idx}
                  onChange={() => setCorrectIndex(idx)}
                  style={{ marginLeft: 8 }}
                  aria-label="Mark as correct"
                />
                <span style={{ fontSize: 13, color: 'var(--primary-3)' }}>{correctIndex === idx ? 'Correct' : ''}</span>
              </div>
            ))}
            <button type="button" className="add-option-btn" onClick={handleAddOption}>+ Add More option</button>
          </div>
          <div className="poll-timer-edit">
            <label htmlFor="time-limit">Time Limit</label>
            <select id="time-limit" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))}>
              {[30, 45, 60].map(t => (
                <option key={t} value={t}>{t} seconds</option>
              ))}
            </select>
          </div>
          <button className="ask-question-btn" type="submit" disabled={!question.trim() || options.some(opt => !opt.trim())}>
            Ask Question
          </button>
        </form>
      )}
      {isPollActive && poll && !results && (
        <div className="poll-live">
          <div className="poll-question">{poll.question}</div>
          <div className="poll-options-list">
            {poll.options.map((opt, idx) => (
              <div className="poll-option-view" key={idx}>{opt.text}</div>
            ))}
          </div>
          <div className="poll-timer-edit">
            <span>Time Left: {poll.timeLimit ? poll.timeLimit + 's' : ''}</span>
          </div>
          <button className="end-poll-btn" onClick={handleEndPoll}>End Poll</button>
        </div>
      )}
      {results && poll && (
        <div className="poll-results">
          {poll.options.map((opt, idx) => (
            <div className="result-bar" key={idx}>
              <span>{opt.text}</span>
              <div className="bar-outer">
                <div className="bar-inner" style={{ width: `${percentResults[idx]}%` }} />
                <span className="bar-label">{percentResults[idx]}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <ChatParticipantsButton onClick={() => setModalOpen(true)} />
      <ChatParticipantsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        participants={studentParticipants}
        onKick={handleKick}
        messages={messages}
        onSendMessage={handleSendMessage}
        userName={userName}
      />
    </div>
  );
};

export default TeacherDashboard; 