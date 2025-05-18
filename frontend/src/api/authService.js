import api from './api';

const authService = {
  login: async (email, password) => {
    try {
      // Pour une démonstration, simulons une réponse d'API
      if ((email === 'admin@ai-drive.com' && password === 'admin123') ||
          (email === 'user@ai-drive.com' && password === 'user123')) {
        
        const isAdmin = email === 'admin@ai-drive.com';
        
        // Dans un environnement réel, cette réponse viendrait du serveur
        const mockResponse = {
          token: 'demo-token-' + Math.random().toString(36).substr(2, 9),
          role: isAdmin ? 'ADMIN' : 'USER',
          userId: isAdmin ? '1' : '2',
          user: {
            id: isAdmin ? '1' : '2',
            email: email,
            firstName: isAdmin ? 'Admin' : 'Utilisateur',
            lastName: isAdmin ? 'Système' : 'Standard',
            role: isAdmin ? 'ADMIN' : 'USER',
            createdAt: new Date().toISOString()
          }
        };
        
        // Simuler un délai de réseau
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return mockResponse;
      } else {
        // Simuler une erreur d'authentification
        throw { response: { data: { message: 'Email ou mot de passe incorrect' } } };
      }
      
      // Dans une implémentation réelle, vous appelleriez l'API:
      // return await api.post('/auth/login', { email, password });
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      // Simuler une réponse d'API pour l'inscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Inscription réussie',
        user: {
          id: Math.floor(Math.random() * 1000) + 10,
          ...userData,
          role: 'USER',
          createdAt: new Date().toISOString()
        }
      };
      
      // Dans une implémentation réelle:
      // return await api.post('/auth/register', userData);
    } catch (error) {
      throw error;
    }
  },
  
  forgotPassword: async (email) => {
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        success: true,
        message: 'Un email de réinitialisation a été envoyé si le compte existe'
      };
      
      // Dans une implémentation réelle:
      // return await api.post('/auth/forgot-password', { email });
    } catch (error) {
      throw error;
    }
  },
  
  resetPassword: async (token, newPassword) => {
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        success: true,
        message: 'Mot de passe réinitialisé avec succès'
      };
      
      // Dans une implémentation réelle:
      // return await api.post('/auth/reset-password', { token, newPassword });
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    
    // Dans une implémentation réelle avec invalidation de token:
    // return api.post('/auth/logout');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
  
  isAdmin: () => {
    return localStorage.getItem('userRole') === 'ADMIN';
  },
  
  getToken: () => {
    return localStorage.getItem('authToken');
  },
  
  getCurrentUserId: () => {
    return localStorage.getItem('userId');
  }
};

export default authService;