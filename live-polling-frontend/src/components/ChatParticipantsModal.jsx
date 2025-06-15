import React, { useState, useRef, useEffect } from 'react';
import './ChatParticipantsModal.css';

const ChatParticipantsModal = ({ open, onClose, participants = [], onKick, messages = [], onSendMessage, userName }) => {
  const [tab, setTab] = useState('chat');
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && tab === 'chat' && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, tab]);

  if (!open) return null;
  return (
    <div className="chat-modal-backdrop" onClick={onClose}>
      <div className="chat-modal" onClick={e => e.stopPropagation()}>
        <div className="chat-modal-header">
          <button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>Chat</button>
          <button className={tab === 'participants' ? 'active' : ''} onClick={() => setTab('participants')}>Participants</button>
          <button className="close-btn" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <div className="chat-modal-content">
          {tab === 'chat' ? (
            <div className="chat-tab">
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="chat-tab-placeholder">No messages yet.</div>
                ) : (
                  messages.map((msg, idx) => (
                    <div className={`chat-message${msg.name === userName ? ' self' : ''}`} key={idx}>
                      <span className="chat-message-name">{msg.name}:</span> <span>{msg.text}</span>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <form className="chat-input-row" onSubmit={e => {
                e.preventDefault();
                if (input.trim()) {
                  onSendMessage(input.trim());
                  setInput('');
                }
              }}>
                <input
                  className="chat-input"
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type a message..."
                  autoFocus={tab === 'chat'}
                />
                <button className="chat-send-btn" type="submit" disabled={!input.trim()}>Send</button>
              </form>
            </div>
          ) : (
            <div className="participants-list">
              {participants.length === 0 ? (
                <div className="participants-tab-placeholder">No participants yet.</div>
              ) : (
                participants.map((p, idx) => (
                  <div className="participant-row" key={p.id || idx}>
                    <span className="participant-name">{p.name}</span>
                    {onKick && (
                      <button className="kick-btn" onClick={() => onKick(p.id)}>Kick out</button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatParticipantsModal; 