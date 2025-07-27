// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import './App.css';

const API_BASE = 'https://termiclad-backend.onrender.com';

// Function to detect if running on Vercel
const isRunningOnVercel = () => {
  const hostname = window.location.hostname;

  // Option 1: Only Vercel domains (recommended)
  const isVercelDomain = hostname.includes('vercel.app') ||
    hostname.includes('vercel.com');

  // Option 2: If you want to include your specific www domain
  // const isYourWebDomain = hostname === 'www.termiclad.com' || hostname === 'termiclad.com';

  // Option 3: If you want ALL www domains (current behavior)
  // const isAnyWwwDomain = hostname.startsWith('www.');

  return isVercelDomain;
  // return isVercelDomain || isYourWebDomain; // Use this if you have a custom domain
  // return isVercelDomain || isAnyWwwDomain; // Use this for ALL www domains
};

// Component to show download message
const DownloadPage = () => {
  return (
    <div className="App">
      <div className="download-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '40px',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: 'bold' }}>
            Termiclad
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: '0.9' }}>
            Experience the best chat application on your desktop and mobile devices
          </p>

          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
              Download Termiclad App
            </h2>

            {/* Desktop Download Button */}
            <div style={{ marginBottom: '15px' }}>
              <a
                href="#"
                style={{
                  display: 'inline-block',
                  background: '#4CAF50',
                  color: 'white',
                  padding: '15px 30px',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s',
                  margin: '5px'
                }}
                onMouseOver={(e) => e.target.style.background = '#45a049'}
                onMouseOut={(e) => e.target.style.background = '#4CAF50'}
              >
                📱 Download for Desktop (.exe)
              </a>
            </div>

            {/* Play Store Button (for future) */}
            <div style={{ marginBottom: '15px' }}>
              <a
                href="#"
                style={{
                  display: 'inline-block',
                  background: '#FF6B35',
                  color: 'white',
                  padding: '15px 30px',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s',
                  margin: '5px'
                }}
                onMouseOver={(e) => e.target.style.background = '#e55a2b'}
                onMouseOut={(e) => e.target.style.background = '#FF6B35'}
              >
                📱 Get on Play Store (Coming Soon)
              </a>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '10px',
            marginTop: '20px'
          }}>
            <h3 style={{ marginBottom: '15px' }}>Why Download?</h3>
            <ul style={{
              textAlign: 'left',
              listStyle: 'none',
              padding: '0',
              margin: '0'
            }}>
              <li style={{ marginBottom: '10px' }}>✨ Better performance</li>
              <li style={{ marginBottom: '10px' }}>🔔 Native notifications</li>
              <li style={{ marginBottom: '10px' }}>🚀 Faster loading times</li>
              <li style={{ marginBottom: '10px' }}>💾 Offline capabilities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  // Check if running on Vercel - do this after all hooks
  if (isRunningOnVercel()) {
    return <DownloadPage />;
  }

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