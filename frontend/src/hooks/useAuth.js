import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook personnalisé pour gérer l'authentification
 * Fournit des méthodes pour la connexion, la déconnexion et la vérification d'authentification
 * @returns {Object} Méthodes et état d'authentification
 */
const useAuth = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  
  /**
   * Connexion avec redirection
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @param {string} redirectPath - Chemin de redirection après connexion
   * @returns {Promise} Résultat de la connexion
   */
  const loginWithRedirect = async (email, password, redirectPath = '/') => {
    const result = await auth.login(email, password);
    
    if (result.success) {
      navigate(redirectPath);
    }
    
    return result;
  };
  
  /**
   * Déconnexion avec redirection
   * @param {string} redirectPath - Chemin de redirection après déconnexion
   */
  const logoutWithRedirect = (redirectPath = '/login') => {
    auth.logout();
    navigate(redirectPath);
  };
  
  /**
   * Inscription avec redirection
   * @param {Object} userData - Données de l'utilisateur
   * @param {string} redirectPath - Chemin de redirection après inscription
   * @returns {Promise} Résultat de l'inscription
   */
  const registerWithRedirect = async (userData, redirectPath = '/login') => {
    const result = await auth.register(userData);
    
    if (result.success) {
      navigate(redirectPath, { 
        state: { 
          registrationSuccess: true,
          email: userData.email
        } 
      });
    }
    
    return result;
  };
  
  /**
   * Vérifier si l'utilisateur a un rôle requis, sinon rediriger
   * @param {string} requiredRole - Rôle requis
   * @param {string} redirectPath - Chemin de redirection si le rôle n'est pas présent
   * @returns {boolean} True si l'utilisateur a le rôle requis
   */
  const checkRole = (requiredRole, redirectPath = '/') => {
    if (!auth.isAuthenticated) {
      navigate('/login');
      return false;
    }
    
    if (!auth.hasRole(requiredRole)) {
      navigate(redirectPath);
      return false;
    }
    
    return true;
  };
  
  return {
    ...auth,
    loginWithRedirect,
    logoutWithRedirect,
    registerWithRedirect,
    checkRole
  };
};

export default useAuth;