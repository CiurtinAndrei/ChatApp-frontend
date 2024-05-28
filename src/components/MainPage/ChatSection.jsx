import React from 'react';

function ChatSection() {
  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1 p-3 overflow-auto">
        <div className="d-flex flex-column">
          <div className="alert alert-secondary">Mesaj 1</div>
          <div className="alert alert-primary align-self-end">Mesaj 2</div>
          <div className="alert alert-secondary">Mesaj 3</div>
        </div>
      </div>
      <div className="p-3 border-top">
        <input type="text" className="form-control" placeholder="Scrie un mesaj..." />
      </div>
    </div>
  );
}

export default ChatSection;