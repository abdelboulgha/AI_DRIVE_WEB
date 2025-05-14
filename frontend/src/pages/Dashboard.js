import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import SensorDataService from '../api/sensorDataService';
import StatCard from '../components/dashboard/StatCard';
import AccelerometerChart from '../components/charts/AccelerometerChart';
import GPSMap from '../components/maps/GPSMap';
import GyroscopeChart from '../components/charts/GyroscopeChart';
import DeviceActivityTimeline from '../components/dashboard/DeviceActivityTimeline';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await SensorDataService.getDashboardData();
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données du tableau de bord');
        setLoading(false);
        console.error(err);
      }
    };

    fetchDashboardData();
    
    // Actualiser les données toutes les 30 secondes
    const intervalId = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord AI-Drive
      </Typography>
      
      {/* Cartes statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Appareils Actifs" 
            value={dashboardData.activeDevices} 
            icon="DevicesOther" 
            color="#4CAF50" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Points GPS" 
            value={dashboardData.totalGPSPoints} 
            icon="LocationOn" 
            color="#2196F3" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Enregistrements Accéléromètre" 
            value={dashboardData.totalAccelerometerReadings} 
            icon="Speed" 
            color="#FF9800" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Enregistrements Gyroscope" 
            value={dashboardData.totalGyroscopeReadings} 
            icon="ThreeSixty" 
            color="#9C27B0" 
          />
        </Grid>
      </Grid>
      
      {/* Graphiques et cartes */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Données GPS des dernières 24h
            </Typography>
            <GPSMap gpsData={dashboardData.recentGPSData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Activité des appareils
            </Typography>
            <DeviceActivityTimeline activities={dashboardData.deviceActivities} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Données d'accéléromètre récentes
            </Typography>
            <AccelerometerChart data={dashboardData.recentAccelerometerData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Données de gyroscope récentes
            </Typography>
            <GyroscopeChart data={dashboardData.recentGyroscopeData} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;