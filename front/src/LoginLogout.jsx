import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LoginLogout.css';

const LoginLogout = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkedLoginStatus, setCheckedLoginStatus] = useState(false);
  const [messageClass, setMessageClass] = useState('');

  useEffect(() => {
    // Check if the user is already logged in when the component mounts
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/status', {
          withCredentials: true
        });
        if (response.data.loggedIn) {
          setIsLoggedIn(true);
          setMessage('You are already logged in');
          setMessageClass('bold');
          setTimeout(() => setMessageClass(''), 2000); // Remove bold class after 2 seconds
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Set logged-in state to false without logging the 401 error in the console
          setIsLoggedIn(false);
        } else {
          console.error('Error checking login status:', error.response ? error.response.data : error.message);
        }
      } finally {
        setCheckedLoginStatus(true);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      setMessage('You are already logged in');
      setMessageClass('bold');
      setTimeout(() => setMessageClass(''), 2000); // Remove bold class after 2 seconds
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      }, { withCredentials: true });
      console.log('Login response:', response.data);
      setMessage('Login successful');
      setMessageClass('');
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      setMessage('Login failed: ' + (error.response ? error.response.data.message : error.message));
      setMessageClass('bold');
      setTimeout(() => setMessageClass(''), 2000); // Remove bold class after 2 seconds
    }
  };

  const handleLogout = async () => {
    if (!isLoggedIn) {
      setMessage('You are already logged out');
      setMessageClass('bold');
      setTimeout(() => setMessageClass(''), 2000); // Remove bold class after 2 seconds
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/logout', {}, {
        withCredentials: true
      });
      console.log('Logout response:', response.data);
      setMessage('Logout successful');
      setMessageClass('');
      setIsLoggedIn(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage('You are already logged out');
        setMessageClass('bold');
        setTimeout(() => setMessageClass(''), 2000); // Remove bold class after 2 seconds
      } else {
        setMessage('Logout failed: ' + (error.response ? error.response.data.message : error.message));
        setMessageClass('bold');
        setTimeout(() => setMessageClass(''), 2000); // Remove bold class after 2 seconds
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Login/Logout</h1>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Login</button>
      </form>
      <button onClick={handleLogout} className="btn logout-btn">Logout</button>
      {checkedLoginStatus && message && <p className={`message ${messageClass}`}>{message}</p>}
    </div>
  );
};

export default LoginLogout;