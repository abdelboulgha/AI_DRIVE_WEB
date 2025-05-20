import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid,
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Tabs,
  Tab,
  Badge,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
  Avatar,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondary
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  DirectionsCar as DirectionsCarIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  Done as DoneIcon,
  DoNotDisturb as DoNotDisturbIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  LocationOn as LocationOnIcon,
  Speed as SpeedIcon,
  ThreeSixty as ThreeSixtyIcon,
  Timeline as TimelineIcon,
  LooksOne as LooksOneIcon,
  LooksTwo as LooksTwoIcon,
  Looks3 as Looks3Icon,
  AccessTime as AccessTimeIcon,
  NotificationsActive as NotificationsActiveIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import AlertService from '../api/alertService';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#f44336', '#ff9800', '#2196f3', '#4caf50'];

// Données de démonstration pour les statistiques en attendant l'implémentation backend
const demoStats = {
  totalAlerts: 0,
  severityStats: {
    high: 0,
    medium: 0,
    low: 0
  },
  statusStats: {
    new: 0,
    acknowledged: 0,
    resolved: 0
  },
  typeStats: [],
  topCars: [],
  timeStats: {
    byHour: Array.from({length: 24}, (_, i) => ({ hour: i, count: 0 })),
    byDay: Array.from({length: 7}, (_, i) => ({ 
      day: i + 1, 
      dayName: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"][i], 
      count: 0 
    }))
  }
};

const AlertsList = () => {
  const navigate = useNavigate();
  const { userId, carId } = useParams(); // Utilisé si on veut filtrer par utilisateur ou voiture
  
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState(null);
  const [alertToUpdate, setAlertToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [orderBy, setOrderBy] = useState('timestamp');
  const [order, setOrder] = useState('desc');
  const [alertStats, setAlertStats] = useState(demoStats);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filters, setFilters] = useState({
    severity: '',
    type: '',
    status: ''
  });
  
  // Valeurs pour les filtres
  const tabStatusFilters = [null, 'NEW', 'ACKNOWLEDGED', 'RESOLVED'];
  
  // Options pour les types d'alertes
  const alertTypes = [
    { value: 'HARSH_BRAKING', label: 'Freinage brusque' },
    { value: 'EXCESSIVE_ACCELERATION', label: 'Accélération excessive' },
    { value: 'DANGEROUS_TURN', label: 'Virage dangereux' },
    { value: 'EXCESSIVE_SPEED', label: 'Vitesse excessive' },
    { value: 'LANE_DEPARTURE', label: 'Sortie de voie' }
  ];
  
  // Options pour les sévérités
  const severityOptions = [
    { value: 'HIGH', label: 'Élevée', color: 'error' },
    { value: 'MEDIUM', label: 'Moyenne', color: 'warning' },
    { value: 'LOW', label: 'Faible', color: 'info' }
  ];
  
  // Options pour les statuts
  const statusOptions = [
    { value: 'NEW', label: 'Nouvelle', color: 'error' },
    { value: 'ACKNOWLEDGED', label: 'Traitée', color: 'warning' },
    { value: 'RESOLVED', label: 'Résolue', color: 'success' }
  ];

  // Fonction pour calculer des statistiques à partir des alertes récupérées
  const calculateStats = (alertsList) => {
    if (!alertsList || alertsList.length === 0) {
      return demoStats;
    }

    const stats = {
      totalAlerts: alertsList.length,
      severityStats: {
        high: 0,
        medium: 0,
        low: 0
      },
      statusStats: {
        new: 0,
        acknowledged: 0,
        resolved: 0
      },
      typeStats: [],
      topCars: [],
      timeStats: {
        byHour: Array.from({length: 24}, (_, i) => ({ hour: i, count: 0 })),
        byDay: Array.from({length: 7}, (_, i) => ({ 
          day: i + 1, 
          dayName: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"][i], 
          count: 0 
        }))
      }
    };

    // Calculer les statistiques de sévérité et statut
    alertsList.forEach(alert => {
      // Sévérité
      if (alert.severity === 'HIGH') stats.severityStats.high++;
      else if (alert.severity === 'MEDIUM') stats.severityStats.medium++;
      else if (alert.severity === 'LOW') stats.severityStats.low++;

      // Statut
      if (alert.status === 'NEW') stats.statusStats.new++;
      else if (alert.status === 'ACKNOWLEDGED') stats.statusStats.acknowledged++;
      else if (alert.status === 'RESOLVED') stats.statusStats.resolved++;

      // Statistiques temporelles (à améliorer)
      try {
        const date = new Date(alert.timestamp);
        const hour = date.getHours();
        const day = date.getDay() === 0 ? 7 : date.getDay(); // 1 = Lundi, ..., 7 = Dimanche

        stats.timeStats.byHour[hour].count++;
        stats.timeStats.byDay[day - 1].count++;
      } catch (e) {
        console.error("Erreur lors du parsing de la date:", e);
      }
    });

    // Compter les types d'alertes
    const typeCounts = {};
    alertsList.forEach(alert => {
      if (!typeCounts[alert.type]) {
        typeCounts[alert.type] = 0;
      }
      typeCounts[alert.type]++;
    });

    stats.typeStats = Object.keys(typeCounts).map(type => ({
      type,
      count: typeCounts[type]
    }));

    return stats;
  };
  
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        sort: `${orderBy}:${order}`
      };
      
      // Appliquer le filtre de statut en fonction de l'onglet actif
      if (tabValue > 0 && tabStatusFilters[tabValue]) {
        params.status = tabStatusFilters[tabValue];
      }
      
      // Appliquer les filtres additionnels
      if (filters.severity) params.severity = filters.severity;
      if (filters.type) params.type = filters.type;
      if (filters.status && !params.status) params.status = filters.status;
      
      // Déterminer la méthode à utiliser en fonction des paramètres de route
      let response;
      if (userId) {
        response = await AlertService.getAlertsByUserId(userId, params);
      } else if (carId) {
        response = await AlertService.getAlertsByCarId(carId, params);
      } else {
        response = await AlertService.getAllAlerts(params);
      }
      
      // Mettre à jour les alertes et la pagination
      setAlerts(response.data);
      setTotalAlerts(response.meta.total);
      
      // Calculer des statistiques basiques en attendant l'endpoint dédié
      const calculatedStats = calculateStats(response.data);
      setAlertStats(prev => ({
        ...prev,
        totalAlerts: response.meta.total,
        severityStats: calculatedStats.severityStats,
        statusStats: calculatedStats.statusStats,
        typeStats: calculatedStats.typeStats,
        timeStats: calculatedStats.timeStats
      }));
      
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des alertes');
      setLoading(false);
      console.error(err);
    }
  };
  
  const fetchStats = async () => {
    try {
      // Préparer les paramètres pour les statistiques
      const params = {};
      if (userId) params.userId = userId;
      if (carId) params.carId = carId;
      
      try {
        const response = await AlertService.getAlertStats(params);
        setAlertStats(response.data);
      } catch (error) {
        // Si l'endpoint statistiques n'est pas disponible, 
        // on utilise les statistiques calculées localement
        console.warn("L'endpoint des statistiques n'est pas disponible. Utilisation des statistiques calculées localement.");
      }
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  };
  
  useEffect(() => {
    fetchAlerts();
    // Essayer de récupérer les statistiques du backend, mais ne pas bloquer
    // si cela échoue
    fetchStats();
  }, [userId, carId, page, rowsPerPage, tabValue, orderBy, order, filters]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchAlerts();
  };
  
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  
  const handleFilterChange = (name) => (event) => {
    setFilters(prev => ({
      ...prev,
      [name]: event.target.value
    }));
  };
  
  const handleFilterApply = () => {
    setPage(0);
    handleFilterClose();
    fetchAlerts();
  };
  
  const handleFilterReset = () => {
    setFilters({
      severity: '',
      type: '',
      status: ''
    });
    setPage(0);
    handleFilterClose();
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
  };
  
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const handleMenuOpen = (event, alert) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedAlert(alert);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  const handleViewAlert = () => {
    if (selectedAlert) {
      navigate(`/alerts/${selectedAlert.id}`);
    }
    handleMenuClose();
  };
  
  const handleViewCar = () => {
    if (selectedAlert && selectedAlert.car && selectedAlert.car.id) {
      navigate(`/vehicles/${selectedAlert.car.id}`);
    }
    handleMenuClose();
  };
  
  const handleUpdateStatus = (status) => {
    setAlertToUpdate(selectedAlert);
    setNewStatus(status);
    setStatusNote('');
    setStatusDialogOpen(true);
    handleMenuClose();
  };
  
  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
    setAlertToUpdate(null);
    setNewStatus('');
    setStatusNote('');
  };
  
  const handleStatusUpdateConfirm = async () => {
    try {
      await AlertService.updateAlert(alertToUpdate.id, {
        status: newStatus,
        notes: statusNote || alertToUpdate.notes
      });
      
      fetchAlerts();
      fetchStats();
      setSuccessMessage(`Statut de l'alerte mis à jour avec succès`);
      setSnackbarOpen(true);
    } catch (err) {
      setError(`Erreur lors de la mise à jour: ${err.response?.data?.message || 'Une erreur est survenue'}`);
      setSnackbarOpen(true);
    } finally {
      handleStatusDialogClose();
    }
  };
  
  const handleDeleteClick = () => {
    setAlertToDelete(selectedAlert);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await AlertService.deleteAlert(alertToDelete.id);
      fetchAlerts();
      fetchStats();
      setSuccessMessage(`L'alerte a été supprimée avec succès`);
      setSnackbarOpen(true);
    } catch (err) {
      setError(`Erreur lors de la suppression: ${err.response?.data?.message || 'Une erreur est survenue'}`);
      setSnackbarOpen(true);
    } finally {
      setDeleteDialogOpen(false);
      setAlertToDelete(null);
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAlertToDelete(null);
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
  const getAlertTypeInfo = (type) => {
    switch (type) {
      case 'HARSH_BRAKING':
        return { icon: <WarningIcon />, color: '#f44336', label: 'Freinage brusque' };
      case 'EXCESSIVE_ACCELERATION':
        return { icon: <SpeedIcon />, color: '#ff9800', label: 'Accélération excessive' };
      case 'DANGEROUS_TURN':
        return { icon: <ThreeSixtyIcon />, color: '#9c27b0', label: 'Virage dangereux' };
      case 'EXCESSIVE_SPEED':
        return { icon: <SpeedIcon />, color: '#f44336', label: 'Vitesse excessive' };
      case 'LANE_DEPARTURE':
        return { icon: <TimelineIcon />, color: '#2196f3', label: 'Sortie de voie' };
      default:
        return { icon: <ErrorIcon />, color: '#f44336', label: type };
    }
  };
  
  // Fonction pour obtenir l'icône et la couleur en fonction de la sévérité
  const getSeverityInfo = (severity) => {
    switch (severity) {
      case 'HIGH':
        return { icon: <Looks3Icon />, color: 'error', label: 'Élevée' };
      case 'MEDIUM':
        return { icon: <LooksTwoIcon />, color: 'warning', label: 'Moyenne' };
      case 'LOW':
        return { icon: <LooksOneIcon />, color: 'info', label: 'Faible' };
      default:
        return { icon: <InfoIcon />, color: 'default', label: severity };
    }
  };
  
  // Fonction pour obtenir l'icône et la couleur en fonction du statut
  const getStatusInfo = (status) => {
    switch (status) {
      case 'NEW':
        return { icon: <NotificationsActiveIcon />, color: 'error', label: 'Nouvelle' };
      case 'ACKNOWLEDGED':
        return { icon: <CheckIcon />, color: 'warning', label: 'Traitée' };
      case 'RESOLVED':
        return { icon: <DoneIcon />, color: 'success', label: 'Résolue' };
      default:
        return { icon: <InfoIcon />, color: 'default', label: status };
    }
  };
  
  const renderStatCard = (title, value, icon, color, percentage = null) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          <Avatar sx={{ bgcolor: color }}>
            {icon}
          </Avatar>
        </Box>
        <Typography variant="h3" component="div" sx={{ my: 2, fontWeight: 'bold' }}>
          {value}
        </Typography>
        {percentage !== null && (
          <Typography variant="body2" color="text.secondary">
            {percentage}% du total
          </Typography>
        )}
      </CardContent>
    </Card>
  );
  
  const renderPieChart = () => {
    if (!alertStats) return null;
    
    const { severityStats, statusStats } = alertStats;
    
    const severityData = [
      { name: 'Élevée', value: severityStats.high },
      { name: 'Moyenne', value: severityStats.medium },
      { name: 'Faible', value: severityStats.low }
    ];
    
    const statusData = [
      { name: 'Nouvelles', value: statusStats.new },
      { name: 'Traitées', value: statusStats.acknowledged },
      { name: 'Résolues', value: statusStats.resolved }
    ];
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Répartition par sévérité
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Répartition par statut
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#f44336" />
                    <Cell fill="#ff9800" />
                    <Cell fill="#4caf50" />
                  </Pie>
                  <Legend />
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };
  
  const renderTypeBarChart = () => {
    if (!alertStats || !alertStats.typeStats || alertStats.typeStats.length === 0) return null;
    
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Répartition par type d'alerte
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={alertStats.typeStats.map(item => ({
                ...item,
                // Convertir le type en libellé lisible
                name: alertTypes.find(t => t.value === item.type)?.label || item.type
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="count" fill="#8884d8" name="Nombre d'alertes" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };
  
  const renderTopCars = () => {
    if (!alertStats || !alertStats.topCars || alertStats.topCars.length === 0) return null;
    
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top 5 des véhicules avec le plus d'alertes
          </Typography>
          <List>
            {alertStats.topCars.map((car, index) => (
              <ListItem
                key={index}
                dense
                sx={{
                  mb: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 1
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <DirectionsCarIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {car.brand} {car.model}
                      <Chip
                        label={car.count}
                        size="small"
                        color="primary"
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption">
                      {car.licensePlate} - {car.percentage}% des alertes
                    </Typography>
                  }
                />
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => navigate(`/vehicles/${car.carId}`)}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };
  
  const renderTimeStatistics = () => {
    if (!alertStats || !alertStats.timeStats) return null;
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
          </Card>
        </Grid>
      </Grid>
    );
  };
  
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          {userId ? 'Alertes de l\'utilisateur' : 
           carId ? 'Alertes du véhicule' : 
           'Gestion des alertes'}
        </Typography>
      </Box>
      
      {alertStats && (
        <>
          {/* Cartes statistiques */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              {renderStatCard(
                'Total des alertes',
                alertStats.totalAlerts,
                <NotificationsActiveIcon />,
                '#1976d2'
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {renderStatCard(
                'Alertes élevées',
                alertStats.severityStats.high,
                <Looks3Icon />,
                '#f44336',
                alertStats.totalAlerts > 0 ? Math.round((alertStats.severityStats.high / alertStats.totalAlerts) * 100) : 0
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {renderStatCard(
                'Alertes en attente',
                alertStats.statusStats.new,
                <ErrorIcon />,
                '#ff9800',
                alertStats.totalAlerts > 0 ? Math.round((alertStats.statusStats.new / alertStats.totalAlerts) * 100) : 0
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {renderStatCard(
                'Alertes résolues',
                alertStats.statusStats.resolved,
                <DoneIcon />,
                '#4caf50',
                alertStats.totalAlerts > 0 ? Math.round((alertStats.statusStats.resolved / alertStats.totalAlerts) * 100) : 0
              )}
            </Grid>
          </Grid>
          
          {/* Graphiques statistiques */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              {renderPieChart()}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderTopCars()}
            </Grid>
          </Grid>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              {renderTypeBarChart()}
            </Grid>
          </Grid>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              {renderTimeStatistics()}
            </Grid>
          </Grid>
        </>
      )}
      
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        {/* Barre de recherche et filtres */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Rechercher une alerte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ mr: 1, width: { xs: '100%', sm: '300px' } }}
            />
            <Button type="submit" variant="contained" size="small">
              Rechercher
            </Button>
          </Box>
          
          <Button
            startIcon={<FilterListIcon />}
            variant="outlined"
            size="small"
            onClick={handleFilterClick}
            color={Object.values(filters).some(v => v !== '') ? 'primary' : 'inherit'}
          >
            Filtres {Object.values(filters).some(v => v !== '') && '(actifs)'}
          </Button>
        </Box>
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab 
            label={
              <Badge badgeContent={alertStats?.totalAlerts || 0} color="primary">
                <Box sx={{ pr: 2 }}>Toutes</Box>
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={alertStats?.statusStats?.new || 0} color="error">
                <Box sx={{ pr: 2 }}>Nouvelles</Box>
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={alertStats?.statusStats?.acknowledged || 0} color="warning">
                <Box sx={{ pr: 2 }}>Traitées</Box>
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={alertStats?.statusStats?.resolved || 0} color="success">
                <Box sx={{ pr: 2 }}>Résolues</Box>
              </Badge>
            } 
          />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {/* Tableau des alertes */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Véhicule</TableCell>
                <TableCell>Sévérité</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'timestamp'}
                    direction={orderBy === 'timestamp' ? order : 'asc'}
                    onClick={() => handleSort('timestamp')}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={40} />
                  </TableCell>
                </TableRow>
              ) : alerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      Aucune alerte trouvée
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                alerts.map((alert) => {
                  const typeInfo = getAlertTypeInfo(alert.type);
                  const severityInfo = getSeverityInfo(alert.severity);
                  const statusInfo = getStatusInfo(alert.status);
                  
                  return (
                    <TableRow key={alert.id} hover>
                      <TableCell>
                        <Tooltip title={typeInfo.label}>
                          <Chip
                            icon={React.cloneElement(typeInfo.icon, { style: { color: 'inherit' } })}
                            label={typeInfo.label}
                            size="small"
                            sx={{ 
                              backgroundColor: `${typeInfo.color}20`,
                              color: typeInfo.color,
                              border: `1px solid ${typeInfo.color}`
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {alert.description}
                        </Typography>
                        {alert.location && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                            <Typography variant="caption" color="text.secondary">
                              {alert.data?.address || `${alert.location.latitude.toFixed(4)}, ${alert.location.longitude.toFixed(4)}`}
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 30, 
                              height: 30, 
                              mr: 1,
                              bgcolor: 'primary.main'
                            }}
                          >
                            <DirectionsCarIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {alert.car ? `${alert.car.brand} ${alert.car.model}` : 'Véhicule ' + (alert.vehicleId || 'inconnu')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {alert.car?.licensePlate || ''}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Chip 
                          icon={React.cloneElement(severityInfo.icon, { fontSize: 'small' })}
                          label={severityInfo.label} 
                          size="small" 
                          color={severityInfo.color} 
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Chip 
                          icon={React.cloneElement(statusInfo.icon, { fontSize: 'small' })}
                          label={statusInfo.label} 
                          size="small" 
                          color={statusInfo.color} 
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Tooltip title={new Date(alert.timestamp).toLocaleString()}>
                          <Typography variant="body2">
                            {getTimeAgo(alert.timestamp)}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      
                      <TableCell align="right">
                        <IconButton
                          aria-label="options"
                          size="small"
                          onClick={(e) => handleMenuOpen(e, alert)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={totalAlerts}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
        />
      </Paper>
      
      {/* Menu contextuel */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewAlert}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          Voir détails
        </MenuItem>
      </Menu>
      
      {/* Menu de filtres */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: {
            width: 300,
            p: 2
          }
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Filtres avancés
        </Typography>
        
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Sévérité</InputLabel>
          <Select
            value={filters.severity}
            onChange={handleFilterChange('severity')}
            label="Sévérité"
          >
            <MenuItem value="">Toutes</MenuItem>
            {severityOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Type d'alerte</InputLabel>
          <Select
            value={filters.type}
            onChange={handleFilterChange('type')}
            label="Type d'alerte"
          >
            <MenuItem value="">Tous</MenuItem>
            {alertTypes.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth size="small" sx={{ mb: 3 }}>
          <InputLabel>Statut</InputLabel>
          <Select
            value={filters.status}
            onChange={handleFilterChange('status')}
            label="Statut"
            disabled={tabValue > 0} // Désactiver si déjà filtré par onglet
          >
            <MenuItem value="">Tous</MenuItem>
            {statusOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleFilterReset} color="inherit">
            Réinitialiser
          </Button>
          <Button onClick={handleFilterApply} variant="contained">
            Appliquer
          </Button>
        </Box>
      </Menu>
      
      {/* Snackbar de notification */}
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

export default AlertsList;