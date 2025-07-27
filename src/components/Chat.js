// frontend/src/components/Chat.js
import React, { useState, useEffect, useRef } from 'react';

const API_BASE = 'https://termiclad-backend.onrender.com';

function Chat({ user, token, socket, onLogout }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('new_message', (message) => {
                if (selectedUser &&
                    (message.sender_id === selectedUser.id || message.receiver_id === selectedUser.id)) {
                    setMessages(prev => [...prev, message]);
                }
            });

            socket.on('message_sent', (message) => {
                setMessages(prev => [...prev, message]);
            });

            return () => {
                socket.off('new_message');
                socket.off('message_sent');
            };
        }
    }, [socket, selectedUser]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const usersData = await response.json();
                setUsers(usersData);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/api/messages/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const messagesData = await response.json();
                setMessages(messagesData);
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserSelect = (selectedUser) => {
        setSelectedUser(selectedUser);
        fetchMessages(selectedUser.id);
    };

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim() || !selectedUser) return;

        const messageData = {
            senderId: user.id,
            receiverId: selectedUser.id,
            message: newMessage.trim()
        };

        socket.emit('send_message', messageData);
        setNewMessage('');
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="chat-container">
            {/* Sidebar */}
            <div className="chat-sidebar">
                <div className="sidebar-header">
                    <div className="user-info">
                        <div className="user-avatar">{user.username[0].toUpperCase()}</div>
                        <div>
                            <div className="username">{user.username}</div>
                            <div className="status">Online</div>
                        </div>
                    </div>
                    <button onClick={onLogout} className="logout-button">
                        Logout
                    </button>
                </div>

                <div className="users-list">
                    <h3>Contacts</h3>
                    {users.map(userItem => (
                        <div
                            key={userItem.id}
                            className={`user-item ${selectedUser?.id === userItem.id ? 'active' : ''}`}
                            onClick={() => handleUserSelect(userItem)}
                        >
                            <div className="user-avatar">
                                {userItem.username[0].toUpperCase()}
                            </div>
                            <div className="user-details">
                                <div className="username">{userItem.username}</div>
                                <div className={`status ${userItem.is_online ? 'online' : 'offline'}`}>
                                    {userItem.is_online ? 'Online' : 'Offline'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="chat-main">
                {selectedUser ? (
                    <>
                        <div className="chat-header">
                            <div className="chat-user-info">
                                <div className="user-avatar">
                                    {selectedUser.username[0].toUpperCase()}
                                </div>
                                <div>
                                    <div className="username">{selectedUser.username}</div>
                                    <div className={`status ${selectedUser.is_online ? 'online' : 'offline'}`}>
                                        {selectedUser.is_online ? 'Online' : 'Offline'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="messages-container">
                            {loading ? (
                                <div className="loading">Loading messages...</div>
                            ) : messages.length > 0 ? (
                                messages.map(message => (
                                    <div
                                        key={message.id}
                                        className={`message ${message.sender_id === user.id ? 'sent' : 'received'}`}
                                    >
                                        <div className="message-content">
                                            {message.message}
                                        </div>
                                        <div className="message-time">
                                            {formatTime(message.timestamp)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-messages">
                                    No messages yet. Start the conversation!
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={sendMessage} className="message-form">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="message-input"
                            />
                            <button type="submit" className="send-button">
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <h2>Welcome to Termiclad!</h2>
                        <p>Select a contact to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;