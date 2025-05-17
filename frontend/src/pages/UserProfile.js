import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid,
  Button,
  TextField,
  IconButton,
  Chip,
  Card,
  CardContent,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
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
  Badge,
  InputAdornment
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  DirectionsCar as DirectionsCarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  VpnKey as VpnKeyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  NotificationsActive as NotificationsActiveIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AddCircle as AddCircleIcon
} from '@mui/icons-material';
import { useNavigate, useParams, Link } from 'react-router-dom';
import UserService from '../api/userService';
import CarService from '../api/carService';
import AlertService from '../api/alertService';
import authService from '../api/authService';
import UserForm from '../components/users/UserForm';
import CarForm from '../components/cars/CarForm';

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  
  // Si userId est indéfini, utiliser l'ID de l'utilisateur connecté (profil personnel)
  const isPersonalProfile = !userId;
  const profileId = userId || authService.getCurrentUserId();
  const isAdmin = authService.isAdmin();
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [userAlerts, setUserAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [addCarDialogOpen, setAddCarDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await UserService.getUserById(profileId);
      setUser(response.data);
      setFormData({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        phone: response.data.phone,
        licenseNumber: response.data.licenseNumber || ''
      });
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des données utilisateur');
      setLoading(false);
      console.error(err);
    }
  };
  
  const fetchCars = async () => {
    try {
      const response = await CarService.getCarsByUserId(profileId);
      setCars(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des véhicules:', err);
    }
  };
  
  const fetchAlerts = async () => {
    try {
      const response = await AlertService.getAlertsByUserId(profileId, { limit: 5 });
      setUserAlerts(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des alertes:', err);
    }
  };
  
  useEffect(() => {
    fetchUser();
    fetchCars();
    fetchAlerts();
  }, [profileId, fetchUser, fetchCars, fetchAlerts]); // Ajoutez les dépendances manquantes
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Réinitialiser l'erreur pour ce champ
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const toggleShowPassword = (field) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };
  
  const handleSaveProfile = async () => {
    try {
      await UserService.updateUser(profileId, formData);
      setUser(prev => ({
        ...prev,
        ...formData
      }));
      setSuccessMessage('Profil mis à jour avec succès');
      setSnackbarOpen(true);
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
      setSnackbarOpen(true);
    }
  };
  
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Le mot de passe actuel est requis';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;
    
    try {
      // Simuler une mise à jour de mot de passe réussie
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setChangePasswordDialogOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSuccessMessage('Mot de passe mis à jour avec succès');
      setSnackbarOpen(true);
    } catch (err) {
      setPasswordErrors({
        ...passwordErrors,
        currentPassword: 'Mot de passe actuel incorrect'
      });
    }
  };
  
  const handleDeleteUser = async () => {
    try {
      await UserService.deleteUser(profileId);
      setDeleteDialogOpen(false);
      setSuccessMessage('Utilisateur supprimé avec succès');
      setSnackbarOpen(true);
      
      // Rediriger vers la liste des utilisateurs ou la page de connexion
      setTimeout(() => {
        if (isPersonalProfile) {
          authService.logout();
          navigate('/login');
        } else {
          navigate('/users');
        }
      }, 2000);
    } catch (err) {
      setError('Erreur lors de la suppression de l\'utilisateur');
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
    }
  };
  
  const handleUserSaved = () => {
    fetchUser();
    setEditUserDialogOpen(false);
    setSuccessMessage('Utilisateur mis à jour avec succès');
    setSnackbarOpen(true);
  };
  
  const handleCarSaved = () => {
    fetchCars();
    setAddCarDialogOpen(false);
    setSuccessMessage('Véhicule ajouté avec succès');
    setSnackbarOpen(true);
  };
  
  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'MANAGER':
        return 'warning';
      default:
        return 'primary';
    }
  };
  
  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrateur';
      case 'MANAGER':
        return 'Gestionnaire';
      default:
        return 'Utilisateur';
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
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Retour
        </Button>
      </Box>
    );
  }
  
  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Utilisateur non trouvé
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Retour
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
            {!isPersonalProfile && (
              <Link 
                to="/users" 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Utilisateurs
              </Link>
            )}
            <Typography color="text.primary">
              {isPersonalProfile ? 'Mon profil' : 'Profil utilisateur'}
            </Typography>
          </Breadcrumbs>
          
          <Typography variant="h4" gutterBottom>
            {isPersonalProfile ? 'Mon profil' : `${user.firstName} ${user.lastName}`}
          </Typography>
        </Box>
        
        <Box>
          {!isPersonalProfile && (
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/users')}
              sx={{ mr: 1 }}
            >
              Retour
            </Button>
          )}
          
          {(isPersonalProfile || isAdmin) && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => setEditUserDialogOpen(true)}
              sx={{ mr: 1 }}
            >
              {isPersonalProfile ? 'Modifier mon profil' : 'Modifier l\'utilisateur'}
            </Button>
          )}
          
          {isAdmin && !isPersonalProfile && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Supprimer
            </Button>
          )}
        </Box>
      </Box>
      
      {/* Onglets */}
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Informations personnelles" />
        <Tab 
          label="Véhicules" 
          icon={<Badge 
            badgeContent={cars.length}
            color="primary"
            sx={{ ml: 1 }}
          />}
          iconPosition="end"
        />
        {(isAdmin || isPersonalProfile) && (
          <Tab label="Paramètres du compte" />
        )}
      </Tabs>
      
      {/* Contenu principal - Onglet Informations personnelles */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Informations de base */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                mb: 3
              }}>
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    mb: 2,
                    bgcolor: getRoleColor(user.role) + '.main',
                    fontSize: '2rem'
                  }}
                >
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </Avatar>
                
                <Typography variant="h5" sx={{ textAlign: 'center' }}>
                  {user.firstName} {user.lastName}
                </Typography>
                
                <Chip 
                  label={getRoleLabel(user.role)}
                  color={getRoleColor(user.role)}
                  sx={{ mt: 1 }}
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <EmailIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Email" 
                    secondary={user.email}
                    primaryTypographyProps={{ variant: 'subtitle2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <PhoneIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Téléphone" 
                    secondary={user.phone}
                    primaryTypographyProps={{ variant: 'subtitle2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <VpnKeyIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Numéro de permis" 
                    secondary={user.licenseNumber || 'Non renseigné'}
                    primaryTypographyProps={{ variant: 'subtitle2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <DirectionsCarIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Véhicules associés" 
                    secondary={`${cars.length} véhicule(s)`}
                    primaryTypographyProps={{ variant: 'subtitle2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              </List>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<DirectionsCarIcon />}
                component={Link}
                to={`/users/${profileId}/cars`}
                sx={{ mt: 2 }}
              >
                Voir tous les véhicules
              </Button>
            </Paper>
          </Grid>
          
          {/* Statistiques et alertes récentes */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: '1px solid #eee' }}>
                    Statistiques
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <DirectionsCarIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {cars.length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Véhicules
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <NotificationsActiveIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {userAlerts.length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Alertes récentes
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {user.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Statut du compte
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    pb: 2,
                    borderBottom: '1px solid #eee'
                  }}>
                    <Typography variant="h6">
                      Alertes récentes
                    </Typography>
                    
                    <Button
                      variant="text"
                      component={Link}
                      to={`/alerts?userId=${profileId}`}
                    >
                      Voir toutes les alertes
                    </Button>
                  </Box>
                  
                  <List>
                    {userAlerts.length > 0 ? (
                      userAlerts.map(alert => (
                        <ListItem 
                          key={alert.id}
                          sx={{ 
                            borderLeft: '4px solid',
                            borderColor: 
                              alert.severity === 'HIGH' ? 'error.main' : 
                              alert.severity === 'MEDIUM' ? 'warning.main' : 'info.main',
                            mb: 2,
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
                              <NotificationsActiveIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {alert.description}
                                <Chip 
                                  label={alert.severity}
                                  size="small"
                                  color={
                                    alert.severity === 'HIGH' ? 'error' :
                                    alert.severity === 'MEDIUM' ? 'warning' : 'info'
                                  }
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
                          <Button
                            variant="outlined"
                            size="small"
                            component={Link}
                            to={`/alerts/${alert.id}`}
                          >
                            Détails
                          </Button>
                        </ListItem>
                      ))
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, flexDirection: 'column' }}>
                        <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="body1">
                          Aucune alerte récente
                        </Typography>
                      </Box>
                    )}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      
      {/* Contenu de l'onglet Véhicules */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h6">
              Véhicules associés à cet utilisateur
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={() => setAddCarDialogOpen(true)}
            >
              Ajouter un véhicule
            </Button>
          </Box>
          
          {cars.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <DirectionsCarIcon color="disabled" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6">
                Aucun véhicule
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Cet utilisateur n'a pas encore de véhicules associés
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                onClick={() => setAddCarDialogOpen(true)}
                sx={{ mt: 2 }}
              >
                Ajouter un véhicule
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {cars.map(car => (
                <Grid item xs={12} sm={6} md={4} key={car.id}>
                  <Card sx={{ 
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    },
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'primary.main',
                            mr: 2
                          }}
                        >
                          <DirectionsCarIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" noWrap>
                            {car.brand} {car.model}
                          </Typography>
                          <Chip 
                            label={car.licensePlate}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Année
                          </Typography>
                          <Typography variant="body2">
                            {car.year}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Statut
                          </Typography>
                          <Chip 
                            label={car.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                            size="small"
                            color={car.status === 'ACTIVE' ? 'success' : 'default'}
                            sx={{ mt: 0.5 }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Kilométrage
                          </Typography>
                          <Typography variant="body2">
                            {car.mileage.toLocaleString()} km
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Score sécurité
                          </Typography>
                          <Chip 
                            label={`${car.safetyScore}%`}
                            size="small"
                            color={
                              car.safetyScore >= 90 ? 'success' :
                              car.safetyScore >= 80 ? 'primary' :
                              car.safetyScore >= 70 ? 'warning' : 'error'
                            }
                            sx={{ mt: 0.5 }}
                          />
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          fullWidth
                          component={Link}
                          to={`/cars/${car.id}`}
                        >
                          Détails
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          component={Link}
                          to={`/cars/${car.id}/data`}
                        >
                          Données
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}
      
      {/* Contenu de l'onglet Paramètres du compte */}
      {tabValue === 2 && (isAdmin || isPersonalProfile) && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: '1px solid #eee' }}>
            Paramètres du compte
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Sécurité
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Changez régulièrement votre mot de passe pour garantir la sécurité de votre compte
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<LockIcon />}
                    onClick={() => setChangePasswordDialogOpen(true)}
                    sx={{ mt: 1 }}
                  >
                    Changer de mot de passe
                  </Button>
                </Box>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Statut du compte
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    icon={user.status === 'ACTIVE' ? <CheckCircleIcon /> : <CancelIcon />}
                    label={user.status === 'ACTIVE' ? 'Compte actif' : 'Compte inactif'}
                    color={user.status === 'ACTIVE' ? 'success' : 'default'}
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {user.status === 'ACTIVE' 
                      ? 'Votre compte est actuellement actif' 
                      : 'Votre compte est actuellement inactif'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
                  Zone de danger
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  La suppression de votre compte est définitive et entraînera la perte de toutes vos données et historiques.
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Supprimer mon compte
                </Button>
              </Card>
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
            {isPersonalProfile 
              ? 'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et supprimera toutes vos données, y compris vos véhicules et historiques.'
              : `Êtes-vous sûr de vouloir supprimer le compte de ${user.firstName} ${user.lastName} ? Cette action est irréversible et supprimera toutes les données associées, y compris les véhicules et historiques.`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog pour modifier l'utilisateur */}
      <UserForm
        open={editUserDialogOpen}
        handleClose={() => setEditUserDialogOpen(false)}
        user={user}
        onSave={handleUserSaved}
      />
      
      {/* Dialog pour ajouter un véhicule */}
      <CarForm
        open={addCarDialogOpen}
        handleClose={() => setAddCarDialogOpen(false)}
        userId={parseInt(profileId)}
        onSave={handleCarSaved}
      />
      
      {/* Dialog pour changer le mot de passe */}
      <Dialog
        open={changePasswordDialogOpen}
        onClose={() => setChangePasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Changer de mot de passe
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Pour changer votre mot de passe, veuillez saisir votre mot de passe actuel, puis votre nouveau mot de passe.
          </DialogContentText>
          
          <TextField
            label="Mot de passe actuel"
            name="currentPassword"
            type={showCurrentPassword ? 'text' : 'password'}
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            error={!!passwordErrors.currentPassword}
            helperText={passwordErrors.currentPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => toggleShowPassword('current')}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="Nouveau mot de passe"
            name="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            error={!!passwordErrors.newPassword}
            helperText={passwordErrors.newPassword || 'Le mot de passe doit contenir au moins 6 caractères'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => toggleShowPassword('new')}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="Confirmer le nouveau mot de passe"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            error={!!passwordErrors.confirmPassword}
            helperText={passwordErrors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => toggleShowPassword('confirm')}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordDialogOpen(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleChangePassword} 
            variant="contained" 
            color="primary"
          >
            Changer le mot de passe
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

export default UserProfile;