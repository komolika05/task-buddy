import react from "react";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './header.css';
import './custom.css';


export default function Header() {
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
        <div className="d-flex justify-content-between align-items-center mb-3 px-4">
            <div>
                <h2 className="header-title fw-600">
                    <FontAwesomeIcon icon={faClipboardList} className="me-2"/>            
                    TaskBuddy
                </h2>
            </div>
            {currentUser && (
            <div className="d-flex flex-row align-items-center">
                <div>
                    <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                    className="rounded-circle"
                    style={{width: '38px', height: '38px'}}
                    />
                </div>
                <div className="ms-2">
                    {currentUser.displayName}
                </div>
                <div className="ms-2">
                    <button
                    onClick={handleLogout}
                    className="btn gray-btn logout-btn d-flex align-items-center justify-content-center"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                        Log Out
                    </button>
                </div>
            </div>
            )}
        </div>
    )
}