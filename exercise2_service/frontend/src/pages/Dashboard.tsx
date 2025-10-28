import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Switch,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  Visibility as ViewsIcon,
} from '@mui/icons-material';
import type { ShortURL } from '../types';
import { urlAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const [targetUrl, setTargetUrl] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [urls, setUrls] = useState<ShortURL[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [urlCount, setUrlCount] = useState(user?.url_count || 0);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await urlAPI.list();
      // Handle paginated response
      const data = response.data;
      setUrls(Array.isArray(data) ? data : data.results || []);
    } catch (err: any) {
      setError('Failed to fetch URLs');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await urlAPI.shorten({
        target_url: targetUrl,
        is_private: isPrivate,
      });
      setUrls([response.data, ...urls]);
      setUrlCount(urlCount + 1); // Update count live
      setSuccess('URL shortened successfully!');
      setTargetUrl('');
      setIsPrivate(false);
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.target_url) {
        setError(errorData.target_url[0]);
      } else {
        setError('Failed to shorten URL. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    setSuccess('Short URL copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) {
      return;
    }

    try {
      await urlAPI.delete(id);
      setUrls(urls.filter((url) => url.id !== id));
      setUrlCount(urlCount - 1); // Update count live
      setSuccess('URL deleted successfully');
    } catch (err: any) {
      setError('Failed to delete URL');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, minHeight: 'calc(100vh - 200px)' }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.username}!
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        You have shortened {urlCount} URLs
      </Typography>

      {/* Shorten URL Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Shorten a New URL
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Enter your long URL"
            placeholder="https://example.com/very/long/url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
              }
              label="Private URL (only visible to you)"
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              size="large"
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* URLs Table */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Your Shortened URLs
        </Typography>

        {fetchLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : urls.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>
            No URLs yet. Shorten your first URL above!
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Short URL</TableCell>
                  <TableCell>Target URL</TableCell>
                  <TableCell>Status</TableCell>
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
                      {url.is_private ? (
                        <Chip label="Private" size="small" color="warning" />
                      ) : (
                        <Chip label="Public" size="small" color="success" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ViewsIcon fontSize="small" color="action" />
                        <Typography variant="body2">{url.views}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(url.created_at)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(url.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
