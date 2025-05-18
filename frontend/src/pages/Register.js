import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  IconButton,
  InputAdornment,
  Alert,
  Link,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Visibility, 
  VisibilityOff, 
  Person, 
  Email, 
  Lock, 
  Phone,
  DirectionsCar,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import authService from '../api/authService';

const Register = () => {
  const navigate = useNavigate();
  
  // État pour le stepper
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Informations personnelles', 'Informations du compte', 'Préférences'];
  
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    acceptTerms: false,
    receiveEmails: true,
    accountType: 'particulier'
  });
  
  // États pour la gestion de l'interface
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Réinitialiser l'erreur de validation pour ce champ
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };
  
  const validateStep = () => {
    const errors = {};
    
    if (activeStep === 0) {
      if (!formData.firstName.trim()) errors.firstName = 'Le prénom est requis';
      if (!formData.lastName.trim()) errors.lastName = 'Le nom est requis';
      if (!formData.phone.trim()) errors.phone = 'Le téléphone est requis';
      if (formData.phone.trim() && !/^[0-9+\s]{9,15}$/.test(formData.phone)) {
        errors.phone = 'Numéro de téléphone invalide';
      }
    } else if (activeStep === 1) {
      if (!formData.email.trim()) {
        errors.email = 'L\'email est requis';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Format d\'email invalide';
      }
      
      if (!formData.password) {
        errors.password = 'Le mot de passe est requis';
      } else if (formData.password.length < 6) {
        errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Veuillez confirmer votre mot de passe';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    } else if (activeStep === 2) {
      if (!formData.acceptTerms) {
        errors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      await authService.register(formData);
      // Enregistrement réussi, rediriger vers la page de connexion
      navigate('/login', { 
        state: { 
          registrationSuccess: true, 
          email: formData.email 
        } 
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 
        'Échec de l\'inscription. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Prénom"
                  name="firstName"
                  variant="outlined"
                  fullWidth
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!validationErrors.firstName}
                  helperText={validationErrors.firstName || ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nom"
                  name="lastName"
                  variant="outlined"
                  fullWidth
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!validationErrors.lastName}
                  helperText={validationErrors.lastName || ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Téléphone"
                  name="phone"
                  variant="outlined"
                  fullWidth
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!validationErrors.phone}
                  helperText={validationErrors.phone || ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Numéro de permis (optionnel)"
                  name="licenseNumber"
                  variant="outlined"
                  fullWidth
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DirectionsCar fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </>
        );
      case 1:
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                  error={!!validationErrors.email}
                  helperText={validationErrors.email || ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Mot de passe"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  value={formData.password}
                  onChange={handleChange}
                  error={!!validationErrors.password}
                  helperText={validationErrors.password || ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirmer le mot de passe"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!validationErrors.confirmPassword}
                  helperText={validationErrors.confirmPassword || ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </>
        );
      case 2:
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <FormLabel component="legend">Type de compte</FormLabel>
                  <RadioGroup
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    row
                  >
                    <FormControlLabel 
                      value="particulier" 
                      control={<Radio />} 
                      label="Particulier" 
                    />
                    <FormControlLabel 
                      value="entreprise" 
                      control={<Radio />} 
                      label="Entreprise" 
                    />
                    <FormControlLabel 
                      value="gestionnaire" 
                      control={<Radio />} 
                      label="Gestionnaire de flotte" 
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="receiveEmails"
                      checked={formData.receiveEmails}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Je souhaite recevoir des notifications et alertes par email"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      J'accepte les <Link href="#" underline="hover">conditions d'utilisation</Link> et la <Link href="#" underline="hover">politique de confidentialité</Link>
                    </Typography>
                  }
                />
                {validationErrors.acceptTerms && (
                  <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                    {validationErrors.acceptTerms}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
    }}>
      <Container maxWidth="md" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <Paper elevation={8} sx={{ 
          p: 4, 
          width: '100%', 
          borderRadius: 2,
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
        }}>
          <Box sx={{ 
            mb: 3, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}>
            <DirectionsCar sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight="bold" align="center">
              Créer un compte AI-Drive
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              Rejoignez notre plateforme de surveillance intelligente de conduite
            </Typography>
          </Box>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box component="form" onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={activeStep === 0 ? () => navigate('/login') : handleBack}
                startIcon={<ArrowBack />}
                sx={{ px: 3 }}
              >
                {activeStep === 0 ? 'Retour' : 'Précédent'}
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  sx={{ px: 3 }}
                >
                  {isLoading ? 'Inscription...' : 'S\'inscrire'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                  sx={{ px: 3 }}
                >
                  Suivant
                </Button>
              )}
            </Box>
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2">
              Vous avez déjà un compte ?{' '}
              <Link component={RouterLink} to="/login" underline="hover" fontWeight="bold">
                Se connecter
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;