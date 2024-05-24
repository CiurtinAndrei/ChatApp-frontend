import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [nume, setNume] = useState('');
  const [prenume, setPrenume] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const registerUrl = "http://localhost:32767/user/register";
    const credentials = {
        nume:nume,
        prenume:prenume,
        username:username,
        email:email,
        password:password
      };

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Replace this with your actual registration API call
    try {
        const response = await axios.post(registerUrl,credentials);
      if (response.data != null) {
        setSuccess('Registration successful! You can now log in.');
        setError('');
        navigate('/login');
      } else {
        setError('Registration failed');
      }
    } catch (error) {
        console.log(error);
      setError('An error occurred during registration');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Last Name (Nume):</label>
          <input
            type="text"
            value={nume}
            onChange={(e) => setNume(e.target.value)}
          />
        </div>
        <div>
          <label>First Name (Prenume):</label>
          <input
            type="text"
            value={prenume}
            onChange={(e) => setPrenume(e.target.value)}
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};



export default Register;