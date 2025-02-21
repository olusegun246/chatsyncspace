import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";

// Connect to backend socket server
const socket = socketIOClient("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  
  useEffect(() => {
    socket.on("chat message", (msgData) => {
      setMessages((prevMessages) => [...prevMessages, msgData]);
    });

    return () => {
      socket.off("chat message"); 
    };
  }, []);

  // Handle sending message
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Send message to the server with the current input
      socket.emit("chat message", message);
      setMessage(""); 
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        Room Chat
      </div>
      <div className="messages">
        {messages.map((msgData, index) => (
          <div key={index} className={`message ${msgData.user === socket.id ? "mine" : "other"}`}>
            <div className="message-username">{msgData.user}</div>
            <div className="message-text">{msgData.message}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
