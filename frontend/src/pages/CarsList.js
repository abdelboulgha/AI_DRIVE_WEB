import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tabs,
  Tab,
  Badge,
  CircularProgress,
  Alert,
  Snackbar,
  Avatar
} from '@mui/material';
import { 
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsCar as DirectionsCarIcon,
  BarChart as BarChartIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  ColorLens as ColorLensIcon,
  LocalGasStation as LocalGasStationIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import CarService from '../api/carService';
import UserService from '../api/userService';
import CarForm from '../components/cars/CarForm';
import authService from '../api/authService';

const CarsList = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Si on veut afficher les voitures d'un utilisateur spécifique
  const isUserSpecific = !!userId;
  
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCars, setTotalCars] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [selectedCar, setSelectedCar] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carFormOpen, setCarFormOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    totalCars: 0,
    activeCars: 0,
    inactiveCars: 0,
    avgSafetyScore: 0
  });
  const [orderBy, setOrderBy] = useState('lastActivity');
  const [order, setOrder] = useState('desc');
  
  const tabFilters = ['all', 'active', 'inactive'];
  
  const fetchUser = async () => {
    if (isUserSpecific) {
      try {
        const response = await UserService.getUserById(userId);
        setUserInfo(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des données utilisateur:', err);
      }
    }
  };
  
  const fetchCars = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        sort: `${orderBy}:${order}`
      };
      
      if (tabValue > 0) {
        params.status = tabFilters[tabValue].toUpperCase();
      }
      
      const response = isUserSpecific
        ? await CarService.getCarsByUserId(userId, params)
        : await CarService.getAllCars(params);
      
      setCars(response.data);
      setTotalCars(response.meta.total);
      
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des véhicules');
      setLoading(false);
      console.error(err);
    }
  };
  
  const fetchStats = async () => {
    try {
      const response = await CarService.getCarStats(isUserSpecific ? userId : null);
      setStats(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  };
  
  useEffect(() => {
    fetchUser();
    fetchCars();
    fetchStats();
  }, [userId, page, rowsPerPage, tabValue, orderBy, order]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchCars();
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
  
  const handleMenuOpen = (event, car) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedCar(car);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  const handleEditCar = () => {
    setCarFormOpen(true);
    handleMenuClose();
  };
  
  const handleDeleteClick = () => {
    setCarToDelete(selectedCar);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await CarService.deleteCar(carToDelete.id);
      fetchCars();
      fetchStats();
      setSuccessMessage(`Le véhicule ${carToDelete.brand} ${carToDelete.model} a été supprimé avec succès`);
      setSnackbarOpen(true);
    } catch (err) {
      setError(`Erreur lors de la suppression: ${err.response?.data?.message || 'Une erreur est survenue'}`);
      setSnackbarOpen(true);
    } finally {
      setDeleteDialogOpen(false);
      setCarToDelete(null);
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCarToDelete(null);
  };
  
  const handleCreateCar = () => {
    setSelectedCar(null);
    setCarFormOpen(true);
  };
  
  const handleFormClose = () => {
    setCarFormOpen(false);
    setSelectedCar(null);
  };
  
  const handleCarSaved = () => {
    fetchCars();
    fetchStats();
    setCarFormOpen(false);
    setSuccessMessage(selectedCar 
      ? `Le véhicule a été mis à jour avec succès` 
      : `Nouveau véhicule créé avec succès`
    );
    setSnackbarOpen(true);
  };
  
  const handleViewCarDetails = (carId) => {
    navigate(`/cars/${carId}`);
    handleMenuClose();
  };
  
  const handleViewCarData = (carId) => {
    navigate(`/cars/${carId}/data`);
    handleMenuClose();
  };
  
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
          width: 24,
          height: 24,
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
  
  const getSafetyScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'primary';
    if (score >= 70) return 'warning';
    return 'error';
  };
  
  const renderCarsTable = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Véhicule</TableCell>
            {!isUserSpecific && <TableCell>Propriétaire</TableCell>}
            <TableCell>Immatriculation</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'year'}
                direction={orderBy === 'year' ? order : 'asc'}
                onClick={() => handleSort('year')}
              >
                Année
              </TableSortLabel>
            </TableCell>
            <TableCell>Kilométrage</TableCell>
            <TableCell>Carburant</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'safetyScore'}
                direction={orderBy === 'safetyScore' ? order : 'asc'}
                onClick={() => handleSort('safetyScore')}
              >
                Score sécurité
              </TableSortLabel>
            </TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'lastActivity'}
                direction={orderBy === 'lastActivity' ? order : 'asc'}
                onClick={() => handleSort('lastActivity')}
              >
                Dernière activité
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={isUserSpecific ? 9 : 10} align="center" sx={{ py: 3 }}>
                <CircularProgress size={40} />
              </TableCell>
            </TableRow>
          ) : cars.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isUserSpecific ? 9 : 10} align="center" sx={{ py: 3 }}>
                <Typography variant="body1">
                  Aucun véhicule trouvé
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            cars.map((car) => (
              <TableRow key={car.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      <DirectionsCarIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {car.brand} {car.model}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        {getColorBox(car.color)}
                        <Typography variant="caption" color="text.secondary">
                          {car.color}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </TableCell>
                
                {!isUserSpecific && (
                  <TableCell>
                    {car.owner.firstName} {car.owner.lastName}
                  </TableCell>
                )}
                
                <TableCell>
                  <Chip 
                    label={car.licensePlate}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                
                <TableCell>{car.year}</TableCell>
                
                <TableCell>
                  {car.mileage.toLocaleString()} km
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getFuelTypeIcon(car.fuelType)}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {car.fuelType}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Chip 
                    label={`${car.safetyScore}%`}
                    size="small"
                    color={getSafetyScoreColor(car.safetyScore)}
                  />
                </TableCell>
                
                <TableCell>
                  <Chip 
                    icon={car.status === 'ACTIVE' ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                    label={car.status === 'ACTIVE' ? 'Actif' : 'Inactif'} 
                    size="small" 
                    color={car.status === 'ACTIVE' ? 'success' : 'default'} 
                  />
                </TableCell>
                
                <TableCell>
                  {car.lastActivity ? new Date(car.lastActivity).toLocaleDateString() : 'Jamais'}
                </TableCell>
                
                <TableCell align="right">
                  <IconButton
                    aria-label="options"
                    size="small"
                    onClick={(e) => handleMenuOpen(e, car)}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
  
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
            {isUserSpecific 
              ? `Véhicules de ${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`
              : 'Gestion des véhicules'
            }
          </Typography>
          
          {isUserSpecific && (
            <Button 
              variant="text" 
              color="primary" 
              onClick={() => navigate('/users')}
              sx={{ mt: 1 }}
            >
              ← Retour à la liste des utilisateurs
            </Button>
          )}
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateCar}
        >
          {isUserSpecific 
            ? 'Ajouter un véhicule à cet utilisateur'
            : 'Nouveau véhicule'
          }
        </Button>
      </Box>
      
      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Total véhicules
                </Typography>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <DirectionsCarIcon />
                </Avatar>
              </Box>
              <Typography variant="h3" component="div" sx={{ my: 2, fontWeight: 'bold' }}>
                {stats.totalCars}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Véhicules actifs
                  </Typography>
                  <Typography variant="h6" color="success.main" sx={{ fontWeight: 'medium' }}>
                    {stats.activeCars}
                  </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    Véhicules inactifs
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    {stats.inactiveCars}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Score de sécurité moyen
                </Typography>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <SpeedIcon />
                </Avatar>
              </Box>
              <Box sx={{ 
                textAlign: 'center', 
                my: 2, 
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center' 
              }}>
                <CircularProgress 
                  variant="determinate" 
                  value={stats.avgSafetyScore} 
                  size={100}
                  thickness={5}
                  sx={{ color: getSafetyScoreColor(stats.avgSafetyScore) + '.main' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" fontWeight="bold">
                    {stats.avgSafetyScore}%
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Excellent (90%+)
                  </Typography>
                  <Chip 
                    label={stats.safetyScoreRanges?.excellent || 0} 
                    size="small"
                    color="success"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Bon (80-89%)
                  </Typography>
                  <Chip 
                    label={stats.safetyScoreRanges?.good || 0} 
                    size="small"
                    color="primary"
                  />
                </Grid>
                <Grid item xs={6} sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Moyen (70-79%)
                  </Typography>
                  <Chip 
                    label={stats.safetyScoreRanges?.average || 0} 
                    size="small"
                    color="warning"
                  />
                </Grid>
                <Grid item xs={6} sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Faible (&lt;70%)
                  </Typography>
                  <Chip 
                    label={stats.safetyScoreRanges?.poor || 0} 
                    size="small"
                    color="error"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Types de carburant
                </Typography>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <LocalGasStationIcon />
                </Avatar>
              </Box>
              
              <Box sx={{ mt: 2, mb: 2 }}>
                {stats.fuelStats?.map((fuel, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getFuelTypeIcon(fuel.fuelType)}
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {fuel.fuelType}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="medium">
                        {fuel.count} ({fuel.percentage}%)
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', bgcolor: 'background.paper', height: 8, borderRadius: 1, overflow: 'hidden' }}>
                      <Box
                        sx={{
                          width: `${fuel.percentage}%`,
                          height: '100%',
                          bgcolor: fuel.fuelType === 'Hybride' ? 'success.main' : 
                                   fuel.fuelType === 'Électrique' ? 'info.main' :
                                   fuel.fuelType === 'Diesel' ? 'warning.main' : 'error.main',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Répartition par marque
                </Typography>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <BarChartIcon />
                </Avatar>
              </Box>
              
              <Box sx={{ mt: 2, mb: 1, maxHeight: 200, overflowY: 'auto' }}>
                {stats.brandStats?.map((brand, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2">
                        {brand.brand}
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {brand.count} ({brand.percentage}%)
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', bgcolor: 'background.paper', height: 8, borderRadius: 1, overflow: 'hidden' }}>
                      <Box
                        sx={{
                          width: `${brand.percentage}%`,
                          height: '100%',
                          bgcolor: 'primary.main',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total kilométrage
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {stats.totalMileage?.toLocaleString()} km
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    Alertes actives
                  </Typography>
                  <Typography variant="h6" color="error.main" fontWeight="medium">
                    {stats.alertsCount || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        {/* Barre de recherche et filtres */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Rechercher un véhicule..."
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
            onClick={() => alert('Filtres avancés à implémenter')}
          >
            Filtres
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
              <Badge badgeContent={stats.totalCars} color="primary">
                <Box sx={{ pr: 2 }}>Tous</Box>
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={stats.activeCars} color="success">
                <Box sx={{ pr: 2 }}>Actifs</Box>
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={stats.inactiveCars} color="error">
                <Box sx={{ pr: 2 }}>Inactifs</Box>
              </Badge>
            } 
          />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {/* Tableau des véhicules */}
        {renderCarsTable()}
        
        <TablePagination
          component="div"
          count={totalCars}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
        />
      </Paper>
      
      {/* Menu contextuel pour actions véhicule */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewCarDetails}>
          <BarChartIcon fontSize="small" sx={{ mr: 1 }} />
          Voir détails
        </MenuItem>
        <MenuItem onClick={handleViewCarData}>
          <TimelineIcon fontSize="small" sx={{ mr: 1 }} />
          Visualiser données
        </MenuItem>
        <MenuItem onClick={handleEditCar}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Modifier
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>
      
      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le véhicule {carToDelete?.brand} {carToDelete?.model} ({carToDelete?.licensePlate}) ?
            Cette action est irréversible et supprimera également toutes les données associées.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>
            Annuler
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Formulaire de véhicule (ajout/modification) */}
      <CarForm
        open={carFormOpen}
        handleClose={handleFormClose}
        car={selectedCar}
        userId={isUserSpecific ? parseInt(userId) : (selectedCar?.userId || null)}
        onSave={handleCarSaved}
      />
      
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

export default CarsList;