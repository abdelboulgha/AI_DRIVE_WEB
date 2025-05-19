import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  CircularProgress, 
  Grid, 
  Card, 
  CardContent,
  Alert,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import { 
  DirectionsCar as DirectionsCarIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationOnIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Composant pour la carte GPS qui affiche toutes les voitures
const VehiclesMapComponent = ({ vehiclesData }) => {
  const mapContainerRef = useRef(null);
  const [mapError, setMapError] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  
  // Initialiser la carte une seule fois après le rendu initial
  useEffect(() => {
    // S'assurer que Leaflet est disponible
    if (!window.L) {
      setMapError("Bibliothèque Leaflet non trouvée. Assurez-vous que les scripts sont bien chargés dans votre index.html");
      return;
    }
    
    // S'assurer que le conteneur DOM existe
    if (!mapContainerRef.current) {
      return;
    }
    
    // Initialiser la carte centrée sur Marrakech
    const map = window.L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: true
    }).setView([31.6162, -8.0659], 12);
    
    // Ajouter les tuiles OpenStreetMap
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Créer un groupe pour les marqueurs
    const markersGroup = window.L.layerGroup().addTo(map);
    
    // Fonction pour mettre à jour la carte avec les données des véhicules
    const updateMap = (data) => {
      // Nettoyer les groupes
      markersGroup.clearLayers();
      
      if (!data || data.length === 0) {
        return;
      }
      
      // Liste pour stocker les positions des marqueurs
      const positions = [];
      
      // Ajouter un marqueur pour chaque véhicule
      data.forEach(vehicle => {
        if (vehicle.lastPosition && 
            typeof vehicle.lastPosition.latitude === 'number' && 
            typeof vehicle.lastPosition.longitude === 'number') {
          
          // Créer une icône personnalisée
          const carIcon = window.L.divIcon({
            className: 'custom-vehicle-marker',
            html: `<div style="background-color: ${vehicle.color || '#2196f3'}; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);">
                    <i class="fas fa-car" style="color: white; font-size: 16px;"></i>
                   </div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
          });
          
          // Position du véhicule
          const position = [vehicle.lastPosition.latitude, vehicle.lastPosition.longitude];
          positions.push(position);
          
          // Créer le popup avec les informations du véhicule
          const popupContent = `
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 5px 0; font-size: 16px;">${vehicle.brand} ${vehicle.model}</h3>
              <p style="margin: 0 0 8px 0; font-size: 14px; background-color: #f0f0f0; padding: 3px 6px; border-radius: 3px; display: inline-block;">${vehicle.licensePlate}</p>
              <div style="margin-top: 10px;">
                <p style="margin: 3px 0; font-size: 14px;"><strong>Vitesse:</strong> ${vehicle.lastPosition.speed ? vehicle.lastPosition.speed.toFixed(1) : 0} km/h</p>
                <p style="margin: 3px 0; font-size: 14px;"><strong>Dernière activité:</strong> ${new Date(vehicle.lastActivity || vehicle.lastPosition.timestamp).toLocaleString()}</p>
                <p style="margin: 3px 0; font-size: 14px;"><strong>Statut:</strong> <span style="color: ${vehicle.status === 'ACTIF' ? 'green' : 'gray'};">${vehicle.status}</span></p>
              </div>
            </div>
          `;
          
          // Ajouter le marqueur à la carte
          window.L.marker(position, { icon: carIcon })
            .bindPopup(popupContent)
            .addTo(markersGroup);
        }
      });
      
      // Ajuster la vue pour voir tous les véhicules si nous avons des positions
      if (positions.length > 0) {
        try {
          const bounds = window.L.latLngBounds(positions);
          map.fitBounds(bounds, { padding: [50, 50] });
        } catch (error) {
          console.error("Erreur lors de l'ajustement de la vue:", error);
          // En cas d'erreur, centrer sur le premier véhicule
          if (positions.length > 0) {
            map.setView(positions[0], 12);
          }
        }
      }
    };
    
    // Stocker dans une ref pour pouvoir y accéder plus tard
    mapContainerRef.current.mapContext = { map, updateMap };
    
    // Indiquer que la carte est prête
    setMapReady(true);
    
    // Nettoyage lors du démontage
    return () => {
      map.remove();
    };
  }, []);
  
  // Mettre à jour la carte quand les données des véhicules changent
  useEffect(() => {
    if (mapReady && mapContainerRef.current && mapContainerRef.current.mapContext) {
      const { updateMap } = mapContainerRef.current.mapContext;
      updateMap(vehiclesData);
    }
  }, [vehiclesData, mapReady]);
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '600px' }}>
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

// Générer des données simulées pour les véhicules
const generateMockVehicles = (count) => {
  const brands = ['Renault', 'Peugeot', 'Dacia', 'Citroën', 'Fiat', 'Toyota', 'Volkswagen', 'Ford'];
  const models = {
    'Renault': ['Clio', 'Megane', 'Captur', 'Kadjar'],
    'Peugeot': ['208', '308', '3008', '5008'],
    'Dacia': ['Sandero', 'Duster', 'Logan', 'Spring'],
    'Citroën': ['C3', 'C4', 'Berlingo', 'C5 Aircross'],
    'Fiat': ['500', 'Panda', 'Tipo', '500X'],
    'Toyota': ['Yaris', 'Corolla', 'RAV4', 'C-HR'],
    'Volkswagen': ['Golf', 'Polo', 'Tiguan', 'Passat'],
    'Ford': ['Fiesta', 'Focus', 'Kuga', 'Puma']
  };
  const colors = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#795548', '#607d8b'];
  
  // Coordonnées centrées autour de Marrakech avec une dispersion aléatoire
  const centerLat = 31.63;
  const centerLng = -8.01;
  
  return Array.from({ length: count }, (_, i) => {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const model = models[brand][Math.floor(Math.random() * models[brand].length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Générer une plaque d'immatriculation aléatoire au format marocain
    const region = Math.floor(Math.random() * 80) + 1;
    const number = Math.floor(Math.random() * 90000) + 10000;
    const series = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const licensePlate = `${region}-${series}-${number}`;
    
    // Générer une position aléatoire autour de Marrakech
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 0.1; // Rayon en degrés (environ 11 km)
    const lat = centerLat + Math.sin(angle) * distance;
    const lng = centerLng + Math.cos(angle) * distance;
    
    // Générer une activité récente aléatoire
    const now = new Date();
    const lastActivity = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000); // 7 jours au maximum
    
    return {
      id: i + 1,
      brand,
      model,
      color,
      licensePlate,
      status: Math.random() > 0.2 ? 'ACTIF' : 'INACTIF', // 80% des véhicules sont actifs
      lastActivity: lastActivity.toISOString(),
      lastPosition: {
        latitude: lat,
        longitude: lng,
        altitude: 400 + Math.random() * 100,
        speed: Math.random() * 80, // 0-80 km/h
        timestamp: lastActivity.toISOString()
      }
    };
  });
};

const GPSData = () => {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  
  const fetchVehicles = async () => {
    setLoading(true);
    
    try {
      // Tentative d'appel à l'API réelle
      const response = await axios.get(`${API_URL}/vehicles`);
      
      // Si l'API retourne des données, les enrichir avec des positions aléatoires
      if (response.data && response.data.length > 0) {
        const vehiclesWithPosition = response.data.map(vehicle => {
          // Générer une position aléatoire autour de Marrakech
          const centerLat = 31.63;
          const centerLng = -8.01;
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 0.1; // Rayon en degrés
          const lat = centerLat + Math.sin(angle) * distance;
          const lng = centerLng + Math.cos(angle) * distance;
          
          return {
            ...vehicle,
            color: ['#f44336', '#2196f3', '#4caf50', '#ff9800'][Math.floor(Math.random() * 4)],
            lastPosition: {
              latitude: lat,
              longitude: lng,
              altitude: 400 + Math.random() * 100,
              speed: Math.random() * 80, // 0-80 km/h
              timestamp: vehicle.lastActivity || new Date().toISOString()
            }
          };
        });
        
        setVehicles(vehiclesWithPosition);
      } else {
        // Si l'API ne retourne pas de données, utiliser des données simulées
        const mockVehicles = generateMockVehicles(15);
        setVehicles(mockVehicles);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des véhicules:', err);
      
      // En cas d'erreur, utiliser des données simulées
      const mockVehicles = generateMockVehicles(15);
      setVehicles(mockVehicles);
      
      setError('Impossible de charger les données des véhicules. Affichage de données simulées.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchVehicles();
    
    // Actualiser les données toutes les 30 secondes
    const interval = setInterval(() => {
      fetchVehicles();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Filtrer les véhicules selon le statut sélectionné
  const filteredVehicles = vehicles.filter(vehicle => {
    if (filterStatus === 'all') return true;
    return vehicle.status === filterStatus;
  });
  
  // Calculer quelques statistiques
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === 'ACTIF').length;
  const inactiveVehicles = totalVehicles - activeVehicles;
  const averageSpeed = filteredVehicles.length > 0 
    ? filteredVehicles.reduce((sum, v) => sum + (v.lastPosition?.speed || 0), 0) / filteredVehicles.length 
    : 0;
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOnIcon sx={{ mr: 1 }} />
          Localisation des Véhicules
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<RefreshIcon />}
          onClick={fetchVehicles}
        >
          Actualiser
        </Button>
      </Box>
      
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total des véhicules</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DirectionsCarIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
                <Typography variant="h3">{totalVehicles}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Chip 
                  label={`${activeVehicles} actifs`} 
                  color="success" 
                  size="small" 
                  sx={{ mr: 1 }} 
                />
                <Chip 
                  label={`${inactiveVehicles} inactifs`} 
                  color="default" 
                  size="small" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Vitesse moyenne</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SpeedIcon fontSize="large" color="secondary" sx={{ mr: 2 }} />
                <Typography variant="h3">{averageSpeed.toFixed(1)} km/h</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Calculée sur les véhicules {filterStatus === 'all' ? 'actifs et inactifs' : filterStatus.toLowerCase()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Filtrer par statut</Typography>
              <FormControl fullWidth>
                <InputLabel id="status-filter-label">Statut</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={filterStatus}
                  label="Statut"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">Tous les véhicules</MenuItem>
                  <MenuItem value="ACTIF">Actifs uniquement</MenuItem>
                  <MenuItem value="INACTIF">Inactifs uniquement</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Carte des véhicules
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Affichage de {filteredVehicles.length} véhicules sur la carte. Cliquez sur un marqueur pour voir les détails.
        </Typography>
        
        {/* Composant de carte */}
        <VehiclesMapComponent vehiclesData={filteredVehicles} />
      </Paper>
      
      {/* Liste des véhicules */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Liste des véhicules ({filteredVehicles.length})
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {filteredVehicles.map(vehicle => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={vehicle.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box 
                      sx={{ 
                        width: 16, 
                        height: 16, 
                        borderRadius: '50%', 
                        bgcolor: vehicle.color || '#2196f3',
                        mr: 1
                      }} 
                    />
                    <Typography variant="h6" noWrap>
                      {vehicle.brand} {vehicle.model}
                    </Typography>
                  </Box>
                  
                  <Chip 
                    label={vehicle.licensePlate} 
                    size="small" 
                    variant="outlined" 
                    sx={{ mb: 1 }} 
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Statut: <Chip 
                      label={vehicle.status === 'ACTIF' ? 'Actif' : 'Inactif'} 
                      size="small" 
                      color={vehicle.status === 'ACTIF' ? 'success' : 'default'} 
                    />
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Vitesse: {vehicle.lastPosition?.speed.toFixed(1) || 0} km/h
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Dernière activité: {new Date(vehicle.lastActivity || vehicle.lastPosition?.timestamp).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default GPSData;