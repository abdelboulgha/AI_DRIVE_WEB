import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress } from '@mui/material';
// import GPSMap from '../components/maps/GPSMap';
// import SensorDataService from '../api/sensorDataService';

// Données temporaires
const mockData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  latitude: 31.65 + (Math.random() * 0.1),
  longitude: -8.01 + (Math.random() * 0.1),
  altitude: 400 + (Math.random() * 50),
  speed: Math.random() * 60,
  deviceId: `device${Math.floor(Math.random() * 3) + 1}`,
  timestamp: new Date(Date.now() - i * 60000).toISOString()
}));

const GPSData = () => {
  const [loading, setLoading] = useState(true);
  const [gpsData, setGpsData] = useState([]);
  
  useEffect(() => {
    // Utilisation des données simulées
    setGpsData(mockData);
    setLoading(false);
    
    // Pour l'appel API réel, décommentez ceci:
    /*
    const fetchGPSData = async () => {
      try {
        const response = await SensorDataService.getGPSData();
        setGpsData(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchGPSData();
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
        Données GPS
      </Typography>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 500 }}>
        {/* <GPSMap gpsData={gpsData} /> */}
        <Typography>Les données GPS sont disponibles mais la carte est en cours de développement</Typography>
      </Paper>
    </Container>
  );
};

export default GPSData;