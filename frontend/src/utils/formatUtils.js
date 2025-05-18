/**
 * Fonctions utilitaires pour le formatage des données
 */

/**
 * Formate un nombre avec séparateur de milliers
 * @param {number} value - Valeur à formater
 * @param {number} decimalPlaces - Nombre de décimales
 * @returns {string} Nombre formaté
 */
export const formatNumber = (value, decimalPlaces = 0) => {
    if (value === undefined || value === null) return '';
    
    return Number(value).toLocaleString('fr-FR', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });
  };
  
  /**
   * Formate une valeur en devise (EUR)
   * @param {number} value - Valeur à formater
   * @param {number} decimalPlaces - Nombre de décimales
   * @returns {string} Montant formaté
   */
  export const formatCurrency = (value, decimalPlaces = 2) => {
    if (value === undefined || value === null) return '';
    
    return Number(value).toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });
  };
  
  /**
   * Formate une distance en kilomètres avec unité
   * @param {number} meters - Distance en mètres
   * @returns {string} Distance formatée
   */
  export const formatDistance = (meters) => {
    if (meters === undefined || meters === null) return '';
    
    const km = meters / 1000;
    
    if (km < 0.1) {
      return `${formatNumber(meters, 0)} m`;
    }
    
    return `${formatNumber(km, 1)} km`;
  };
  
  /**
   * Formate une vitesse en km/h avec unité
   * @param {number} speed - Vitesse en km/h
   * @returns {string} Vitesse formatée
   */
  export const formatSpeed = (speed) => {
    if (speed === undefined || speed === null) return '';
    
    return `${formatNumber(speed, 1)} km/h`;
  };
  
  /**
   * Tronque un texte si sa longueur dépasse maxLength
   * @param {string} text - Texte à tronquer
   * @param {number} maxLength - Longueur maximale
   * @returns {string} Texte tronqué
   */
  export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength) + '...';
  };
  
  /**
   * Convertit une chaîne CamelCase en texte lisible avec espaces
   * @param {string} text - Texte en camelCase ou PascalCase
   * @returns {string} Texte formaté
   */
  export const camelCaseToHuman = (text) => {
    if (!text) return '';
    
    // Remplace camelCase par des espaces et des minuscules
    const result = text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
    
    return result;
  };
  
  /**
   * Obtient les initiales à partir d'un prénom et d'un nom
   * @param {string} firstName - Prénom
   * @param {string} lastName - Nom
   * @returns {string} Initiales
   */
  export const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return '';
    
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    
    return `${firstInitial}${lastInitial}`;
  };