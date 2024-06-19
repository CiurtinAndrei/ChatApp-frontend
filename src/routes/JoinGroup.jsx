import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/joinGroup.css'; 

const JoinGroup = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const getGroups = async () => {
      const url = 'http://localhost:32767/api/conversations/all-public';

      try {
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('API Response:', response.data);
        setGroups(response.data.publicGroups); 
        setError(null);
      } catch (error) {
        setError(error.response ? error.response.data.error : error.message);
        console.error('Error showing groups:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    getGroups();
  }, []);

  const enterGroup = async (id) => {
    const url = `http://localhost:32767/api/conversations/join/${id}`;

    try {
      await axios.post(url, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccess("Successfully joined the group!");
      setError(null);
      setTimeout(() => {
        navigate('/mainpage'); 
      }, 2000);
    } catch (error) {
      setError(error.response ? error.response.data.error : error.message);
      setSuccess(null);
      console.error('Error joining group:', error.response ? error.response.data : error.message);
    }
  };

  console.log('Groups:', groups);

  return (
    <div className="join-group-page container mt-5 d-flex justify-content-center">
      <div className="w-100">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-center mb-0">Join a Group</h2>
          <button className="btn btn-secondary" onClick={() => navigate('/mainpage')}>
            Cancel
          </button>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="group-list row">
          {groups.length > 0 ? (
            groups.map((group) => (
              <div key={group._id} className="group-item col-md-4 mb-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="card-title">{group.groupName}</h3>
                    <p className="card-text">Creator: {group.creator.username}</p>
                    <button className="btn btn-primary" onClick={() => enterGroup(group._id)}>
                      Join Group
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No groups available to join.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinGroup;
