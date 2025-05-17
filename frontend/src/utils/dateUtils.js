/**
 * Fonctions utilitaires pour la manipulation des dates
 */

/**
 * Formate une date en format lisible fr-FR
 * @param {Date|string} date - Date à formater
 * @param {Object} options - Options de formatage
 * @returns {string} Date formatée
 */
export const formatDate = (date, options = {}) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...options
    };
    
    return dateObj.toLocaleDateString('fr-FR', defaultOptions);
  };
  
  /**
   * Formate une date avec l'heure en format lisible fr-FR
   * @param {Date|string} date - Date à formater
   * @returns {string} Date et heure formatées
   */
  export const formatDateTime = (date) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  /**
   * Retourne le temps écoulé depuis la date donnée
   * @param {Date|string} date - Date de référence
   * @returns {string} Temps écoulé en format lisible
   */
  export const getTimeAgo = (date) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const secondsAgo = Math.floor((now - dateObj) / 1000);
    
    if (secondsAgo < 60) return 'il y a quelques secondes';
    if (secondsAgo < 3600) return `il y a ${Math.floor(secondsAgo / 60)} min`;
    if (secondsAgo < 86400) return `il y a ${Math.floor(secondsAgo / 3600)} h`;
    if (secondsAgo < 2592000) return `il y a ${Math.floor(secondsAgo / 86400)} j`;
    
    return formatDate(dateObj);
  };
  
  /**
   * Calcule la différence entre deux dates en jours
   * @param {Date|string} date1 - Première date
   * @param {Date|string} date2 - Deuxième date
   * @returns {number} Différence en jours
   */
  export const getDaysDifference = (date1, date2) => {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
    
    // Conversion en jours (86400000 = nombre de millisecondes dans une journée)
    return Math.abs(Math.round((d2 - d1) / 86400000));
  };
  
  /**
   * Retourne le début et la fin d'une période en fonction d'un type
   * @param {string} periodType - Type de période ('today', 'yesterday', 'week', 'month', 'year')
   * @returns {Object} Début et fin de la période
   */
  export const getDateRangeFromPeriod = (periodType) => {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    
    switch (periodType) {
      case 'today':
        return {
          startDate: today,
          endDate: new Date(now.setHours(23, 59, 59, 999))
        };
        
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayEnd = new Date(yesterday);
        yesterdayEnd.setHours(23, 59, 59, 999);
        return {
          startDate: yesterday,
          endDate: yesterdayEnd
        };
        
      case 'week':
        const startOfWeek = new Date(today);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        return {
          startDate: startOfWeek,
          endDate: endOfWeek
        };
        
      case 'month':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        
        return {
          startDate: startOfMonth,
          endDate: endOfMonth
        };
        
      case 'year':
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
        
        return {
          startDate: startOfYear,
          endDate: endOfYear
        };
        
      default:
        return {
          startDate: today,
          endDate: new Date(now.setHours(23, 59, 59, 999))
        };
    }
  };