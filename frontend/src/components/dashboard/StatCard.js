import React from 'react';
import { Paper, Box, Typography, Avatar } from '@mui/material';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpeedIcon from '@mui/icons-material/Speed';
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import NotificationsIcon from '@mui/icons-material/Notifications';

const StatCard = ({ title, value, icon, color, prefix = '', suffix = '', description = '' }) => {
  // Fonction pour obtenir l'icône appropriée
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'DevicesOther':
        return <DevicesOtherIcon sx={{ fontSize: 40, color }} />;
      case 'LocationOn':
        return <LocationOnIcon sx={{ fontSize: 40, color }} />;
      case 'Speed':
        return <SpeedIcon sx={{ fontSize: 40, color }} />;
      case 'ThreeSixty':
        return <ThreeSixtyIcon sx={{ fontSize: 40, color }} />;
      case 'Person':
        return <PersonIcon sx={{ fontSize: 40, color }} />;
      case 'DirectionsCar':
        return <DirectionsCarIcon sx={{ fontSize: 40, color }} />;
      case 'Notifications':
        return <NotificationsIcon sx={{ fontSize: 40, color }} />;
      default:
        return <DevicesOtherIcon sx={{ fontSize: 40, color }} />;
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        borderRadius: 2,
        boxShadow: 3,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 5,
        },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '5px',
          backgroundColor: color,
        }
      }}
    >
      <Box>
        <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 0.5 }}>
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        {description && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {description}
          </Typography>
        )}
      </Box>
      <Avatar sx={{ 
        bgcolor: `${color}15`, // Couleur avec faible opacité 
        width: 56, 
        height: 56,
        boxShadow: 1
      }}>
        {getIcon(icon)}
      </Avatar>
    </Paper>
  );
};

export default StatCard;