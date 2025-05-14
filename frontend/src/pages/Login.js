import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple mock login for demonstration
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('authToken', 'demo-token');
      navigate('/');
    } else {
      alert('Identifiants invalides. Utilisez admin/password');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', height: '100vh', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom>
          AI-Drive - Tableau de bord
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Nom d'utilisateur"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
          />
          
          <TextField
            label="Mot de passe"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 3, mb: 2 }}
          >
            Se connecter
          </Button>
          
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Pour la démonstration, utilisez: admin / password
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;