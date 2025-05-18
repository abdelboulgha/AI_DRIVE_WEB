import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemAvatar,
  Tooltip,
  Button,
  Chip
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  Close as CloseIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import authService from '../../api/authService';
import AlertService from '../../api/alertService';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Récupérer les données utilisateur
  const userId = authService.getCurrentUserId();
  const isAdmin = authService.isAdmin();
  
  // Récupérer les notifications (alertes récentes)
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Dans une implémentation réelle, vous feriez un appel API
      const response = await AlertService.getAlertsByUserId(userId, { 
        limit: 5,
        sort: 'timestamp:desc'
      });
      
      setNotifications(response.data);
      
      // Simuler des notifications non lues (dans une implémentation réelle,
      // cela viendrait d'une API spécifique pour les notifications)
      setUnreadCount(Math.min(3, response.data.length));
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNotifications();
    
    // Actualiser les notifications toutes les 60 secondes
    const intervalId = setInterval(fetchNotifications, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
    // Dans une implémentation réelle, vous marqueriez les notifications comme lues ici
    setUnreadCount(0);
  };
  
  const handleProfileOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };
  
  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  
  const handleProfileClick = () => {
    navigate('/profile');
    handleProfileClose();
  };
  
  const handleSettingsClick = () => {
    navigate('/settings');
    handleProfileClose();
  };
  
  const handleNotificationClick = (alertId) => {
    navigate(`/alerts/${alertId}`);
    handleNotificationsClose();
  };
  
  // Fonction pour formater le temps écoulé
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const secondsAgo = Math.floor((now - date) / 1000);
    
    if (secondsAgo < 60) return 'il y a quelques secondes';
    if (secondsAgo < 3600) return `il y a ${Math.floor(secondsAgo / 60)} min`;
    if (secondsAgo < 86400) return `il y a ${Math.floor(secondsAgo / 3600)} h`;
    return `il y a ${Math.floor(secondsAgo / 86400)} j`;
  };
  
  // Fonction pour obtenir l'icône et la couleur en fonction du type d'alerte
  const getAlertIcon = (type) => {
    switch (type) {
      case 'HARSH_BRAKING':
        return <WarningIcon sx={{ color: '#f44336' }} />;
      case 'EXCESSIVE_ACCELERATION':
        return <SpeedIcon sx={{ color: '#ff9800' }} />;
      case 'DANGEROUS_TURN':
        return <WarningIcon sx={{ color: '#9c27b0' }} />;
      case 'EXCESSIVE_SPEED':
        return <SpeedIcon sx={{ color: '#f44336' }} />;
      case 'LANE_DEPARTURE':
        return <WarningIcon sx={{ color: '#2196f3' }} />;
      default:
        return <InfoIcon sx={{ color: '#f44336' }} />;
    }
  };
  
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DirectionsCarIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" noWrap component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
            AI-Drive
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Bouton de notifications */}
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit"
              onClick={handleNotificationsOpen}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* Menu de notifications */}
          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
            PaperProps={{
              sx: { 
                width: 360,
                maxHeight: 400,
                overflow: 'auto',
                mt: 1.5
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Notifications</Typography>
              <IconButton size="small" onClick={handleNotificationsClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Divider />
            
            {notifications.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Aucune notification récente
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {notifications.map(alert => (
                  <React.Fragment key={alert.id}>
                    <ListItem 
                      button 
                      onClick={() => handleNotificationClick(alert.id)}
                      alignItems="flex-start"
                      sx={{ 
                        py: 1.5,
                        ...(alert.status === 'NEW' && {
                          bgcolor: 'action.hover'
                        })
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: 
                            alert.severity === 'HIGH' ? 'error.light' : 
                            alert.severity === 'MEDIUM' ? 'warning.light' : 'info.light'
                        }}>
                          {getAlertIcon(alert.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle2" component="span">
                              {alert.description}
                            </Typography>
                            <Chip 
                              label={alert.severity}
                              size="small"
                              color={
                                alert.severity === 'HIGH' ? 'error' :
                                alert.severity === 'MEDIUM' ? 'warning' : 'info'
                              }
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" component="span" sx={{ display: 'block' }}>
                              {alert.car?.brand} {alert.car?.model} - {alert.car?.licensePlate}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" component="span">
                              {getTimeAgo(alert.timestamp)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
            
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="text" 
                component={RouterLink} 
                to="/alerts"
                onClick={handleNotificationsClose}
              >
                Voir toutes les alertes
              </Button>
            </Box>
          </Menu>
          
          {/* Bouton de profil */}
          <Tooltip title="Profil">
            <IconButton 
              color="inherit"
              onClick={handleProfileOpen}
              sx={{ ml: 1 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: isAdmin ? 'error.main' : 'primary.main' }}>
                {isAdmin ? 'A' : 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
          
          {/* Menu de profil */}
          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleProfileClose}
            PaperProps={{
              sx: { width: 200, mt: 1.5 }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Mon profil" />
            </MenuItem>
            
            <MenuItem onClick={handleSettingsClick}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Paramètres" />
            </MenuItem>
            
            <Divider />
            
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Déconnexion" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;