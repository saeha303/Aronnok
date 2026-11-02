import React, { useEffect, useState } from 'react';
import './AdminNavbar.css';
import UserNotification from '../UserNotification/UserNotification';
import { API } from '../../backend';
import { getCurrentUserId } from '../../session';

const AdminNavbar = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [notis, setNotis] = useState([]);
  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  useEffect(() => {

    const fetchNotification = async () => {
      try {
        const response = await fetch(`${API}/api/notification/${getCurrentUserId()}`);
        const data = await response.json();
        setNotis(data.messages);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };



    const intervalId = setInterval(() => {
      fetchNotification();
    }, 5000);

    return () => clearInterval(intervalId);

  }, []);
  return (
    <div className="admin-navbar">
      <div className="left-section">
      <div className="logo">
  <img src="/aronnok-logo.png" alt="logo" style={{ width: '50px', height: '50px' }} />
</div>
        <div className="admin-name">Aronnok</div>
      </div>
      <div className="right-section">
        {/* <div className="adminnotification-icon">🔔</div> */}
        <div className="notification-icon"><button style={{ backgroundColor: "white", fontSize: '30px' }} onClick={openPopup}><i class="bi bi-bell-fill" style={{ color: 'rgb(0, 100, 0)', fontSize: '25px' }}></i></button>
          <div className="notification-count" style={{ fontSize: '10px' }}>{notis.length}</div>
        </div>
        <div className="adminsearch-bar">
          <input type="text" placeholder="Search" />
          <button className= "adminsearchbutton"type="button">Search</button>
        </div>
        {/* <div className="profile-icon">👤</div> */}
        <div className="adminprofile-icon">
            {/* <img src="/us.png" alt="profile-icon" style={{ width: '50px', height: '50px' }} /> */}
        </div>
      </div>
      {isPopupOpen && (
        <div className="notification-overlay">

          <UserNotification userId={getCurrentUserId()} onClose={closePopup} />

        </div>
      )}
    </div>
  );
};

export default AdminNavbar;
