import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JoinGroup = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setGroups(response.data.publicGroups); // Assuming API response is { publicGroups: [...] }
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
    } catch (error) {
      setError(error.response ? error.response.data.error : error.message);
      setSuccess(null);
      console.error('Error joining group:', error.response ? error.response.data : error.message);
    }
  };

  console.log('Groups:', groups);

  return (
    <div className="join-group-page">
      <h2>Join a Group</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="group-list">
          {groups.length > 0 ? (
            groups.map((group, index) => (
              <div key={group._id} className="group-item">
                <h3>{group.groupName}</h3>
                <p>Creator: {group.creator.username}</p>
                <button className="btn btn-primary" onClick={() => enterGroup(group._id)}>Join Group</button>
              </div>
            ))
          ) : (
            <div>No groups available to join.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default JoinGroup;
