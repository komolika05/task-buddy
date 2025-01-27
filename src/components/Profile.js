import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './custom.css';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg mx-auto" style={{maxWidth: '500px'}}>
        <div className="card-body">
          <h2 className="card-title h4 mb-4">
            <FontAwesomeIcon icon={faUser} className="purple me-2" />
            Profile
          </h2>
          {currentUser && (
            <div>
              <div className="text-center mb-4">
                <img 
                  src={currentUser.photoURL} 
                  alt="Profile" 
                  className="rounded-circle"
                  style={{width: '80px', height: '80px'}}
                />
              </div>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>Email:</strong> {currentUser.email}
                </p>
                <p className="mb-2">
                  <strong>Name:</strong> {currentUser.displayName}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-danger d-flex align-items-center justify-content-center w-100"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
