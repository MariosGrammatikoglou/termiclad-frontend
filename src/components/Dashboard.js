// frontend/src/components/Dashboard.js
import React, { useState, useEffect } from 'react';

// Mock data for servers (for now, can be replaced by actual data)
const mockServers = [
    { id: 1, name: 'Termiclad Devs' },
    { id: 2, name: 'React Enthusiasts' },
    { id: 3, name: 'NodeJS Hangout' },
];

const Dashboard = ({ user }) => {
    // State for storing servers user is part of
    const [servers, setServers] = useState(mockServers); // Replace with API call to get user servers

    useEffect(() => {
        // You can fetch real server data here when API is ready
        // For now, we're using mock data
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#ff9a8b] via-[#fad0c4] to-[#ffb3c6] p-8">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl max-w-4xl mx-auto">
                <div className="flex flex-col items-center">
                    {/* Welcome Message */}
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to Termiclad, {user ? user.name : 'User'}!</h1>

                    <p className="text-xl text-gray-600 mb-4">
                        Explore your servers, connect with friends, and start chatting!
                    </p>

                    {/* Buttons */}
                    <div className="flex space-x-6 mb-6">
                        <button className="px-6 py-3 bg-gradient-to-r from-[#a6c0fe] to-[#f68084] text-white font-semibold rounded-full shadow-md transition transform hover:scale-105">
                            Join Server
                        </button>
                        <button className="px-6 py-3 bg-gradient-to-r from-[#f6d365] to-[#fda085] text-white font-semibold rounded-full shadow-md transition transform hover:scale-105">
                            Create Server
                        </button>
                    </div>

                    {/* Server List */}
                    <div className="w-full bg-white/90 rounded-xl shadow-lg p-6 space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Servers</h2>

                        {/* Render a list of servers the user is part of */}
                        {servers.length > 0 ? (
                            <ul className="space-y-4">
                                {servers.map((server) => (
                                    <li key={server.id} className="flex justify-between items-center bg-[#f3f4f6] p-4 rounded-xl shadow-md">
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
