import { useState, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import type { BulkUploadResult } from '../types';
import { urlAPI } from '../api/client';

export const BulkUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<BulkUploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.txt')) {
        setError('Please select a .txt file');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setError('');
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await urlAPI.bulkUpload(file);
      setResult(response.data);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.file) {
        setError(errorData.file[0]);
      } else if (errorData?.detail) {
        setError(errorData.detail);
      } else {
        setError('Failed to upload file. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResults = () => {
    if (!result) return;

    const csvContent = [
      'Status,Short URL,Original URL,Error',
      ...result.results.map((item) =>
        `${item.status},${item.short_url || ''},${item.original_url},"${item.error || ''}"`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-upload-results-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (!droppedFile.name.endsWith('.txt')) {
        setError('Please drop a .txt file');
        return;
      }
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFile(droppedFile);
      setError('');
      setResult(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bulk URL Upload
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Upload a .txt file with one URL per line (max 1000 URLs, 5MB file size)
      </Typography>

      {/* Upload Area */}
      <Paper elevation={3} sx={{ p: 3, mt: 3, mb: 3 }}>
        <Box
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          sx={{
            border: '2px dashed',
            borderColor: file ? 'success.main' : 'grey.400',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            backgroundColor: file ? 'success.50' : 'grey.50',
            cursor: 'pointer',
            transition: 'all 0.3s',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'grey.100',
            },
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt"
            style={{ display: 'none' }}
          />
          <UploadIcon sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {file ? file.name : 'Drop your .txt file here or click to browse'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {file
              ? `File size: ${(file.size / 1024).toFixed(2)} KB`
              : 'Supported format: .txt (max 5MB, up to 1000 URLs)'}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={handleUpload}
            disabled={!file || loading}
            size="large"
          >
            {loading ? 'Uploading...' : 'Upload URLs'}
          </Button>
          {file && (
            <Button
              variant="outlined"
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              disabled={loading}
            >
              Clear
            </Button>
          )}
        </Box>

        {loading && <LinearProgress sx={{ mt: 2 }} />}
      </Paper>

      {/* Results */}
      {result && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Upload Results</Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadResults}
            >
              Download CSV
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            <Box>
              <Typography variant="h6" color="primary">
                {result.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total URLs
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="success.main">
                {result.success}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Successful
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="error.main">
                {result.failed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Failed
              </Typography>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Short URL</TableCell>
                  <TableCell>Original URL</TableCell>
                  <TableCell>Error</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.results.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {item.status === 'success' ? (
                        <Chip
                          icon={<SuccessIcon />}
                          label="Success"
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Chip
                          icon={<ErrorIcon />}
                          label="Failed"
                          color="error"
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {item.short_url && (
                        <Typography variant="body2" fontFamily="monospace">
                          {item.short_url}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 400,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.original_url}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {item.error && (
                        <Typography variant="body2" color="error">
                          {item.error}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};
