import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpeedIcon from '@mui/icons-material/Speed';
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';

const StatCard = ({ title, value, icon, color }) => {
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
      }}
    >
      <Box>
        <Typography variant="h6" component="h2" fontWeight="bold">
          {value.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Box>
        {getIcon(icon)}
      </Box>
    </Paper>
  );
};

export default StatCard;