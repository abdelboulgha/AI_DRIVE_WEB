import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid,
  Chip,
  IconButton,
  Button,
  Divider,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Snackbar,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tooltip,
  Breadcrumbs
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  Done as DoneIcon,
  DoNotDisturb as DoNotDisturbIcon,
  Warning as WarningIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationOnIcon,
  Speed as SpeedIcon,
  ThreeSixty as ThreeSixtyIcon,
  Timeline as TimelineIcon,
  DirectionsCar as DirectionsCarIcon,
  Person as PersonIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  AccessTime as AccessTimeIcon,
  NotificationsActive as NotificationsActiveIcon,
  LooksOne as LooksOneIcon,
  LooksTwo as LooksTwoIcon,
  Looks3 as Looks3Icon
} from '@mui/icons-material';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AlertService from '../api/alertService';
import GPSMap from '../components/maps/GPSMap';

const AlertDetails = () => {
  const navigate = useNavigate();
  const { alertId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [editNotes, setEditNotes] = useState(false);
  const [newNotes, setNewNotes] = useState('');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchAlert = async () => {
    try {
      setLoading(true);
      const response = await AlertService.getAlertById(alertId);
      setAlert(response.data);
      setNewNotes(response.data.notes || '');
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des détails de l\'alerte');
      setLoading(false);
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchAlert();
  }, [alertId]);
  
  // Fonction pour mettre à jour les notes
  const handleSaveNotes = async () => {
    try {
      await AlertService.updateAlert(alertId, { notes: newNotes });
      setAlert(prev => ({ ...prev, notes: newNotes }));
      setEditNotes(false);
      setSuccessMessage('Notes mises à jour avec succès');
      setSnackbarOpen(true);
    } catch (err) {
      setError('Erreur lors de la mise à jour des notes');
      setSnackbarOpen(true);
    }
  };
  
  // Fonction pour ouvrir le dialogue de changement de statut
  const handleStatusChange = (status) => {
    setNewStatus(status);
    setStatusNote('');
    setStatusDialogOpen(true);
  };
  
  // Fonction pour sauvegarder le nouveau statut
  const handleStatusSave = async () => {
    try {
      const updatedData = {
        status: newStatus,
        notes: statusNote ? (alert.notes ? `${alert.notes}\n\n${statusNote}` : statusNote) : alert.notes
      };
      
      await AlertService.updateAlert(alertId, updatedData);
      
      // Mettre à jour l'état local avec les nouvelles valeurs
      setAlert(prev => ({
        ...prev,
        status: newStatus,
        notes: updatedData.notes
      }));
      
      setNewNotes(updatedData.notes || '');
      setStatusDialogOpen(false);
      setSuccessMessage(`Statut mis à jour avec succès`);
      setSnackbarOpen(true);
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
      setSnackbarOpen(true);
    }
  };
  
  // Fonction pour confirmer la suppression
  const handleDeleteConfirm = async () => {
    try {
      await AlertService.deleteAlert(alertId);
      setDeleteDialogOpen(false);
      setSuccessMessage('Alerte supprimée avec succès');
      setSnackbarOpen(true);
      
      // Rediriger vers la liste des alertes après 2 secondes
      setTimeout(() => {
        navigate('/alerts');
      }, 2000);
    } catch (err) {
      setError('Erreur lors de la suppression de l\'alerte');
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
    }
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
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !alert) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/alerts')}
          sx={{ mt: 2 }}
        >
          Retour à la liste des alertes
        </Button>
      </Box>
    );
  }
  
  if (!alert) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Alerte non trouvée
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/alerts')}
          sx={{ mt: 2 }}
        >
          Retour à la liste des alertes
        </Button>
      </Box>
    );
  }
  
  // Extraire les informations nécessaires
  const typeInfo = getAlertTypeInfo(alert.type);
  const severityInfo = getSeverityInfo(alert.severity);
  const statusInfo = getStatusInfo(alert.status);
  const alertDate = new Date(alert.timestamp);
  
  // Préparer les données pour la carte
  const gpsData = alert.location ? [{
    latitude: alert.location.latitude,
    longitude: alert.location.longitude,
    altitude: 0,
    speed: alert.data?.speed || 0,
    deviceId: alert.deviceId,
    timestamp: alert.timestamp
  }] : [];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête avec fil d'Ariane et boutons d'action */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link 
              to="/alerts" 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Alertes
            </Link>
            <Typography color="text.primary">Détails de l'alerte</Typography>
          </Breadcrumbs>
          
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            {React.cloneElement(typeInfo.icon, { style: { marginRight: '8px', color: typeInfo.color } })}
            {typeInfo.label} 
            <Chip 
              label={`ID: ${alert.id}`}
              size="small"
              sx={{ ml: 2 }}
              color="primary"
              variant="outlined"
            />
          </Typography>
        </Box>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/alerts')}
            sx={{ mr: 1 }}
          >
            Retour
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
      
      {/* Contenu principal */}
      <Grid container spacing={3}>
        {/* Informations de base */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: '1px solid #eee' }}>
              Informations de l'alerte
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Type d'alerte
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Avatar sx={{ bgcolor: `${typeInfo.color}20`, mr: 1 }}>
                    {React.cloneElement(typeInfo.icon, { sx: { color: typeInfo.color } })}
                  </Avatar>
                  <Typography variant="body1">
                    {typeInfo.label}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Sévérité
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Chip 
                    icon={React.cloneElement(severityInfo.icon, { fontSize: 'small' })}
                    label={severityInfo.label} 
                    color={severityInfo.color} 
                    sx={{ mr: 1 }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Statut actuel
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Chip 
                    icon={React.cloneElement(statusInfo.icon, { fontSize: 'small' })}
                    label={statusInfo.label} 
                    color={statusInfo.color} 
                    sx={{ mr: 1 }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date et heure
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1">
                    {alertDate.toLocaleDateString()} {alertDate.toLocaleTimeString()}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {alert.description}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Localisation
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, flexWrap: 'wrap' }}>
                  <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1" sx={{ mr: 2 }}>
                    {alert.data?.address || 'Adresse non disponible'}
                  </Typography>
                  {alert.location && (
                    <Typography variant="body2" color="text.secondary">
                      ({alert.location.latitude.toFixed(6)}, {alert.location.longitude.toFixed(6)})
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Actions
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              {alert.status === 'NEW' && (
                <Grid item xs={12} md={6}>
                  <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    startIcon={<CheckIcon />}
                    onClick={() => handleStatusChange('ACKNOWLEDGED')}
                  >
                    Marquer comme traitée
                  </Button>
                </Grid>
              )}
              
              {(alert.status === 'NEW' || alert.status === 'ACKNOWLEDGED') && (
                <Grid item xs={12} md={6}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    startIcon={<DoneIcon />}
                    onClick={() => handleStatusChange('RESOLVED')}
                  >
                    Marquer comme résolue
                  </Button>
                </Grid>
              )}
              
              {alert.status !== 'NEW' && (
                <Grid item xs={12} md={6}>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<DoNotDisturbIcon />}
                    onClick={() => handleStatusChange('NEW')}
                  >
                    Marquer comme nouvelle
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
        
        {/* Carte et données */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ height: '300px', width: '100%' }}>
              {gpsData.length > 0 ? (
                <GPSMap gpsData={gpsData} />
              ) : (
                <Box sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  bgcolor: '#f5f5f5'
                }}>
                  <Typography variant="body1" color="text.secondary">
                    Localisation GPS non disponible
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Box sx={{ p: 3, flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: '1px solid #eee' }}>
                Données détaillées
              </Typography>
              
              <List>
                {alert.data && Object.entries(alert.data).map(([key, value]) => (
                  <ListItem key={key} divider dense>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" color="text.secondary">
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                          {key === 'speed' || key === 'speedLimit' ? `${value} km/h` :
                           key === 'acceleration' ? `${value} m/s²` :
                           key === 'angularVelocity' ? `${value} deg/s` :
                           value.toString()}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
                {(!alert.data || Object.keys(alert.data).length === 0) && (
                  <ListItem>
                    <ListItemText
                      primary="Aucune donnée supplémentaire disponible"
                      primaryTypographyProps={{ color: 'text.secondary' }}
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          </Paper>
        </Grid>
        
        {/* Informations sur le véhicule */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              pb: 2,
              borderBottom: '1px solid #eee'
            }}>
              <Typography variant="h6">
                Informations du véhicule
              </Typography>
              
              <Button
                variant="text"
                startIcon={<DirectionsCarIcon />}
                component={Link}
                to={`/cars/${alert.carId}`}
              >
                Voir le véhicule
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Avatar 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  mr: 2,
                  bgcolor: 'primary.main'
                }}
              >
                <DirectionsCarIcon sx={{ fontSize: 30 }} />
              </Avatar>
              
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  {alert.car.brand} {alert.car.model}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {alert.car.licensePlate}
                </Typography>
              </Box>
            </Box>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Propriétaire
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1">
                    {alert.car.owner.firstName} {alert.car.owner.lastName}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  ID de l'appareil
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {alert.deviceId || 'Non disponible'}
                </Typography>
              </Grid>
            </Grid>
            
            <Button
              variant="outlined"
              fullWidth
              startIcon={<TimelineIcon />}
              component={Link}
              to={`/cars/${alert.carId}/data`}
              sx={{ mt: 3 }}
            >
              Voir les données du véhicule
            </Button>
          </Paper>
        </Grid>
        
        {/* Notes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              pb: 2,
              borderBottom: '1px solid #eee'
            }}>
              <Typography variant="h6">
                Notes et commentaires
              </Typography>
              
              {editNotes ? (
                <Box>
                  <Button
                    color="inherit"
                    onClick={() => {
                      setEditNotes(false);
                      setNewNotes(alert.notes || '');
                    }}
                    sx={{ mr: 1 }}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveNotes}
                  >
                    Enregistrer
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditNotes(true)}
                >
                  Modifier
                </Button>
              )}
            </Box>
            
            {editNotes ? (
              <TextField
                fullWidth
                multiline
                rows={6}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Ajoutez des notes concernant cette alerte..."
                variant="outlined"
                sx={{ mt: 2 }}
              />
            ) : (
              <Box sx={{ mt: 2, minHeight: '150px' }}>
                {alert.notes ? (
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {alert.notes}
                  </Typography>
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Aucune note disponible. Cliquez sur "Modifier" pour ajouter des notes.
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Dialog pour changer le statut */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Changer le statut
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Vous allez changer le statut de l'alerte de "{getStatusInfo(alert.status).label}" à "{getStatusInfo(newStatus).label}".
          </DialogContentText>
          
          <Typography variant="subtitle2" gutterBottom>
            Ajouter une note (optionnelle):
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="Expliquez la raison du changement de statut..."
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)} color="inherit">
            Annuler
          </Button>
          <Button 
            onClick={handleStatusSave} 
            variant="contained" 
            color={
              newStatus === 'RESOLVED' ? 'success' :
              newStatus === 'ACKNOWLEDGED' ? 'warning' : 'primary'
            }
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      
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
            Êtes-vous sûr de vouloir supprimer cette alerte ? Cette action est irréversible.
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

export default AlertDetails;