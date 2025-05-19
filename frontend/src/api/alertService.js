import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const AlertService = {
  getAllAlerts: async (params) => {
    try {
      const response = await axios.get(`${API_URL}/alerts`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },

  getAlertsByUserId: async (userId, params) => {
    try {
      const response = await axios.get(`${API_URL}/alerts/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching alerts for user ${userId}:`, error);
      throw error;
    }
  },

  getAlertsByCarId: async (vehicleId, params) => {
    try {
      const response = await axios.get(`${API_URL}/alerts/vehicle/${vehicleId}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching alerts for vehicle ${vehicleId}:`, error);
      throw error;
    }
  },

  getAlertById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/alerts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching alert ${id}:`, error);
      throw error;
    }
  },

  createAlert: async (alertData) => {
    try {
      const response = await axios.post(`${API_URL}/alerts`, alertData);
      return response.data;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  },

  updateAlert: async (id, alertData) => {
    try {
      const response = await axios.put(`${API_URL}/alerts/${id}`, alertData);
      return response.data;
    } catch (error) {
      console.error(`Error updating alert ${id}:`, error);
      throw error;
    }
  },

  deleteAlert: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/alerts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting alert ${id}:`, error);
      throw error;
    }
  },

  getAlertStats: async (params) => {
    try {
      const response = await axios.get(`${API_URL}/alerts/stats`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching alert stats:', error);
      throw error;
    }
  }
};

export default AlertService;