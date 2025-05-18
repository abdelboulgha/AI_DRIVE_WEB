import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { frFR } from '@mui/material/locale';
import Dashboard from './pages/Dashboard';
import AccelerometerData from './pages/AccelerometerData';
import GPSData from './pages/GPSData';
import GyroscopeData from './pages/GyroscopeData';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UsersList from './pages/UsersList';
import UserProfile from './pages/UserProfile';
import CarsList from './pages/CarsList';
import CarDetails from './pages/CarDetails';
import CarData from './pages/CarData';
import AlertsList from './pages/AlertsList';
import AlertDetails from './pages/AlertDetails';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';

// Création du thème
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#f5f5f5',
        },
      },
    },
  },
}, frFR); // Utilisation des locales françaises

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
  {/* Routes publiques */}
  <Route path="/login" element={<Login />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password/:token" element={<ResetPassword />} />
  
  {/* Routes protégées */}
  <Route path="/" element={<Layout />}>
    <Route index element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    
    {/* Routes de données capteurs */}
    <Route path="accelerometer" element={<PrivateRoute><AccelerometerData /></PrivateRoute>} />
    <Route path="gps" element={<PrivateRoute><GPSData /></PrivateRoute>} />
    <Route path="gyroscope" element={<PrivateRoute><GyroscopeData /></PrivateRoute>} />
    
    {/* Routes de gestion des utilisateurs */}
    <Route path="users" element={<AdminRoute><UsersList /></AdminRoute>} />
    <Route path="users/:userId" element={<AdminRoute><UserProfile /></AdminRoute>} />
    <Route path="users/:userId/cars" element={<AdminRoute><CarsList /></AdminRoute>} />
    <Route path="profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
    
    {/* Routes de gestion des véhicules */}
    <Route path="cars" element={<PrivateRoute><CarsList /></PrivateRoute>} />
    <Route path="cars/:carId" element={<PrivateRoute><CarDetails /></PrivateRoute>} />
    <Route path="cars/:carId/data" element={<PrivateRoute><CarData /></PrivateRoute>} />
    
    {/* Routes de gestion des alertes */}
    <Route path="alerts" element={<PrivateRoute><AlertsList /></PrivateRoute>} />
    <Route path="alerts/:alertId" element={<PrivateRoute><AlertDetails /></PrivateRoute>} />
  </Route>
  
  {/* Redirection par défaut */}
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;