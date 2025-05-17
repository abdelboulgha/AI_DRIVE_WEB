import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Link
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Visibility, VisibilityOff, Email, Lock, Google, Facebook } from '@mui/icons-material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import authService from '../api/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userRole', response.role);
      localStorage.setItem('userId', response.userId);
      navigate('/');
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 
        'Échec de connexion. Vérifiez vos identifiants.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@ai-drive.com');
      setPassword('admin123');
    } else {
      setEmail('user@ai-drive.com');
      setPassword('user123');
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
    }}>
      <Container maxWidth="md" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={8} sx={{ 
          p: 4, 
          width: '100%', 
          borderRadius: 2,
          display: 'flex',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
        }}>
          <Grid container>
            {/* Left side - Form */}
            <Grid item xs={12} md={6} sx={{ p: { xs: 2, md: 4 } }}>
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DirectionsCarIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                  AI-Drive
                </Typography>
              </Box>
              
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 500, textAlign: 'center' }}>
                Connexion
              </Typography>
              
              {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMessage}
                </Alert>
              )}
              
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
                
                <TextField
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
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
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 2 }}>
                  <Link 
                    component={RouterLink} 
                    to="/forgot-password" 
                    underline="hover"
                    sx={{ fontSize: 14 }}
                  >
                    Mot de passe oublié ?
                  </Link>
                </Box>
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  sx={{ 
                    mt: 1, 
                    py: 1.5,
                    mb: 2,
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
                
                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    OU
                  </Typography>
                </Divider>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth 
                      variant="outlined"
                      startIcon={<Google />}
                      onClick={() => alert('Connexion Google non configurée')}
                      sx={{ py: 1 }}
                    >
                      Google
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth 
                      variant="outlined"
                      startIcon={<Facebook />}
                      onClick={() => alert('Connexion Facebook non configurée')}
                      sx={{ py: 1 }}
                    >
                      Facebook
                    </Button>
                  </Grid>
                </Grid>
                
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2">
                    Vous n'avez pas de compte ?{' '}
                    <Link component={RouterLink} to="/register" underline="hover" fontWeight="bold">
                      S'inscrire
                    </Link>
                  </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mb: 1 }}>
                    Pour la démonstration, utilisez:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button 
                        size="small" 
                        variant="text" 
                        fullWidth
                        onClick={() => handleDemoLogin('admin')}
                      >
                        admin@ai-drive.com / admin123
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button 
                        size="small" 
                        variant="text" 
                        fullWidth
                        onClick={() => handleDemoLogin('user')}
                      >
                        user@ai-drive.com / user123
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
            
            {/* Right side - Image and Info */}
            <Grid item md={6} sx={{ 
              background: 'linear-gradient(135deg, #2196f3 0%, #1565c0 100%)',
              color: 'white',
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              p: 4,
              position: 'relative'
            }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                Bienvenue dans AI-Drive
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                La plateforme d'analyse intelligente de conduite pour améliorer la sécurité routière.
              </Typography>
              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Caractéristiques principales:
                </Typography>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>Analyse des comportements de conduite</li>
                  <li>Détection des freinages brusques</li>
                  <li>Surveillance des accélérations excessives</li>
                  <li>Visualisation des trajets GPS</li>
                  <li>Statistiques de conduite personnalisées</li>
                </ul>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;