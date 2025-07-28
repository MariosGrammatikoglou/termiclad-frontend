// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import Dashboard from './pages/Dashboard';

const API_BASE = 'https://termiclad-backend.onrender.com';

// Function to detect if running on Vercel
const isRunningOnVercel = () => {
  const hostname = window.location.hostname;

  // Option 1: Only Vercel domains (recommended)
  const isVercelDomain = hostname.includes('vercel.app') ||
    hostname.includes('vercel.com');

  return isVercelDomain;
};

const BuildingPage = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
      <div className="bg-white/10 backdrop-blur-lg p-12 rounded-3xl max-w-2xl w-full shadow-2xl border border-white/20">
        <div className="mb-8 relative">
          <div className="text-8xl mb-4 animate-bounce">🏗️</div>
          <div className="absolute -top-2 -right-2 text-4xl animate-spin">⚙️</div>
        </div>
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">Termiclad</h1>
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-4 text-yellow-300">🚧 Under Construction 🚧</h2>
          <p className="text-xl opacity-90 leading-relaxed mb-4">We're building something amazing for you{dots}</p>
          <p className="text-lg opacity-80">Mao is working hard to bring you the best chat experience</p>
        </div>
        <div className="mb-8">
          <div className="bg-white/20 rounded-full h-4 mb-3 overflow-hidden">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full animate-pulse" style={{ width: '75%' }}></div>
          </div>
          <p className="text-sm opacity-75">Building Progress: 75%</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl mb-8">
          <h3 className="text-2xl font-semibold mb-6 text-cyan-300">🔥 What's Coming Soon</h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="flex items-center space-x-3"><span className="text-2xl">💬</span><span className="text-lg">Real-time messaging</span></div>
            <div className="flex items-center space-x-3"><span className="text-2xl">🎨</span><span className="text-lg">Beautiful UI/UX</span></div>
            <div className="flex items-center space-x-3"><span className="text-2xl">🔒</span><span className="text-lg">Secure encryption</span></div>
            <div className="flex items-center space-x-3"><span className="text-2xl">📱</span><span className="text-lg">Mobile & desktop apps</span></div>
            <div className="flex items-center space-x-3"><span className="text-2xl">🎵</span><span className="text-lg">Voice & video calls</span></div>
            <div className="flex items-center space-x-3"><span className="text-2xl">⚡</span><span className="text-lg">Lightning fast</span></div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-2xl mb-8">
          <h3 className="text-xl font-semibold mb-4 text-pink-300">📅 Expected Launch</h3>
          <p className="text-2xl font-bold text-yellow-300">Coming Very Soon!</p>
          <p className="text-sm opacity-75 mt-2">Follow us for updates and be the first to know when we launch</p>
        </div>
        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-sm opacity-60">Thank you for your patience • Built with ❤️ by the Termiclad Mao</p>
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
    return <BuildingPage />;
  }

  if (user && token) {
    return <Dashboard user={user} token={token} onLogout={handleLogout} />;
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
