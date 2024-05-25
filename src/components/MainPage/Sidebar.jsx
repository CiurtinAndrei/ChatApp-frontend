import React from 'react';

function Sidebar() {
  return (
    <div className="p-3">
      <h4>Grupuri</h4>
      <ul className="list-group mb-3">
        <li className="list-group-item">Grup 1</li>
        <li className="list-group-item">Grup 2</li>
        <li className="list-group-item">Grup 3</li>
      </ul>
      <h4>Conversații Private</h4>
      <ul className="list-group">
        <li className="list-group-item">User 1</li>
        <li className="list-group-item">User 2</li>
        <li className="list-group-item">User 3</li>
      </ul>
    </div>
  );
}

export default Sidebar;