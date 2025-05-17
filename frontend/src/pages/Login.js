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
            borderRadius: 16,  // Modifié à 16px comme vous le souhaitez
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
                  
                </Divider>
                
              </Box>
            </Grid>
            
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;