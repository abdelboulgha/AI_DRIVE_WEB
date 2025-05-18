import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid,
  Button,
  Card,
  CardContent,
  IconButton,
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
  ButtonGroup,
  Chip,
  Skeleton
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  DirectionsCar as DirectionsCarIcon,
  DateRange as DateRangeIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon,
  GpsFixed as GpsFixedIcon,
  Speed as SpeedIcon,
  ThreeSixty as ThreeSixtyIcon,
  Download as DownloadIcon,
  Launch as LaunchIcon,
  Map as MapIcon,
  FilterList as FilterListIcon
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
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import CarService from '../api/carService';
import SensorDataService from '../api/sensorDataService';
import GPSMap from '../components/maps/GPSMap';

// Générer des données simulées pour les capteurs
const generateSensorData = (count, type) => {
  let data = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    // Date allant de maintenant à x jours en arrière
    const date = new Date(now.getTime() - (count - i) * 15 * 60000); // 15 minutes d'intervalle
    
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
      // Coordonnées centrées autour de Marrakech avec de petites variations
      data.push({
        timestamp: date.toISOString(),
        latitude: 31.63 + Math.sin(i / 20) * 0.05 + Math.random() * 0.02 - 0.01,
        longitude: -8.01 + Math.cos(i / 15) * 0.05 + Math.random() * 0.02 - 0.01,
        altitude: 450 + Math.sin(i / 10) * 20 + Math.random() * 10 - 5,
        speed: 30 + Math.sin(i / 8) * 20 + Math.random() * 10
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
      const response = await CarService.getCarById(carId);
      setCar(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des détails du véhicule');
      setLoading(false);
      console.error(err);
    }
  };
  
  const fetchSensorData = async () => {
    setIsLoadingData(true);
    
    try {
      // En réalité, nous ferions un appel API ici
      // const params = { startDate, endDate, ...autres filtres };
      // const response = await SensorDataService.getSensorData(carId, dataType, params);
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Générer des données simulées selon le type
      const mockData = generateSensorData(100, dataType);
      setSensorData(mockData);
      
      setIsLoadingData(false);
    } catch (err) {
      setError(`Erreur lors du chargement des données du capteur: ${err.message}`);
      setIsLoadingData(false);
      setSnackbarOpen(true);
    }
  };
  
  useEffect(() => {
    fetchCar();
  }, [carId]);
  
  useEffect(() => {
    if (car) {
      fetchSensorData();
    }
  }, [car, dataType, timeRange]);
  
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
    // Logique pour télécharger les données
    alert('Téléchargement des données (fonctionnalité à implémenter)');
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
  
  // Rendu des différents types de graphiques
  const renderChart = () => {
    const formattedData = formatChartData(sensorData);
    
    if (isLoadingData) {
      return (
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={400} 
          animation="wave" 
        />
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
        // Pour le GPS nous affichons deux graphiques: vitesse et carte
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
            <Grid item xs={12}>
              <Box sx={{ height: 400, width: '100%', border: '1px solid #eee', borderRadius: 1 }}>
                <GPSMap gpsData={sensorData} />
              </Box>
            </Grid>
          </Grid>
        );
        
      default:
        return <Typography>Sélectionnez un type de données</Typography>;
    }
  };
  
  // Cartes de statistiques pour chaque type de capteur
  const renderStatCards = () => {
    if (!sensorData.length) return null;
    
    switch (dataType) {
      case 'accelerometer': {
        // Calculer les statistiques pour les données d'accéléromètre
        const maxX = Math.max(...sensorData.map(d => d.x));
        const minX = Math.min(...sensorData.map(d => d.x));
        const avgX = sensorData.reduce((sum, d) => sum + d.x, 0) / sensorData.length;
        
        const maxY = Math.max(...sensorData.map(d => d.y));
        const minY = Math.min(...sensorData.map(d => d.y));
        const avgY = sensorData.reduce((sum, d) => sum + d.y, 0) / sensorData.length;
        
        const maxZ = Math.max(...sensorData.map(d => d.z));
        const minZ = Math.min(...sensorData.map(d => d.z));
        const avgZ = sensorData.reduce((sum, d) => sum + d.z, 0) / sensorData.length;
        
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">Axe X</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Min</Typography>
                        <Typography variant="h6">{minX.toFixed(2)}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Moy</Typography>
                        <Typography variant="h6">{avgX.toFixed(2)}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Max</Typography>
                        <Typography variant="h6">{maxX.toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#4caf50' }}>Axe Y</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Min</Typography>
                        <Typography variant="h6">{minY.toFixed(2)}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Moy</Typography>
                        <Typography variant="h6">{avgY.toFixed(2)}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Max</Typography>
                        <Typography variant="h6">{maxY.toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#2196f3' }}>Axe Z</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Min</Typography>
                        <Typography variant="h6">{minZ.toFixed(2)}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Moy</Typography>
                        <Typography variant="h6">{avgZ.toFixed(2)}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Max</Typography>
                        <Typography variant="h6">{maxZ.toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      }
      
      case 'gyroscope': {
        // Calculer les statistiques pour les données du gyroscope
        const maxX = Math.max(...sensorData.map(d => d.rotationX));
        const minX = Math.min(...sensorData.map(d => d.rotationX));
        const avgX = sensorData.reduce((sum, d) => sum + d.rotationX, 0) / sensorData.length;
        
        const maxY = Math.max(...sensorData.map(d => d.rotationY));
        const minY = Math.min(...sensorData.map(d => d.rotationY));
        const avgY = sensorData.reduce((sum, d) => sum + d.rotationY, 0) / sensorData.length;
        
        const maxZ = Math.max(...sensorData.map(d => d.rotationZ));
        const minZ = Math.min(...sensorData.map(d => d.rotationZ));
        const avgZ = sensorData.reduce((sum, d) => sum + d.rotationZ, 0) / sensorData.length;
        
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">Rotation X</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Min</Typography>
                        <Typography variant="h6">{minX.toFixed(2)}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Moy</Typography>
                        <Typography variant="h6">{avgX.toFixed(2)}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Max</Typography>
                        <Typography variant="h6">{maxX.toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#4caf50' }}>Rotation Y</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Min</Typography>
                        <Typography variant="h6">{minY.toFixed(2)}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Moy</Typography>
                        <Typography variant="h6">{avgY.toFixed(2)}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Max</Typography>
                        <Typography variant="h6">{maxY.toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#2196f3' }}>Rotation Z</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Min</Typography>
                        <Typography variant="h6">{minZ.toFixed(2)}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Moy</Typography>
                        <Typography variant="h6">{avgZ.toFixed(2)}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Max</Typography>
                        <Typography variant="h6">{maxZ.toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      }
      
      case 'gps': {
        // Calculer les statistiques pour les données GPS
        const maxSpeed = Math.max(...sensorData.map(d => d.speed));
        const minSpeed = Math.min(...sensorData.map(d => d.speed));
        const avgSpeed = sensorData.reduce((sum, d) => sum + d.speed, 0) / sensorData.length;
        
        const maxAlt = Math.max(...sensorData.map(d => d.altitude));
        const minAlt = Math.min(...sensorData.map(d => d.altitude));
        const avgAlt = sensorData.reduce((sum, d) => sum + d.altitude, 0) / sensorData.length;
        
        // Calculer la distance totale parcourue (approximation simple)
        let totalDistance = 0;
        for (let i = 1; i < sensorData.length; i++) {
          const lat1 = sensorData[i-1].latitude;
          const lon1 = sensorData[i-1].longitude;
          const lat2 = sensorData[i].latitude;
          const lon2 = sensorData[i].longitude;
          
          // Formule Haversine simplifiée
          const R = 6371; // Rayon de la Terre en km
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distance = R * c;
          
          totalDistance += distance;
        }
        
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">Vitesse</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Min</Typography>
                        <Typography variant="h6">{minSpeed.toFixed(1)} km/h</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Moy</Typography>
                        <Typography variant="h6">{avgSpeed.toFixed(1)} km/h</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Max</Typography>
                        <Typography variant="h6">{maxSpeed.toFixed(1)} km/h</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#4caf50' }}>Altitude</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Min</Typography>
                        <Typography variant="h6">{minAlt.toFixed(0)} m</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Moy</Typography>
                        <Typography variant="h6">{avgAlt.toFixed(0)} m</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Max</Typography>
                        <Typography variant="h6">{maxAlt.toFixed(0)} m</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#2196f3' }}>Distance</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h4" align="center" fontWeight="bold">
                      {totalDistance.toFixed(2)} km
                    </Typography>
                    <Typography variant="caption" color="text.secondary" align="center" display="block">
                      Distance totale parcourue
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      }
      
      default:
        return null;
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
      {/* En-tête avec fil d'Ariane et boutons d'action */}
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
      
      {/* Conteneur de filtres */}
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
      
      {/* Statistiques */}
      <Box sx={{ mb: 3 }}>
        {renderStatCards()}
      </Box>
      
      {/* Graphique principal */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {dataType === 'accelerometer' && 'Données de l\'accéléromètre'}
          {dataType === 'gyroscope' && 'Données du gyroscope'}
          {dataType === 'gps' && 'Données GPS et trajet'}
        </Typography>
        
        {renderChart()}
      </Paper>
      
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