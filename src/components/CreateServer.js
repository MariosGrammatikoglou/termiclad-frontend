import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CreateServer = () => {
    const [serverName, setServerName] = useState('');
    const [serverDescription, setServerDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Hook to navigate the user

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!serverName) {
            alert('Server name is required!');
            return;
        }

        setLoading(true);

        try {
            // API call to create the server
            const response = await fetch('https://your-backend-url.com/api/servers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass token for authentication
                },
                body: JSON.stringify({
                    name: serverName,
                    description: serverDescription,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const serverId = data.id; // Assuming the response returns the server ID
                // Server creation successful, redirect to the server details page
                navigate(`/server/${serverId}`);
            } else {
                console.error('Failed to create server');
                alert('Failed to create server. Please try again.');
            }
        } catch (error) {
            console.error('Error creating server:', error);
            alert('An error occurred while creating the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#ffdfba] via-[#f4c6b1] to-[#f5a7c3] p-8">
            <div className="bg-white/90 p-8 rounded-3xl shadow-2xl max-w-4xl mx-auto">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Pacifico, sans-serif' }}>
                        Create a New Server
                    </h1>
                    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
                        <div>
                            <label htmlFor="serverName" className="block text-xl font-medium text-gray-700 mb-2">
                                Server Name
                            </label>
                            <input
                                type="text"
                                id="serverName"
                                value={serverName}
                                onChange={(e) => setServerName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter server name"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="serverDescription" className="block text-xl font-medium text-gray-700 mb-2">
                                Server Description (Optional)
                            </label>
                            <textarea
                                id="serverDescription"
                                value={serverDescription}
                                onChange={(e) => setServerDescription(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter server description"
                            />
                        </div>
                        <div className="flex justify-center mt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-gradient-to-r from-[#a6c0fe] to-[#f68084] text-white font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl disabled:bg-gray-400"
                            >
                                {loading ? 'Creating...' : 'Create Server'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateServer;
