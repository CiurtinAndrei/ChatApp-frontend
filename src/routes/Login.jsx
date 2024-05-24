import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    const loginUrl = "http://localhost:32767/user/login";
    const credentials = {
        email:username,
        password:password
      };
    e.preventDefault();
    try {
        const response = await axios.post(loginUrl,credentials);
        const loginJWT = response.data.token;
        
      if (loginJWT) {
        localStorage.removeItem('token');
        localStorage.setItem('token', response.data.token);
        console.log(localStorage.getItem('token'));
        setError('');
        navigate('/');
        // Redirect to another page or update UI
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>E-mail:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};


export default Login;