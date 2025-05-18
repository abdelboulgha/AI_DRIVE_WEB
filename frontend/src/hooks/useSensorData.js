import { useState, useEffect, useCallback } from 'react';
import SensorDataService from '../api/sensorDataService';
import { getDateRangeFromPeriod } from '../utils/dateUtils';

/**
 * Hook personnalisé pour gérer les données des capteurs
 * Fournit des méthodes pour récupérer et filtrer les données des capteurs
 * @param {string} dataType - Type de données ('accelerometer', 'gyroscope', 'gps')
 * @param {number} carId - ID du véhicule
 * @returns {Object} État et méthodes pour les données des capteurs
 */
const useSensorData = (dataType = 'accelerometer', carId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('today');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date(new Date().setHours(0,0,0,0)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  /**
   * Récupérer les données des capteurs
   */
  const fetchData = useCallback(async () => {
    if (!carId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let params = {};
      
      // Définir les dates en fonction de la période sélectionnée
      if (timeRange === 'custom') {
        params.startDate = customDateRange.startDate;
        params.endDate = customDateRange.endDate;
      } else {
        const dateRange = getDateRangeFromPeriod(timeRange);
        params.startDate = dateRange.startDate.toISOString();
        params.endDate = dateRange.endDate.toISOString();
      }
      
      // Récupérer les données en fonction du type
      let response;
      switch (dataType) {
        case 'accelerometer':
          response = await SensorDataService.getAccelerometerDataByDeviceId(carId, params);
          break;
        case 'gyroscope':
          response = await SensorDataService.getGyroscopeDataByDeviceId(carId, params);
          break;
        case 'gps':
          response = await SensorDataService.getGPSDataByDeviceId(carId, params);
          break;
        default:
          throw new Error(`Type de données non pris en charge: ${dataType}`);
      }
      
      setData(response.data);
    } catch (err) {
      console.error(`Erreur lors de la récupération des données ${dataType}:`, err);
      setError(`Erreur lors du chargement des données: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [carId, dataType, timeRange, customDateRange]);
  
  // Charger les données au montage et lorsque les dépendances changent
  useEffect(() => {
    if (carId) {
      fetchData();
    }
  }, [fetchData, carId, dataType, timeRange]);
  
  /**
   * Modifier la période de temps
   * @param {string} newTimeRange - Nouvelle période ('today', 'yesterday', 'week', 'month', 'custom')
   */
  const changeTimeRange = (newTimeRange) => {
    setTimeRange(newTimeRange);
  };
  
  /**
   * Mettre à jour les dates personnalisées
   * @param {Object} newDateRange - Nouvelles dates {startDate, endDate}
   */
  const updateCustomDateRange = (newDateRange) => {
    setCustomDateRange(newDateRange);
    
    // Si la période actuelle est 'custom', recharger les données
    if (timeRange === 'custom') {
      fetchData();
    }
  };
  
  /**
   * Calculer les statistiques à partir des données
   * @returns {Object} Statistiques calculées
   */
  const calculateStats = () => {
    if (!data || data.length === 0) {
      return null;
    }
    
    switch (dataType) {
      case 'accelerometer': {
        // Statistiques pour l'accéléromètre
        const maxX = Math.max(...data.map(d => d.x));
        const minX = Math.min(...data.map(d => d.x));
        const avgX = data.reduce((sum, d) => sum + d.x, 0) / data.length;
        
        const maxY = Math.max(...data.map(d => d.y));
        const minY = Math.min(...data.map(d => d.y));
        const avgY = data.reduce((sum, d) => sum + d.y, 0) / data.length;
        
        const maxZ = Math.max(...data.map(d => d.z));
        const minZ = Math.min(...data.map(d => d.z));
        const avgZ = data.reduce((sum, d) => sum + d.z, 0) / data.length;
        
        return { maxX, minX, avgX, maxY, minY, avgY, maxZ, minZ, avgZ };
      }
      
      case 'gyroscope': {
        // Statistiques pour le gyroscope
        const maxRotX = Math.max(...data.map(d => d.rotationX));
        const minRotX = Math.min(...data.map(d => d.rotationX));
        const avgRotX = data.reduce((sum, d) => sum + d.rotationX, 0) / data.length;
        
        const maxRotY = Math.max(...data.map(d => d.rotationY));
        const minRotY = Math.min(...data.map(d => d.rotationY));
        const avgRotY = data.reduce((sum, d) => sum + d.rotationY, 0) / data.length;
        
        const maxRotZ = Math.max(...data.map(d => d.rotationZ));
        const minRotZ = Math.min(...data.map(d => d.rotationZ));
        const avgRotZ = data.reduce((sum, d) => sum + d.rotationZ, 0) / data.length;
        
        return { 
          maxRotX, minRotX, avgRotX, 
          maxRotY, minRotY, avgRotY, 
          maxRotZ, minRotZ, avgRotZ 
        };
      }
      
      case 'gps': {
        // Statistiques pour les données GPS
        const maxSpeed = Math.max(...data.map(d => d.speed));
        const minSpeed = Math.min(...data.map(d => d.speed));
        const avgSpeed = data.reduce((sum, d) => sum + d.speed, 0) / data.length;
        
        const maxAlt = Math.max(...data.map(d => d.altitude));
        const minAlt = Math.min(...data.map(d => d.altitude));
        const avgAlt = data.reduce((sum, d) => sum + d.altitude, 0) / data.length;
        
        // Calculer la distance totale parcourue
        let totalDistance = 0;
        for (let i = 1; i < data.length; i++) {
          const lat1 = data[i-1].latitude;
          const lon1 = data[i-1].longitude;
          const lat2 = data[i].latitude;
          const lon2 = data[i].longitude;
          
          // Formule Haversine pour calculer la distance
          const R = 6371; // Rayon de la Terre en km
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distance = R * c;
          
          totalDistance += distance;
        }
        
        return { 
          maxSpeed, minSpeed, avgSpeed, 
          maxAlt, minAlt, avgAlt, 
          totalDistance 
        };
      }
      
      default:
        return null;
    }
  };
  
  return {
    data,
    loading,
    error,
    timeRange,
    customDateRange,
    fetchData,
    changeTimeRange,
    updateCustomDateRange,
    calculateStats
  };
};

export default useSensorData;