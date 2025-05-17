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
  Switch,
  FormControlLabel,
  Typography,
  Box,
  Divider,
  IconButton,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import CarService from '../../api/carService';
import UserService from '../../api/userService';

const CarForm = ({ open, handleClose, car, userId, onSave }) => {
  const isEditMode = !!car;
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    color: '',
    userId: userId || '',
    status: 'ACTIVE',
    fuelType: 'Essence',
    mileage: 0,
    deviceId: '',
    vin: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const carColors = [
    'Blanc', 'Noir', 'Gris', 'Bleu', 'Rouge', 'Vert', 'Jaune', 'Orange', 
    'Marron', 'Beige', 'Violet', 'Rose', 'Doré', 'Argenté'
  ];
  
  const carBrands = [
    'Audi', 'BMW', 'Citroën', 'Dacia', 'Fiat', 'Ford', 'Honda', 'Hyundai',
    'Kia', 'Mercedes', 'Nissan', 'Opel', 'Peugeot', 'Renault', 'Seat',
    'Skoda', 'Toyota', 'Volkswagen', 'Volvo'
  ];
  
  const fuelTypes = [
    'Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL', 'GNV'
  ];
  
  useEffect(() => {
    if (car) {
      setFormData({
        brand: car.brand || '',
        model: car.model || '',
        year: car.year || new Date().getFullYear(),
        licensePlate: car.licensePlate || '',
        color: car.color || '',
        userId: car.userId || userId || '',
        status: car.status || 'ACTIVE',
        fuelType: car.fuelType || 'Essence',
        mileage: car.mileage || 0,
        deviceId: car.deviceId || '',
        vin: car.vin || ''
      });
      
      if (car.userId) {
        setSelectedUser({
          id: car.userId,
          fullName: `${car.owner?.firstName || ''} ${car.owner?.lastName || ''}`
        });
      }
    } else {
      // Réinitialiser le formulaire pour une nouvelle voiture
      setFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        color: '',
        userId: userId || '',
        status: 'ACTIVE',
        fuelType: 'Essence',
        mileage: 0,
        deviceId: '',
        vin: ''
      });
      
      setSelectedUser(null);
    }
    
    setErrors({});
    
    // Si aucun userId n'est fourni, charger la liste des utilisateurs
    if (!userId) {
      fetchUsers();
    }
  }, [car, userId, open]);
  
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await UserService.getAllUsers({ limit: 100 });
      
      // Transformer les données pour l'autocomplete
      const formattedUsers = response.data.map(user => ({
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email
      }));
      
      setUsers(formattedUsers);
      setLoadingUsers(false);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setLoadingUsers(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ si elle existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? '' : parseInt(value, 10);
    
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked ? 'ACTIVE' : 'INACTIVE'
    }));
  };
  
  const handleUserChange = (event, newValue) => {
    setSelectedUser(newValue);
    
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        userId: newValue.id
      }));
      
      if (errors.userId) {
        setErrors(prev => ({
          ...prev,
          userId: ''
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        userId: ''
      }));
    }
  };
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 31 }, (_, i) => currentYear - i);
  
  const validateForm = () => {
    const newErrors = {};
    
    // Valider la marque
    if (!formData.brand.trim()) {
      newErrors.brand = 'La marque est requise';
    }
    
    // Valider le modèle
    if (!formData.model.trim()) {
      newErrors.model = 'Le modèle est requis';
    }
    
    // Valider l'année
    if (!formData.year) {
      newErrors.year = 'L\'année est requise';
    } else if (formData.year < 1900 || formData.year > currentYear) {
      newErrors.year = `L'année doit être comprise entre 1900 et ${currentYear}`;
    }
    
    // Valider la plaque d'immatriculation
    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'La plaque d\'immatriculation est requise';
    }
    
    // Valider la couleur
    if (!formData.color.trim()) {
      newErrors.color = 'La couleur est requise';
    }
    
    // Valider l'utilisateur
    if (!formData.userId) {
      newErrors.userId = 'Le propriétaire est requis';
    }
    
    // Valider le kilométrage
    if (formData.mileage === '') {
      newErrors.mileage = 'Le kilométrage est requis';
    } else if (isNaN(formData.mileage) || formData.mileage < 0) {
      newErrors.mileage = 'Le kilométrage doit être un nombre positif';
    }
    
    // Valider l'ID de l'appareil
    if (formData.deviceId && !/^[A-Za-z0-9-]+$/.test(formData.deviceId)) {
      newErrors.deviceId = 'Format d\'ID de l\'appareil invalide';
    }
    
    // Valider le VIN
    if (formData.vin && !/^[A-HJ-NPR-Z0-9]{17}$/.test(formData.vin)) {
      newErrors.vin = 'Le VIN doit comporter exactement 17 caractères alphanumériques (sans I, O ou Q)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const carData = { ...formData };
      
      if (isEditMode) {
        await CarService.updateCar(car.id, carData);
      } else {
        await CarService.createCar(carData);
      }
      
      onSave();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      const serverErrors = error.response?.data?.errors;
      
      if (serverErrors) {
        setErrors(prev => ({
          ...prev,
          ...serverErrors,
          serverError: error.response?.data?.message || 'Une erreur est survenue'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          serverError: 'Une erreur est survenue lors de la communication avec le serveur'
        }));
      }
    } finally {
      setLoading(false);
    }
  };
  
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
          width: 16,
          height: 16,
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
  
  return (
    <Dialog 
      open={open} 
      onClose={loading ? null : handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {isEditMode ? 'Modifier le véhicule' : 'Ajouter un nouveau véhicule'}
        </Typography>
        <IconButton onClick={handleClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        {errors.serverError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errors.serverError}
          </Typography>
        )}
        
        <Grid container spacing={3}>
          {/* Informations de base */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Informations du véhicule
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={carBrands}
              freeSolo
              value={formData.brand}
              onChange={(event, newValue) => {
                setFormData(prev => ({
                  ...prev,
                  brand: newValue || ''
                }));
                if (errors.brand) {
                  setErrors(prev => ({
                    ...prev,
                    brand: ''
                  }));
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="brand"
                  label="Marque"
                  error={!!errors.brand}
                  helperText={errors.brand}
                  required
                  disabled={loading}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="model"
              label="Modèle"
              fullWidth
              value={formData.model}
              onChange={handleChange}
              error={!!errors.model}
              helperText={errors.model}
              required
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.year} disabled={loading}>
              <InputLabel>Année</InputLabel>
              <Select
                name="year"
                value={formData.year}
                onChange={handleChange}
                label="Année"
              >
                {years.map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
              {errors.year && <FormHelperText>{errors.year}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="licensePlate"
              label="Plaque d'immatriculation"
              fullWidth
              value={formData.licensePlate}
              onChange={handleChange}
              error={!!errors.licensePlate}
              helperText={errors.licensePlate}
              required
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.color} disabled={loading}>
              <InputLabel>Couleur</InputLabel>
              <Select
                name="color"
                value={formData.color}
                onChange={handleChange}
                label="Couleur"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getColorBox(selected)}
                    {selected}
                  </Box>
                )}
              >
                {carColors.map(color => (
                  <MenuItem key={color} value={color}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getColorBox(color)}
                      {color}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.color && <FormHelperText>{errors.color}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.fuelType} disabled={loading}>
              <InputLabel>Type de carburant</InputLabel>
              <Select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                label="Type de carburant"
              >
                {fuelTypes.map(fuel => (
                  <MenuItem key={fuel} value={fuel}>{fuel}</MenuItem>
                ))}
              </Select>
              {errors.fuelType && <FormHelperText>{errors.fuelType}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="mileage"
              label="Kilométrage"
              type="number"
              fullWidth
              value={formData.mileage}
              onChange={handleNumberChange}
              error={!!errors.mileage}
              helperText={errors.mileage}
              required
              disabled={loading}
              InputProps={{
                endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>km</Typography>,
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          
          {/* Information propriétaire */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Information propriétaire
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            {userId ? (
              <TextField
                label="Propriétaire"
                fullWidth
                value={selectedUser?.fullName || 'Utilisateur assigné'}
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />
            ) : (
              <Autocomplete
                options={users}
                loading={loadingUsers}
                value={selectedUser}
                onChange={handleUserChange}
                getOptionLabel={(option) => option.fullName || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Propriétaire"
                    required
                    error={!!errors.userId}
                    helperText={errors.userId}
                    disabled={loading}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingUsers ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body1">{option.fullName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.email}
                      </Typography>
                    </Box>
                  </li>
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            )}
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          
          {/* Informations techniques */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Informations techniques
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="vin"
              label="Numéro VIN"
              fullWidth
              value={formData.vin}
              onChange={handleChange}
              error={!!errors.vin}
              helperText={errors.vin || 'Numéro d\'identification du véhicule (17 caractères)'}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="deviceId"
              label="ID de l'appareil"
              fullWidth
              value={formData.deviceId}
              onChange={handleChange}
              error={!!errors.deviceId}
              helperText={errors.deviceId || 'Identifiant du boîtier AI-Drive'}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status === 'ACTIVE'}
                    onChange={handleSwitchChange}
                    name="status"
                    color="primary"
                    disabled={loading}
                  />
                }
                label="Véhicule actif"
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Sauvegarde en cours...' : isEditMode ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CarForm;