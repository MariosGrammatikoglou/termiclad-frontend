// frontend/src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Dashboard = ({ user }) => {
    const [servers, setServers] = useState([]);
    const navigate = useNavigate(); // Hook for navigating

    useEffect(() => {
        // Fetch real server data here from the backend API
        const fetchServers = async () => {
            try {
                const response = await fetch('https://your-backend-url.com/api/servers', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass the token for authentication
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setServers(data); // Assuming the backend returns an array of servers
                } else {
                    console.error('Failed to fetch servers');
                }
            } catch (error) {
                console.error('Error fetching servers:', error);
            }
        };

        fetchServers(); // Fetch servers on mount
    }, []);

    // Function to handle click on a server
    const handleServerClick = (serverId) => {
        navigate(`/server/${serverId}`); // Navigate to the server details page
    };

    // Navigate to the create server page
    const handleCreateServer = () => {
        navigate('/create-server'); // Assuming there is a route for creating a server
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#ffdfba] via-[#f4c6b1] to-[#f5a7c3] p-8">
            <div className="bg-white/90 p-8 rounded-3xl shadow-2xl max-w-4xl mx-auto">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Pacifico, sans-serif' }}>
                        Welcome to Termiclad, {user ? user.name : 'User'}!
                    </h1>
                    <div className="flex space-x-6 mb-6">
                        <button
                            className="px-6 py-3 bg-gradient-to-r from-[#a6c0fe] to-[#f68084] text-white font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
                            onClick={handleCreateServer} // Navigate to create server page
                        >
                            Create Server
                        </button>
                    </div>

                    {/* List of servers */}
                    <div className="w-full bg-white/90 rounded-xl shadow-xl p-6 space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Servers</h2>
                        {servers.length > 0 ? (
                            <ul className="space-y-4">
                                {servers.map((server) => (
                                    <li
                                        key={server.id}
                                        className="flex justify-between items-center bg-[#f3f4f6] p-4 rounded-xl shadow-md border-2 border-[#f8b9b7] transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
                                        onClick={() => handleServerClick(server.id)} // Add click event to navigate
                                    >
                                        <span className="text-xl font-medium text-gray-800">{server.name}</span>
                                        <button className="px-4 py-2 bg-[#f7a1b5] text-white rounded-lg text-sm transition-all duration-300 ease-in-out transform hover:scale-105">
                                            Chat
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
