import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Alert,
  InputAdornment,
  Link
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Email, ArrowBack } from '@mui/icons-material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import authService from '../api/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrorMessage('Veuillez saisir votre adresse email');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Format d\'email invalide');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 
        'Une erreur est survenue. Veuillez réessayer plus tard.'
      );
    } finally {
      setIsLoading(false);
    }
  };

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
              Mot de passe oublié
            </Typography>
            {!isSubmitted && (
              <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe
              </Typography>
            )}
          </Box>
          
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}
          
          {isSubmitted ? (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Si votre adresse email est associée à un compte, vous recevrez bientôt un email contenant un lien pour réinitialiser votre mot de passe.
              </Alert>
              
              <Typography variant="body2" sx={{ mb: 3 }}>
                Si vous ne recevez pas d'email dans les prochaines minutes, veuillez vérifier votre dossier de spam ou essayer avec une autre adresse email.
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/login')}
                sx={{ mt: 2 }}
                fullWidth
              >
                Retour à la connexion
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                type="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
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
                disabled={isLoading}
              >
                {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
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

export default ForgotPassword;