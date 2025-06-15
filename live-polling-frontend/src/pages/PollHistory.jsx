import React, { useEffect, useState } from 'react';
import './PollHistory.css';

const TEACHER_ID = 'teacher'; // Replace with real teacher id if available

const PollHistory = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/polls/history/${TEACHER_ID}`);
        const data = await res.json();
        setPolls(data.polls || []);
      } catch (err) {
        setPolls([]);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  return (
    <div className="poll-history-container">
      <h2>View <span className="bold">Poll History</span></h2>
      {loading ? (
        <div>Loading...</div>
      ) : polls.length === 0 ? (
        <div>No poll history found.</div>
      ) : (
        polls.map((poll, idx) => (
          <div className="poll-history-block" key={poll._id || idx}>
            <div className="poll-history-question">{poll.question}</div>
            <div className="poll-history-results">
              {poll.options.map((opt, i) => {
                const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0) || 1;
                const percent = Math.round((opt.votes / totalVotes) * 100);
                return (
                  <div className="result-bar" key={i}>
                    <span>{opt.text}</span>
                    <div className="bar-outer">
                      <div className="bar-inner" style={{ width: `${percent}%` }} />
                      <span className="bar-label">{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PollHistory; 