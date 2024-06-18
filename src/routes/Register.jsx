import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const registerUrl = "http://localhost:32767/user/register";
    const credentials = {
      nume,
      prenume,
      username,
      email,
      password
    };

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(registerUrl, credentials);
      if (response.data != null) {
        setSuccess('Registration successful! You can now log in.');
        setError('');
        navigate('/login');
      } else {
        setError('Registration failed');
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="register-container p-4 border rounded bg-light shadow">
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-2">
            <label className="form-label">Last Name (Nume):</label>
            <input
              type="text"
              className="form-control"
              value={nume}
              onChange={(e) => setNume(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">First Name (Prenume):</label>
            <input
              type="text"
              className="form-control"
              value={prenume}
              onChange={(e) => setPrenume(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Username:</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Confirm Password:</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-between mt-3">
            <button type="submit" className="btn btn-primary">Register</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/')}>Cancel Registration</button>
          </div>
        </form>

        {/* Toast notification for errors */}
        {error && (
          <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div className="toast show align-items-center text-white bg-danger border-0" role="alert">
              <div className="d-flex">
                <div className="toast-body">{error}</div>
                <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={() => setError('')}></button>
              </div>
            </div>
          </div>
        )}

        {/* Toast notification for success */}
        {success && (
          <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div className="toast show align-items-center text-white bg-success border-0" role="alert">
              <div className="d-flex">
                <div className="toast-body">{success}</div>
                <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={() => setSuccess('')}></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
