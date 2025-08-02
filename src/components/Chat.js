import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Chat = ({ socket }) => {
    const { serverId } = useParams();  // Retrieve serverId from the URL
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (!socket) return;

        // Emit an event to join the server chat room
        socket.emit('join_server', serverId);

        // Listen for new messages in the chat room
        socket.on('receive_message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [socket, serverId]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        socket.emit('send_message', {
            serverId,
            message: newMessage,
        });

        setNewMessage('');
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Server {serverId} Chat</h2>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        <p>{msg}</p>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
