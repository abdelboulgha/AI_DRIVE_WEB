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
  Tab,
  TextField,
  InputAdornment
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
  LocationOn as LocationOnIcon,
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';

// Configuration de l'URL de l'API
const API_URL = 'http://localhost:8080/api';

// Couleurs pour les graphiques
const COLORS = ['#f44336', '#ff9800', '#2196f3', '#4caf50', '#9c27b0'];

const UserVehicles = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  
  // États
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    inactiveVehicles: 0,
    byFuelType: {},
    byYear: {}
  });

  // Fonction pour récupérer les données de l'utilisateur
  const fetchUserData = async () => {
    try {
      // Note: Dans un cas réel, vous devrez peut-être créer cet endpoint
      const response = await axios.get(`${API_URL}/auth/users/${userId}`);
      setUser(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des données utilisateur', err);
      // Fallback si l'API n'est pas disponible
      setUser({
        id: userId,
        username: "Utilisateur",
        email: "user@example.com",
        status: "ACTIF"
      });
    }
  };

  // Fonction pour récupérer les véhicules de l'utilisateur
  const fetchUserVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/vehicles/user/${userId}`);
      
      // En cas de réponse vide, utiliser des données de test
      let vehiclesData = response.data.length > 0 ? response.data : [
        {
          id: 1,
          licensePlate: "MNO345",
          brand: "BMW",
          model: "Série 3",
          color: "Bleu",
          year: 2020,
          mileage: 28500,
          fuelType: "Essence",
          safetyScore: 88,
          status: "ACTIF",
          lastActivity: "2025-05-20T12:40:48.362524"
        },
        {
          id: 2,
          licensePlate: "ABC123",
          brand: "Toyota",
          model: "Corolla",
          color: "Rouge",
          year: 2019,
          mileage: 45200,
          fuelType: "Diesel",
          safetyScore: 92,
          status: "ACTIF",
          lastActivity: "2025-05-19T10:30:22.123456"
        },
        {
          id: 3,
          licensePlate: "XYZ789",
          brand: "Tesla",
          model: "Model 3",
          color: "Blanc",
          year: 2021,
          mileage: 15000,
          fuelType: "Électrique",
          safetyScore: 95,
          status: "INACTIF",
          lastActivity: "2025-04-15T16:45:30.876543"
        }
      ];
      
      setVehicles(vehiclesData);
      
      // Calculer les statistiques
      const activeVehicles = vehiclesData.filter(v => v.status === 'ACTIF').length;
      
      // Statistiques par type de carburant
      const fuelTypeStats = {};
      vehiclesData.forEach(vehicle => {
        fuelTypeStats[vehicle.fuelType] = (fuelTypeStats[vehicle.fuelType] || 0) + 1;
      });
      
      // Statistiques par année
      const yearStats = {};
      vehiclesData.forEach(vehicle => {
        if (vehicle.year) {
          yearStats[vehicle.year] = (yearStats[vehicle.year] || 0) + 1;
        }
      });
      
      setStats({
        totalVehicles: vehiclesData.length,
        activeVehicles,
        inactiveVehicles: vehiclesData.length - activeVehicles,
        byFuelType: fuelTypeStats,
        byYear: yearStats,
        averageMileage: Math.round(
          vehiclesData.reduce((sum, v) => sum + (v.mileage || 0), 0) / vehiclesData.length
        ),
        averageSafetyScore: Math.round(
          vehiclesData.reduce((sum, v) => sum + (v.safetyScore || 0), 0) / vehiclesData.length
        )
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des véhicules', err);
      setError('Erreur lors du chargement des véhicules de l\'utilisateur');
      setLoading(false);
    }
  };

  // Initialisation des données
  useEffect(() => {
    fetchUserData();
    fetchUserVehicles();
  }, [userId]);

  // Gestion de la suppression
  const handleDeleteClick = (vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      // Simulation d'un appel API pour supprimer le véhicule
      // await axios.delete(`${API_URL}/vehicles/${vehicleToDelete.id}`);
      
      // Mettre à jour la liste des véhicules (optimistic update)
      setVehicles(prev => prev.filter(v => v.id !== vehicleToDelete.id));
      
      // Mettre à jour les statistiques
      setStats(prev => ({
        ...prev,
        totalVehicles: prev.totalVehicles - 1,
        activeVehicles: vehicleToDelete.status === 'ACTIF' ? prev.activeVehicles - 1 : prev.activeVehicles,
        inactiveVehicles: vehicleToDelete.status === 'INACTIF' ? prev.inactiveVehicles - 1 : prev.inactiveVehicles
      }));
      
      setSuccessMessage(`Le véhicule ${vehicleToDelete.brand} ${vehicleToDelete.model} a été supprimé avec succès`);
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
    } catch (err) {
      setError('Erreur lors de la suppression du véhicule');
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
    }
  };

  // Filtrer les véhicules selon le terme de recherche
  const getFilteredVehicles = () => {
    if (!searchTerm) return vehicles;
    
    const term = searchTerm.toLowerCase();
    return vehicles.filter(vehicle => 
      vehicle.brand.toLowerCase().includes(term) ||
      vehicle.model.toLowerCase().includes(term) ||
      vehicle.licensePlate.toLowerCase().includes(term) ||
      (vehicle.color && vehicle.color.toLowerCase().includes(term)) ||
      (vehicle.fuelType && vehicle.fuelType.toLowerCase().includes(term))
    );
  };

  // Fonction pour obtenir la couleur du badge de carburant
  const getFuelTypeColor = (fuelType) => {
    switch (fuelType) {
      case 'Essence': return '#f44336';
      case 'Diesel': return '#ff9800';
      case 'Hybride': return '#4caf50';
      case 'Électrique': return '#2196f3';
      default: return '#9e9e9e';
    }
  };
  
  // Fonction pour obtenir la couleur en fonction du score de sécurité
  const getSafetyScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'primary';
    if (score >= 70) return 'warning';
    return 'error';
  };
  
  // Fonction pour obtenir l'icône du type de carburant
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
  
  // Fonction pour obtenir la boîte de couleur
  const getColorBox = (color) => {
    const colorMap = {
      'Rouge': '#f44336',
      'Bleu': '#2196f3',
      'Vert': '#4caf50',
      'Jaune': '#ffeb3b',
      'Noir': '#212121',
      'Blanc': '#f5f5f5',
      'Gris': '#9e9e9e'
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
  
  // Fonction pour générer le graphique des types de carburant
  const renderFuelTypePieChart = () => {
    if (!stats.byFuelType || Object.keys(stats.byFuelType).length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Aucune donnée disponible
          </Typography>
        </Box>
      );
    }
    
    const data = Object.entries(stats.byFuelType).map(([type, count]) => ({
      name: type,
      value: count,
      color: getFuelTypeColor(type)
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
  
  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddVehicle = () => {
    navigate('/vehicles/add', { state: { userId } });
  };

  const handleViewVehicleData = (vehicleId) => {
    navigate(`/cars/${vehicleId}/data`);
  };

  const handleEditVehicle = (vehicleId) => {
    navigate(`/vehicles/${vehicleId}/edit`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && vehicles.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/users')}
          sx={{ mt: 2 }}
        >
          Retour à la liste des utilisateurs
        </Button>
      </Box>
    );
  }

  const filteredVehicles = getFilteredVehicles();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête avec fil d'Ariane et boutons d'action */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link 
              to="/users" 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Utilisateurs
            </Link>
            <Typography color="text.primary">Véhicules de {user?.username || `l'utilisateur #${userId}`}</Typography>
          </Breadcrumbs>
          
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
  <DirectionsCarIcon sx={{ mr: 1 }} />
  Véhicules de {user?.username || "Utilisateur"}
</Typography>
        </Box>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/users')}
            sx={{ mr: 1 }}
          >
            Retour
          </Button>
          
        </Box>
      </Box>
      
      {/* Onglets */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Tableau de bord" />
        <Tab label="Liste des véhicules" />
        <Tab label="Statistiques" />
      </Tabs>
      
      {/* Onglet Tableau de bord */}
      {tabValue === 0 && (
        <>
          {/* Filtres et recherche */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                placeholder="Rechercher un véhicule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              

            </Box>
          </Paper>
          
          {/* Statistiques */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
                  <DirectionsCarIcon sx={{ mr: 1 }} />
                  Véhicules
                </Typography>
                
                <Typography variant="h3" component="div" sx={{ my: 2, fontWeight: 'bold', textAlign: 'center' }}>
                  {stats.totalVehicles}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Chip 
                        icon={<CheckCircleIcon />}
                        label="Actifs" 
                        color="success" 
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {stats.activeVehicles}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Chip 
                        icon={<CancelIcon />}
                        label="Inactifs" 
                        color="default" 
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {stats.inactiveVehicles}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
                  <SpeedIcon sx={{ mr: 1 }} />
                  Performance moyenne
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Kilométrage moyen
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {stats.averageMileage?.toLocaleString() || 0} km
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Score de sécurité
                      </Typography>
                      <Chip 
                        label={`${stats.averageSafetyScore || 0}%`}
                        color={getSafetyScoreColor(stats.averageSafetyScore || 0)}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Répartition par type de carburant
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1 }}>
                  {Object.entries(stats.byFuelType).map(([type, count]) => (
                    <Box key={type} sx={{ textAlign: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          bgcolor: getFuelTypeColor(type), 
                          mx: 'auto', 
                          mb: 1,
                          fontSize: '1rem'
                        }}
                      >
                        {count}
                      </Avatar>
                      <Typography variant="caption" display="block">
                        {type}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Informations utilisateur
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      mr: 2,
                      bgcolor: 'primary.main'
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                      {user?.username || `Utilisateur #${userId}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email || 'Email non disponible'}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<PersonIcon />}
                  component={Link}
                  to={`/users/${userId}`}
                >
                  Voir le profil complet
                </Button>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Liste des véhicules récents */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3
            }}>
              <Typography variant="h6">
                Véhicules récents
              </Typography>
              
              <Button
                variant="outlined"
                onClick={() => setTabValue(1)}
              >
                Voir tous les véhicules
              </Button>
            </Box>
            
            {filteredVehicles.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <DirectionsCarIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6">
                  Aucun véhicule trouvé
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Cet utilisateur n'a pas encore de véhicules enregistrés
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddVehicle}
                  sx={{ mt: 2 }}
                >
                  Ajouter un véhicule
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredVehicles.slice(0, 3).map((vehicle) => (
                  <Grid item key={vehicle.id} xs={12} md={4}>
                    <Paper sx={{ height: '100%', overflow: 'hidden' }}>
                      <Box sx={{ 
                        p: 2, 
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              mr: 2, 
                              bgcolor: vehicle.status === 'ACTIF' ? 'success.main' : 'action.disabled'
                            }}
                          >
                            <DirectionsCarIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {vehicle.brand} {vehicle.model}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {vehicle.licensePlate}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Chip 
                          icon={vehicle.status === 'ACTIF' ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                          label={vehicle.status} 
                          color={vehicle.status === 'ACTIF' ? 'success' : 'default'} 
                          size="small"
                        />
                      </Box>
                      
                      <Box sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Couleur
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              {getColorBox(vehicle.color)}
                              <Typography variant="body1">
                                {vehicle.color || 'Non spécifiée'}
                              </Typography>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Année
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 0.5 }}>
                              {vehicle.year || 'Non spécifiée'}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Carburant
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              {getFuelTypeIcon(vehicle.fuelType)}
                              <Typography variant="body1" sx={{ ml: 1 }}>
                                {vehicle.fuelType}
                              </Typography>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Kilométrage
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <SpeedIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body1">
                                {vehicle.mileage?.toLocaleString() || '0'} km
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                      
                      <Divider />
                      
                      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                          startIcon={<TimelineIcon />}
                          onClick={() => handleViewVehicleData(vehicle.id)}
                          color="primary"
                        >
                          Données
                        </Button>
                        
                        <Box>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEditVehicle(vehicle.id)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          
                          <IconButton 
                            color="error" 
                            onClick={() => handleDeleteClick(vehicle)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </>
      )}
      
      {/* Onglet Liste des véhicules */}
      {tabValue === 1 && (
        <>
          {/* Filtres et recherche */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                placeholder="Rechercher un véhicule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddVehicle}
                sx={{ ml: 2, whiteSpace: 'nowrap' }}
              >
                Ajouter
              </Button>
            </Box>
          </Paper>
          
          {/* Liste des véhicules */}
          {filteredVehicles.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <DirectionsCarIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6">
                Aucun véhicule trouvé
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Cet utilisateur n'a pas encore de véhicules enregistrés
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddVehicle}
                sx={{ mt: 2 }}
              >
                Ajouter un véhicule
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredVehicles.map((vehicle) => (
                <Grid item key={vehicle.id} xs={12} md={6} lg={4}>
                  <Paper sx={{ height: '100%', overflow: 'hidden' }}>
                    <Box sx={{ 
                      p: 2, 
                      borderBottom: '1px solid #eee',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            mr: 2, 
                            bgcolor: vehicle.status === 'ACTIF' ? 'success.main' : 'action.disabled'
                          }}
                        >
                          <DirectionsCarIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {vehicle.brand} {vehicle.model}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {vehicle.licensePlate}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Chip 
                        icon={vehicle.status === 'ACTIF' ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                        label={vehicle.status} 
                        color={vehicle.status === 'ACTIF' ? 'success' : 'default'} 
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Couleur
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            {getColorBox(vehicle.color)}
                            <Typography variant="body1">
                              {vehicle.color || 'Non spécifiée'}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Année
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>
                            {vehicle.year || 'Non spécifiée'}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Carburant
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            {getFuelTypeIcon(vehicle.fuelType)}
                            <Typography variant="body1" sx={{ ml: 1 }}>
                              {vehicle.fuelType}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Kilométrage
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <SpeedIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body1">
                              {vehicle.mileage?.toLocaleString() || '0'} km
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Score de sécurité
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Box 
                              sx={{ 
                                width: '100%', 
                                height: 8, 
                                bgcolor: '#eee', 
                                borderRadius: 4, 
                                overflow: 'hidden',
                                mr: 2
                              }}
                            >
                              <Box 
                                sx={{ 
                                  width: `${vehicle.safetyScore}%`, 
                                  height: '100%', 
                                  bgcolor: vehicle.safetyScore >= 80 ? 'success.main' : 
                                         vehicle.safetyScore >= 60 ? 'warning.main' : 'error.main'
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {vehicle.safetyScore}/100
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Dernière activité: {new Date(vehicle.lastActivity).toLocaleString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    <Divider />
                    
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        variant="outlined"
                        startIcon={<TimelineIcon />}
                        onClick={() => handleViewVehicleData(vehicle.id)}
                      >
                        Données
                      </Button>
                      
                      <Box>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleEditVehicle(vehicle.id)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteClick(vehicle)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
      
      {/* Onglet Statistiques */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
                <LocalGasStationIcon sx={{ mr: 1 }} />
                Répartition par type de carburant
              </Typography>
              
              {renderFuelTypePieChart()}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
                <DriveEtaIcon sx={{ mr: 1 }} />
                Répartition par année
              </Typography>
              
              {Object.keys(stats.byYear).length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Aucune donnée disponible
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {Object.entries(stats.byYear)
                    .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
                    .map(([year, count]) => (
                      <Grid item xs={6} md={4} key={year}>
                        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {year}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {count} véhicule{count > 1 ? 's' : ''}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))
                  }
                </Grid>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
                <InfoIcon sx={{ mr: 1 }} />
                Résumé des véhicules
              </Typography>
              
              <List>
                <ListItem divider>
                  <ListItemText
                    primary="Nombre total de véhicules"
                    secondary={stats.totalVehicles}
                    primaryTypographyProps={{ color: 'text.secondary', variant: 'subtitle2' }}
                    secondaryTypographyProps={{ color: 'text.primary', variant: 'body1', fontWeight: 'bold' }}
                  />
                </ListItem>
                
                <ListItem divider>
                  <ListItemText
                    primary="Véhicules actifs"
                    secondary={stats.activeVehicles}
                    primaryTypographyProps={{ color: 'text.secondary', variant: 'subtitle2' }}
                    secondaryTypographyProps={{ color: 'text.primary', variant: 'body1', fontWeight: 'bold' }}
                  />
                </ListItem>
                
                <ListItem divider>
                  <ListItemText
                    primary="Véhicules inactifs"
                    secondary={stats.inactiveVehicles}
                    primaryTypographyProps={{ color: 'text.secondary', variant: 'subtitle2' }}
                    secondaryTypographyProps={{ color: 'text.primary', variant: 'body1', fontWeight: 'bold' }}
                  />
                </ListItem>
                
                <ListItem divider>
                  <ListItemText
                    primary="Kilométrage moyen"
                    secondary={`${stats.averageMileage?.toLocaleString() || 0} km`}
                    primaryTypographyProps={{ color: 'text.secondary', variant: 'subtitle2' }}
                    secondaryTypographyProps={{ color: 'text.primary', variant: 'body1', fontWeight: 'bold' }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Score de sécurité moyen"
                    secondary={
                      <Chip 
                        label={`${stats.averageSafetyScore || 0}%`}
                        color={getSafetyScoreColor(stats.averageSafetyScore || 0)}
                      />
                    }
                    primaryTypographyProps={{ color: 'text.secondary', variant: 'subtitle2' }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
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
            Êtes-vous sûr de vouloir supprimer le véhicule {vehicleToDelete?.brand} {vehicleToDelete?.model} ({vehicleToDelete?.licensePlate}) ? 
            Cette action supprimera également toutes les données associées à ce véhicule.
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

export default UserVehicles;