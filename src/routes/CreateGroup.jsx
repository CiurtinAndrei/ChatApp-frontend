import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateGroup = () => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    status: false,
    memberlist: [],
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    const url = 'http://localhost:32767/api/conversations/new';
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(url, {
        name: values.name,
        public: values.status,
        members: values.memberlist,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Group added successfully:', response.data);
      resetForm();
      setError('');  
      navigate('/mainpage'); 
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'An error occurred. Please try again.';
      setError(errorMessage);
      console.error('Error adding group:', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getFriends = async () => {
    const url = 'http://localhost:32767/friends/get';
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('API response:', response.data); 
      setFriends(response.data || []); 
      console.log('Friends:', response.data.friendsData); 
    } catch (error) {
      console.error('Error getting friends:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Create Group</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/mainpage')}>
          Cancel
        </button>
      </div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, values, handleChange }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="name">Group Name</label>
              <Field
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="Enter group name"
              />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>
            
            <div className="form-group">
              <label>Status</label>
              <div>
                <Field
                  type="radio"
                  id="public"
                  name="status"
                  value="true"
                  checked={values.status === true}
                  onChange={() => handleChange({ target: { name: 'status', value: true } })}
                />
                <label htmlFor="public">Public</label>
              </div>
              <div>
                <Field
                  type="radio"
                  id="private"
                  name="status"
                  value="false"
                  checked={values.status === false}
                  onChange={() => handleChange({ target: { name: 'status', value: false } })}
                />
                <label htmlFor="private">Private</label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="memberlist">Select Friends</label>
              <Field
                as="select"
                id="memberlist"
                name="memberlist"
                className="form-control"
                multiple={true}
              >
                {friends.length > 0 ? friends.map(friend => (
                  <option key={friend.id} value={friend.id}>{friend.username}</option>
                )) : <option disabled>No friends available</option>}
              </Field>
              <ErrorMessage name="memberlist" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Group'}
            </button>
          </Form>
        )}
      </Formik>
      {error && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show">
            <div className="toast-header">
              <strong className="me-auto">Error</strong>
              <button type="button" className="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div className="toast-body">
              {error}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateGroup;
