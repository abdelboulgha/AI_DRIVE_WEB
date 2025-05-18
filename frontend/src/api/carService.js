import api from './api';

// Données mockées pour simuler les voitures
const mockCars = [
  {
    id: 1,
    brand: 'Renault',
    model: 'Clio',
    year: 2020,
    licensePlate: '123456-A-1',
    color: 'Rouge',
    userId: 1,
    status: 'ACTIVE',
    lastActivity: '2025-05-17T08:15:00Z',
    fuelType: 'Essence',
    mileage: 28500,
    deviceId: 'D2001',
    vin: 'VF1RFB00067123456',
    safetyScore: 87,
    alertsCount: 2,
    owner: {
      id: 1,
      firstName: 'Admin',
      lastName: 'Système'
    }
  },
  {
    id: 2,
    brand: 'Peugeot',
    model: '308',
    year: 2021,
    licensePlate: '789012-B-2',
    color: 'Noir',
    userId: 1,
    status: 'ACTIVE',
    lastActivity: '2025-05-16T17:30:00Z',
    fuelType: 'Diesel',
    mileage: 15800,
    deviceId: 'D2002',
    vin: 'VF38CAHNC8L123456',
    safetyScore: 92,
    alertsCount: 0,
    owner: {
      id: 1,
      firstName: 'Admin',
      lastName: 'Système'
    }
  },
  {
    id: 3,
    brand: 'Dacia',
    model: 'Duster',
    year: 2019,
    licensePlate: '345678-C-3',
    color: 'Blanc',
    userId: 1,
    status: 'INACTIVE',
    lastActivity: '2025-05-10T12:45:00Z',
    fuelType: 'Essence',
    mileage: 42000,
    deviceId: 'D2003',
    vin: 'UU1HSDC5G65123456',
    safetyScore: 65,
    alertsCount: 5,
    owner: {
      id: 1,
      firstName: 'Admin',
      lastName: 'Système'
    }
  },
  {
    id: 4,
    brand: 'Toyota',
    model: 'Corolla',
    year: 2022,
    licensePlate: '901234-D-4',
    color: 'Gris',
    userId: 2,
    status: 'ACTIVE',
    lastActivity: '2025-05-17T09:20:00Z',
    fuelType: 'Hybride',
    mileage: 12300,
    deviceId: 'D2004',
    vin: 'SB1BR56L50F123456',
    safetyScore: 95,
    alertsCount: 0,
    owner: {
      id: 2,
      firstName: 'Mohamed',
      lastName: 'Alami'
    }
  },
  {
    id: 5,
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2021,
    licensePlate: '567890-E-5',
    color: 'Bleu',
    userId: 2,
    status: 'ACTIVE',
    lastActivity: '2025-05-16T14:10:00Z',
    fuelType: 'Diesel',
    mileage: 22000,
    deviceId: 'D2005',
    vin: 'WVWZZZ1KZ5W123456',
    safetyScore: 88,
    alertsCount: 1,
    owner: {
      id: 2,
      firstName: 'Mohamed',
      lastName: 'Alami'
    }
  },
  {
    id: 6,
    brand: 'Fiat',
    model: '500',
    year: 2020,
    licensePlate: '678901-F-6',
    color: 'Jaune',
    userId: 3,
    status: 'ACTIVE',
    lastActivity: '2025-05-15T11:30:00Z',
    fuelType: 'Essence',
    mileage: 18500,
    deviceId: 'D2006',
    vin: 'ZFA31200000123456',
    safetyScore: 82,
    alertsCount: 3,
    owner: {
      id: 3,
      firstName: 'Fatima',
      lastName: 'Benali'
    }
  },
  {
    id: 7,
    brand: 'Mercedes',
    model: 'Classe C',
    year: 2022,
    licensePlate: '123789-G-7',
    color: 'Noir',
    userId: 5,
    status: 'ACTIVE',
    lastActivity: '2025-05-17T10:45:00Z',
    fuelType: 'Diesel',
    mileage: 9800,
    deviceId: 'D2007',
    vin: 'WDD2050071R123456',
    safetyScore: 91,
    alertsCount: 0,
    owner: {
      id: 5,
      firstName: 'Yasmine',
      lastName: 'Tazi'
    }
  },
  {
    id: 8,
    brand: 'Audi',
    model: 'A3',
    year: 2021,
    licensePlate: '456012-H-8',
    color: 'Gris',
    userId: 5,
    status: 'INACTIVE',
    lastActivity: '2025-04-30T16:20:00Z',
    fuelType: 'Essence',
    mileage: 16700,
    deviceId: 'D2008',
    vin: 'WAUZZZ8P5AA123456',
    safetyScore: 79,
    alertsCount: 4,
    owner: {
      id: 5,
      firstName: 'Yasmine',
      lastName: 'Tazi'
    }
  },
  {
    id: 9,
    brand: 'Ford',
    model: 'Focus',
    year: 2019,
    licensePlate: '789345-I-9',
    color: 'Rouge',
    userId: 6,
    status: 'ACTIVE',
    lastActivity: '2025-05-16T18:05:00Z',
    fuelType: 'Diesel',
    mileage: 35600,
    deviceId: 'D2009',
    vin: 'WF05XXGCC5FR123456',
    safetyScore: 76,
    alertsCount: 2,
    owner: {
      id: 6,
      firstName: 'Rachid',
      lastName: 'Mansouri'
    }
  },
  {
    id: 10,
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2021,
    licensePlate: '012678-J-10',
    color: 'Blanc',
    userId: 6,
    status: 'ACTIVE',
    lastActivity: '2025-05-17T07:30:00Z',
    fuelType: 'Essence',
    mileage: 14300,
    deviceId: 'D2010',
    vin: 'TMAJ381AAFJ123456',
    safetyScore: 90,
    alertsCount: 1,
    owner: {
      id: 6,
      firstName: 'Rachid',
      lastName: 'Mansouri'
    }
  },
  {
    id: 11,
    brand: 'Kia',
    model: 'Sportage',
    year: 2020,
    licensePlate: '345901-K-11',
    color: 'Vert',
    userId: 6,
    status: 'ACTIVE',
    lastActivity: '2025-05-15T09:15:00Z',
    fuelType: 'Diesel',
    mileage: 27400,
    deviceId: 'D2011',
    vin: 'U5YPC813DHL123456',
    safetyScore: 83,
    alertsCount: 2,
    owner: {
      id: 6,
      firstName: 'Rachid',
      lastName: 'Mansouri'
    }
  },
  {
    id: 12,
    brand: 'Skoda',
    model: 'Octavia',
    year: 2022,
    licensePlate: '678234-L-12',
    color: 'Gris',
    userId: 6,
    status: 'ACTIVE',
    lastActivity: '2025-05-16T15:40:00Z',
    fuelType: 'Diesel',
    mileage: 8900,
    deviceId: 'D2012',
    vin: 'TMBEG7NE7E0123456',
    safetyScore: 94,
    alertsCount: 0,
    owner: {
      id: 6,
      firstName: 'Rachid',
      lastName: 'Mansouri'
    }
  },
  {
    id: 13,
    brand: 'Citroën',
    model: 'C3',
    year: 2020,
    licensePlate: '901567-M-13',
    color: 'Bleu',
    userId: 6,
    status: 'INACTIVE',
    lastActivity: '2025-05-01T13:25:00Z',
    fuelType: 'Essence',
    mileage: 19800,
    deviceId: 'D2013',
    vin: 'VF7SC5FS9EW123456',
    safetyScore: 81,
    alertsCount: 3,
    owner: {
      id: 6,
      firstName: 'Rachid',
      lastName: 'Mansouri'
    }
  }
];

// Service pour la gestion des voitures
const CarService = {
  getAllCars: async (params) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filtrer les voitures en fonction des paramètres
      let filteredCars = [...mockCars];
      
      if (params?.userId) {
        filteredCars = filteredCars.filter(car => car.userId === parseInt(params.userId));
      }
      
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredCars = filteredCars.filter(car => 
          car.brand.toLowerCase().includes(searchLower) ||
          car.model.toLowerCase().includes(searchLower) ||
          car.licensePlate.toLowerCase().includes(searchLower) ||
          `${car.owner.firstName} ${car.owner.lastName}`.toLowerCase().includes(searchLower)
        );
      }
      
      if (params?.status) {
        filteredCars = filteredCars.filter(car => car.status === params.status);
      }
      
      // Trier les résultats
      if (params?.sort) {
        const [field, order] = params.sort.split(':');
        filteredCars.sort((a, b) => {
          let comparison = 0;
          
          if (field === 'brand') {
            comparison = a.brand.localeCompare(b.brand);
          } else if (field === 'model') {
            comparison = a.model.localeCompare(b.model);
          } else if (field === 'year') {
            comparison = a.year - b.year;
          } else if (field === 'lastActivity') {
            comparison = new Date(a.lastActivity) - new Date(b.lastActivity);
          } else if (field === 'safetyScore') {
            comparison = a.safetyScore - b.safetyScore;
          }
          
          return order === 'desc' ? -comparison : comparison;
        });
      }
      
      // Compter le total avant pagination
      const total = filteredCars.length;
      
      // Paginer
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const start = (page - 1) * limit;
      const end = start + limit;
      
      const paginatedCars = filteredCars.slice(start, end);
      
      return {
        data: paginatedCars,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
      
      // Dans une implémentation réelle:
      // return await api.get('/cars', { params });
    } catch (error) {
      throw error;
    }
  },
  
  getCarById: async (id) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const car = mockCars.find(car => car.id === parseInt(id));
      
      if (!car) {
        throw { response: { status: 404, data: { message: 'Véhicule non trouvé' } } };
      }
      
      return { data: car };
      
      // Dans une implémentation réelle:
      // return await api.get(`/cars/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  getCarsByUserId: async (userId, params = {}) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Filtrer les voitures de l'utilisateur
      const userCars = mockCars.filter(car => car.userId === parseInt(userId));
      
      let filteredCars = [...userCars];
      
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredCars = filteredCars.filter(car => 
          car.brand.toLowerCase().includes(searchLower) ||
          car.model.toLowerCase().includes(searchLower) ||
          car.licensePlate.toLowerCase().includes(searchLower)
        );
      }
      
      if (params?.status) {
        filteredCars = filteredCars.filter(car => car.status === params.status);
      }
      
      // Compter le total avant pagination
      const total = filteredCars.length;
      
      // Paginer
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const start = (page - 1) * limit;
      const end = start + limit;
      
      const paginatedCars = filteredCars.slice(start, end);
      
      return {
        data: paginatedCars,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
      
      // Dans une implémentation réelle:
      // return await api.get(`/users/${userId}/cars`, { params });
    } catch (error) {
      throw error;
    }
  },
  
  createCar: async (carData) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Créer une nouvelle voiture mockée
      const newCar = {
        id: Math.max(...mockCars.map(c => c.id)) + 1,
        ...carData,
        status: 'ACTIVE',
        lastActivity: null,
        alertsCount: 0,
        safetyScore: 100
      };
      
      // En réalité, nous ne modifions pas mockCars car c'est juste une simulation
      // mockCars.push(newCar);
      
      return { 
        success: true, 
        data: newCar,
        message: 'Véhicule créé avec succès'
      };
      
      // Dans une implémentation réelle:
      // return await api.post('/cars', carData);
    } catch (error) {
      throw error;
    }
  },
  
  updateCar: async (id, carData) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const carIndex = mockCars.findIndex(car => car.id === parseInt(id));
      
      if (carIndex === -1) {
        throw { response: { status: 404, data: { message: 'Véhicule non trouvé' } } };
      }
      
      // Simulation de la voiture mise à jour
      const updatedCar = { 
        ...mockCars[carIndex], 
        ...carData, 
        updatedAt: new Date().toISOString() 
      };
      
      return { 
        success: true, 
        data: updatedCar,
        message: 'Véhicule mis à jour avec succès'
      };
      
      // Dans une implémentation réelle:
      // return await api.put(`/cars/${id}`, carData);
    } catch (error) {
      throw error;
    }
  },
  
  deleteCar: async (id) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const carIndex = mockCars.findIndex(car => car.id === parseInt(id));
      
      if (carIndex === -1) {
        throw { response: { status: 404, data: { message: 'Véhicule non trouvé' } } };
      }
      
      return { 
        success: true,
        message: 'Véhicule supprimé avec succès'
      };
      
      // Dans une implémentation réelle:
      // return await api.delete(`/cars/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  getCarStats: async (userId) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filtrer les voitures de l'utilisateur si nécessaire
      const relevantCars = userId 
        ? mockCars.filter(car => car.userId === parseInt(userId))
        : mockCars;
      
      // Calculer des statistiques à partir des données mockées
      const totalCars = relevantCars.length;
      const activeCars = relevantCars.filter(car => car.status === 'ACTIVE').length;
      const inactiveCars = totalCars - activeCars;
      
      // Calculer la répartition par marque
      const brandDistribution = {};
      relevantCars.forEach(car => {
        if (!brandDistribution[car.brand]) {
          brandDistribution[car.brand] = 0;
        }
        brandDistribution[car.brand]++;
      });
      
      const brandStats = Object.entries(brandDistribution).map(([brand, count]) => ({
        brand,
        count,
        percentage: Math.round((count / totalCars) * 100)
      }));
      
      // Calculer la répartition par année
      const yearDistribution = {};
      relevantCars.forEach(car => {
        if (!yearDistribution[car.year]) {
          yearDistribution[car.year] = 0;
        }
        yearDistribution[car.year]++;
      });
      
      const yearStats = Object.entries(yearDistribution).map(([year, count]) => ({
        year: parseInt(year),
        count
      })).sort((a, b) => a.year - b.year);
      
      // Calculer la répartition par type de carburant
      const fuelDistribution = {};
      relevantCars.forEach(car => {
        if (!fuelDistribution[car.fuelType]) {
          fuelDistribution[car.fuelType] = 0;
        }
        fuelDistribution[car.fuelType]++;
      });
      
      const fuelStats = Object.entries(fuelDistribution).map(([fuelType, count]) => ({
        fuelType,
        count,
        percentage: Math.round((count / totalCars) * 100)
      }));
      
      // Calculer la répartition par score de sécurité
      const safetyScoreRanges = {
        excellent: relevantCars.filter(car => car.safetyScore >= 90).length,
        good: relevantCars.filter(car => car.safetyScore >= 80 && car.safetyScore < 90).length,
        average: relevantCars.filter(car => car.safetyScore >= 70 && car.safetyScore < 80).length,
        poor: relevantCars.filter(car => car.safetyScore < 70).length
      };
      
      const avgSafetyScore = relevantCars.length > 0
        ? Math.round(relevantCars.reduce((sum, car) => sum + car.safetyScore, 0) / relevantCars.length)
        : 0;
      
      return {
        data: {
          totalCars,
          activeCars,
          inactiveCars,
          brandStats,
          yearStats,
          fuelStats,
          safetyScoreRanges,
          avgSafetyScore,
          alertsCount: relevantCars.reduce((sum, car) => sum + car.alertsCount, 0),
          totalMileage: relevantCars.reduce((sum, car) => sum + car.mileage, 0)
        }
      };
      
      // Dans une implémentation réelle:
      // return await api.get(userId ? `/users/${userId}/car-stats` : '/cars/stats');
    } catch (error) {
      throw error;
    }
  }
};

export default CarService;