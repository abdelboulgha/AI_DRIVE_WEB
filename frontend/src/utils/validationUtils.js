/**
 * Fonctions utilitaires pour la validation des données
 */

/**
 * Vérifie si une adresse email est valide
 * @param {string} email - Email à valider
 * @returns {boolean} True si l'email est valide
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    
    // Expression régulière pour validation basique d'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Vérifie si un numéro de téléphone est valide
   * @param {string} phone - Numéro à valider
   * @returns {boolean} True si le numéro est valide
   */
  export const isValidPhone = (phone) => {
    if (!phone) return false;
    
    // Expression régulière pour accepter différents formats de numéros
    // Accepte +XX XXX XXX XXX, 0X XX XX XX XX, etc.
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };
  
  /**
   * Vérifie si un mot de passe est assez fort
   * @param {string} password - Mot de passe à valider
   * @returns {Object} État de validation et message d'erreur
   */
  export const validatePassword = (password) => {
    if (!password) {
      return {
        isValid: false,
        message: 'Le mot de passe est requis'
      };
    }
    
    if (password.length < 6) {
      return {
        isValid: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères'
      };
    }
    
    // Vérification plus stricte (optionnelle)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strongPassword = hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    
    if (!strongPassword) {
      return {
        isValid: true,
        isStrong: false,
        message: 'Pour un mot de passe plus sécurisé, incluez des majuscules, minuscules, chiffres et caractères spéciaux'
      };
    }
    
    return {
      isValid: true,
      isStrong: true,
      message: ''
    };
  };
  
  /**
   * Vérifie si une plaque d'immatriculation est au format valide
   * @param {string} licensePlate - Plaque à valider
   * @returns {boolean} True si la plaque est valide
   */
  export const isValidLicensePlate = (licensePlate) => {
    if (!licensePlate) return false;
    
    // Format marocain: XXXXXX-X-XX (chiffres-lettre-chiffres)
    // Cette regex est adaptée au format marocain, à ajuster selon les besoins
    const plateRegex = /^\d{1,6}-[A-Z]-\d{1,2}$/;
    return plateRegex.test(licensePlate);
  };
  
  /**
   * Vérifie si un VIN (Vehicle Identification Number) est valide
   * @param {string} vin - Numéro VIN à valider
   * @returns {boolean} True si le VIN est valide
   */
  export const isValidVIN = (vin) => {
    if (!vin) return false;
    
    // Un VIN valide a 17 caractères et n'inclut pas I, O, Q
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    return vinRegex.test(vin);
  };
  
  /**
   * Vérifie si une année est valide (entre 1900 et l'année actuelle)
   * @param {number} year - Année à valider
   * @returns {boolean} True si l'année est valide
   */
  export const isValidYear = (year) => {
    if (!year) return false;
    
    const currentYear = new Date().getFullYear();
    return Number(year) >= 1900 && Number(year) <= currentYear;
  };
  
  /**
   * Vérifie si un objet a toutes les propriétés requises
   * @param {Object} obj - Objet à valider
   * @param {Array} requiredProps - Liste des propriétés requises
   * @returns {boolean} True si l'objet est valide
   */
  export const hasRequiredProperties = (obj, requiredProps) => {
    if (!obj || typeof obj !== 'object') return false;
    
    return requiredProps.every(prop => 
      Object.prototype.hasOwnProperty.call(obj, prop) && 
      obj[prop] !== null && 
      obj[prop] !== undefined && 
      obj[prop] !== ''
    );
  };