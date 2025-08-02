import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Create axios instance with backend base URL
const api = axios.create({
    baseURL: 'http://localhost:5000',  // <-- your backend port
});

const Dashboard = ({ user, token, socket, onLogout }) => {
    const [servers, setServers] = useState([]);
    const [newServerName, setNewServerName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !token) return;

        const fetchServers = async () => {
            try {
                const res = await api.get('/api/servers', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setServers(res.data.servers);
            } catch (err) {
                console.error('Failed to fetch servers', err);
                setError('Failed to fetch servers. Please try again.');
            }
        };

        fetchServers();
    }, [user, token]);

    const handleCreateServer = async (e) => {
        e.preventDefault();
        if (!newServerName.trim()) return;

        try {
            setIsCreating(true);
            setError(null);

            const res = await api.post(
                '/api/create-server',
                { name: newServerName },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setServers((prev) => [...prev, res.data.server]);
            setNewServerName('');
        } catch (err) {
            console.error('Failed to create server:', err);
            setError('Failed to create server. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#ff9a8b] via-[#fad0c4] to-[#ffb3c6] p-8">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl max-w-4xl mx-auto">
                <div className="flex flex-col items-center">
                    <div className="flex justify-between w-full mb-6">
                        <h1 className="text-4xl font-bold text-gray-800">
                            Welcome to Termiclad, {user ? user.name : 'User'}!
                        </h1>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="w-full max-w-xl">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Servers</h2>
                        {servers.length === 0 ? (
                            <p className="text-gray-600 mb-4">You have no servers yet. Create one below!</p>
                        ) : (
                            <ul className="mb-6 space-y-3">
                                {servers.map((server) => (
                                    <li
                                        key={server.id}
                                        className="bg-purple-200 text-purple-900 px-4 py-3 rounded-lg font-semibold"
                                    >
                                        {server.name}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <form onSubmit={handleCreateServer} className="flex space-x-3">
                            <input
                                type="text"
                                placeholder="New server name"
                                value={newServerName}
                                onChange={(e) => setNewServerName(e.target.value)}
                                className="flex-grow rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                disabled={isCreating}
                            />
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="bg-purple-500 text-white px-5 rounded-md hover:bg-purple-600 transition disabled:opacity-50"
                            >
                                {isCreating ? 'Creating...' : 'Create'}
                            </button>
                        </form>

                        {error && <p className="mt-3 text-red-600 font-semibold">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
