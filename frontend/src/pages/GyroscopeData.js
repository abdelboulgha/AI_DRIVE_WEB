import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress } from '@mui/material';
import GyroscopeChart from '../components/charts/GyroscopeChart';
// import SensorDataService from '../api/sensorDataService';

// Données temporaires
const mockData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  rotationX: Math.random() * 6 - 3,
  rotationY: Math.random() * 6 - 3,
  rotationZ: Math.random() * 6 - 3,
  deviceId: `device${Math.floor(Math.random() * 3) + 1}`,
  timestamp: new Date(Date.now() - i * 60000).toISOString()
}));

const GyroscopeData = () => {
  const [loading, setLoading] = useState(true);
  const [gyroscopeData, setGyroscopeData] = useState([]);
  
  useEffect(() => {
    // Utilisation des données simulées
    setGyroscopeData(mockData);
    setLoading(false);
    
    // Pour l'appel API réel, décommentez ceci:
    /*
    const fetchGyroscopeData = async () => {
      try {
        const response = await SensorDataService.getGyroscopeData();
        setGyroscopeData(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchGyroscopeData();
    */
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Données Gyroscope
      </Typography>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 500 }}>
        <GyroscopeChart data={gyroscopeData} />
      </Paper>
    </Container>
  );
};

export default GyroscopeData;