import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid,
  Button,
  Chip,
  IconButton,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Breadcrumbs,
  Tabs,
  Tab
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsCar as DirectionsCarIcon,
  Person as PersonIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  LocalGasStation as LocalGasStationIcon,
  DriveEta as DriveEtaIcon,
  EventNote as EventNoteIcon,
  ColorLens as ColorLensIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  NotificationsActive as NotificationsActiveIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import CarService from '../api/carService';
import AlertService from '../api/alertService';
import CarForm from '../components/cars/CarForm';

const COLORS = ['#f44336', '#ff9800', '#2196f3', '#4caf50', '#9c27b0'];

const CarDetails = () => {
  const navigate = useNavigate();
  const { carId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [car, setCar] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  const fetchCar = async () => {
    try {
      setLoading(true);
      const response = await CarService.getCarById(carId);
      setCar(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des détails du véhicule');
      setLoading(false);
      console.error(err);
    }
  };
  
  const fetchAlerts = async () => {
    try {
      const response = await AlertService.getAlertsByCarId(carId, { limit: 10 });
      setAlerts(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des alertes:', err);
    }
  };
  
  useEffect(() => {
    fetchCar();
    fetchAlerts();
  }, [carId]);
  
  // Fonction pour confirmer la suppression
  const handleDeleteConfirm = async () => {
    try {
      await CarService.deleteCar(carId);
      setDeleteDialogOpen(false);
      setSuccessMessage('Véhicule supprimé avec succès');
      setSnackbarOpen(true);
      
      // Rediriger vers la liste des véhicules après 2 secondes
      setTimeout(() => {
        navigate('/cars');
      }, 2000);
    } catch (err) {
      setError('Erreur lors de la suppression du véhicule');
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
    }
  };
  
  const handleCarSaved = () => {
    fetchCar();
    setEditDialogOpen(false);
    setSuccessMessage('Véhicule mis à jour avec succès');
    setSnackbarOpen(true);
  };
  
  // Fonction pour obtenir la couleur en fonction du score de sécurité
  const getSafetyScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'primary';
    if (score >= 70) return 'warning';
    return 'error';
  };
  
  // Fonction pour obtenir l'icône et la couleur du type de carburant
  const getFuelTypeIcon = (fuelType) => {
    switch (fuelType) {
      case 'Hybride':
        return <LocalGasStationIcon sx={{ color: '#4caf50' }} />;
      case 'Électrique':
        return <LocalGasStationIcon sx={{ color: '#2196f3' }} />;
      case 'Diesel':
        return <LocalGasStationIcon sx={{ color: '#ff9800' }} />;
      case 'Essence':
      default:
        return <LocalGasStationIcon sx={{ color: '#f44336' }} />;
    }
  };
  
  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    return status === 'ACTIVE' ? 'success' : 'default';
  };
  
  // Fonction pour obtenir la boîte de couleur
  const getColorBox = (color) => {
    const colorMap = {
      'Rouge': '#f44336',
      'Bleu': '#2196f3',
      'Vert': '#4caf50',
      'Jaune': '#ffeb3b',
      'Noir': '#212121',
      'Blanc': '#f5f5f5',
      'Gris': '#9e9e9e',
      'Orange': '#ff9800',
      'Marron': '#795548',
      'Beige': '#e0e0d1',
      'Violet': '#9c27b0',
      'Rose': '#e91e63',
      'Doré': '#ffd700',
      'Argenté': '#c0c0c0'
    };
    
    const bgColor = colorMap[color] || '#9e9e9e';
    
    return (
      <Box
        sx={{
          width: 20,
          height: 20,
          bgcolor: bgColor,
          borderRadius: '50%',
          display: 'inline-block',
          border: '1px solid #ddd',
          mr: 1,
          verticalAlign: 'middle'
        }}
      />
    );
  };
  
  // Fonction pour obtenir l'icône et la couleur en fonction du type d'alerte
  const getAlertTypeInfo = (type) => {
    switch (type) {
      case 'HARSH_BRAKING':
        return { icon: <WarningIcon />, color: '#f44336', label: 'Freinage brusque' };
      case 'EXCESSIVE_ACCELERATION':
        return { icon: <SpeedIcon />, color: '#ff9800', label: 'Accélération excessive' };
      case 'DANGEROUS_TURN':
        return { icon: <TimelineIcon />, color: '#9c27b0', label: 'Virage dangereux' };
      case 'EXCESSIVE_SPEED':
        return { icon: <SpeedIcon />, color: '#f44336', label: 'Vitesse excessive' };
      case 'LANE_DEPARTURE':
        return { icon: <TimelineIcon />, color: '#2196f3', label: 'Sortie de voie' };
      default:
        return { icon: <InfoIcon />, color: '#f44336', label: type };
    }
  };
  
  // Fonction pour obtenir l'icône et la couleur en fonction de la sévérité
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
  
  // Fonction pour formater le temps écoulé
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const secondsAgo = Math.floor((now - date) / 1000);
    
    if (secondsAgo < 60) return 'il y a quelques secondes';
    if (secondsAgo < 3600) return `il y a ${Math.floor(secondsAgo / 60)} min`;
    if (secondsAgo < 86400) return `il y a ${Math.floor(secondsAgo / 3600)} h`;
    return `il y a ${Math.floor(secondsAgo / 86400)} j`;
  };
  
  // Fonction pour générer le graphique des alertes par type
  const renderAlertsPieChart = () => {
    if (!alerts || alerts.length === 0) return null;
    
    // Grouper les alertes par type
    const alertsByType = {};
    alerts.forEach(alert => {
      if (!alertsByType[alert.type]) {
        alertsByType[alert.type] = 0;
      }
      alertsByType[alert.type]++;
    });
    
    const data = Object.entries(alertsByType).map(([type, count]) => ({
      name: getAlertTypeInfo(type).label,
      value: count,
      color: getAlertTypeInfo(type).color
    }));
    
    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <RechartsTooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !car) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/cars')}
          sx={{ mt: 2 }}
        >
          Retour à la liste des véhicules
        </Button>
      </Box>
    );
  }
  
  if (!car) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Véhicule non trouvé
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/cars')}
          sx={{ mt: 2 }}
        >
          Retour à la liste des véhicules
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête avec fil d'Ariane et boutons d'action */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link 
              to="/cars" 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Véhicules
            </Link>
            <Typography color="text.primary">Détails du véhicule</Typography>
          </Breadcrumbs>
          
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            {car.brand} {car.model}
            <Chip 
              label={car.licensePlate}
              size="medium"
              sx={{ ml: 2 }}
              color="primary"
            />
          </Typography>
        </Box>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/cars')}
            sx={{ mr: 1 }}
          >
            Retour
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => setEditDialogOpen(true)}
            sx={{ mr: 1 }}
          >
            Modifier
          </Button>
          
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Supprimer
          </Button>
        </Box>
      </Box>
      
      {/* Onglets */}
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Informations générales" />
        <Tab 
          label="Alertes" 
          icon={<Chip 
            label={alerts.length}
            size="small"
            color="error"
            sx={{ ml: 1 }}
          />}
          iconPosition="end"
        />
        <Tab label="Données Techniques" />
      </Tabs>
      
      {/* Contenu principal - Onglet Informations générales */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Informations de base */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: '1px solid #eee' }}>
                Informations du véhicule
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 70, 
                    height: 70, 
                    mr: 2,
                    bgcolor: 'primary.main'
                  }}
                >
                  <DirectionsCarIcon sx={{ fontSize: 40 }} />
                </Avatar>
                
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                      {car.brand} {car.model}
                    </Typography>
                    <Chip 
                      label={car.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                      size="small"
                      color={getStatusColor(car.status)}
                      sx={{ ml: 2 }}
                      icon={car.status === 'ACTIVE' ? <CheckCircleIcon /> : <CancelIcon />}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {getColorBox(car.color)}
                    <Typography variant="body1" color="text.secondary">
                      {car.color} - {car.year}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Immatriculation
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, fontWeight: 'medium' }}>
                    {car.licensePlate}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Type de carburant
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {getFuelTypeIcon(car.fuelType)}
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {car.fuelType}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Kilométrage
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {car.mileage.toLocaleString()} km
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Score de sécurité
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={`${car.safetyScore}%`}
                      color={getSafetyScoreColor(car.safetyScore)}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    ID de l'appareil
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {car.deviceId || 'Non assigné'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Dernière activité
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {car.lastActivity ? new Date(car.lastActivity).toLocaleString() : 'Jamais'}
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Propriétaire
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main',
                    mr: 2
                  }}
                >
                  {car.owner.firstName.charAt(0)}{car.owner.lastName.charAt(0)}
                </Avatar>
                
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {car.owner.firstName} {car.owner.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID Utilisateur: {car.userId}
                  </Typography>
                </Box>
                
                <Button 
                  variant="outlined"
                  size="small"
                  component={Link}
                  to={`/users/${car.userId}`}
                  sx={{ ml: 'auto' }}
                >
                  Voir le profil
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Statistiques et actions */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: '1px solid #eee' }}>
                    Synthèse des alertes
                  </Typography>
                  
                  {alerts.length > 0 ? (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {alerts.length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total des alertes
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Chip 
                              label={alerts.filter(a => a.severity === 'HIGH').length}
                              color="error"
                              size="small"
                              sx={{ mb: 0.5 }}
                            />
                            <Typography variant="caption" color="text.secondary" display="block">
                              Élevée
                            </Typography>
                          </Box>
                          
                          <Box sx={{ textAlign: 'center' }}>
                            <Chip 
                              label={alerts.filter(a => a.severity === 'MEDIUM').length}
                              color="warning"
                              size="small"
                              sx={{ mb: 0.5 }}
                            />
                            <Typography variant="caption" color="text.secondary" display="block">
                              Moyenne
                            </Typography>
                          </Box>
                          
                          <Box sx={{ textAlign: 'center' }}>
                            <Chip 
                              label={alerts.filter(a => a.severity === 'LOW').length}
                              color="info"
                              size="small"
                              sx={{ mb: 0.5 }}
                            />
                            <Typography variant="caption" color="text.secondary" display="block">
                              Faible
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      {renderAlertsPieChart()}
                      
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<NotificationsActiveIcon />}
                          onClick={() => setTabValue(1)}
                        >
                          Voir toutes les alertes
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
                      <Typography variant="h6">
                        Aucune alerte
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ce véhicule n'a pas d'alertes enregistrées
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: '1px solid #eee' }}>
                    Actions
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<TimelineIcon />}
                        component={Link}
                        to={`/cars/${car.id}/data`}
                      >
                        Voir les données du véhicule
                      </Button>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        startIcon={<NotificationsActiveIcon />}
                        component={Link}
                        to={`/alerts?carId=${car.id}`}
                      >
                        Historique des alertes
                      </Button>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        startIcon={<EditIcon />}
                        onClick={() => setEditDialogOpen(true)}
                      >
                        Modifier le véhicule
                      </Button>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        Supprimer le véhicule
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      
      {/* Contenu de l'onglet Alertes */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h6">
              Dernières alertes pour ce véhicule
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<NotificationsActiveIcon />}
              component={Link}
              to={`/alerts?carId=${car.id}`}
            >
              Voir toutes les alertes
            </Button>
          </Box>
          
          {alerts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6">
                Aucune alerte détectée
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Ce véhicule n'a pas d'alertes enregistrées pour le moment
              </Typography>
            </Box>
          ) : (
            <List>
              {alerts.map((alert) => {
                const typeInfo = getAlertTypeInfo(alert.type);
                return (
                  <ListItem
                    key={alert.id}
                    component={Paper}
                    sx={{ 
                      mb: 2, 
                      p: 2,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'stretch', sm: 'center' },
                      gap: 2,
                      borderLeft: '4px solid',
                      borderColor: typeInfo.color
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: { xs: '100%', sm: 56 }, m: { xs: 'auto', sm: 0 } }}>
                      <Avatar sx={{ bgcolor: `${typeInfo.color}20`, color: typeInfo.color }}>
                        {typeInfo.icon}
                      </Avatar>
                    </ListItemAvatar>
                    
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          {typeInfo.label}
                        </Typography>
                        <Chip 
                          label={alert.severity}
                          size="small"
                          color={getSeverityColor(alert.severity)}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        {alert.description}
                      </Typography>
                      
                      {alert.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                          <Typography variant="caption" color="text.secondary">
                            {alert.data?.address || `${alert.location.latitude.toFixed(4)}, ${alert.location.longitude.toFixed(4)}`}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: 'space-between',
                      alignItems: { xs: 'center', sm: 'flex-end' },
                      minWidth: { sm: 100 }
                    }}>
                      <Chip 
                        label={alert.status}
                        size="small"
                        color={
                          alert.status === 'NEW' ? 'error' :
                          alert.status === 'ACKNOWLEDGED' ? 'warning' : 'success'
                        }
                        sx={{ mb: { sm: 1 } }}
                      />
                      
                      <Tooltip title={new Date(alert.timestamp).toLocaleString()}>
                        <Typography variant="caption" color="text.secondary">
                          {getTimeAgo(alert.timestamp)}
                        </Typography>
                      </Tooltip>
                    </Box>
                    
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to={`/alerts/${alert.id}`}
                      sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}
                    >
                      Détails
                    </Button>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Paper>
      )}
      
      {/* Contenu de l'onglet Données Techniques */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: '1px solid #eee' }}>
            Informations techniques
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem divider>
                  <ListItemText
                    primary="Numéro VIN"
                    secondary={car.vin || 'Non renseigné'}
                    primaryTypographyProps={{ color: 'text.secondary', variant: 'subtitle2' }}
                    secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                  />
                </ListItem>
                
                <ListItem divider>
                  <ListItemText
                    primary="Année de fabrication"
                    secondary={car.year}
                    primaryTypographyProps={{ color: 'text.secondary', variant: 'subtitle2' }}
                    secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                  />
                </ListItem>
                
                <ListItem divider>
                  <ListItemText
                    primary="Type de carburant"
                    secondary={car.fuelType}
                    primaryTypographyProps={{ color: 'text.secondary', variant: 'subtitle2' }}
                    secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Couleur"
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getColorBox(car.color)}
                        {car.color}
                      </Box>
                    }
                    primaryTypographyProps={{ color: 'text.secondary', variant: 'subtitle2' }}
                    secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <List>
                <ListItem divider>
                  <ListItemText
                    primary="ID de l'appareil"
                    secondary={car.deviceId || 'Non assigné'}
                    primaryTypographyProps={{ color: 'text.secondary', variant: 'subtitle2' }}
                    secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                  />
                </ListItem>
                
                <ListItem divider>
                  <ListItemText
                    primary="Kilométrage actuel"
                    secondary={`${car.mileage.toLocaleString()} km`}
                    primaryTypographyProps={{ color: 'text.secondary', variant: 'subtitle2' }}
                    secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                  />
                </ListItem>
                
                <ListItem divider>
                  <ListItemText
                    primary="Score de sécurité"
                    secondary={
                      <Chip 
                        label={`${car.safetyScore}%`}
                        color={getSafetyScoreColor(car.safetyScore)}
                      />
                    }
                    primaryTypographyProps={{ color: 'text.secondary', variant: 'subtitle2' }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Statut"
                    secondary={
                      <Chip 
                        label={car.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                        color={getStatusColor(car.status)}
                        icon={car.status === 'ACTIVE' ? <CheckCircleIcon /> : <CancelIcon />}
                      />
                    }
                    primaryTypographyProps={{ color: 'text.secondary', variant: 'subtitle2' }}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Dialog pour confirmer la suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le véhicule {car.brand} {car.model} ({car.licensePlate}) ? 
            Cette action supprimera également toutes les données et alertes associées à ce véhicule.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog pour modifier le véhicule */}
      <CarForm
        open={editDialogOpen}
        handleClose={() => setEditDialogOpen(false)}
        car={car}
        userId={car.userId}
        onSave={handleCarSaved}
      />
      
      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={error ? "error" : "success"}
          sx={{ width: '100%' }}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CarDetails;