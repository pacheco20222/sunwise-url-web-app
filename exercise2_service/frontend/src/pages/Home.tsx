import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Link as LinkIcon } from '@mui/icons-material';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <LinkIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
          <Typography variant="h2" component="h1" gutterBottom>
            URL Shortener
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Shorten your long URLs and track analytics
          </Typography>

          <Paper elevation={3} sx={{ p: 4, mt: 4, width: '100%', maxWidth: 600 }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'left' }}>
              Features:
            </Typography>
            <Box component="ul" sx={{ textAlign: 'left', pl: 3, mb: 3 }}>
              <Typography component="li" sx={{ mb: 1 }}>
                Create short, memorable URLs
              </Typography>
              <Typography component="li" sx={{ mb: 1 }}>
                Track views and analytics
              </Typography>
              <Typography component="li" sx={{ mb: 1 }}>
                Bulk upload URLs from .txt files
              </Typography>
              <Typography component="li" sx={{ mb: 1 }}>
                Public and private URL options
              </Typography>
              <Typography component="li" sx={{ mb: 1 }}>
                Manage all your shortened URLs in one place
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};
