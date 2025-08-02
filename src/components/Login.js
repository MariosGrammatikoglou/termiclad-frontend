import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://termiclad-backend.onrender.com';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await fetch(`${API_BASE}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Login failed');
            }
            const data = await res.json();
            onLogin(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-5">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg p-10 shadow-xl max-w-md w-full space-y-6"
            >
                <h2 className="text-3xl font-bold text-center text-purple-700">Login</h2>
                {error && <p className="text-red-600 font-semibold">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition"
                >
                    Log In
                </button>

                <p className="text-center text-gray-600">
                    Don't have an account?{' '}
                    <a href="/register" className="text-purple-600 hover:underline">
                        Register here
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Login;
