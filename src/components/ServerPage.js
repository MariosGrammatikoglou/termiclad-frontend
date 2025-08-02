import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const ServerPage = ({ token }) => {
    const { serverId } = useParams();  // Get the server ID from the URL
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Initialize Socket.IO connection
        const socket = io('https://termiclad-backend.onrender.com', {
            transports: ['websocket'],
            auth: { token },
        });

        // Listen for new messages from the server
        socket.on('new_message', (newMsg) => {
            setMessages((prevMessages) => [...prevMessages, newMsg]);
        });

        // Join the room for the server
        socket.emit('join_room', serverId);

        setSocket(socket);

        return () => {
            socket.disconnect();  // Clean up socket when component unmounts
        };
    }, [serverId, token]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() === '') return;

        socket.emit('send_message', {
            senderId: 'currentUserId',  // Replace with actual user ID
            receiverId: serverId,  // In this case, the serverId is the "room"
            message,
        });

        setMessage('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#ff9a8b] via-[#fad0c4] to-[#ffb3c6] p-8">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl max-w-4xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6">Chat for Server {serverId}</h2>

                <div className="h-80 overflow-y-scroll bg-gray-100 p-4 rounded-lg mb-4">
                    {messages.map((msg, index) => (
                        <div key={index} className="mb-4">
                            <div className="font-semibold">{msg.sender_username}</div>
                            <div>{msg.message}</div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-grow rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <button
                        type="submit"
                        className="bg-purple-500 text-white px-5 rounded-md hover:bg-purple-600 transition"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ServerPage;
