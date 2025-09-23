import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as FileIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Storage as DatabaseIcon,
  TableChart as TableIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { config, buildApiUrl } from '../../../config/config';

interface UploadResponse {
  data_cid?: string;
  index_cids?: Record<string, string>;
  index_sizes?: Record<string, number>;
  file_type?: string;
  rows_processed?: number;
  message?: string;
  error?: string;
}

const DataUpload: React.FC = () => {
  const [uploadState, setUploadState] = useState<{
    isUploading: boolean;
    progress: number;
    result: UploadResponse | null;
    error: string | null;
  }>({
    isUploading: false,
    progress: 0,
    result: null,
    error: null,
  });

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();
    
    if (!fileExtension || !['csv', 'sql'].includes(fileExtension)) {
      setUploadState(prev => ({
        ...prev,
        error: 'Please select a CSV or SQL file. Other file types are not supported.',
      }));
      return;
    }

    setUploadState({
      isUploading: true,
      progress: 0,
      result: null,
      error: null,
    });

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Create progress tracking
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progressPercent = (e.loaded / e.total) * 100;
          setUploadState(prev => ({
            ...prev,
            progress: progressPercent,
          }));
        }
      });

      const uploadPromise = new Promise<UploadResponse>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (e) {
              reject(new Error('Invalid response format'));
            }
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network error during upload'));
        };

        xhr.open('POST', buildApiUrl('/upload/patient-data'));
        
        // Add headers from config if needed
        Object.entries(config.REQUEST_CONFIG.HEADERS).forEach(([key, value]) => {
          if (key !== 'Content-Type') { // Let browser set Content-Type for FormData
            xhr.setRequestHeader(key, value);
          }
        });

        xhr.send(formData);
      });

      const result = await uploadPromise;

      if (result.error) {
        throw new Error(result.error);
      }

      setUploadState({
        isUploading: false,
        progress: 100,
        result,
        error: null,
      });

    } catch (error) {
      console.error('Upload error:', error);
      setUploadState({
        isUploading: false,
        progress: 0,
        result: null,
        error: error instanceof Error ? error.message : 'Upload failed',
      });
    }

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetUpload = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      result: null,
      error: null,
    });
  };

  const getFileIcon = (fileType?: string) => {
    switch (fileType?.toLowerCase()) {
      case 'csv':
        return <TableIcon sx={{ color: '#4CAF50' }} />;
      case 'sql':
        return <DatabaseIcon sx={{ color: '#2196F3' }} />;
      default:
        return <FileIcon sx={{ color: '#757575' }} />;
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          fontWeight={700} 
          sx={{ 
            mb: 2, 
            color: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <UploadIcon sx={{ fontSize: 40, color: '#00D4FF' }} />
          Data Upload
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Upload patient data to Web3DB using CSV or SQL files. Data will be encrypted and stored on IPFS.
        </Typography>
      </Box>

      {/* Upload Area */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              {!uploadState.result && !uploadState.error && (
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                    Select File to Upload
                  </Typography>
                  
                  {/* File Drop Zone */}
                  <Paper
                    sx={{
                      border: '2px dashed #00D4FF',
                      borderRadius: 2,
                      p: 6,
                      textAlign: 'center',
                      bgcolor: 'rgba(0, 212, 255, 0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(0, 212, 255, 0.1)',
                        borderColor: '#0099CC',
                      }
                    }}
                    onClick={handleFileSelect}
                  >
                    <UploadIcon sx={{ fontSize: 60, color: '#00D4FF', mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                      Click to Upload Data File
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Drag and drop or click to select CSV or SQL files
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Chip label="CSV Files" size="small" color="primary" variant="outlined" />
                      <Chip label="SQL Files" size="small" color="primary" variant="outlined" />
                    </Stack>
                  </Paper>

                  <input
                    type="file"
                    accept=".csv,.sql"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </Box>
              )}

              {/* Upload Progress */}
              {uploadState.isUploading && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress size={60} sx={{ color: '#00D4FF', mb: 3 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Uploading Data...
                  </Typography>
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={uploadState.progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #00D4FF 0%, #0099CC 100%)',
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {uploadState.progress.toFixed(1)}% complete
                  </Typography>
                </Box>
              )}

              {/* Success Result */}
              {uploadState.result && !uploadState.error && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <SuccessIcon sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#4CAF50' }}>
                    Upload Successful!
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {uploadState.result.message}
                  </Typography>

                  {/* Upload Summary */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                        {getFileIcon(uploadState.result.file_type)}
                        <Typography variant="body2" fontWeight={600} sx={{ mt: 1 }}>
                          File Type
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {uploadState.result.file_type?.toUpperCase()}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                        <TableIcon sx={{ color: '#2196F3' }} />
                        <Typography variant="body2" fontWeight={600} sx={{ mt: 1 }}>
                          Rows Processed
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {uploadState.result.rows_processed?.toLocaleString()}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                        <DatabaseIcon sx={{ color: '#FF9800' }} />
                        <Typography variant="body2" fontWeight={600} sx={{ mt: 1 }}>
                          Data CID
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                          {uploadState.result.data_cid?.substring(0, 8)}...
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                        <InfoIcon sx={{ color: '#9C27B0' }} />
                        <Typography variant="body2" fontWeight={600} sx={{ mt: 1 }}>
                          Indexes
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {Object.keys(uploadState.result.index_cids || {}).length} created
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                      variant="outlined"
                      onClick={() => setDetailsDialogOpen(true)}
                      startIcon={<InfoIcon />}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      onClick={resetUpload}
                      startIcon={<RefreshIcon />}
                      sx={{
                        background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                      }}
                    >
                      Upload Another File
                    </Button>
                  </Stack>
                </Box>
              )}

              {/* Error State */}
              {uploadState.error && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ErrorIcon sx={{ fontSize: 60, color: '#f44336', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#f44336' }}>
                    Upload Failed
                  </Typography>
                  <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                    {uploadState.error}
                  </Alert>
                  <Button
                    variant="contained"
                    onClick={resetUpload}
                    startIcon={<RefreshIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                    }}
                  >
                    Try Again
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Information Panel */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                📋 Supported File Formats
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <TableIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                    <Typography variant="body2" fontWeight={600}>CSV Files (.csv)</Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Comma-separated values with headers. Automatically detects columns (e.g., PatientID, HospitalID, and Age).
                  </Typography>
                </Box>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <DatabaseIcon sx={{ color: '#2196F3', fontSize: 20 }} />
                    <Typography variant="body2" fontWeight={600}>SQL Files (.sql)</Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    SQL INSERT statements or data dumps. Processed and converted to structured format.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                🔒 Security & Privacy
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  • Data is encrypted before IPFS storage
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Automatic index generation for fast queries
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Decentralized storage with content addressing
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Smart contract integration for metadata
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>Upload Details</Typography>
            <IconButton onClick={() => setDetailsDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {uploadState.result && (
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Data CID (IPFS Hash)
                </Typography>
                <Paper sx={{ p: 2, bgcolor: '#f8f9fa', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {uploadState.result.data_cid}
                </Paper>
              </Box>

              {uploadState.result.index_cids && Object.keys(uploadState.result.index_cids).length > 0 && (
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                    Index CIDs
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><Typography fontWeight={600}>Attribute</Typography></TableCell>
                          <TableCell><Typography fontWeight={600}>Index CID</Typography></TableCell>
                          <TableCell><Typography fontWeight={600}>Size</Typography></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(uploadState.result.index_cids).map(([attr, cid]) => (
                          <TableRow key={attr}>
                            <TableCell>{attr}</TableCell>
                            <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                              {cid}
                            </TableCell>
                            <TableCell>
                              {uploadState.result?.index_sizes?.[attr] || 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataUpload;