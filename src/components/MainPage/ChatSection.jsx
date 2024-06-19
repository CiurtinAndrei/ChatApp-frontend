import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "../../css/chatSection.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function ChatSection({ groupId }) {
  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const chatEndRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  const getMessages = async (id) => {
    const url = `http://localhost:32767/api/conversations/messages/${id}`;
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data && response.data.length > 0) {
        setMessages(response.data);
      } else {
        setMessages([]); 
      }
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        console.error('Error fetching messages:', error.response ? error.response.data : error.message);
        showError('Error fetching messages');
      }
    }
  };

  const showError = (message) => {
    setError(message);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    errorTimeoutRef.current = setTimeout(() => {
      setError(null);
    }, 3000); 
  };

  const savePhoto = async () => {
    if (!selectedPhoto) {
      showError('Please select a photo to upload');
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
        showError('Error uploading photo and sending message');
      }
    };

    reader.readAsDataURL(selectedPhoto);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (newMessageContent.trim() === '') {
      showError('Message content cannot be empty');
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
        setNewMessageContent(''); 
        getMessages(groupId); 
      } catch (error) {
        showError(error.response ? error.response.data.error : error.message);
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
  
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100); 

    return () => clearTimeout(timeoutId);
  }, [messages]);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
    }
  };

 
  useEffect(() => {
    setMessages([]);
  }, [groupId]);

  
  const convertToGMTPlus3 = (utcTimestamp) => {
    const utcDate = new Date(utcTimestamp);
    const gmtPlus3Date = new Date(utcDate.getTime());
    return gmtPlus3Date.toLocaleString();
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1 p-3 chat-section">
        <div className="d-flex flex-column">
          {messages.length > 0 ? messages.map((message, index) => (
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
          )) : <p>No messages in this group yet.</p>}
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
      </div>
      {error && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body">
                {error}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" onClick={() => setError(null)}></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatSection;
