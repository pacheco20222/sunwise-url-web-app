import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  TextField,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Visibility as ViewsIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import type { ShortURL } from '../types';
import { urlAPI } from '../api/client';

export const PublicHome = () => {
  const navigate = useNavigate();
  const [urls, setUrls] = useState<ShortURL[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetUrl, setTargetUrl] = useState('');
  const [shortenLoading, setShortenLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPublicUrls();
  }, []);

  const fetchPublicUrls = async () => {
    try {
      const response = await urlAPI.list();
      const data = response.data;
      setUrls(Array.isArray(data) ? data : data.results || []);
    } catch (err: any) {
      console.error('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShortenLoading(true);

    try {
      const response = await urlAPI.shorten({
        target_url: targetUrl,
        is_private: false, // Always public
      });
      setUrls([response.data, ...urls]);
      setSuccess('URL shortened successfully!');
      setTargetUrl('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.target_url) {
        setError(errorData.target_url[0]);
      } else {
        setError('Failed to shorten URL. Please try again.');
      }
    } finally {
      setShortenLoading(false);
    }
  };

  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    setSuccess('Short URL copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Public URL Shortener
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Create and view all public shortened URLs
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/login')}
          sx={{ mr: 2 }}
        >
          Create Private URLs
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<UploadIcon />}
          onClick={() => navigate('/public-bulk-upload')}
        >
          Bulk Upload (Public)
        </Button>
      </Box>

      {/* Shorten URL Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Shorten a Public URL
        </Typography>

        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography color="error.dark">{error}</Typography>
          </Box>
        )}

        {success && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography color="success.dark">{success}</Typography>
          </Box>
        )}

        <Box component="form" onSubmit={handleShorten}>
          <TextField
            fullWidth
            label="Enter your long URL"
            placeholder="https://example.com/very/long/url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={shortenLoading}
            size="large"
          >
            {shortenLoading ? 'Shortening...' : 'Shorten URL'}
          </Button>
        </Box>
      </Paper>

      {/* Public URLs Table */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          All Public URLs
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : urls.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>
            No public URLs yet. Be the first to create one!
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Short URL</TableCell>
                  <TableCell>Target URL</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Views</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {urls.map((url) => (
                  <TableRow key={url.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontFamily="monospace">
                          {url.short_url}
                        </Typography>
                        <Tooltip title="Copy short URL">
                          <IconButton
                            size="small"
                            onClick={() => handleCopy(url.short_url)}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {url.target_url}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {url.owner_email || 'Anonymous'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ViewsIcon fontSize="small" color="action" />
                        <Typography variant="body2">{url.views}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(url.created_at)}</TableCell>
                    <TableCell align="right">
                      <Chip label="Public" size="small" color="success" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};
