import React, { useState } from 'react';
import Sidebar from '../components/MainPage/Sidebar';
import ChatSection from '../components/MainPage/ChatSection';
import ProfileSettings from '../components/MainPage/ProfileSettings';

function MainPage() {
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const handleGroupSelect = (groupId) => {
    setSelectedGroupId(groupId);
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-md-3 border-end">
          <Sidebar onGroupSelect={handleGroupSelect} />
        </div>
        <div className="col-md-6">
          <ChatSection groupId={selectedGroupId} />
        </div>
        <div className="col-md-3 border-start">
          <ProfileSettings />
        </div>
      </div>
    </div>
  );
}

export default MainPage;