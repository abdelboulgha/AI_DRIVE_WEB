import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { format } from 'date-fns';

// Correction de l'icône Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const GPSMap = ({ gpsData }) => {
  // Si aucune donnée, afficher un message
  if (!gpsData || gpsData.length === 0) {
    return <div>Aucune donnée GPS disponible</div>;
  }

  // Calculer le centre de la carte (première position GPS)
  const center = [gpsData[0].latitude, gpsData[0].longitude];
  
  // Créer un tableau de points pour la ligne de tracé
  const polylinePositions = gpsData.map(point => [point.latitude, point.longitude]);

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Ligne de tracé */}
      <Polyline 
        positions={polylinePositions} 
        color="#2196f3" 
        weight={3} 
        opacity={0.7} 
      />
      
      {/* Points GPS */}
      {gpsData.map((point, index) => (
        <Marker 
          key={index} 
          position={[point.latitude, point.longitude]} 
          icon={defaultIcon}
        >
          <Popup>
            <div>
              <p><strong>Device ID:</strong> {point.deviceId}</p>
              <p><strong>Latitude:</strong> {point.latitude}</p>
              <p><strong>Longitude:</strong> {point.longitude}</p>
              <p><strong>Altitude:</strong> {point.altitude} m</p>
              <p><strong>Vitesse:</strong> {point.speed} km/h</p>
              <p><strong>Date:</strong> {format(new Date(point.timestamp), 'dd/MM/yyyy HH:mm:ss')}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default GPSMap;