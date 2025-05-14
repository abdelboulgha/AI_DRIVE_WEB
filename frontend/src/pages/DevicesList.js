import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  CircularProgress, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import SensorDataService from '../api/sensorDataService';

const DevicesList = () => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const response = await SensorDataService.getDeviceList();
        setDevices(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement de la liste des appareils');
        setLoading(false);
        console.error(err);
      }
    };

    fetchDevices();
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
        Liste des Appareils
      </Typography>
      
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID de l'appareil</TableCell>
                <TableCell>Dernière activité</TableCell>
                <TableCell>Données accéléromètre</TableCell>
                <TableCell>Données GPS</TableCell>
                <TableCell>Données gyroscope</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {devices.map((deviceId) => (
                <TableRow key={deviceId}>
                  <TableCell>{deviceId}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default DevicesList;