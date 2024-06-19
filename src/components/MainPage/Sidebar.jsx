import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import "../../css/sidebar.css"; 

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
    <div className="sidebar-container">
      <div className="d-flex justify-content-between align-items-center px-3 mb-3">
        <h4 className="mb-0">Groups</h4>
        <Link to="/joingroup" className="btn btn-success">
          Join Group
        </Link>
      </div>

      <div className="p-3">
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
      
      <div className="create-group-button">
        <Link to="/creategroup" className="btn btn-primary btn-block">
          Create New Group
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
