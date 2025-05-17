import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../api/authService';

const AdminRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  
  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Si l'utilisateur est connecté mais n'est pas administrateur, rediriger vers la page d'accueil
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  // Si l'utilisateur est connecté et est administrateur, afficher le contenu protégé
  return children;
};

export default AdminRoute;