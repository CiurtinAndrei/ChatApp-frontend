import React from 'react';
import Sidebar from '../components/MainPage/Sidebar';
import ChatSection from '../components/MainPage/ChatSection';
import ProfileSettings from '../components/MainPage/ProfileSettings';

function MainPage() {
  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-md-3 border-end">
          <Sidebar />
        </div>
        <div className="col-md-6">
          <ChatSection />
        </div>
        <div className="col-md-3 border-start">
          <ProfileSettings />
        </div>
      </div>
    </div>
  );
}

export default MainPage;