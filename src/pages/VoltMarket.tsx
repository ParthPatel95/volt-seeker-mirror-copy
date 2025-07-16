import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const VoltMarket = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the main landing page since that's the actual site
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
};
