import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ user }) => {
    const [servers, setServers] = useState([]);
    const [newServerName, setNewServerName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);

    // Fetch servers for user on mount
    useEffect(() => {
        if (!user) return;
        const fetchServers = async () => {
            try {
                const res = await axios.get(`/api/servers?userId=${user.id}`);
                setServers(res.data.servers); // Adjust based on your API response
            } catch (err) {
                console.error('Failed to fetch servers', err);
            }
        };
        fetchServers();
    }, [user]);

    // Handle create server submit
    const handleCreateServer = async (e) => {
        e.preventDefault();
        if (!newServerName.trim()) return;

        try {
            setIsCreating(true);
            setError(null);

            const res = await axios.post('/api/servers', {
                name: newServerName,
                createdById: user.id,
            });

            setServers((prev) => [...prev, res.data.server]); // append new server
            setNewServerName('');
        } catch (err) {
            console.error(err);
            setError('Failed to create server');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#ff9a8b] via-[#fad0c4] to-[#ffb3c6] p-8">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl max-w-4xl mx-auto">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">
                        Welcome to Termiclad, {user ? user.name : 'User'}!
                    </h1>

                    <p className="text-xl text-gray-600 mb-4">
                        Explore your servers, connect with friends, and start chatting!
                    </p>

                    {/* Create Server Form */}
                    <form onSubmit={handleCreateServer} className="mb-6 flex space-x-4">
                        <input
                            type="text"
                            placeholder="New server name"
                            value={newServerName}
                            onChange={(e) => setNewServerName(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            disabled={isCreating}
                        />
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="px-6 py-3 bg-gradient-to-r from-[#f6d365] to-[#fda085] text-white font-semibold rounded-full shadow-md transition transform hover:scale-105 disabled:opacity-50"
                        >
                            {isCreating ? 'Creating...' : 'Create Server'}
                        </button>
                    </form>
                    {error && <p className="text-red-600 mb-4">{error}</p>}

                    {/* Server List */}
                    <div className="w-full bg-white/90 rounded-xl shadow-lg p-6 space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Servers</h2>

                        {servers.length > 0 ? (
                            <ul className="space-y-4">
                                {servers.map((server) => (
                                    <li
                                        key={server.id}
                                        className="flex justify-between items-center bg-[#f3f4f6] p-4 rounded-xl shadow-md"
                                    >
                                        <span className="text-xl font-medium text-gray-800">{server.name}</span>
                                        <button className="px-4 py-2 bg-[#6c5ce7] text-white rounded-lg text-sm transition transform hover:scale-105">
                                            View
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-lg text-gray-600">You are not part of any servers yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
