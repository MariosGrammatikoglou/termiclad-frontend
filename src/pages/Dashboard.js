import React, { useEffect, useState } from 'react';

function Dashboard({ user, token, onLogout }) {
    const [servers, setServers] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [message, setMessage] = useState('');

    const API_BASE = 'https://termiclad-backend.onrender.com';

    useEffect(() => {
        fetch(`${API_BASE}/api/servers`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setServers(data);
            })
            .catch(err => {
                console.error('Failed to fetch servers:', err);
                onLogout(); // Logout on token failure
            });
    }, [token, onLogout]);

    const handleCreateServer = () => {
        if (!name) return;
        fetch(`${API_BASE}/api/servers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name, description })
        })
            .then(res => res.json())
            .then(data => {
                if (data.server) {
                    setServers([data.server, ...servers]);
                    setName('');
                    setDescription('');
                    setMessage('Server created!');
                } else {
                    setMessage(data.message || 'Error creating server');
                }
            });
    };

    const handleJoinServer = () => {
        if (!inviteCode) return;
        fetch(`${API_BASE}/api/servers/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ inviteCode })
        })
            .then(res => res.json())
            .then(data => {
                if (data.server) {
                    setServers([data.server, ...servers]);
                    setInviteCode('');
                    setMessage('Joined server!');
                } else {
                    setMessage(data.message || 'Error joining server');
                }
            });
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>Welcome, {user.username}</h2>
                <button onClick={onLogout}>Logout</button>
            </div>

            <div className="server-actions">
                <h3>Create Server</h3>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Server name" />
                <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
                <button onClick={handleCreateServer}>Create</button>

                <h3>Join Server</h3>
                <input value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="Invite Code" />
                <button onClick={handleJoinServer}>Join</button>

                {message && <p>{message}</p>}
            </div>

            <div className="server-list">
                <h3>Your Servers</h3>
                {servers.length === 0 ? (
                    <p>You are not in any servers yet.</p>
                ) : (
                    <ul>
                        {servers.map(server => (
                            <li key={server.id}>
                                <strong>{server.name}</strong> — {server.description || 'No description'} <br />
                                Invite Code: {server.invite_code} | Role: {server.role}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
