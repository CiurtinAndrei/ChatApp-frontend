import React from 'react';

function ProfileSettings() {
  return (
    <div className="p-3">
      <h4>Profil</h4>
      <div className="mb-3">
        <label className="form-label">Nume</label>
        <input type="text" className="form-control" placeholder="Numele tău" />
      </div>
      <h4>Setări</h4>
      <div className="form-check">
        <input className="form-check-input" type="checkbox" value="" id="darkMode" />
        <label className="form-check-label" htmlFor="darkMode">
          Mod întunecat
        </label>
      </div>
    </div>
  );
}

export default ProfileSettings;