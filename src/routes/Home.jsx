import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../css/home.css"; // Ensure you have a CSS file for styling

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

const Home = () => {
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
  };

  const visitMainPage = () => {
    navigate('/mainpage');
  };

  return (
    <div className="home-container d-flex justify-content-center align-items-center vh-100">
      <div className="profile-settings p-4 border rounded bg-light shadow">
        <h1 className="text-center mb-4">Welcome to ChatApp!</h1>
        {user ? (
          <div>
            <h2 className="mb-4">Hello, <strong>{user.username}</strong>!</h2>
            <div className="btn-group" role="group">
              <button className="btn btn-outline-primary" onClick={handleLogout}>Log Out</button>
              <button className="btn btn-outline-primary" onClick={visitMainPage}>Go to Main Page</button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">You are not logged in</p>
            <Link to="/login" className="btn btn-primary">Log In</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
