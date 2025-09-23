import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Lock as LockIcon,
  DataUsage as DataUsageIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { buildApiUrl } from '../../../config/config';

interface DataAccessVisualizationProps {
  currentResultsCount?: number;
  isQueryExecuted?: boolean;
}

interface TotalDataResponse {
  status: string;
  total_rows: number;
  cids_processed: number;
  index_used: string;
}

const DataAccessVisualization: React.FC<DataAccessVisualizationProps> = ({
  currentResultsCount = 0,
  isQueryExecuted = false,
}) => {
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  const fetchTotalRowCount = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        buildApiUrl('/query/count'),
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TotalDataResponse = await response.json();
      setTotalRows(data.total_rows);
      setHasFetched(true);
    } catch (err) {
      console.error('Error fetching total row count:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch total data count');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      fetchTotalRowCount();
    }
  }, [hasFetched]);

  const calculateAccessPercentage = () => {
    const safeTotal = totalRows || 0;
    const safeCount = currentResultsCount || 0;
    if (safeTotal === 0) return 0;
    return Math.min((safeCount / safeTotal) * 100, 100);
  };

  const accessPercentage = calculateAccessPercentage();
  const restrictedCount = Math.max((totalRows || 0) - (currentResultsCount || 0), 0);

  const getAccessLevel = () => {
    if (accessPercentage === 0) return { label: 'No Access', color: '#f44336', icon: <VisibilityOffIcon /> };
    if (accessPercentage < 25) return { label: 'Limited Access', color: '#ff9800', icon: <LockIcon /> };
    if (accessPercentage < 75) return { label: 'Partial Access', color: '#2196f3', icon: <SecurityIcon /> };
    return { label: 'Full Access', color: '#4caf50', icon: <VisibilityIcon /> };
  };

  const accessLevel = getAccessLevel();

  if (loading) {
    return (
      <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <CircularProgress size={30} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Loading data access information...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="warning" 
        sx={{ borderRadius: 2, mb: 2 }}
        action={
          <Chip 
            label="Retry" 
            size="small" 
            onClick={fetchTotalRowCount}
            sx={{ cursor: 'pointer' }}
          />
        }
      >
        <Typography variant="body2">
          Unable to fetch total data count: {error}
        </Typography>
      </Alert>
    );
  }

  return (
    <Card sx={{ 
      borderRadius: 2, 
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(0, 153, 204, 0.05) 100%)'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <DataUsageIcon sx={{ color: '#00D4FF', mr: 1, fontSize: 28 }} />
          <Typography variant="h6" fontWeight={600}>
            Data Access Control Overview
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Access Level Indicator */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 1,
                color: accessLevel.color
              }}>
                {accessLevel.icon}
                <Typography 
                  variant="h4" 
                  fontWeight={700} 
                  sx={{ ml: 1, color: accessLevel.color }}
                >
                  {accessPercentage.toFixed(1)}%
                </Typography>
              </Box>
              <Chip
                label={accessLevel.label}
                size="small"
                sx={{
                  bgcolor: `${accessLevel.color}15`,
                  color: accessLevel.color,
                  fontWeight: 600
                }}
              />
            </Box>
          </Grid>

          {/* Progress Visualization */}
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  Accessible Data
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(currentResultsCount || 0).toLocaleString()} / {(totalRows || 0).toLocaleString()} records
                </Typography>
              </Box>
              
              <Tooltip title={`You can access ${accessPercentage.toFixed(1)}% of the total data`}>
                <LinearProgress
                  variant="determinate"
                  value={accessPercentage}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 6,
                      background: `linear-gradient(90deg, ${accessLevel.color} 0%, ${accessLevel.color}CC 100%)`,
                    },
                  }}
                />
              </Tooltip>
            </Box>

            {/* Data Breakdown */}
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip
                icon={<VisibilityIcon />}
                label={`${(currentResultsCount || 0).toLocaleString()} Accessible`}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(76, 175, 80, 0.1)', 
                  color: '#4CAF50',
                  fontWeight: 600
                }}
              />
              <Chip
                icon={<LockIcon />}
                label={`${(restrictedCount || 0).toLocaleString()} Restricted`}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(244, 67, 54, 0.1)', 
                  color: '#f44336',
                  fontWeight: 600
                }}
              />
            </Stack>
          </Grid>
        </Grid>

        {/* Information Banner */}
        {isQueryExecuted && (
          <Alert 
            severity="info" 
            sx={{ 
              mt: 3, 
              borderRadius: 2,
              backgroundColor: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.3)'
            }}
          >
            <Typography variant="body2">
              <strong>Access Control Active:</strong> Due to your wallet's access policies, 
              you can currently view {(currentResultsCount || 0).toLocaleString()} out of {(totalRows || 0).toLocaleString()} total records 
              ({accessPercentage.toFixed(1)}% of available data).
            </Typography>
          </Alert>
        )}

        {!isQueryExecuted && totalRows > 0 && (
          <Alert 
            severity="warning" 
            sx={{ 
              mt: 3, 
              borderRadius: 2,
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              border: '1px solid rgba(255, 152, 0, 0.3)'
            }}
          >
            <Typography variant="body2">
              <strong>Ready to Query:</strong> The database contains {(totalRows || 0).toLocaleString()} total records. 
              Run a query to see what data your wallet can access.
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default DataAccessVisualization;
