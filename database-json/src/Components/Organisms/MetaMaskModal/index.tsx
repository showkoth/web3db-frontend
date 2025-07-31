import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useWeb3 } from '../../../context/Web3Context';

interface MetaMaskModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onDisconnect?: () => void;
}

const MetaMaskModal: React.FC<MetaMaskModalProps> = ({ open, onClose, onSuccess, onDisconnect }) => {
  const { connectWallet, disconnectWallet, isConnected, isMetaMaskInstalled, error, account } = useWeb3();
  const [isConnecting, setIsConnecting] = React.useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleContinueToDemo = () => {
    console.log("Continue to Demo clicked");
    if (onSuccess) {
      console.log("Calling onSuccess callback");
      onSuccess();
    } else {
      console.log("No onSuccess callback, just closing modal");
      handleClose();
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    if (onDisconnect) {
      onDisconnect();
    }
    handleClose();
  };

  const handleClose = () => {
    setIsConnecting(false);
    onClose();
  };

  // If already connected, show success message
  if (isConnected && account) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Wallet Connected</Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={2}>
            <AccountBalanceWalletIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Successfully Connected!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connected to: {account.slice(0, 6)}...{account.slice(-4)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Box sx={{ width: '100%' }}>
            <Button onClick={handleContinueToDemo} variant="contained" fullWidth sx={{ mb: 1 }}>
              Continue to Demo
            </Button>
            <Button onClick={handleDisconnect} variant="outlined" fullWidth color="error">
              Disconnect Wallet
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Connect Your Wallet</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box textAlign="center" py={2}>
          <AccountBalanceWalletIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
          
          <Typography variant="h5" gutterBottom>
            Connect to Web3DB
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            To access the Web3DB demo, you need to connect your MetaMask wallet.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
              {error}
            </Alert>
          )}

          {!isMetaMaskInstalled && (
            <Alert severity="warning" sx={{ mb: 2, textAlign: 'left' }}>
              MetaMask is not installed. You will be redirected to install MetaMask.
            </Alert>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              What you can do with your wallet:
            </Typography>
            <Box sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Access decentralized database features
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Execute secure queries
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Manage your data ownership
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Box sx={{ width: '100%' }}>
          <Button
            onClick={handleConnect}
            variant="contained"
            fullWidth
            size="large"
            disabled={isConnecting}
            startIcon={
              isConnecting ? (
                <CircularProgress size={20} />
              ) : (
                <AccountBalanceWalletIcon />
              )
            }
            sx={{ mb: 2 }}
          >
            {isConnecting
              ? 'Connecting...'
              : isMetaMaskInstalled
              ? 'Connect MetaMask'
              : 'Install & Connect MetaMask'
            }
          </Button>
          
          <Button onClick={handleClose} variant="outlined" fullWidth>
            Cancel
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default MetaMaskModal;
