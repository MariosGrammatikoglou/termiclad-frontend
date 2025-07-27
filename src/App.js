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
    <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl max-w-lg w-full shadow-2xl">
        <h1 className="text-5xl font-bold mb-5 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          Termiclad
        </h1>
        <p className="text-xl mb-8 opacity-90 leading-relaxed">
          Experience the best chat application on your desktop and mobile devices
        </p>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">
            Download Termiclad App
          </h2>

          {/* Desktop Download Button */}
          <div className="mb-4">
            <a
              href="#"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl m-1"
            >
              🖥️ Download for Desktop (.exe)
            </a>
          </div>

          {/* Play Store Button (for future) */}
          <div className="mb-4">
            <a
              href="#"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl m-1"
            >
              📱 Get on Play Store (Coming Soon)
            </a>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl mt-6">
          <h3 className="text-xl font-semibold mb-4">Why Download?</h3>
          <ul className="text-left space-y-3 list-none">
            <li className="flex items-center">
              <span className="mr-3">✨</span>
              <span>Better performance</span>
            </li>
            <li className="flex items-center">
              <span className="mr-3">🔔</span>
              <span>Native notifications</span>
            </li>
            <li className="flex items-center">
              <span className="mr-3">🚀</span>
              <span>Faster loading times</span>
            </li>
            <li className="flex items-center">
              <span className="mr-3">💾</span>
              <span>Offline capabilities</span>
            </li>
          </ul>
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