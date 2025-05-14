import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress } from '@mui/material';
import AccelerometerChart from '../components/charts/AccelerometerChart';
// import SensorDataService from '../api/sensorDataService';

// Données temporaires
const mockData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  x: Math.random() * 10 - 5,
  y: Math.random() * 10 - 5,
  z: Math.random() * 10 - 5,
  deviceId: `device${Math.floor(Math.random() * 3) + 1}`,
  timestamp: new Date(Date.now() - i * 60000).toISOString()
}));

const AccelerometerData = () => {
  const [loading, setLoading] = useState(true);
  const [accelerometerData, setAccelerometerData] = useState([]);
  
  useEffect(() => {
    // Utilisation des données simulées
    setAccelerometerData(mockData);
    setLoading(false);
    
    // Pour l'appel API réel, décommentez ceci:
    /*
    const fetchAccelerometerData = async () => {
      try {
        const response = await SensorDataService.getAccelerometerData();
        setAccelerometerData(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchAccelerometerData();
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
        Données Accéléromètre
      </Typography>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 500 }}>
        <AccelerometerChart data={accelerometerData} />
      </Paper>
    </Container>
  );
};

export default AccelerometerData;