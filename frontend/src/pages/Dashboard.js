import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button,
  CircularProgress, 
  Avatar,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondary,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tab,
  Tabs,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Badge
} from '@mui/material';
import { 
  DirectionsCar as DirectionsCarIcon,
  Person as PersonIcon,
  Speed as SpeedIcon,
  DevicesOther as DevicesOtherIcon,
  ThreeSixty as ThreeSixtyIcon,
  LocationOn as LocationOnIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Timeline as TimelineIcon,
  LocalGasStation as LocalGasStationIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SensorDataService from '../api/sensorDataService';
import UserService from '../api/userService';
import CarService from '../api/carService';
import GPSMap from '../components/maps/GPSMap';
import AccelerometerChart from '../components/charts/AccelerometerChart';
import GyroscopeChart from '../components/charts/GyroscopeChart';
import DeviceActivityTimeline from '../components/dashboard/DeviceActivityTimeline';
import StatCard from '../components/dashboard/StatCard';
import authService from '../api/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [carStats, setCarStats] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [recentCars, setRecentCars] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [alertsTabValue, setAlertsTabValue] = useState(0);
  const [error, setError] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentUserId] = useState(authService.getCurrentUserId());
  const [isAdmin] = useState(authService.isAdmin());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les données du tableau de bord
        const response = await SensorDataService.getDashboardData();
        setDashboardData(response.data);
        
        // Récupérer les statistiques utilisateurs
        const userStatsResponse = await UserService.getUserStats();
        setUserStats(userStatsResponse.data);
        
        // Récupérer les statistiques des voitures
        const carStatsResponse = await CarService.getCarStats();
        setCarStats(carStatsResponse.data);
        
        // Simuler les alertes récentes
        setRecentAlerts([
          {
            id: 1,
            type: 'HARSH_BRAKING',
            description: 'Freinage brusque détecté',
            severity: 'HIGH',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            carId: 4,
            car: { brand: 'Toyota', model: 'Corolla', licensePlate: '901234-D-4' },
            location: { latitude: 31.63, longitude: -8.02 },
            deviceId: 'D2004'
          },
          {
            id: 2,
            type: 'EXCESSIVE_ACCELERATION',
            description: 'Accélération excessive détectée',
            severity: 'MEDIUM',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            carId: 9,
            car: { brand: 'Ford', model: 'Focus', licensePlate: '789345-I-9' },
            location: { latitude: 31.64, longitude: -8.03 },
            deviceId: 'D2009'
          },
          {
            id: 3,
            type: 'DANGEROUS_TURN',
            description: 'Virage dangereux détecté',
            severity: 'LOW',
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            carId: 11,
            car: { brand: 'Kia', model: 'Sportage', licensePlate: '345901-K-11' },
            location: { latitude: 31.62, longitude: -8.01 },
            deviceId: 'D2011'
          },
          {
            id: 4,
            type: 'HARSH_BRAKING',
            description: 'Freinage brusque détecté',
            severity: 'MEDIUM',
            timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
            carId: 3,
            car: { brand: 'Dacia', model: 'Duster', licensePlate: '345678-C-3' },
            location: { latitude: 31.65, longitude: -8.04 },
            deviceId: 'D2003'
          },
          {
            id: 5,
            type: 'EXCESSIVE_SPEED',
            description: 'Vitesse excessive détectée',
            severity: 'HIGH',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            carId: 1,
            car: { brand: 'Renault', model: 'Clio', licensePlate: '123456-A-1' },
            location: { latitude: 31.61, longitude: -8.02 },
            deviceId: 'D2001'
          }
        ]);
        
        // Récupérer les voitures récentes
        const carsResponse = await CarService.getAllCars({ 
          limit: 5, 
          sort: 'lastActivity:desc'
        });
        setRecentCars(carsResponse.data);
        
        // Récupérer les utilisateurs récents
        const usersResponse = await UserService.getAllUsers({ limit: 5 });
        setRecentUsers(usersResponse.data);
        
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

  // Gestionnaires d'événements pour les menus contextuels
  const handleMenuOpen = (event, item, type) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedItem({ ...item, type });
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedItem(null);
  };
  
  const handleViewDetails = () => {
    if (selectedItem) {
      if (selectedItem.type === 'car') {
        navigate(`/cars/${selectedItem.id}`);
      } else if (selectedItem.type === 'user') {
        navigate(`/users/${selectedItem.id}`);
      } else if (selectedItem.type === 'alert') {
        navigate(`/alerts/${selectedItem.id}`);
      }
    }
    handleMenuClose();
  };
  
  const handleViewCarData = () => {
    if (selectedItem && selectedItem.type === 'car') {
      navigate(`/cars/${selectedItem.id}/data`);
    }
    handleMenuClose();
  };
  
  const handleViewUserCars = () => {
    if (selectedItem && selectedItem.type === 'user') {
      navigate(`/users/${selectedItem.id}/cars`);
    }
    handleMenuClose();
  };
  
  // Fonction utilitaire pour formater le temps écoulé
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const secondsAgo = Math.floor((now - date) / 1000);
    
    if (secondsAgo < 60) return 'il y a quelques secondes';
    if (secondsAgo < 3600) return `il y a ${Math.floor(secondsAgo / 60)} min`;
    if (secondsAgo < 86400) return `il y a ${Math.floor(secondsAgo / 3600)} h`;
    return `il y a ${Math.floor(secondsAgo / 86400)} j`;
  };
  
  // Fonction pour obtenir l'icône et la couleur en fonction du type d'alerte
  const getAlertIcon = (type) => {
    switch (type) {
      case 'HARSH_BRAKING':
        return <WarningIcon sx={{ color: '#f44336' }} />;
      case 'EXCESSIVE_ACCELERATION':
        return <SpeedIcon sx={{ color: '#ff9800' }} />;
      case 'DANGEROUS_TURN':
        return <ThreeSixtyIcon sx={{ color: '#9c27b0' }} />;
      case 'EXCESSIVE_SPEED':
        return <SpeedIcon sx={{ color: '#f44336' }} />;
      default:
        return <ErrorIcon sx={{ color: '#f44336' }} />;
    }
  };
  
  // Fonction pour obtenir la couleur en fonction de la sévérité
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'info';
      default:
        return 'default';
    }
  };
  
  // Fonction pour obtenir l'initiale d'un utilisateur
  const getUserInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };
  
  // Filtrer les alertes en fonction de l'onglet actif
  const getFilteredAlerts = () => {
    if (alertsTabValue === 0) return recentAlerts;
    
    const severityMap = {
      1: 'HIGH',
      2: 'MEDIUM',
      3: 'LOW'
    };
    
    return recentAlerts.filter(alert => alert.severity === severityMap[alertsTabValue]);
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          Tableau de bord AI-Drive
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/alerts')}
          startIcon={<NotificationsIcon />}
        >
          Voir toutes les alertes
        </Button>
      </Box>
      
      {/* Cartes statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Véhicules actifs" 
            value={carStats?.activeCars || 0} 
            icon="DirectionsCar" 
            color="#4CAF50" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Utilisateurs actifs" 
            value={userStats?.activeUsers || 0} 
            icon="Person" 
            color="#2196F3" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Alertes actives" 
            value={recentAlerts.length} 
            icon="Notifications" 
            color="#FF9800" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Score moyen de sécurité" 
            value={carStats?.avgSafetyScore || 0}
            suffix="%"
            icon="Speed" 
            color="#9C27B0" 
          />
        </Grid>
      </Grid>
      
      {/* Contenu principal du tableau de bord */}
      <Grid container spacing={3}>
        {/* Carte GPS */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Données GPS des dernières 24h
            </Typography>
            <GPSMap gpsData={dashboardData.recentGPSData} />
          </Paper>
        </Grid>
        
        {/* Alertes récentes */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6">
                Alertes récentes
              </Typography>
              <Badge badgeContent={recentAlerts.length} color="error">
                <NotificationsIcon color="action" />
              </Badge>
            </Box>
            
            <Tabs
              value={alertsTabValue}
              onChange={(e, newValue) => setAlertsTabValue(newValue)}
              sx={{ mb: 2 }}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Toutes" />
              <Tab 
                label="Critiques" 
                sx={{ color: 'error.main' }}
                icon={<Badge badgeContent={recentAlerts.filter(a => a.severity === 'HIGH').length} color="error" />} 
                iconPosition="end"
              />
              <Tab 
                label="Moyennes" 
                sx={{ color: 'warning.main' }}
                icon={<Badge badgeContent={recentAlerts.filter(a => a.severity === 'MEDIUM').length} color="warning" />} 
                iconPosition="end"
              />
              <Tab 
                label="Faibles" 
                sx={{ color: 'info.main' }}
                icon={<Badge badgeContent={recentAlerts.filter(a => a.severity === 'LOW').length} color="info" />} 
                iconPosition="end"
              />
            </Tabs>
            
            <List sx={{ overflow: 'auto', flex: 1, mb: 1 }}>
              {getFilteredAlerts().length === 0 ? (
                <ListItem>
                  <ListItemText 
                    primary="Aucune alerte" 
                    secondary="Pas d'alertes trouvées pour ce filtre"
                  />
                </ListItem>
              ) : (
                getFilteredAlerts().map((alert) => (
                  <ListItem
                    key={alert.id}
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        size="small"
                        onClick={(e) => handleMenuOpen(e, alert, 'alert')}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    }
                    sx={{ 
                      borderLeft: '4px solid',
                      borderColor: 
                        alert.severity === 'HIGH' ? 'error.main' : 
                        alert.severity === 'MEDIUM' ? 'warning.main' : 'info.main',
                      mb: 1,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      boxShadow: 1
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: 
                          alert.severity === 'HIGH' ? 'error.light' : 
                          alert.severity === 'MEDIUM' ? 'warning.light' : 'info.light'
                      }}>
                        {getAlertIcon(alert.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {alert.description}
                          <Chip 
                            label={alert.severity}
                            size="small"
                            color={getSeverityColor(alert.severity)}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            {alert.car.brand} {alert.car.model} {alert.car.licensePlate}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" component="div">
                            {getTimeAgo(alert.timestamp)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="text" 
                color="primary" 
                size="small"
                onClick={() => navigate('/alerts')}
              >
                Voir toutes les alertes
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Données d'accéléromètre */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Données d'accéléromètre récentes
            </Typography>
            <AccelerometerChart data={dashboardData.recentAccelerometerData} />
          </Paper>
        </Grid>
        
        {/* Données de gyroscope */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Données de gyroscope récentes
            </Typography>
            <GyroscopeChart data={dashboardData.recentGyroscopeData} />
          </Paper>
        </Grid>
        
        {/* Véhicules récents */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Activité des véhicules récente
              </Typography>
              <Button 
                variant="text" 
                color="primary" 
                size="small"
                onClick={() => navigate('/cars')}
              >
                Tous les véhicules
              </Button>
            </Box>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Véhicule</TableCell>
                    <TableCell>Immatriculation</TableCell>
                    <TableCell>Score de sécurité</TableCell>
                    <TableCell>Dernière activité</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentCars.map((car) => (
                    <TableRow key={car.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 30, 
                              height: 30, 
                              mr: 1,
                              bgcolor: car.status === 'ACTIVE' ? 'primary.main' : 'text.disabled'
                            }}
                          >
                            <DirectionsCarIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {car.brand} {car.model}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {car.fuelType}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={car.licensePlate}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${car.safetyScore}%`}
                          size="small"
                          color={
                            car.safetyScore >= 90 ? 'success' :
                            car.safetyScore >= 80 ? 'primary' :
                            car.safetyScore >= 70 ? 'warning' :
                            'error'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {car.lastActivity ? getTimeAgo(car.lastActivity) : 'Jamais'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, car, 'car')}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {recentCars.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Aucun véhicule trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        {/* Utilisateurs récents */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Utilisateurs récents
              </Typography>
              {isAdmin && (
                <Button 
                  variant="text" 
                  color="primary" 
                  size="small"
                  onClick={() => navigate('/users')}
                >
                  Tous les utilisateurs
                </Button>
              )}
            </Box>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Utilisateur</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Téléphone</TableCell>
                    <TableCell>Véhicules</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 30, 
                              height: 30, 
                              mr: 1,
                              bgcolor: user.status === 'ACTIVE' ? 'primary.main' : 'text.disabled'
                            }}
                          >
                            {getUserInitials(user.firstName, user.lastName)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {user.firstName} {user.lastName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.phone}</Typography>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          badgeContent={user.carsCount} 
                          color="primary"
                          showZero
                        >
                          <DirectionsCarIcon 
                            color={user.carsCount > 0 ? "primary" : "disabled"} 
                            fontSize="small"
                          />
                        </Badge>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, user, 'user')}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {recentUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Aucun utilisateur trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Menu contextuel */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          Voir détails
        </MenuItem>
        
        {selectedItem?.type === 'car' && (
          <MenuItem onClick={handleViewCarData}>
            <TimelineIcon fontSize="small" sx={{ mr: 1 }} />
            Visualiser données
          </MenuItem>
        )}
        
        {selectedItem?.type === 'user' && (
          <MenuItem onClick={handleViewUserCars}>
            <DirectionsCarIcon fontSize="small" sx={{ mr: 1 }} />
            Voir ses véhicules
          </MenuItem>
        )}
      </Menu>
    </Container>
  );
};

export default Dashboard;