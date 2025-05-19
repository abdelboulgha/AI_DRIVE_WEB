import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
  Typography,
  Box,
  Divider
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const CarForm = ({ open, handleClose, car, userId, onSave, unsecuredEdit = false }) => {
  const isEditing = !!car;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [colors, setColors] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    licensePlate: '',
    color: '',
    year: new Date().getFullYear(),
    mileage: 0,
    fuelType: 'Essence',
    safetyScore: 80,
    status: 'ACTIF'
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Chargement des constantes (couleurs, types de carburant, etc.)
  useEffect(() => {
    const fetchConstants = async () => {
      try {
        const response = await axios.get(`${API_URL}/vehicles/constants`);
        setColors(response.data.vehicleColors || []);
        setFuelTypes(response.data.fuelTypes || []);
        setStatusOptions(response.data.statusOptions || []);
      } catch (err) {
        console.error('Erreur lors du chargement des constantes:', err);
        setColors([
          { name: 'Rouge', hexCode: '#f44336' },
          { name: 'Bleu', hexCode: '#2196f3' },
          { name: 'Vert', hexCode: '#4caf50' },
          { name: 'Jaune', hexCode: '#ffeb3b' },
          { name: 'Noir', hexCode: '#212121' },
          { name: 'Blanc', hexCode: '#f5f5f5' },
          { name: 'Gris', hexCode: '#9e9e9e' }
        ]);
        setFuelTypes([
          { id: 1, name: 'Essence', color: '#f44336' },
          { id: 2, name: 'Diesel', color: '#ff9800' },
          { id: 3, name: 'Hybride', color: '#4caf50' },
          { id: 4, name: 'Électrique', color: '#2196f3' }
        ]);
        setStatusOptions([
          { value: 'ACTIF', label: 'Actif', color: 'success' },
          { value: 'INACTIF', label: 'Inactif', color: 'default' }
        ]);
      }
    };
    
    fetchConstants();
  }, []);
  
  // Initialisation du formulaire avec les données du véhicule si en mode édition
  useEffect(() => {
    if (car) {
      setFormData({
        brand: car.brand || '',
        model: car.model || '',
        licensePlate: car.licensePlate || '',
        color: car.color || '',
        year: car.year || new Date().getFullYear(),
        mileage: car.mileage || 0,
        fuelType: car.fuelType || 'Essence',
        safetyScore: car.safetyScore || 80,
        status: car.status || 'ACTIF'
      });
    } else {
      // Réinitialiser le formulaire en mode création
      setFormData({
        brand: '',
        model: '',
        licensePlate: '',
        color: '',
        year: new Date().getFullYear(),
        mileage: 0,
        fuelType: 'Essence',
        safetyScore: 80,
        status: 'ACTIF'
      });
    }
    
    // Réinitialiser les erreurs
    setFormErrors({});
    setError(null);
  }, [car, open]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Effacer l'erreur si le champ est rempli
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.brand.trim()) {
      errors.brand = 'La marque est requise';
    }
    
    if (!formData.model.trim()) {
      errors.model = 'Le modèle est requis';
    }
    
    if (!formData.licensePlate.trim()) {
      errors.licensePlate = "La plaque d'immatriculation est requise";
    } else if (!/^[A-Z0-9-]{2,10}$/i.test(formData.licensePlate.trim())) {
      errors.licensePlate = "Format de plaque d'immatriculation invalide";
    }
    
    if (!formData.color) {
      errors.color = 'La couleur est requise';
    }
    
    if (!formData.year) {
      errors.year = "L'année est requise";
    } else if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      errors.year = 'Année invalide';
    }
    
    if (formData.mileage < 0) {
      errors.mileage = 'Le kilométrage ne peut pas être négatif';
    }
    
    if (!formData.fuelType) {
      errors.fuelType = 'Le type de carburant est requis';
    }
    
    if (formData.safetyScore < 0 || formData.safetyScore > 100) {
      errors.safetyScore = 'Le score de sécurité doit être entre 0 et 100';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async () => {
    // Valider le formulaire
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Préparer les données
      const carData = {
        ...formData,
        mileage: parseInt(formData.mileage, 10),
        year: parseInt(formData.year, 10),
        safetyScore: parseInt(formData.safetyScore, 10)
      };
      
      console.log('Données envoyées au serveur:', carData);
      
      // Si un utilisateur spécifique est fourni, ajouter son ID
      if (userId) {
        carData.userId = userId;
      }
      
      // Effectuer l'appel API
      if (isEditing) {
        // Log pour debug
        console.log(`Mise à jour du véhicule ${car.id} - Mode ${unsecuredEdit ? 'sans sécurité' : 'sécurisé'}`);
        
        if (unsecuredEdit) {
          // Appel sans sécurité
          await axios.put(`${API_URL}/vehicles/update-unsecured/${car.id}`, carData);
        } else {
          // Appel normal
          await axios.put(`${API_URL}/vehicles/${car.id}`, carData);
        }
      } else {
        // Création d'un nouveau véhicule
        console.log('Création d\'un nouveau véhicule');
        
        // Utiliser l'endpoint sans sécurité pour la création
        await axios.post(`${API_URL}/vehicles/vehicles/create`, carData);
        //http://localhost:8080/api/vehicles/vehicles/create
      }
      
      // Callback de succès
      if (onSave) {
        onSave(carData);
      } else {
        handleClose();
      }
    } catch (err) {
      console.error('Erreur lors de la création/modification du véhicule:', err);
      
      // Afficher un message d'erreur détaillé
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Erreur: ${err.response.data.message}`);
      } else {
        setError(`Erreur lors de ${isEditing ? 'la modification' : 'la création'} du véhicule: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {isEditing 
          ? `Modifier le véhicule ${car?.brand} ${car?.model}`
          : 'Ajouter un nouveau véhicule'
        }
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Marque"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              error={!!formErrors.brand}
              helperText={formErrors.brand}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Modèle"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              error={!!formErrors.model}
              helperText={formErrors.model}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Plaque d'immatriculation"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleInputChange}
              error={!!formErrors.licensePlate}
              helperText={formErrors.licensePlate}
              margin="normal"
              disabled={isEditing} // Désactiver si en mode édition
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl 
              fullWidth 
              margin="normal"
              error={!!formErrors.color}
            >
              <InputLabel>Couleur *</InputLabel>
              <Select
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                label="Couleur *"
              >
                {colors.map((color) => (
                  <MenuItem key={color.name} value={color.name}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 20, 
                          height: 20, 
                          borderRadius: '50%', 
                          bgcolor: color.hexCode,
                          border: '1px solid #ddd',
                          mr: 1
                        }} 
                      />
                      {color.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {formErrors.color && (
                <FormHelperText>{formErrors.color}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }}>Détails techniques</Divider>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Année"
              name="year"
              type="number"
              InputProps={{ inputProps: { min: 1900, max: new Date().getFullYear() + 1 } }}
              value={formData.year}
              onChange={handleInputChange}
              error={!!formErrors.year}
              helperText={formErrors.year}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Kilométrage"
              name="mileage"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              value={formData.mileage}
              onChange={handleInputChange}
              error={!!formErrors.mileage}
              helperText={formErrors.mileage}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl 
              fullWidth 
              margin="normal"
              error={!!formErrors.fuelType}
            >
              <InputLabel>Type de carburant</InputLabel>
              <Select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                label="Type de carburant"
              >
                {fuelTypes.map((fuel) => (
                  <MenuItem key={fuel.id} value={fuel.name}>
                    {fuel.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.fuelType && (
                <FormHelperText>{formErrors.fuelType}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Score de sécurité (%)"
              name="safetyScore"
              type="number"
              InputProps={{ inputProps: { min: 0, max: 100 } }}
              value={formData.safetyScore}
              onChange={handleInputChange}
              error={!!formErrors.safetyScore}
              helperText={formErrors.safetyScore}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl 
              fullWidth 
              margin="normal"
              error={!!formErrors.status}
            >
              <InputLabel>Statut</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                label="Statut"
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={handleClose} 
          color="inherit"
          disabled={loading}
        >
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {isEditing ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CarForm;