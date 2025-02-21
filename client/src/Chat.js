import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Connect to the backend

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  
  useEffect(() => {
    socket.on('receive-message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    
    return () => {
      socket.off('receive-message');
    };
  }, []);

  const sendMessage = () => {
    if (message) {
      socket.emit('send-message', message);
      setMessage('');
    }
  };

  return (
    <div>
      <div>
        <h2>Chat Room</h2>
        <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc' }}>
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
