import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function ChatSection({ groupId }) {
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const getMessages = async (id) => {
    const url = `http://localhost:32767/api/conversations/messages/${id}`;
    try { 
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    if (groupId) {
      getMessages(groupId);
    }
  }, [groupId]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Cleanup messages when groupId changes
  useEffect(() => {
    setMessages([]);
  }, [groupId]);

  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1 p-3 overflow-auto">
        <div className="d-flex flex-column">
          {messages.length > 0 && messages.map((message, index) => (
            <div
              key={index}
              className={`alert ${message.senderId === 'me' ? 'alert-primary align-self-end' : 'alert-secondary'}`}
            >
              <strong>{message.senderId.username}</strong>: {message.content}
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>
      </div>
      <div className="p-3 border-top">
        <input type="text" className="form-control" placeholder="Scrie un mesaj..." />
      </div>
    </div>
  );
}

export default ChatSection; 