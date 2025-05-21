import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Chip,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Breadcrumbs,
  Link,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  Speed as SpeedIcon,
  ThreeSixty as ThreeSixtyIcon,
  Info as InfoIcon,
  DirectionsCar as DirectionsCarIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';

// Configuration de l'API
const API_URL = 'http://localhost:8080/api';

// Service pour les alertes
const AlertService = {
  getAlert: (id) => {
    return axios.get(`${API_URL}/alerts/${id}`);
  },
  
  updateAlert: (id, data) => {
    return axios.put(`${API_URL}/alerts/${id}`, data);
  },
  
  deleteAlert: (id) => {
    return axios.delete(`${API_URL}/alerts/${id}`);
  }
};

const AlertDetailsV2 = () => {
  const { alertId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    const fetchAlertDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const alertResponse = await AlertService.getAlert(alertId);
        setAlert(alertResponse.data);
        setNotes(alertResponse.data.notes || '');
        
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des détails de l'alerte");
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchAlertDetails();
  }, [alertId]);
  
  // Fonction pour obtenir l'icône et la couleur en fonction du type d'alerte
  const getAlertTypeInfo = (type) => {
    switch (type) {
      case 'HARSH_BRAKING':
        return { icon: <WarningIcon />, color: '#f44336', bgColor: '#ffebee', label: 'Freinage brusque' };
      case 'EXCESSIVE_ACCELERATION':
        return { icon: <SpeedIcon />, color: '#ff9800', bgColor: '#fff3e0', label: 'Accélération excessive' };
      case 'DANGEROUS_TURN':
        return { icon: <ThreeSixtyIcon />, color: '#9c27b0', bgColor: '#f3e5f5', label: 'Virage dangereux' };
      case 'EXCESSIVE_SPEED':
        return { icon: <SpeedIcon />, color: '#f44336', bgColor: '#ffebee', label: 'Vitesse excessive' };
      case 'LANE_DEPARTURE':
        return { icon: <ThreeSixtyIcon />, color: '#2196f3', bgColor: '#e3f2fd', label: 'Sortie de voie' };
      default:
        return { icon: <WarningIcon />, color: '#f44336', bgColor: '#ffebee', label: type };
    }
  };
  
  // Fonction pour obtenir la couleur en fonction de la sévérité
  const getSeverityInfo = (severity) => {
    switch (severity) {
      case 'HIGH':
        return { color: '#f44336', bgColor: '#ffebee', label: 'Élevée' };
      case 'MEDIUM':
        return { color: '#ff9800', bgColor: '#fff3e0', label: 'Moyenne' };
      case 'LOW':
        return { color: '#2196f3', bgColor: '#e3f2fd', label: 'Faible' };
      default:
        return { color: '#757575', bgColor: '#f5f5f5', label: severity };
    }
  };
  
  // Fonction pour obtenir la couleur en fonction du statut
  const getStatusInfo = (status) => {
    switch (status) {
      case 'NEW':
        return { color: '#f44336', bgColor: '#ffebee', label: 'Nouvelle' };
      case 'ACKNOWLEDGED':
        return { color: '#ff9800', bgColor: '#fff3e0', label: 'Traitée' };
      case 'RESOLVED':
        return { color: '#4caf50', bgColor: '#e8f5e9', label: 'Résolue' };
      default:
        return { color: '#757575', bgColor: '#f5f5f5', label: status };
    }
  };
  
  const handleResolveClick = async () => {
    try {
      await AlertService.updateAlert(alertId, {
        status: 'RESOLVED',
        notes: notes
      });
      
      // Mettre à jour l'état local
      setAlert(prev => ({
        ...prev,
        status: 'RESOLVED'
      }));
      
    } catch (err) {
      setError(`Erreur lors de la résolution: ${err.response?.data?.message || 'Une erreur est survenue'}`);
    }
  };
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await AlertService.deleteAlert(alertId);
      navigate('/alerts');
    } catch (err) {
      setError(`Erreur lors de la suppression: ${err.response?.data?.message || 'Une erreur est survenue'}`);
      setDeleteDialogOpen(false);
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };
  
  const handleNotesOpen = () => {
    setNotesDialogOpen(true);
  };
  
  const handleNotesCancel = () => {
    setNotesDialogOpen(false);
  };
  
  const handleNotesSave = async () => {
    try {
      await AlertService.updateAlert(alertId, {
        notes: notes
      });
      
      // Mettre à jour l'état local
      setAlert(prev => ({
        ...prev,
        notes: notes
      }));
      
      setNotesDialogOpen(false);
    } catch (err) {
      setError(`Erreur lors de la mise à jour des notes: ${err.response?.data?.message || 'Une erreur est survenue'}`);
    }
  };
  
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${day} ${['', 'jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc'][date.getMonth()+1]} ${year} à ${hours}:${minutes}:${seconds}`;
  };
  
  const renderMap = () => {
    if (!alert?.location?.latitude || !alert?.location?.longitude) {
      return (
        <Box sx={{ 
          height: 250, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          bgcolor: '#f5f5f5', 
          borderRadius: 1,
          mb: 3 
        }}>
          <Typography variant="body2" color="text.secondary">
            Aucune donnée de localisation disponible
          </Typography>
        </Box>
      );
    }
    
    // URL pour l'iframe OpenStreetMap
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${alert.location.longitude - 0.01}%2C${alert.location.latitude - 0.01}%2C${alert.location.longitude + 0.01}%2C${alert.location.latitude + 0.01}&amp;layer=mapnik&amp;marker=${alert.location.latitude}%2C${alert.location.longitude}`;
    
    return (
      <Box sx={{ height: 250, borderRadius: 1, overflow: 'hidden', mb: 3 }}>
        <iframe 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight="0" 
          marginWidth="0" 
          src={mapUrl}
          title="Localisation de l'alerte"
          style={{ border: 0 }}
        />
      </Box>
    );
  };
  
  // Fonction pour parser et afficher les données JSON supplémentaires
  const renderAlertData = () => {
    if (!alert || !alert.data) return null;
    
    try {
      const parsedData = JSON.parse(alert.data);
      return (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Informations additionnelles
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(parsedData).map(([key, value]) => (
              <Grid item xs={12} sm={4} key={key}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 1,
                  borderRadius: 1
                }}>
                  <InfoIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {key}
                    </Typography>
                    <Typography variant="body2">
                      {value}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    } catch (e) {
      console.error("Erreur lors du parsing des données JSON:", e);
      return null;
    }
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate('/alerts')}
        >
          Retour à la liste des alertes
        </Button>
      </Container>
    );
  }
  
  if (!alert) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          L'alerte demandée n'existe pas ou a été supprimée.
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate('/alerts')}
        >
          Retour à la liste des alertes
        </Button>
      </Container>
    );
  }
  
  const typeInfo = getAlertTypeInfo(alert.type);
  const severityInfo = getSeverityInfo(alert.severity);
  const statusInfo = getStatusInfo(alert.status);
  
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Fil d'Ariane */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={() => navigate('/alerts')} 
          sx={{ cursor: 'pointer', fontSize: '0.9rem' }}
        >
          Alertes
        </Link>
        <Typography color="text.primary" sx={{ fontSize: '0.9rem' }}>
          Détails de l'alerte #{alertId}
        </Typography>
      </Breadcrumbs>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIosNewIcon />}
          variant="outlined"
          size="small"
          onClick={() => navigate('/alerts')}
          sx={{ textTransform: 'none' }}
        >
          Retour
        </Button>
        
        <Typography variant="h5" component="h1">
          Alerte #{alertId}
        </Typography>
        
        <Box>
          <Button 
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
            sx={{ textTransform: 'none' }}
          >
            Supprimer
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box 
                sx={{ 
                  bgcolor: typeInfo.bgColor, 
                  color: typeInfo.color, 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                {React.cloneElement(typeInfo.icon, { style: { fontSize: 30 } })}
              </Box>
              <Box>
                <Typography variant="h6" component="h2">
                  {typeInfo.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {alert.description}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Date et heure
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(alert.timestamp)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Sévérité
                  </Typography>
                  <Chip 
                    label={severityInfo.label}
                    sx={{ 
                      bgcolor: severityInfo.bgColor, 
                      color: severityInfo.color,
                      fontWeight: 500
                    }}
                    size="small"
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Statut
                  </Typography>
                  <Chip 
                    label={statusInfo.label}
                    sx={{ 
                      bgcolor: statusInfo.bgColor, 
                      color: statusInfo.color,
                      fontWeight: 500
                    }}
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>
            
            <Typography variant="h6" gutterBottom>
              Localisation
            </Typography>
            
            {alert.location ? (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {alert.location.latitude.toFixed(6)}, {alert.location.longitude.toFixed(6)}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Aucune donnée de localisation disponible
              </Typography>
            )}
            
            {renderMap()}
            
            {/* Notes */}
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Notes
                </Typography>
                <IconButton size="small" onClick={handleNotesOpen}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {alert.notes || 'Aucune note disponible'}
              </Typography>
            </Box>
            
            {/* Informations additionnelles */}
            {renderAlertData()}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Véhicule concerné
            </Typography>
            
            {alert.car ? (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      bgcolor: 'primary.light', 
                      color: 'white', 
                      width: 50, 
                      height: 50, 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mr: 2
                    }}
                  >
                    <DirectionsCarIcon />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1">
                      {alert.car.brand} {alert.car.model}
                    </Typography>
                    <Chip 
                      label={alert.car.licensePlate} 
                      size="small" 
                      sx={{ bgcolor: 'primary.light', color: 'white' }}
                    />
                  </Box>
                </Box>
                
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate(`/cars/${alert.car.id}`)}
                  sx={{ mt: 2, textTransform: 'none' }}
                >
                  Voir les détails du véhicule
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', py: 4 }}>
                <DirectionsCarIcon color="disabled" sx={{ fontSize: 60, opacity: 0.3, mb: 2 }} />
                <Typography variant="body2" color="text.secondary" align="center">
                  Aucun véhicule associé à cette alerte
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Dialog de confirmation pour la suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette alerte ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog pour éditer les notes */}
      <Dialog
        open={notesDialogOpen}
        onClose={handleNotesCancel}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Modifier les notes</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Notes"
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNotesCancel} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleNotesSave} color="primary" variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AlertDetailsV2;