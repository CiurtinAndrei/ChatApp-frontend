import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';

const AddFriend = () => {
  const initialValues = {
    username: '',
  };

  const [error, setError] = useState('');

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
      setError('');  // Clear error on success
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
    <div className="container">
      <h2>Add Friend</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field
                type="text"
                id="username"
                name="username"
                className="form-control"
                placeholder="Enter friend's username"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Friend'}
            </button>
          </Form>
        )}
      </Formik>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddFriend;
