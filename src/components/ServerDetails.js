import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Use useParams to get the server ID

const ServerDetails = () => {
    const { id } = useParams(); // Get the server ID from the URL
    const [server, setServer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServerDetails = async () => {
            try {
                const response = await fetch(`https://your-backend-url.com/api/servers/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setServer(data);
                } else {
                    console.error('Failed to fetch server details');
                    alert('Failed to load server details.');
                }
            } catch (error) {
                console.error('Error fetching server details:', error);
                alert('An error occurred while fetching server details.');
            } finally {
                setLoading(false);
            }
        };

        fetchServerDetails();
    }, [id]); // Re-fetch when the server ID changes

    if (loading) return <div>Loading...</div>;

    if (!server) return <div>Server not found.</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#ffdfba] via-[#f4c6b1] to-[#f5a7c3] p-8">
            <div className="bg-white/90 p-8 rounded-3xl shadow-2xl max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">{server.name}</h1>
                <p className="text-xl text-gray-700">{server.description}</p>
            </div>
        </div>
    );
};

export default ServerDetails;
