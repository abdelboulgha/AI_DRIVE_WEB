import React, { createContext, useState, useEffect } from 'react';
import authService from '../api/authService';

// Création du contexte
export const AuthContext = createContext();

/**
 * Fournisseur pour le contexte d'authentification
 * Gère l'état d'authentification de l'utilisateur dans l'application
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  
  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userId = authService.getCurrentUserId();
          
          if (userId) {
            // Dans une implémentation réelle, on ferait un appel API pour
            // récupérer les informations complètes de l'utilisateur
            setIsAuthenticated(true);
            
            // Simuler un chargement de données utilisateur
            // Dans une application réelle, appeler API pour obtenir les détails de l'utilisateur
            const userRole = authService.isAdmin() ? 'ADMIN' : 'USER';
            
            setCurrentUser({
              id: userId,
              role: userRole,
              // D'autres propriétés seraient ajoutées ici dans une implémentation réelle
            });
          } else {
            setIsAuthenticated(false);
            setCurrentUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Erreur de vérification d'authentification:", err);
        setError("Erreur lors de la vérification de l'authentification");
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  /**
   * Fonction de connexion
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise} Résultat de la connexion
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(email, password);
      
      setIsAuthenticated(true);
      setCurrentUser({
        id: response.userId,
        role: response.role,
        ...response.user
      });
      
      return { success: true };
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Échec de connexion. Vérifiez vos identifiants.'
      );
      return { success: false, error: err.response?.data?.message || 'Erreur de connexion' };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Fonction de déconnexion
   */
  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };
  
  /**
   * Fonction d'inscription
   * @param {Object} userData - Données de l'utilisateur
   * @returns {Promise} Résultat de l'inscription
   */
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      return { success: true, data: response };
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Échec de l'inscription. Veuillez réessayer."
      );
      return { success: false, error: err.response?.data?.message || "Erreur d'inscription" };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   * @param {string} role - Rôle à vérifier
   * @returns {boolean} True si l'utilisateur a le rôle spécifié
   */
  const hasRole = (role) => {
    if (!currentUser) return false;
    return currentUser.role === role;
  };
  
  // Valeurs fournies par le contexte
  const value = {
    currentUser,
    loading,
    isAuthenticated,
    error,
    login,
    logout,
    register,
    hasRole,
    isAdmin: () => hasRole('ADMIN')
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};