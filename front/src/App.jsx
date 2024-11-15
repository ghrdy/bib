import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginLogout from './LoginLogout';
import AdminPanelUsers from './AdminPanelUsers';
import PanelProjects from './PanelProjects';
import './App.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to the Admin Users Test Panel</h1>
      <button onClick={() => navigate('/login')} className="btn">Login/Logout Test</button>
      <button onClick={() => navigate('/admin')} className="btn">Admin Panel</button>
      <button onClick={() => navigate('/projects')} className="btn">Projects Panel</button>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginLogout />} />
        <Route path="/admin" element={<AdminPanelUsers />} />
        <Route path="/projects" element={<PanelProjects />} />
      </Routes>
    </Router>
  );
};

export default App;