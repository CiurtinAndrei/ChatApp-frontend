import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddFriend = () => {
  const initialValues = {
    username: '',
  };

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    const url = 'http://localhost:32767/friends/add';
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(url, { person2: values.username }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Friend added successfully:', response.data);
      resetForm();
      setError('');  
      navigate('/mainpage'); 
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'An error occurred. Please try again.';
      setError(errorMessage);
      console.error('Error adding friend:', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-4">Add Friend</h2>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    placeholder="Enter friend's username"
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Add Friend'}
                  </button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate('/mainpage')}>
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          {error && <p className="text-danger mt-3">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AddFriend;
