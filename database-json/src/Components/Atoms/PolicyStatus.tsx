import React from 'react';
import { Box, Typography, Chip, Alert, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { usePolicy } from '../../context/PolicyContext';
import { useWeb3 } from '../../context/Web3Context';

const PolicyStatus: React.FC = () => {
  const { isConnected, account } = useWeb3();
  const { policyCount, isLoadingPolicies, policyError } = usePolicy();

  if (!isConnected) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Policy Status
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 1 }}>
        <Chip 
          label={`Wallet: ${account?.slice(0, 6)}...${account?.slice(-4)}`} 
          size="small" 
          variant="outlined" 
        />
        <Chip 
          label={`Policies: ${policyCount ?? 0}`} 
          size="small" 
          color={(policyCount ?? 0) > 0 ? 'success' : 'default'}
        />
        {isLoadingPolicies && (
          <Chip 
            label="Loading..." 
            size="small" 
            color="info" 
          />
        )}
        <Button
          component={RouterLink}
          to="/policies"
          size="small"
          variant="outlined"
          color="primary"
          sx={{ ml: 'auto' }}
        >
          🔒 Manage Policies
        </Button>
      </Box>

      {policyError && (
        <Alert severity="warning" sx={{ mt: 1 }}>
          Policy Error: {policyError}
        </Alert>
      )}
      
      {(policyCount ?? 0) === 0 && !isLoadingPolicies && !policyError && (
        <Alert severity="info" sx={{ mt: 1 }}>
          No policies found. Visit the{' '}
          <Button
            component={RouterLink}
            to="/policies"
            size="small"
            variant="text"
            sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
          >
            Policy Management
          </Button>
          {' '}page to create access policies.
        </Alert>
      )}
    </Box>
  );
};

export default PolicyStatus;
