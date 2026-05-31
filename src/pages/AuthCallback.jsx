import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Completing sign in...');

  useEffect(() => {
    let isActive = true;

    const finishAuth = async () => {
      if (!supabase) {
        navigate('/login', { replace: true });
        return;
      }

      const { data, error } = await supabase.auth.getSession();

      if (!isActive) {
        return;
      }

      if (error) {
        setMessage(error.message || 'Unable to complete sign in.');
        navigate('/login', { replace: true });
        return;
      }

      if (data.session) {
        navigate('/account', { replace: true });
        return;
      }

      navigate('/login', { replace: true });
    };

    finishAuth();

    return () => {
      isActive = false;
    };
  }, [navigate]);

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center bg-light px-3">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status" aria-hidden="true"></div>
        <p className="mb-0">{message}</p>
      </div>
    </div>
  );
};

export default AuthCallback;