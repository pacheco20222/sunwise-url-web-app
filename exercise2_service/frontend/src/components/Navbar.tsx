import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import {
  Link as LinkIcon,
  CloudUpload as UploadIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <LinkIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to={isAuthenticated ? '/dashboard' : '/'}
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            URL Shortener
          </Typography>

          {isAuthenticated ? (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                color="inherit"
                component={RouterLink}
                to="/dashboard"
                startIcon={<LinkIcon />}
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/bulk-upload"
                startIcon={<UploadIcon />}
              >
                Bulk Upload
              </Button>
              <Typography variant="body2" sx={{ mx: 2 }}>
                {user?.username}
              </Typography>
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" component={RouterLink} to="/login">
                Login / Register for Private URLs
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
