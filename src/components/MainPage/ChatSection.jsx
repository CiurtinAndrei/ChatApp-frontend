import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "../../css/chatSection.css";

function ChatSection({ groupId }) {
  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
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
        setShowPhotoUpload(false);
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
      setError('');
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
    // Scroll to the bottom after a short delay to allow messages to render
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100); // Adjust the delay time as needed

    return () => clearTimeout(timeoutId);
  }, [messages]);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
    }
  };

  // Cleanup messages when groupId changes
  useEffect(() => {
    setMessages([]);
  }, [groupId]);

  // Function to convert UTC timestamp to GMT+3:00
  const convertToGMTPlus3 = (utcTimestamp) => {
    const utcDate = new Date(utcTimestamp);
    const gmtPlus3Date = new Date(utcDate.getTime());
    return gmtPlus3Date.toLocaleString();
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1 p-3 chat-section">
        <div className="d-flex flex-column">
          {messages.length > 0 && messages.map((message, index) => (
            <div
              key={index}
              className={`alert ${message.senderId === 'me' ? 'alert-primary align-self-end' : 'alert-secondary'}`}
            >
              <div className="d-flex justify-content-between align-items-center">
                <strong>{message.senderId.username}</strong>
                <small>{convertToGMTPlus3(message.messageTimestamp)}</small>
              </div>
              <div>{message.content}</div>
              {message.mediaId && <img src={`http://localhost:32767/api/images/view/resized/${message.mediaId}`} alt="Message media" className="img-fluid mt-2" />}
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>
      </div>
      <div className="p-3 border-top position-relative">
        <form onSubmit={sendMessage} className="d-flex align-items-center w-100">
          <input
            type="text"
            className="form-control"
            placeholder="Write a message..."
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
          />
          <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowPhotoUpload(!showPhotoUpload)}>
            Media
          </button>
          <button type="submit" className="btn btn-primary ms-2">Send</button>
        </form>
        {showPhotoUpload && (
          <div className="photo-upload-popup">
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => setSelectedPhoto(e.target.files[0])}
            />
            <button type="button" className="btn btn-secondary mt-2" onClick={savePhoto}>Upload Photo</button>
          </div>
        )}
        {error && <div className="text-danger mt-2">{error}</div>}
      </div>
    </div>
  );
}

export default ChatSection;
