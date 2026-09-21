import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './LoginRequiredPrompt.css';

const LoginRequiredPrompt = ({ message, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = `${location.pathname}${location.search}${location.hash}`;

  const goToAuth = (path) => {
    onClose();
    navigate(path, { state: { returnTo } });
  };

  return (
    <div className="login-required-backdrop" role="presentation" onClick={onClose}>
      <div
        className="login-required-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-required-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="btn-close float-end" aria-label="Close" onClick={onClose}></button>
        <h2 id="login-required-title">Login Required</h2>
        <p>{message}</p>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-primary" onClick={() => goToAuth('/login')}>Login</button>
          <button type="button" className="btn btn-outline-primary" onClick={() => goToAuth('/register')}>Create Account</button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredPrompt;
