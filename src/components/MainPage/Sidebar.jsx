import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Sidebar({ onGroupSelect }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const getGroups = async () => {
    const url = 'http://localhost:32767/user/all-groups';
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setGroups(response.data.groups);
    } catch (error) {
      console.error('Error fetching groups:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  const handleGroupSelect = (groupId) => {
    setSelectedGroupId(groupId);
    onGroupSelect(groupId);
  };

  return (
    <div className="p-3">
      <h4>Grupuri</h4>
      <ul className="list-group mb-3">
        {groups.length > 0 ? 
          groups.map((group, index) => (
            <li 
              key={index} 
              className={`list-group-item ${selectedGroupId === group._id ? 'active' : ''}`}
              onClick={() => handleGroupSelect(group._id)}
              style={{ cursor: 'pointer' }}
            >
              {group && group.groupName ? group.groupName : 'No group name available'}
            </li>
          )) 
          : <li className="list-group-item">No groups available</li>
        }
      </ul>
    </div>
  );
}

export default Sidebar;