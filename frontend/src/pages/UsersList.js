import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tabs,
  Tab,
  Badge,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsCar as DirectionsCarIcon,
  Person as PersonIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LockOpen as LockOpenIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserForm from '../components/users/UserForm';

const UsersList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [unsecuredDelete, setUnsecuredDelete] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0
  });
  
  const tabFilters = ['all', 'ACTIF', 'INACTIF'];
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Appel à votre endpoint
      const response = await axios.get('http://localhost:8080/api/auth/users');
      
      // Filtrage selon l'onglet sélectionné
      let filteredUsers = response.data;
      if (tabValue > 0) {
        filteredUsers = response.data.filter(user => user.status === tabFilters[tabValue]);
      }
      
      // Filtrage selon le terme de recherche
      if (searchTerm) {
        filteredUsers = filteredUsers.filter(user => 
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.telephone && user.telephone.includes(searchTerm))
        );
      }
      
      // Pagination simple côté client
      const paginatedUsers = filteredUsers.slice(
        page * rowsPerPage, 
        page * rowsPerPage + rowsPerPage
      );
      
      setUsers(paginatedUsers);
      setTotalUsers(filteredUsers.length);
      
      // Calcul des statistiques
      const activeUsers = response.data.filter(user => user.status === 'ACTIF').length;
      setStats({
        totalUsers: response.data.length,
        activeUsers,
        inactiveUsers: response.data.length - activeUsers
      });
      
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      setLoading(false);
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, tabValue, searchTerm]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
  };
  
  const handleMenuOpen = (event, user) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  const handleEditUser = () => {
    setUserFormOpen(true);
    handleMenuClose();
  };
  
  const handleDeleteClick = () => {
    setUserToDelete(selectedUser);
    setDeleteDialogOpen(true);
    setUnsecuredDelete(false);
    handleMenuClose();
  };
  
  const handleDeleteUnsecuredClick = () => {
    setUserToDelete(selectedUser);
    setDeleteDialogOpen(true);
    setUnsecuredDelete(true);
    handleMenuClose();
  };
  
  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      
      // Choisir l'endpoint approprié selon le mode de suppression
      const endpoint = unsecuredDelete 
        ? `http://localhost:8080/api/auth/users/delete-unsecured/${userToDelete.id}`
        : `http://localhost:8080/api/auth/users/${userToDelete.id}`;
      // Appel à l'API pour supprimer l'utilisateur
      await axios.delete(endpoint);
      
      // Mettre à jour la liste des utilisateurs
      fetchUsers();
      
      // Afficher un message de succès
      const successText = unsecuredDelete 
        ? `L'utilisateur ${userToDelete.username} a été supprimé avec succès (sans sécurité)`
        : `L'utilisateur ${userToDelete.username} a été supprimé avec succès`;
      
      setSuccessMessage(successText);
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      
      // Afficher un message d'erreur
      let errorMessage = 'Une erreur est survenue lors de la suppression';
      if (err.response && err.response.data && err.response.data.error) {
        errorMessage = err.response.data.error;
      }
      
      setError(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };
  
  const handleCreateUser = () => {
    setSelectedUser(null);
    setUserFormOpen(true);
  };
  
  const handleFormClose = () => {
    setUserFormOpen(false);
    setSelectedUser(null);
  };
  
  const handleUserSaved = () => {
    fetchUsers();
    setUserFormOpen(false);
    setSuccessMessage(selectedUser 
      ? `L'utilisateur a été mis à jour avec succès` 
      : `Nouvel utilisateur créé avec succès`
    );
    setSnackbarOpen(true);
  };
  
  const handleViewUserCars = (userId) => {
    navigate(`/users/${userId}/cars`);
    handleMenuClose();
  };
  
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          Gestion des utilisateurs
        </Typography>
      </Box>
      
      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Total utilisateurs
                </Typography>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
              </Box>
              <Typography variant="h3" component="div" sx={{ my: 2, fontWeight: 'bold' }}>
                {stats.totalUsers}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Utilisateurs actifs
                  </Typography>
                  <Typography variant="h6" color="success.main" sx={{ fontWeight: 'medium' }}>
                    {stats.activeUsers}
                  </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    Utilisateurs inactifs
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    {stats.inactiveUsers}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Utilisateurs avec véhicules
                </Typography>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <DirectionsCarIcon />
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', my: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {users.filter(u => u.vehicles && u.vehicles.length > 0).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avec véhicules
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {users.filter(u => !u.vehicles || u.vehicles.length === 0).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sans véhicule
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        {/* Barre de recherche et filtres */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ mr: 1, width: { xs: '100%', sm: '300px' } }}
            />
            <Button type="submit" variant="contained" size="small">
              Rechercher
            </Button>
          </Box>
          
          <Button
            startIcon={<FilterListIcon />}
            variant="outlined"
            size="small"
            onClick={() => alert('Filtres avancés à implémenter')}
          >
            Filtres
          </Button>
        </Box>
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab 
            label={
              <Badge badgeContent={stats.totalUsers} color="primary">
                <Box sx={{ pr: 2 }}>Tous</Box>
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={stats.activeUsers} color="success">
                <Box sx={{ pr: 2 }}>Actifs</Box>
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={stats.inactiveUsers} color="error">
                <Box sx={{ pr: 2 }}>Inactifs</Box>
              </Badge>
            } 
          />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {/* Tableau des utilisateurs */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Utilisateur</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="center">Véhicules</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={40} />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      Aucun utilisateur trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {user.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {user.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.telephone || "Non renseigné"}</TableCell>
                    <TableCell>
                      <Chip 
                        icon={user.status === 'ACTIF' ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                        label={user.status} 
                        size="small" 
                        color={user.status === 'ACTIF' ? 'success' : 'default'} 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Badge 
                        badgeContent={user.vehicles ? user.vehicles.length : 0} 
                        color="primary"
                        showZero
                        sx={{ 
                          '& .MuiBadge-badge': { 
                            right: -12, 
                            top: 5 
                          } 
                        }}
                      >
                        <DirectionsCarIcon 
                          color={user.vehicles && user.vehicles.length > 0 ? "primary" : "disabled"} 
                        />
                      </Badge>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="options"
                        size="small"
                        onClick={(e) => handleMenuOpen(e, user)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={totalUsers}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
        />
      </Paper>
      
      {/* Menu contextuel pour actions utilisateur */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewUserCars(selectedUser?.id)}>
          <DirectionsCarIcon fontSize="small" sx={{ mr: 1 }} />
          Voir les véhicules
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteUnsecuredClick} sx={{ color: 'error.main' }}>
          <LockOpenIcon fontSize="small" sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>
      
      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer l'utilisateur {userToDelete?.username} ?
            {unsecuredDelete 
              ? " Cette action est irréversible et sera effectuée sans vérification de sécurité." 
              : " Cette action est irréversible et supprimera également toutes les données associées."
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
          >
            {unsecuredDelete ? "Supprimer (sans sécurité)" : "Supprimer"}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Formulaire d'utilisateur (ajout/modification) */}
      <UserForm
        open={userFormOpen}
        handleClose={handleFormClose}
        user={selectedUser}
        onSave={handleUserSaved}
      />
      
      {/* Snackbar de notification */}
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

export default UsersList;