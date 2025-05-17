import api from './api';

// Données de test pour simuler les utilisateurs
const mockUsers = [
  {
    id: 1,
    firstName: 'Admin',
    lastName: 'Système',
    email: 'admin@ai-drive.com',
    phone: '+212 661 123456',
    role: 'ADMIN',
    status: 'ACTIVE',
    licenseNumber: 'A123456',
    createdAt: '2023-01-15T10:30:00Z',
    lastLogin: '2025-05-16T08:45:00Z',
    carsCount: 3
  },
  {
    id: 2,
    firstName: 'Mohamed',
    lastName: 'Alami',
    email: 'user@ai-drive.com',
    phone: '+212 662 789012',
    role: 'USER',
    status: 'ACTIVE',
    licenseNumber: 'B654321',
    createdAt: '2023-02-20T14:15:00Z',
    lastLogin: '2025-05-15T16:20:00Z',
    carsCount: 2
  },
  {
    id: 3,
    firstName: 'Fatima',
    lastName: 'Benali',
    email: 'fatima@example.com',
    phone: '+212 663 456789',
    role: 'USER',
    status: 'ACTIVE',
    licenseNumber: 'C987654',
    createdAt: '2023-03-10T09:45:00Z',
    lastLogin: '2025-05-10T11:30:00Z',
    carsCount: 1
  },
  {
    id: 4,
    firstName: 'Karim',
    lastName: 'Idrissi',
    email: 'karim@example.com',
    phone: '+212 664 234567',
    role: 'USER',
    status: 'INACTIVE',
    licenseNumber: 'D765432',
    createdAt: '2023-04-05T16:20:00Z',
    lastLogin: '2025-04-18T10:15:00Z',
    carsCount: 0
  },
  {
    id: 5,
    firstName: 'Yasmine',
    lastName: 'Tazi',
    email: 'yasmine@example.com',
    phone: '+212 665 345678',
    role: 'USER',
    status: 'ACTIVE',
    licenseNumber: 'E543210',
    createdAt: '2023-05-12T11:10:00Z',
    lastLogin: '2025-05-14T15:45:00Z',
    carsCount: 2
  },
  {
    id: 6,
    firstName: 'Rachid',
    lastName: 'Mansouri',
    email: 'rachid@example.com',
    phone: '+212 666 456789',
    role: 'MANAGER',
    status: 'ACTIVE',
    licenseNumber: 'F432109',
    createdAt: '2023-06-08T13:25:00Z',
    lastLogin: '2025-05-16T09:30:00Z',
    carsCount: 5
  }
];

const UserService = {
  getAllUsers: async (params) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filtrer et paginer si nécessaire
      let filteredUsers = [...mockUsers];
      
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        );
      }
      
      if (params?.role) {
        filteredUsers = filteredUsers.filter(user => user.role === params.role);
      }
      
      if (params?.status) {
        filteredUsers = filteredUsers.filter(user => user.status === params.status);
      }
      
      // Compter le total avant pagination
      const total = filteredUsers.length;
      
      // Paginer
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const start = (page - 1) * limit;
      const end = start + limit;
      
      const paginatedUsers = filteredUsers.slice(start, end);
      
      return {
        data: paginatedUsers,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
      
      // Dans une implémentation réelle:
      // return await api.get('/users', { params });
    } catch (error) {
      throw error;
    }
  },
  
  getUserById: async (id) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = mockUsers.find(user => user.id === parseInt(id));
      
      if (!user) {
        throw { response: { status: 404, data: { message: 'Utilisateur non trouvé' } } };
      }
      
      return { data: user };
      
      // Dans une implémentation réelle:
      // return await api.get(`/users/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  createUser: async (userData) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Créer un nouvel utilisateur mockée
      const newUser = {
        id: Math.max(...mockUsers.map(u => u.id)) + 1,
        ...userData,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        carsCount: 0,
        status: 'ACTIVE'
      };
      
      // En réalité, nous ne modifions pas mockUsers car c'est juste une simulation
      // mockUsers.push(newUser);
      
      return { 
        success: true, 
        data: newUser,
        message: 'Utilisateur créé avec succès'
      };
      
      // Dans une implémentation réelle:
      // return await api.post('/users', userData);
    } catch (error) {
      throw error;
    }
  },
  
  updateUser: async (id, userData) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userIndex = mockUsers.findIndex(user => user.id === parseInt(id));
      
      if (userIndex === -1) {
        throw { response: { status: 404, data: { message: 'Utilisateur non trouvé' } } };
      }
      
      // En réalité, nous ne modifions pas mockUsers car c'est juste une simulation
      // const updatedUser = { ...mockUsers[userIndex], ...userData, updatedAt: new Date().toISOString() };
      // mockUsers[userIndex] = updatedUser;
      
      // Simulation de l'utilisateur mis à jour
      const updatedUser = { 
        ...mockUsers[userIndex], 
        ...userData, 
        updatedAt: new Date().toISOString() 
      };
      
      return { 
        success: true, 
        data: updatedUser,
        message: 'Utilisateur mis à jour avec succès'
      };
      
      // Dans une implémentation réelle:
      // return await api.put(`/users/${id}`, userData);
    } catch (error) {
      throw error;
    }
  },
  
  deleteUser: async (id) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const userIndex = mockUsers.findIndex(user => user.id === parseInt(id));
      
      if (userIndex === -1) {
        throw { response: { status: 404, data: { message: 'Utilisateur non trouvé' } } };
      }
      
      // En réalité, nous ne supprimons pas de mockUsers car c'est juste une simulation
      // mockUsers.splice(userIndex, 1);
      
      return { 
        success: true,
        message: 'Utilisateur supprimé avec succès'
      };
      
      // Dans une implémentation réelle:
      // return await api.delete(`/users/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  getUserStats: async () => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Calculer des statistiques à partir des données mockées
      const totalUsers = mockUsers.length;
      const activeUsers = mockUsers.filter(user => user.status === 'ACTIVE').length;
      const inactiveUsers = totalUsers - activeUsers;
      const adminUsers = mockUsers.filter(user => user.role === 'ADMIN').length;
      const managerUsers = mockUsers.filter(user => user.role === 'MANAGER').length;
      const regularUsers = mockUsers.filter(user => user.role === 'USER').length;
      
      return {
        data: {
          totalUsers,
          activeUsers,
          inactiveUsers,
          adminUsers,
          managerUsers,
          regularUsers,
          usersWithCars: mockUsers.filter(user => user.carsCount > 0).length,
          usersWithoutCars: mockUsers.filter(user => user.carsCount === 0).length,
          // Simuler une distribution des utilisateurs par mois d'inscription
          registrationsByMonth: [
            { month: 'Jan', count: 1 },
            { month: 'Feb', count: 1 },
            { month: 'Mar', count: 1 },
            { month: 'Apr', count: 1 },
            { month: 'May', count: 1 },
            { month: 'Jun', count: 1 },
            { month: 'Jul', count: 0 },
            { month: 'Aug', count: 0 },
            { month: 'Sep', count: 0 },
            { month: 'Oct', count: 0 },
            { month: 'Nov', count: 0 },
            { month: 'Dec', count: 0 }
          ]
        }
      };
      
      // Dans une implémentation réelle:
      // return await api.get('/users/stats');
    } catch (error) {
      throw error;
    }
  }
};

export default UserService;