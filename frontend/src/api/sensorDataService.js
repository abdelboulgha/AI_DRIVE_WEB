import api from './api';

// Service pour accéder aux données des capteurs
const SensorDataService = {
  // Accéléromètre
  getAccelerometerData: (params) => api.get('/sensor/accelerometer', { params }),
  getAccelerometerDataByDeviceId: (deviceId, params) => api.get(`/sensor/accelerometer/${deviceId}`, { params }),
  
  // GPS
  getGPSData: (params) => api.get('/sensor/gps', { params }),
  getGPSDataByDeviceId: (deviceId, params) => api.get(`/sensor/gps/${deviceId}`, { params }),
  
  // Gyroscope
  getGyroscopeData: (params) => api.get('/sensor/gyroscope', { params }),
  getGyroscopeDataByDeviceId: (deviceId, params) => api.get(`/sensor/gyroscope/${deviceId}`, { params }),
  
  // Statistiques
  getStatsSummary: () => api.get('/stats/summary'),
  getDeviceList: () => api.get('/stats/devices'),
  
  // Données agrégées pour le tableau de bord
  getDashboardData: () => api.get('/stats/dashboard'),
};

export default SensorDataService;