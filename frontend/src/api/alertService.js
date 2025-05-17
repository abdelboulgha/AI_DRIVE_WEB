import api from './api';

// Données mockées pour simuler les alertes
const mockAlerts = [
  {
    id: 1,
    type: 'HARSH_BRAKING',
    description: 'Freinage brusque détecté',
    severity: 'HIGH',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    carId: 4,
    car: { 
      id: 4,
      brand: 'Toyota', 
      model: 'Corolla', 
      licensePlate: '901234-D-4',
      userId: 2,
      owner: {
        id: 2,
        firstName: 'Mohamed',
        lastName: 'Alami'
      }
    },
    location: { latitude: 31.63, longitude: -8.02 },
    deviceId: 'D2004',
    data: {
      acceleration: -9.8,
      speed: 65,
      direction: 'North',
      address: 'Avenue Mohammed V, Marrakech'
    },
    status: 'NEW',
    notes: ''
  },
  {
    id: 2,
    type: 'EXCESSIVE_ACCELERATION',
    description: 'Accélération excessive détectée',
    severity: 'MEDIUM',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    carId: 9,
    car: { 
      id: 9,
      brand: 'Ford', 
      model: 'Focus', 
      licensePlate: '789345-I-9',
      userId: 6,
      owner: {
        id: 6,
        firstName: 'Rachid',
        lastName: 'Mansouri'
      }
    },
    location: { latitude: 31.64, longitude: -8.03 },
    deviceId: 'D2009',
    data: {
      acceleration: 8.2,
      speed: 45,
      direction: 'East',
      address: 'Rue Ibn Sina, Marrakech'
    },
    status: 'ACKNOWLEDGED',
    notes: 'Le conducteur a été contacté pour un rappel des consignes de sécurité'
  },
  {
    id: 3,
    type: 'DANGEROUS_TURN',
    description: 'Virage dangereux détecté',
    severity: 'LOW',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    carId: 11,
    car: { 
      id: 11,
      brand: 'Kia', 
      model: 'Sportage', 
      licensePlate: '345901-K-11',
      userId: 6,
      owner: {
        id: 6,
        firstName: 'Rachid',
        lastName: 'Mansouri'
      }
    },
    location: { latitude: 31.62, longitude: -8.01 },
    deviceId: 'D2011',
    data: {
      angularVelocity: 75,
      speed: 55,
      direction: 'West',
      address: 'Boulevard Al Yarmouk, Marrakech'
    },
    status: 'RESOLVED',
    notes: 'Le conducteur a été formé sur les techniques de conduite'
  },
  {
    id: 4,
    type: 'HARSH_BRAKING',
    description: 'Freinage brusque détecté',
    severity: 'MEDIUM',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    carId: 3,
    car: { 
      id: 3,
      brand: 'Dacia', 
      model: 'Duster', 
      licensePlate: '345678-C-3',
      userId: 1,
      owner: {
        id: 1,
        firstName: 'Admin',
        lastName: 'Système'
      }
    },
    location: { latitude: 31.65, longitude: -8.04 },
    deviceId: 'D2003',
    data: {
      acceleration: -8.5,
      speed: 70,
      direction: 'South',
      address: 'Avenue Mohammed VI, Marrakech'
    },
    status: 'NEW',
    notes: ''
  },
  {
    id: 5,
    type: 'EXCESSIVE_SPEED',
    description: 'Vitesse excessive détectée',
    severity: 'HIGH',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    carId: 1,
    car: { 
      id: 1,
      brand: 'Renault', 
      model: 'Clio', 
      licensePlate: '123456-A-1',
      userId: 1,
      owner: {
        id: 1,
        firstName: 'Admin',
        lastName: 'Système'
      }
    },
    location: { latitude: 31.61, longitude: -8.02 },
    deviceId: 'D2001',
    data: {
      speed: 125,
      speedLimit: 90,
      direction: 'North-East',
      address: 'Route de Casablanca, Marrakech'
    },
    status: 'ACKNOWLEDGED',
    notes: 'Rappel de sécurité envoyé'
  },
  {
    id: 6,
    type: 'LANE_DEPARTURE',
    description: 'Sortie de voie détectée',
    severity: 'MEDIUM',
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    carId: 7,
    car: { 
      id: 7,
      brand: 'Mercedes', 
      model: 'Classe C', 
      licensePlate: '123789-G-7',
      userId: 5,
      owner: {
        id: 5,
        firstName: 'Yasmine',
        lastName: 'Tazi'
      }
    },
    location: { latitude: 31.66, longitude: -8.05 },
    deviceId: 'D2007',
    data: {
      lateralAcceleration: 3.2,
      speed: 85,
      direction: 'East',
      address: 'Avenue Hassan II, Marrakech'
    },
    status: 'RESOLVED',
    notes: 'Le conducteur a été sensibilisé'
  },
  {
    id: 7,
    type: 'HARSH_BRAKING',
    description: 'Freinage brusque détecté',
    severity: 'LOW',
    timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    carId: 5,
    car: { 
      id: 5,
      brand: 'Volkswagen', 
      model: 'Golf', 
      licensePlate: '567890-E-5',
      userId: 2,
      owner: {
        id: 2,
        firstName: 'Mohamed',
        lastName: 'Alami'
      }
    },
    location: { latitude: 31.67, longitude: -8.06 },
    deviceId: 'D2005',
    data: {
      acceleration: -7.5,
      speed: 40,
      direction: 'West',
      address: 'Rue Houmane El Fetouaki, Marrakech'
    },
    status: 'NEW',
    notes: ''
  },
  {
    id: 8,
    type: 'DANGEROUS_TURN',
    description: 'Virage dangereux détecté',
    severity: 'MEDIUM',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    carId: 10,
    car: { 
      id: 10,
      brand: 'Hyundai', 
      model: 'Tucson', 
      licensePlate: '012678-J-10',
      userId: 6,
      owner: {
        id: 6,
        firstName: 'Rachid',
        lastName: 'Mansouri'
      }
    },
    location: { latitude: 31.68, longitude: -8.07 },
    deviceId: 'D2010',
    data: {
      angularVelocity: 65,
      speed: 60,
      direction: 'South',
      address: 'Avenue Allal El Fassi, Marrakech'
    },
    status: 'ACKNOWLEDGED',
    notes: 'En attente d\'une formation'
  },
  {
    id: 9,
    type: 'EXCESSIVE_ACCELERATION',
    description: 'Accélération excessive détectée',
    severity: 'HIGH',
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    carId: 12,
    car: { 
      id: 12,
      brand: 'Skoda', 
      model: 'Octavia', 
      licensePlate: '678234-L-12',
      userId: 6,
      owner: {
        id: 6,
        firstName: 'Rachid',
        lastName: 'Mansouri'
      }
    },
    location: { latitude: 31.69, longitude: -8.08 },
    deviceId: 'D2012',
    data: {
      acceleration: 9.0,
      speed: 50,
      direction: 'North',
      address: 'Boulevard Moulay Abdellah, Marrakech'
    },
    status: 'NEW',
    notes: ''
  },
  {
    id: 10,
    type: 'EXCESSIVE_SPEED',
    description: 'Vitesse excessive détectée',
    severity: 'HIGH',
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    carId: 2,
    car: { 
      id: 2,
      brand: 'Peugeot', 
      model: '308', 
      licensePlate: '789012-B-2',
      userId: 1,
      owner: {
        id: 1,
        firstName: 'Admin',
        lastName: 'Système'
      }
    },
    location: { latitude: 31.60, longitude: -8.00 },
    deviceId: 'D2002',
    data: {
      speed: 115,
      speedLimit: 80,
      direction: 'South-West',
      address: 'Route de Fès, Marrakech'
    },
    status: 'RESOLVED',
    notes: 'Formation de conduite sécuritaire programmée'
  }
];

// Service pour la gestion des alertes
const AlertService = {
  getAllAlerts: async (params) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filtrer les alertes en fonction des paramètres
      let filteredAlerts = [...mockAlerts];
      
      if (params?.userId) {
        // Filtrer par l'utilisateur propriétaire de la voiture associée à l'alerte
        filteredAlerts = filteredAlerts.filter(alert => 
          alert.car && alert.car.userId === parseInt(params.userId)
        );
      }
      
      if (params?.carId) {
        filteredAlerts = filteredAlerts.filter(alert => 
          alert.carId === parseInt(params.carId)
        );
      }
      
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredAlerts = filteredAlerts.filter(alert => 
          alert.description.toLowerCase().includes(searchLower) ||
          alert.type.toLowerCase().includes(searchLower) ||
          alert.car?.brand.toLowerCase().includes(searchLower) ||
          alert.car?.model.toLowerCase().includes(searchLower) ||
          alert.car?.licensePlate.toLowerCase().includes(searchLower)
        );
      }
      
      if (params?.severity) {
        filteredAlerts = filteredAlerts.filter(alert => 
          alert.severity === params.severity
        );
      }
      
      if (params?.status) {
        filteredAlerts = filteredAlerts.filter(alert => 
          alert.status === params.status
        );
      }
      
      if (params?.type) {
        filteredAlerts = filteredAlerts.filter(alert => 
          alert.type === params.type
        );
      }
      
      if (params?.startDate) {
        const startDate = new Date(params.startDate);
        filteredAlerts = filteredAlerts.filter(alert => 
          new Date(alert.timestamp) >= startDate
        );
      }
      
      if (params?.endDate) {
        const endDate = new Date(params.endDate);
        filteredAlerts = filteredAlerts.filter(alert => 
          new Date(alert.timestamp) <= endDate
        );
      }
      
      // Trier les résultats
      if (params?.sort) {
        const [field, order] = params.sort.split(':');
        filteredAlerts.sort((a, b) => {
          let comparison = 0;
          
          if (field === 'timestamp') {
            comparison = new Date(a.timestamp) - new Date(b.timestamp);
          } else if (field === 'severity') {
            const severityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
            comparison = severityOrder[a.severity] - severityOrder[b.severity];
          } else if (field === 'status') {
            const statusOrder = { 'NEW': 3, 'ACKNOWLEDGED': 2, 'RESOLVED': 1 };
            comparison = statusOrder[a.status] - statusOrder[b.status];
          }
          
          return order === 'desc' ? -comparison : comparison;
        });
      } else {
        // Par défaut, trier par date décroissante (le plus récent en premier)
        filteredAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }
      
      // Compter le total avant pagination
      const total = filteredAlerts.length;
      
      // Paginer
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const start = (page - 1) * limit;
      const end = start + limit;
      
      const paginatedAlerts = filteredAlerts.slice(start, end);
      
      return {
        data: paginatedAlerts,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
      
      // Dans une implémentation réelle:
      // return await api.get('/alerts', { params });
    } catch (error) {
      throw error;
    }
  },
  
  getAlertById: async (id) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const alert = mockAlerts.find(alert => alert.id === parseInt(id));
      
      if (!alert) {
        throw { response: { status: 404, data: { message: 'Alerte non trouvée' } } };
      }
      
      return { data: alert };
      
      // Dans une implémentation réelle:
      // return await api.get(`/alerts/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  getAlertsByCarId: async (carId, params = {}) => {
    try {
      // Ajouter le paramètre carId et déléguer à getAllAlerts
      return await AlertService.getAllAlerts({
        ...params,
        carId: carId
      });
      
      // Dans une implémentation réelle:
      // return await api.get(`/cars/${carId}/alerts`, { params });
    } catch (error) {
      throw error;
    }
  },
  
  getAlertsByUserId: async (userId, params = {}) => {
    try {
      // Ajouter le paramètre userId et déléguer à getAllAlerts
      return await AlertService.getAllAlerts({
        ...params,
        userId: userId
      });
      
      // Dans une implémentation réelle:
      // return await api.get(`/users/${userId}/alerts`, { params });
    } catch (error) {
      throw error;
    }
  },
  
  updateAlert: async (id, alertData) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const alertIndex = mockAlerts.findIndex(alert => alert.id === parseInt(id));
      
      if (alertIndex === -1) {
        throw { response: { status: 404, data: { message: 'Alerte non trouvée' } } };
      }
      
      // Simulation de l'alerte mise à jour
      const updatedAlert = { 
        ...mockAlerts[alertIndex], 
        ...alertData, 
        updatedAt: new Date().toISOString() 
      };
      
      return { 
        success: true, 
        data: updatedAlert,
        message: 'Alerte mise à jour avec succès'
      };
      
      // Dans une implémentation réelle:
      // return await api.put(`/alerts/${id}`, alertData);
    } catch (error) {
      throw error;
    }
  },
  
  deleteAlert: async (id) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const alertIndex = mockAlerts.findIndex(alert => alert.id === parseInt(id));
      
      if (alertIndex === -1) {
        throw { response: { status: 404, data: { message: 'Alerte non trouvée' } } };
      }
      
      return { 
        success: true,
        message: 'Alerte supprimée avec succès'
      };
      
      // Dans une implémentation réelle:
      // return await api.delete(`/alerts/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  getAlertStats: async (params = {}) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filtrer les alertes si nécessaire
      let relevantAlerts = [...mockAlerts];
      
      if (params.userId) {
        relevantAlerts = relevantAlerts.filter(alert => 
          alert.car && alert.car.userId === parseInt(params.userId)
        );
      }
      
      if (params.carId) {
        relevantAlerts = relevantAlerts.filter(alert => 
          alert.carId === parseInt(params.carId)
        );
      }
      
      // Calculer des statistiques
      const totalAlerts = relevantAlerts.length;
      
      // Par sévérité
      const highSeverity = relevantAlerts.filter(alert => alert.severity === 'HIGH').length;
      const mediumSeverity = relevantAlerts.filter(alert => alert.severity === 'MEDIUM').length;
      const lowSeverity = relevantAlerts.filter(alert => alert.severity === 'LOW').length;
      
      // Par statut
      const newAlerts = relevantAlerts.filter(alert => alert.status === 'NEW').length;
      const acknowledgedAlerts = relevantAlerts.filter(alert => alert.status === 'ACKNOWLEDGED').length;
      const resolvedAlerts = relevantAlerts.filter(alert => alert.status === 'RESOLVED').length;
      
      // Par type
      const alertsByType = {};
      relevantAlerts.forEach(alert => {
        if (!alertsByType[alert.type]) {
          alertsByType[alert.type] = 0;
        }
        alertsByType[alert.type]++;
      });
      
      // Par voiture
      const alertsByCar = {};
      relevantAlerts.forEach(alert => {
        const carId = alert.carId;
        if (!alertsByCar[carId]) {
          alertsByCar[carId] = {
            count: 0,
            car: alert.car
          };
        }
        alertsByCar[carId].count++;
      });
      
      // Les tendances par heure de la journée (0-23)
      const alertsByHour = Array(24).fill(0);
      relevantAlerts.forEach(alert => {
        const hour = new Date(alert.timestamp).getHours();
        alertsByHour[hour]++;
      });
      
      // Les tendances par jour de la semaine (0-6, 0 = dimanche)
      const alertsByDay = Array(7).fill(0);
      relevantAlerts.forEach(alert => {
        const day = new Date(alert.timestamp).getDay();
        alertsByDay[day]++;
      });
      
      return {
        data: {
          totalAlerts,
          
          // Statistiques par sévérité
          severityStats: {
            high: highSeverity,
            medium: mediumSeverity,
            low: lowSeverity
          },
          
          // Statistiques par statut
          statusStats: {
            new: newAlerts,
            acknowledged: acknowledgedAlerts,
            resolved: resolvedAlerts
          },
          
          // Statistiques par type
          typeStats: Object.entries(alertsByType).map(([type, count]) => ({
            type,
            count,
            percentage: Math.round((count / totalAlerts) * 100)
          })),
          
          // Top 5 des voitures avec le plus d'alertes
          topCars: Object.values(alertsByCar)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map(item => ({
              carId: item.car.id,
              brand: item.car.brand,
              model: item.car.model,
              licensePlate: item.car.licensePlate,
              count: item.count,
              percentage: Math.round((item.count / totalAlerts) * 100)
            })),
          
          // Tendances temporelles
          timeStats: {
            byHour: alertsByHour.map((count, hour) => ({ hour, count })),
            byDay: alertsByDay.map((count, day) => ({ 
              day, 
              dayName: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][day],
              count 
            }))
          }
        }
      };
      
      // Dans une implémentation réelle:
      // return await api.get('/alerts/stats', { params });
    } catch (error) {
      throw error;
    }
  }
};

export default AlertService;