// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import './App.css';

const API_BASE = 'https://termiclad-backend.onrender.com';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentView, setCurrentView] = useState('login');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      // Verify token is still valid
      fetch(`${API_BASE}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (response.ok) {
            const userData = JSON.parse(localStorage.getItem('user'));
            setUser(userData);

            // Initialize socket connection
            const newSocket = io(API_BASE);
            setSocket(newSocket);

            if (userData) {
              newSocket.emit('join_room', userData.id);
            }
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
          }
        })
        .catch(error => {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
        });
    }
  }, [token]);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));

    // Initialize socket connection
    const newSocket = io(API_BASE);
    setSocket(newSocket);
    newSocket.emit('join_room', userData.id);
  };

  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
    }
    setUser(null);
    setToken(null);
    setSocket(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (user && socket) {
    return <Chat user={user} token={token} socket={socket} onLogout={handleLogout} />;
  }

  return (
    <div className="App">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Termiclad</h1>
          <p>Connect and chat with your friends</p>
        </div>

        <div className="auth-tabs">
          <button
            className={currentView === 'login' ? 'active' : ''}
            onClick={() => setCurrentView('login')}
          >
            Login
          </button>
          <button
            className={currentView === 'register' ? 'active' : ''}
            onClick={() => setCurrentView('register')}
          >
            Register
          </button>
        </div>

        {currentView === 'login' ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Register onRegister={handleLogin} />
        )}
      </div>
    </div>
  );
}

export default App;