import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function ChatSection({ groupId }) {
  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [error, setError] = useState(null);
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

  const sendMessage = async (e) => {
    e.preventDefault();

    if (newMessageContent.trim() === '') {
      setError('');
      return;
    }

    const url = 'http://localhost:32767/api/messages/new';
    const requestBody = {
      content: newMessageContent,
      conversationId: groupId, // Assuming the API needs the groupId
    };

    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setNewMessageContent(''); // Clear the input field
      getMessages(groupId); // Refresh messages
    } catch (error) {
      setError(error.response ? error.response.data.error : error.message);
      console.error('Error sending message:', error.response ? error.response.data : error.message);
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
        <form onSubmit={sendMessage} className="d-flex">
          <input
            type="text"
            className="form-control"
            placeholder="Scrie un mesaj..."
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
          />
          <button type="submit" className="btn btn-primary ms-2">Send</button>
        </form>
        {error && <div className="text-danger mt-2">{error}</div>}
      </div>
    </div>
  );
}

export default ChatSection;