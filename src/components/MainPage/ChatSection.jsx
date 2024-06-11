import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function ChatSection({ groupId }) {
  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
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

  const savePhoto = async () => {
    if (!selectedPhoto) {
      setError('Please select a photo to upload');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(",")[1];
      const url = 'http://localhost:32767/api/images/uploadb64';
      const data = {
        image: base64Image,
        fileName: selectedPhoto.name,
      };
      try {
        const response = await axios.post(url, data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        const photoID = response.data.uploadedFileId;

        const messageUrl = 'http://localhost:32767/api/messages/new';
        const requestBody = {
          content: newMessageContent,
          conversationId: groupId,
          mediaId: photoID,
        };

        await axios.post(messageUrl, requestBody, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setNewMessageContent('');
        setSelectedPhoto(null);
        getMessages(groupId);
      } catch (error) {
        console.error('Error uploading photo and sending message:', error.response ? error.response.data : error.message);
      }
    };

    reader.readAsDataURL(selectedPhoto);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (newMessageContent.trim() === '') {
      setError('Message content cannot be empty');
      return;
    }

    if (selectedPhoto) {
      await savePhoto();
    } else {
      const url = 'http://localhost:32767/api/messages/new';
      const requestBody = {
        content: newMessageContent,
        conversationId: groupId,
      };

      try {
        await axios.post(url, requestBody, {
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
              <strong>{message.senderId.username}</strong>
              <div>{message.content}</div>
              {message.mediaId && <img src={`http://localhost:32767/api/images/view/resized/${message.mediaId}`} alt="Message media" className="img-fluid mt-2" />}
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>
      </div>
      <div className="p-3 border-top">
        <form onSubmit={sendMessage} className="d-flex align-items-center">
          <input
            type="text"
            className="form-control"
            placeholder="Scrie un mesaj..."
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="form-control ms-2"
            onChange={(e) => setSelectedPhoto(e.target.files[0])}
          />
          <button type="submit" className="btn btn-primary ms-2">Send</button>
        </form>
        {error && <div className="text-danger mt-2">{error}</div>}
      </div>
    </div>
  );
}

export default ChatSection;