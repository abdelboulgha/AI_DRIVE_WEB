import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './pages/Dashboard';
import AccelerometerData from './pages/AccelerometerData';
import GPSData from './pages/GPSData';
import GyroscopeData from './pages/GyroscopeData';
import DevicesList from './pages/DevicesList';
import Login from './pages/Login';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';

// Création du thème
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="accelerometer" element={<PrivateRoute><AccelerometerData /></PrivateRoute>} />
            <Route path="gps" element={<PrivateRoute><GPSData /></PrivateRoute>} />
            <Route path="gyroscope" element={<PrivateRoute><GyroscopeData /></PrivateRoute>} />
            <Route path="devices" element={<PrivateRoute><DevicesList /></PrivateRoute>} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;