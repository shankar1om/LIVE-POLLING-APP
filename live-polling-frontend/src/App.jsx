import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import StudentJoin from './pages/StudentJoin';
import StudentPoll from './pages/StudentPoll';
import TeacherDashboard from './pages/TeacherDashboard';
import KickedOut from './pages/KickedOut';
import PollHistory from './pages/PollHistory';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/student/join" element={<StudentJoin />} />
        <Route path="/student/poll" element={<StudentPoll />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/history" element={<PollHistory />} />
        <Route path="/kicked" element={<KickedOut />} />
        {/* TODO: Add routes for PollHistory */}
      </Routes>
    </Router>
  );
}

export default App;
