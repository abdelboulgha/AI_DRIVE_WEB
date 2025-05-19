import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid,
  Button,
  Card,
  CardContent,
  Breadcrumbs,
  CircularProgress,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Tab,
  Tabs,
  Chip
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  DirectionsCar as DirectionsCarIcon,
  DateRange as DateRangeIcon,
  Refresh as RefreshIcon,
  GpsFixed as GpsFixedIcon,
  Speed as SpeedIcon,
  ThreeSixty as ThreeSixtyIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:8080/api';

// IMPORTANT: Ajoutez ces lignes dans le <head> de votre index.html:
// <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
// <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

// Composant pour la carte GPS - approche simplifiée et robuste
const GPSMapComponent = ({ gpsData }) => {
  const mapContainerRef = useRef(null);
  const [mapError, setMapError] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  
  // Initialiser la carte une seule fois après le rendu initial
  useEffect(() => {
    // S'assurer que Leaflet est disponible
    if (!window.L) {
      setMapError("Bibliothèque Leaflet non trouvée. Vérifiez que les scripts sont bien chargés.");
      return;
    }
    
    // S'assurer que le conteneur DOM existe
    if (!mapContainerRef.current) {
      return;
    }
    
    // Initialiser la carte
    const map = window.L.map(mapContainerRef.current, {
      // Désactiver le zoom au démarrage pour éviter les problèmes
      zoomControl: true,
      attributionControl: true
    }).setView([31.6162, -8.0659], 13);
    
    // Ajouter les tuiles OpenStreetMap
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Créer un groupe pour les marqueurs et un autre pour le trajet
    const markersGroup = window.L.layerGroup().addTo(map);
    const routeGroup = window.L.layerGroup().addTo(map);
    
    // Fonction pour mettre à jour la carte avec les données GPS
    const updateMap = (data) => {
      // Nettoyer les groupes
      markersGroup.clearLayers();
      routeGroup.clearLayers();
      
      if (!data || data.length === 0) {
        return;
      }
      
      // Filtrer les coordonnées valides
      const validPoints = data.filter(point => 
        point && 
        typeof point.latitude === 'number' && !isNaN(point.latitude) &&
        typeof point.longitude === 'number' && !isNaN(point.longitude)
      );
      
      if (validPoints.length === 0) {
        return;
      }
      
      // Créer un tableau de coordonnées pour la polyline
      const coordinates = validPoints.map(point => [point.latitude, point.longitude]);
      
      // Ajouter la polyline (le trajet)
      const polyline = window.L.polyline(coordinates, {
        color: 'blue',
        weight: 3,
        opacity: 0.7
      }).addTo(routeGroup);
      
      // Ajouter un marqueur pour le point de départ
      const startIcon = window.L.divIcon({
        className: 'custom-marker-start',
        html: '<div style="background-color: green; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white;"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      
      window.L.marker(coordinates[0], { icon: startIcon })
        .addTo(markersGroup)
        .bindPopup(`Départ: ${new Date(validPoints[0].timestamp).toLocaleString()}`);
      
      // Ajouter un marqueur pour le point d'arrivée (dernier point)
      const endIcon = window.L.divIcon({
        className: 'custom-marker-end',
        html: '<div style="background-color: red; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white;"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      
      window.L.marker(coordinates[coordinates.length - 1], { icon: endIcon })
        .addTo(markersGroup)
        .bindPopup(`Arrivée: ${new Date(validPoints[validPoints.length - 1].timestamp).toLocaleString()}`);
      
      // Ajouter le marqueur principal (bleu) sur le point médian ou un point important
      const mainPoint = Math.floor(coordinates.length / 2);
      const mainIcon = window.L.divIcon({
        className: 'custom-marker-main',
        html: '<div style="background-color: #1976D2; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });
      
      window.L.marker(coordinates[mainPoint], { icon: mainIcon })
        .addTo(markersGroup)
        .bindPopup(`
          <strong>Position GPS</strong><br>
          Latitude: ${validPoints[mainPoint].latitude.toFixed(6)}<br>
          Longitude: ${validPoints[mainPoint].longitude.toFixed(6)}<br>
          Altitude: ${validPoints[mainPoint].altitude.toFixed(1)} m<br>
          Vitesse: ${validPoints[mainPoint].speed.toFixed(1)} km/h<br>
          Heure: ${new Date(validPoints[mainPoint].timestamp).toLocaleString()}
        `);
      
      // Ajuster la vue pour voir tout le trajet
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    };
    
    // Attacher la fonction updateMap et map à notre composant via une ref
    const mapContext = {
      map,
      updateMap
    };
    
    // Stocker dans une ref pour pouvoir y accéder plus tard
    mapContainerRef.current.mapContext = mapContext;
    
    // Indiquer que la carte est prête
    setMapReady(true);
    
    // Nettoyage lors du démontage
    return () => {
      map.remove();
    };
  }, []);
  
  // Mettre à jour la carte quand les données GPS changent
  useEffect(() => {
    if (mapReady && mapContainerRef.current && mapContainerRef.current.mapContext) {
      const { updateMap } = mapContainerRef.current.mapContext;
      
      // Démonstration avec des données hardcodées si gpsData est vide
      if (!gpsData || gpsData.length === 0) {
        // Données d'exemple (trajet à Marrakech)
        const demoData = [
          {"latitude":31.6162417,"longitude":-8.0659496,"altitude":501.6,"speed":0.0,"timestamp":"2025-05-18T20:28:38"},
          {"latitude":31.616406,"longitude":-8.066031,"altitude":474.3,"speed":0.35,"timestamp":"2025-05-18T20:28:44"},
          {"latitude":31.616339,"longitude":-8.066055,"altitude":431.2,"speed":0.77,"timestamp":"2025-05-18T20:28:45"},
          {"latitude":31.616331,"longitude":-8.066025,"altitude":461.2,"speed":1.10,"timestamp":"2025-05-18T20:28:46"},
          {"latitude":31.616320,"longitude":-8.066006,"altitude":471.5,"speed":1.41,"timestamp":"2025-05-18T20:28:47"},
          {"latitude":31.616391,"longitude":-8.066043,"altitude":476.2,"speed":2.00,"timestamp":"2025-05-18T20:28:48"},
          {"latitude":31.616380,"longitude":-8.066026,"altitude":478.9,"speed":0.98,"timestamp":"2025-05-18T20:28:49"},
          {"latitude":31.616376,"longitude":-8.066006,"altitude":480.3,"speed":1.52,"timestamp":"2025-05-18T20:28:50"},
          {"latitude":31.616360,"longitude":-8.065995,"altitude":485.0,"speed":0.87,"timestamp":"2025-05-18T20:28:51"},
          {"latitude":31.616346,"longitude":-8.065970,"altitude":489.3,"speed":0.85,"timestamp":"2025-05-18T20:28:52"},
          {"latitude":31.616336,"longitude":-8.065955,"altitude":493.4,"speed":0.50,"timestamp":"2025-05-18T20:28:53"},
          {"latitude":31.616325,"longitude":-8.065946,"altitude":496.6,"speed":0.57,"timestamp":"2025-05-18T20:28:54"},
          {"latitude":31.616318,"longitude":-8.065936,"altitude":500.2,"speed":0.0,"timestamp":"2025-05-18T20:28:55"},
          {"latitude":31.616316,"longitude":-8.065923,"altitude":503.1,"speed":0.0,"timestamp":"2025-05-18T20:28:56"},
          {"latitude":31.616315,"longitude":-8.065911,"altitude":505.8,"speed":0.0,"timestamp":"2025-05-18T20:28:57"},
          {"latitude":31.616313,"longitude":-8.065900,"altitude":508.0,"speed":0.0,"timestamp":"2025-05-18T20:29:00"},
          {"latitude":31.616303,"longitude":-8.065878,"altitude":509.7,"speed":0.0,"timestamp":"2025-05-18T20:29:01"},
          {"latitude":31.616349,"longitude":-8.065852,"altitude":501.7,"speed":0.0,"timestamp":"2025-05-18T20:29:01"},
          {"latitude":31.616298,"longitude":-8.065865,"altitude":511.7,"speed":0.0,"timestamp":"2025-05-18T20:29:04"},
          {"latitude":31.616288,"longitude":-8.065845,"altitude":514.5,"speed":0.0,"timestamp":"2025-05-18T20:29:06"},
          {"latitude":31.616278,"longitude":-8.065833,"altitude":516.3,"speed":0.0,"timestamp":"2025-05-18T20:29:07"},
          {"latitude":31.616273,"longitude":-8.065823,"altitude":518.6,"speed":0.0,"timestamp":"2025-05-18T20:29:09"},
          {"latitude":31.616266,"longitude":-8.065811,"altitude":520.6,"speed":0.0,"timestamp":"2025-05-18T20:29:12"}
        ];
        updateMap(demoData);
      } else {
        updateMap(gpsData);
      }
    }
  }, [gpsData, mapReady]);
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '500px' }}>
      {mapError && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, bottom: 0, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.8)',
          zIndex: 1000 
        }}>
          <Alert severity="error">{mapError}</Alert>
        </Box>
      )}
      
      {!mapReady && !mapError && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, bottom: 0, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.8)',
          zIndex: 1000 
        }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Chargement de la carte...</Typography>
        </Box>
      )}
      
      <div 
        ref={mapContainerRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
    </div>
  );
};

// Générer des données simulées pour les capteurs
const generateSensorData = (count, type) => {
  let data = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(now.getTime() - (count - i) * 15 * 60000);
    
    if (type === 'accelerometer') {
      data.push({
        timestamp: date.toISOString(),
        x: Math.sin(i / 5) * 3 + Math.random() * 2 - 1,
        y: Math.cos(i / 5) * 2 + Math.random() * 2 - 1,
        z: Math.sin(i / 3) * 1.5 + Math.random() * 2 - 1
      });
    } else if (type === 'gyroscope') {
      data.push({
        timestamp: date.toISOString(),
        rotationX: Math.sin(i / 10) * 4 + Math.random() * 2 - 1,
        rotationY: Math.cos(i / 8) * 5 + Math.random() * 2 - 1,
        rotationZ: Math.sin(i / 6) * 3 + Math.random() * 2 - 1
      });
    } else if (type === 'gps') {
      // Coordonnées centrées autour de Marrakech avec un itinéraire plus réaliste
      let latitude = 31.63;
      let longitude = -8.01;
      
      if (i > 0) {
        // Créer un chemin qui ressemble à un trajet réel
        const angle = (i / count) * Math.PI * 4; // 2 tours complets
        const radius = 0.05 * (1 - i/count); // Rayon qui diminue
        
        latitude += Math.sin(angle) * radius;
        longitude += Math.cos(angle) * radius;
      }
      
      data.push({
        timestamp: date.toISOString(),
        latitude: latitude,
        longitude: longitude,
        altitude: 450 + Math.sin(i / 10) * 20,
        speed: 30 + Math.sin(i / 8) * 20
      });
    }
  }
  
  return data;
};

// Configuration des périodes pour le filtre
const timeRanges = [
  { value: 'today', label: 'Aujourd\'hui' },
  { value: 'yesterday', label: 'Hier' },
  { value: 'week', label: 'Cette semaine' },
  { value: 'month', label: 'Ce mois' },
  { value: 'custom', label: 'Personnalisé' }
];

const CarData = () => {
  const navigate = useNavigate();
  const { carId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [car, setCar] = useState(null);
  const [dataType, setDataType] = useState('accelerometer');
  const [timeRange, setTimeRange] = useState('today');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date(new Date().setHours(0,0,0,0)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [sensorData, setSensorData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const fetchCar = async () => {
    try {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/vehicles/${carId}`);
        setCar(response.data);
      } catch (err) {
        // Fallback en cas d'erreur
        setCar({
          id: carId,
          brand: "Véhicule",
          model: "Test",
          licensePlate: "TEST-123"
        });
      }
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des détails du véhicule');
      setLoading(false);
    }
  };
  
  const fetchSensorData = async () => {
    setIsLoadingData(true);
    
    try {
      let data = [];
      let url = '';
      
      switch (dataType) {
        case 'accelerometer':
          url = `${API_URL}/sensor/accelerometer/vehicle/${carId}`;
          break;
        case 'gyroscope':
          url = `${API_URL}/sensor/gyroscope/vehicle/${carId}`;
          break;
        case 'gps':
          url = `${API_URL}/sensor/gps/vehicle/${carId}`;
          break;
        default:
          url = `${API_URL}/sensor/accelerometer/vehicle/${carId}`;
      }
      
      let params = {};
      if (timeRange === 'custom') {
        params.startDate = customDateRange.startDate;
        params.endDate = customDateRange.endDate;
      } else if (timeRange === 'today') {
        const today = new Date();
        params.startDate = today.toISOString().split('T')[0];
      } else if (timeRange === 'yesterday') {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        params.startDate = yesterday.toISOString().split('T')[0];
        params.endDate = new Date().toISOString().split('T')[0];
      } else if (timeRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        params.startDate = weekAgo.toISOString().split('T')[0];
      } else if (timeRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        params.startDate = monthAgo.toISOString().split('T')[0];
      }
      
      try {
        const response = await axios.get(url, { params });
        
        if (response.data && response.data.length > 0) {
          data = response.data;
        } else {
          data = generateSensorData(100, dataType);
        }
      } catch (err) {
        // En cas d'erreur, utiliser des données générées
        data = generateSensorData(100, dataType);
      }
      
      setSensorData(data);
    } catch (err) {
      const mockData = generateSensorData(100, dataType);
      setSensorData(mockData);
      setError(`Erreur lors du chargement des données: ${err.message}`);
      setSnackbarOpen(true);
    } finally {
      setIsLoadingData(false);
    }
  };
  
  useEffect(() => {
    fetchCar();
  }, [carId]);
  
  useEffect(() => {
    if (car) {
      fetchSensorData();
    }
  }, [car, dataType, timeRange, customDateRange]);
  
  const handleDataTypeChange = (event, newValue) => {
    setDataType(newValue);
  };
  
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };
  
  const handleCustomDateChange = (field) => (event) => {
    setCustomDateRange({
      ...customDateRange,
      [field]: event.target.value
    });
  };
  
  const handleRefresh = () => {
    fetchSensorData();
    setSuccessMessage('Données rafraîchies avec succès');
    setSnackbarOpen(true);
  };
  
  const handleDownload = () => {
    try {
      const dataStr = JSON.stringify(sensorData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${car.brand}_${car.model}_${dataType}_data.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccessMessage('Données téléchargées avec succès');
      setSnackbarOpen(true);
    } catch (err) {
      setError('Erreur lors du téléchargement des données');
      setSnackbarOpen(true);
    }
  };
  
  // Fonction pour formater les données pour les graphiques
  const formatChartData = (data) => {
    return data.map(item => {
      const date = new Date(item.timestamp);
      return {
        ...item,
        formattedTime: `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`,
        formattedDate: date.toLocaleDateString()
      };
    });
  };
  
  // Rendu des graphiques
  const renderChart = () => {
    const formattedData = formatChartData(sensorData);
    
    if (isLoadingData) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    switch (dataType) {
      case 'accelerometer':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={formattedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedTime" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="x" stroke="#f44336" name="Axe X" dot={false} />
              <Line type="monotone" dataKey="y" stroke="#4caf50" name="Axe Y" dot={false} />
              <Line type="monotone" dataKey="z" stroke="#2196f3" name="Axe Z" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'gyroscope':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={formattedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedTime" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rotationX" stroke="#f44336" name="Rotation X" dot={false} />
              <Line type="monotone" dataKey="rotationY" stroke="#4caf50" name="Rotation Y" dot={false} />
              <Line type="monotone" dataKey="rotationZ" stroke="#2196f3" name="Rotation Z" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'gps':
        // Pour le GPS nous affichons la vitesse et la carte
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart
                  data={formattedData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="formattedTime" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="speed" fill="#ff9800" stroke="#ff9800" name="Vitesse (km/h)" />
                </AreaChart>
              </ResponsiveContainer>
            </Grid>
            
            {/* Statistiques GPS sous forme de cartes */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>Vitesse</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Min</Typography>
                          <Typography variant="h6">
                            {sensorData.length ? Math.min(...sensorData.map(d => d.speed)).toFixed(1) : '-'} km/h
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Moy</Typography>
                          <Typography variant="h6">
                            {sensorData.length ? (sensorData.reduce((sum, d) => sum + d.speed, 0) / sensorData.length).toFixed(1) : '-'} km/h
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Max</Typography>
                          <Typography variant="h6">
                            {sensorData.length ? Math.max(...sensorData.map(d => d.speed)).toFixed(1) : '-'} km/h
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>Altitude</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Min</Typography>
                          <Typography variant="h6">
                            {sensorData.length ? Math.min(...sensorData.map(d => d.altitude)).toFixed(0) : '-'} m
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Moy</Typography>
                          <Typography variant="h6">
                            {sensorData.length ? (sensorData.reduce((sum, d) => sum + d.altitude, 0) / sensorData.length).toFixed(0) : '-'} m
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Max</Typography>
                          <Typography variant="h6">
                            {sensorData.length ? Math.max(...sensorData.map(d => d.altitude)).toFixed(0) : '-'} m
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>Distance</Typography>
                      <Typography variant="h4" align="center" fontWeight="bold">
                        {(() => {
                          if (!sensorData.length) return '-';
                          let total = 0;
                          for (let i = 1; i < sensorData.length; i++) {
                            const lat1 = sensorData[i-1].latitude;
                            const lon1 = sensorData[i-1].longitude;
                            const lat2 = sensorData[i].latitude;
                            const lon2 = sensorData[i].longitude;
                            
                            const R = 6371; // Rayon de la Terre en km
                            const dLat = (lat2 - lat1) * Math.PI / 180;
                            const dLon = (lon2 - lon1) * Math.PI / 180;
                            const a = 
                              Math.sin(dLat/2) * Math.sin(dLat/2) +
                              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                              Math.sin(dLon/2) * Math.sin(dLon/2);
                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                            const distance = R * c;
                            
                            total += distance;
                          }
                          return total.toFixed(2);
                        })()} km
                      </Typography>
                      <Typography variant="caption" color="text.secondary" align="center" display="block">
                        Distance totale parcourue
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            
            {/* Carte GPS */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Données GPS et trajet
                </Typography>
                <GPSMapComponent gpsData={sensorData} />
              </Paper>
            </Grid>
          </Grid>
        );
        
      default:
        return <Typography>Sélectionnez un type de données</Typography>;
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !car) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Retour
        </Button>
      </Box>
    );
  }
  
  if (!car) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Véhicule non trouvé
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/cars')}
          sx={{ mt: 2 }}
        >
          Retour à la liste des véhicules
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link 
              to="/cars" 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Véhicules
            </Link>
            <Link 
              to={`/cars/${carId}`} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {car.brand} {car.model}
            </Link>
            <Typography color="text.primary">Données des capteurs</Typography>
          </Breadcrumbs>
          
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <DirectionsCarIcon sx={{ mr: 1 }} />
            Données de {car.brand} {car.model}
            <Chip 
              label={car.licensePlate}
              size="medium"
              sx={{ ml: 2 }}
              color="primary"
            />
          </Typography>
        </Box>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/cars/${carId}`)}
            sx={{ mr: 1 }}
          >
            Retour aux détails
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Exporter les données
          </Button>
        </Box>
      </Box>
      
      {/* Filtres */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <Tabs
              value={dataType}
              onChange={handleDataTypeChange}
              aria-label="data source tabs"
              variant="fullWidth"
            >
              <Tab 
                icon={<SpeedIcon />} 
                label="Accéléromètre" 
                value="accelerometer"
                iconPosition="start"
              />
              <Tab 
                icon={<ThreeSixtyIcon />} 
                label="Gyroscope" 
                value="gyroscope"
                iconPosition="start"
              />
              <Tab 
                icon={<GpsFixedIcon />} 
                label="GPS" 
                value="gps"
                iconPosition="start"
              />
            </Tabs>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="time-range-label">Période</InputLabel>
              <Select
                labelId="time-range-label"
                value={timeRange}
                onChange={handleTimeRangeChange}
                label="Période"
                size="small"
                startAdornment={<DateRangeIcon sx={{ mr: 1 }} />}
              >
                {timeRanges.map(option => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {timeRange === 'custom' && (
            <>
              <Grid item xs={12} md={2}>
                <TextField
                  label="Date de début"
                  type="date"
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={customDateRange.startDate}
                  onChange={handleCustomDateChange('startDate')}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <TextField
                  label="Date de fin"
                  type="date"
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={customDateRange.endDate}
                  onChange={handleCustomDateChange('endDate')}
                />
              </Grid>
            </>
          )}
          
          <Grid item xs={12} md={timeRange === 'custom' ? 2 : 6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={isLoadingData}
              >
                Actualiser
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Contenu principal */}
      {renderChart()}
      
      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={error ? "error" : "success"}
          sx={{ width: '100%' }}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CarData;