import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

async function checkLogin() {
  if (localStorage.getItem('token') != null) {
    try {
      const url = "http://localhost:32767/user/tokendata";
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      localStorage.setItem('id', response.data.user.id);
      return response.data.user;
    } catch (error) {
      console.error(error);
      return null;
    }
  } else {
    return null;
  }
}

const ProfileSettings = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const userData = await checkLogin();
      setUser(userData);
    };
  
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="profile-settings p-4 border rounded bg-light d-flex justify-content-center">
      {user ? (
        <div className="text-center">
          <h2 className="mb-4">Welcome, <strong>{user.username}</strong>!</h2>
          <button className="btn btn-primary me-2" onClick={handleLogout}>Log Out</button>
          <Link to="/addfriend" className="btn btn-primary">Add Friend</Link>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4">You are not logged in</p>
          <Link to="/login" className="btn btn-primary">Log In</Link>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
