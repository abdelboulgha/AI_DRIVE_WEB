import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SpeedIcon from '@mui/icons-material/Speed';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';

const drawerWidth = 240;

const menuItems = [
  { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/' },
  { text: 'Accéléromètre', icon: <SpeedIcon />, path: '/accelerometer' },
  { text: 'GPS', icon: <LocationOnIcon />, path: '/gps' },
  { text: 'Gyroscope', icon: <ThreeSixtyIcon />, path: '/gyroscope' },
  { text: 'Appareils', icon: <DevicesOtherIcon />, path: '/devices' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 8 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
                borderLeft: location.pathname === item.path ? '4px solid' : 'none',
                borderColor: 'primary.main',
                pl: location.pathname === item.path ? 2 : 3,
              }}
            >
              <ListItemIcon 
                sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};

export default Sidebar;