import React, { useState } from 'react';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };
  
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          //ml: { sm: '240px' },
          mt: '34px',
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'background.default'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;