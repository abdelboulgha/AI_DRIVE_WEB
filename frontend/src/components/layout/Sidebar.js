import React, { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Box, 
  Collapse,
  ListItemButton,
  Avatar,
  Typography,
  Button,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SpeedIcon from '@mui/icons-material/Speed';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import authService from '../../api/authService';

const drawerWidth = 240;

// Menu principal pour tous les utilisateurs

// Menu de surveillance des capteurs
const sensorMenuItems = [
  { text: 'GPS', icon: <LocationOnIcon />, path: '/gps' },
];

// Menu administrateur
const adminMenuItems = [
  { text: 'Utilisateurs', icon: <PeopleIcon />, path: '/users' }
];

// Menu de gestion
const managementMenuItems = [
  { text: 'Véhicules', icon: <DirectionsCarIcon />, path: '/cars' },
  { text: 'Alertes', icon: <NotificationsIcon />, badge: 5, path: '/alerts' }
];

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // États pour les sous-menus dépliables
  const [openSensorMenu, setOpenSensorMenu] = useState(true);
  const [openManagementMenu, setOpenManagementMenu] = useState(true);
  
  // Récupérer les informations d'utilisateur
  const isAdmin = authService.isAdmin();
  const userName = "Utilisateur"; // En production, récupérer le nom depuis un service
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  
  const handleSensorMenuToggle = () => {
    setOpenSensorMenu(!openSensorMenu);
  };
  
  const handleManagementMenuToggle = () => {
    setOpenManagementMenu(!openManagementMenu);
  };
  
  // Ferme le drawer sur mobile après avoir cliqué sur un élément
  const handleItemClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };
  
  const drawer = (
    <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* En-tête du Sidebar */}
      <Box sx={{ 
        p: 2, 
        textAlign: 'center',
        backgroundColor: theme.palette.primary.main,
        color: 'white'
      }}>
        <DirectionsCarIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          AI-Drive
        </Typography>
      </Box>
      
      <Divider />
      
      {/* Profil utilisateur */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 2,
        backgroundColor: theme.palette.background.paper
      }}>
        <Avatar 
          sx={{ 
            bgcolor: isAdmin ? theme.palette.error.main : theme.palette.primary.main,
            width: 40,
            height: 40,
            mr: 2
          }}
        >
          {isAdmin ? 'A' : 'U'}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {userName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {isAdmin ? 'Administrateur' : 'Utilisateur'}
          </Typography>
        </Box>
      </Box>
      
      <Divider />
      
      {/* Liste principale */}
      <List component="nav" sx={{ px: 1 }}>
        
        {/* Sous-menu capteurs */}
        <ListItemButton 
          onClick={handleSensorMenuToggle}
          sx={{ 
            borderRadius: 1,
            mb: 0.5,
            bgcolor: openSensorMenu ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
          }}
        >
          <ListItemIcon>
            <SpeedIcon />
          </ListItemIcon>
          <ListItemText primary="Capteurs" />
          {openSensorMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSensorMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {sensorMenuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                onClick={handleItemClick}
                selected={location.pathname === item.path}
                sx={{
                  pl: 4,
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  },
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
        </Collapse>
        
        {/* Sous-menu gestion */}
        <ListItemButton 
          onClick={handleManagementMenuToggle}
          sx={{ 
            borderRadius: 1,
            mb: 0.5,
            bgcolor: openManagementMenu ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
          }}
        >
          <ListItemIcon>
            <DirectionsCarIcon />
          </ListItemIcon>
          <ListItemText primary="Gestion" />
          {openManagementMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openManagementMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {managementMenuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                onClick={handleItemClick}
                selected={location.pathname === item.path}
                sx={{
                  pl: 4,
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}
                >
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Collapse>
        
        {/* Menu admin (visible uniquement pour les administrateurs) */}
        {isAdmin && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography 
              variant="overline" 
              sx={{ px: 2, color: 'text.secondary', display: 'block' }}
            >
              Administration
            </Typography>
            {adminMenuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                onClick={handleItemClick}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  },
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
          </>
        )}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      {/* Menu bas de page */}
      <List sx={{ px: 1 }}>
        <Divider sx={{ my: 1 }} />

        <ListItem button onClick={handleLogout} sx={{ borderRadius: 1 }}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </ListItem>
      </List>
      
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} AI-Drive
          <br />
          Tous droits réservés
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Version mobile (temporaire) */}
      <Drawer
        variant="temporary"
        open={isMobile ? open : false}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Version desktop (permanente) */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;