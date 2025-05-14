import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Pour la démo, on suppose que l'utilisateur est toujours authentifié
  const isAuthenticated = true; // ou localStorage.getItem('authToken');
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;