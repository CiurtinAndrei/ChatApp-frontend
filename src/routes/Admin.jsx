import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

async function checkLogin() {
  if (localStorage.getItem('token') != null) {
    try {
      const url = "http://localhost:32767/user/data";
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
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

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await checkLogin();
      if (userData) {
        setUser(userData);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>Admin Page</h1>

      <Link to="/phototest">
        <button>Send Photo to API</button>
      </Link>
      
      <Link to="/register">
        <button>Create a New Account</button>
      </Link>

      {user && (
        <footer>
          <h1>You are logged in as: {user.username}</h1>
          <Link to="/logout">
        <button>Log Out</button>
      </Link>
        </footer>
      )}
      {!user && (
        <footer>
          <Link to="/login">
        <button>Log In</button>
      </Link>
        </footer>
      )}


    </div>
  );
};

export default Home;