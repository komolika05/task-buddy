import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import circleBg from './assets/circles_bg.png';
import loginImg from './assets/login-page-image.png';
import GoogleIcon from "./assets/google-icon.png"
import './custom.css';
import './login.css';

export default function Login() {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleGoogleSignIn() {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  }

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-start bg-light position-relative">
      <div className="mobile-content-box d-flex flex-column align-items-start">
        <div className="mb-4">
          <h2 className="display-6 text-purple fw-600">
            <FontAwesomeIcon icon={faClipboardList} className="purple me-2"/>            
            TaskBuddy
          </h2>
          <p className="mt-2 black login-description mb-0">
            Streamline your workflow and track progress effortlessly with our all-in-one task management app.
          </p>
        </div>
        <button
          onClick={handleGoogleSignIn}
          className="btn login-btn-box d-flex align-items-center justify-content-center"
        >
          <img 
            src={GoogleIcon}
            alt="Google"
            className="me-3"
            style={{ width: '25px', height: '25px' }}
          />
          Sign in with Google
        </button>
      </div>
      <div className="login-image-container position-absolute" style={{ zIndex: 1, top: 0, right: 0 }}>
        <img
          src={circleBg}
          alt="Login"
          className="img-fluid"
        />
      </div>
      <div className="position-absolute" style={{ zIndex: 2, top: '70px', left: '866px' }}>
        <img 
          src={loginImg}
          alt="Login"
          className="img-fluid"
          style={{ height: '662px', width: '942px' }}
        />
      </div>
    </div>
  );
}
