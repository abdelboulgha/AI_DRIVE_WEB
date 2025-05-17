import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Alert,
  InputAdornment,
  IconButton,
  Link,
  CircularProgress
} from '@mui/material';
import { useNavigate, Link as RouterLink, useParams } from 'react-router-dom';
import { Visibility, VisibilityOff, Lock, ArrowBack } from '@mui/icons-material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import authService from '../api/authService';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Valider le token au chargement de la page
  useEffect(() => {
    const validateToken = async () => {
      try {
        // Dans une application réelle, vous appelleriez une API pour valider le token
        // Pour cette démo, nous simulons une validation de token
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsValidToken(true);
      } catch (err) {
        setIsValidToken(false);
        setError('Le lien de réinitialisation du mot de passe est invalide ou a expiré. Veuillez demander un nouveau lien.');
      } finally {
        setIsLoading(false);
      }
    };
    
    validateToken();
  }, [token]);
  
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation basique
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      await authService.resetPassword(token, password);
      setResetSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Une erreur est survenue. Veuillez réessayer plus tard.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Afficher un loader pendant la validation du token
  if (isLoading) {
    return (
      <Box sx={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
      }}>
        <DirectionsCarIcon sx={{ fontSize: 60, color: 'white', mb: 3 }} />
        <CircularProgress color="inherit" sx={{ color: 'white' }} />
        <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
          Validation du lien de réinitialisation...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
    }}>
      <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={8} sx={{ 
          p: 4, 
          width: '100%', 
          borderRadius: 2,
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
        }}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <DirectionsCarIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" fontWeight="bold" textAlign="center">
              Réinitialisation du mot de passe
            </Typography>
          </Box>
          
          {!isValidToken ? (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              
              <Button 
                variant="contained" 
                color="primary" 
                component={RouterLink}
                to="/forgot-password"
                sx={{ mt: 2 }}
                fullWidth
              >
                Demander un nouveau lien
              </Button>
            </Box>
          ) : resetSuccess ? (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Votre mot de passe a été réinitialisé avec succès.
              </Alert>
              
              <Typography variant="body1" sx={{ mb: 3 }}>
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/login')}
                sx={{ mt: 2 }}
                fullWidth
              >
                Se connecter
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                Veuillez choisir un nouveau mot de passe pour votre compte
              </Typography>
              
              <TextField
                label="Nouveau mot de passe"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
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
              
              <TextField
                label="Confirmer le mot de passe"
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
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
              
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  py: 1.5
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Réinitialisation en cours...
                  </Box>
                ) : 'Réinitialiser le mot de passe'}
              </Button>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  startIcon={<ArrowBack />}
                  sx={{ textTransform: 'none' }}
                >
                  Retour à la connexion
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;