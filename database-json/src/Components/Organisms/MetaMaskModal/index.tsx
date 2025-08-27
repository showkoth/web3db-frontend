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
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
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
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight={700} color="white">
              🎉 Wallet Connected
            </Typography>
            <IconButton onClick={handleClose} size="small" sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 4, pb: 2 }}>
          <Box textAlign="center" py={3}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00D4FF 0%, #4CAF50 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 0 30px rgba(0, 212, 255, 0.6)'
                }
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            
            <Typography variant="h4" fontWeight={700} color="white" gutterBottom>
              Successfully Connected!
            </Typography>
            
            <Chip
              label={`${account.slice(0, 8)}...${account.slice(-6)}`}
              sx={{
                background: 'rgba(0, 212, 255, 0.1)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                color: '#00D4FF',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                fontWeight: 600,
                mb: 3
              }}
            />
            
            <Typography variant="body1" color="rgba(255, 255, 255, 0.8)" sx={{ mb: 3 }}>
              You're all set! Now you can access all Web3DB features.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4 }}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              onClick={handleContinueToDemo} 
              variant="contained" 
              fullWidth 
              size="large"
              sx={{ 
                background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                color: 'white',
                fontWeight: 700,
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #00B8E6 0%, #0088BB 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 25px rgba(0, 212, 255, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Continue to Demo →
            </Button>
            <Button 
              onClick={handleDisconnect} 
              variant="outlined" 
              fullWidth
              sx={{ 
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'rgba(255, 255, 255, 0.7)',
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  borderColor: 'rgba(255, 87, 87, 0.5)',
                  backgroundColor: 'rgba(255, 87, 87, 0.1)',
                  color: '#FF5757'
                }
              }}
            >
              Disconnect Wallet
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          minHeight: '500px'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={700} color="white">
            Connect Your Wallet
          </Typography>
          <IconButton onClick={handleClose} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 4 }}>
        <Box textAlign="center" py={2}>
          {/* MetaMask Logo/Icon */}
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #F6851B 0%, #E2761B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              border: '3px solid rgba(246, 133, 27, 0.2)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: -2,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #F6851B, #E2761B, #00D4FF)',
                zIndex: -1,
              }
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 50, color: 'white' }} />
          </Box>
          
          <Typography variant="h4" fontWeight={700} color="white" gutterBottom>
            Connect to Web3DB
          </Typography>
          
          <Typography variant="body1" color="rgba(255, 255, 255, 0.8)" paragraph sx={{ mb: 4 }}>
            To access the demo, you need to connect your Web3 wallet.
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                textAlign: 'left',
                backgroundColor: 'rgba(255, 87, 87, 0.1)',
                border: '1px solid rgba(255, 87, 87, 0.3)',
                color: '#FF5757',
                borderRadius: 2
              }}
            >
              {error}
            </Alert>
          )}

          {!isMetaMaskInstalled && (
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 3, 
                textAlign: 'left',
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                border: '1px solid rgba(255, 193, 7, 0.3)',
                color: '#FFC107',
                borderRadius: 2
              }}
            >
              MetaMask is not installed. You will be redirected to install MetaMask.
            </Alert>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" color="white" sx={{ mb: 3, fontWeight: 600 }}>
              What you can do with your wallet:
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 450, mx: 'auto' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'left', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <StorageIcon sx={{ fontSize: 20, color: 'white' }} />
                </Box>
                <Typography variant="body1" color="rgba(255, 255, 255, 0.9)">
                  Access decentralized database features
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'left', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <QueryStatsIcon sx={{ fontSize: 20, color: 'white' }} />
                </Box>
                <Typography variant="body1" color="rgba(255, 255, 255, 0.9)">
                  Execute secure queries
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'left', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 20, color: 'white' }} />
                </Box>
                <Typography variant="body1" color="rgba(255, 255, 255, 0.9)">
                  Manage your data ownership
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 4 }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            onClick={handleConnect}
            variant="contained"
            fullWidth
            size="large"
            disabled={isConnecting}
            startIcon={
              isConnecting ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                <AccountBalanceWalletIcon />
              )
            }
            sx={{ 
              background: isConnecting 
                ? 'rgba(0, 212, 255, 0.3)'
                : 'linear-gradient(135deg, #F6851B 0%, #E2761B 100%)',
              color: 'white',
              fontWeight: 700,
              py: 1.8,
              fontSize: '1.1rem',
              textTransform: 'none',
              borderRadius: 2,
              border: '2px solid rgba(246, 133, 27, 0.3)',
              '&:hover': {
                background: isConnecting 
                  ? 'rgba(0, 212, 255, 0.3)'
                  : 'linear-gradient(135deg, #E2761B 0%, #D2691E 100%)',
                transform: isConnecting ? 'none' : 'translateY(-2px)',
                boxShadow: isConnecting ? 'none' : '0 8px 25px rgba(246, 133, 27, 0.4)'
              },
              '&:disabled': {
                color: 'rgba(255, 255, 255, 0.7)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {isConnecting
              ? 'Connecting...'
              : isMetaMaskInstalled
              ? '🦊 Connect MetaMask'
              : '🦊 Install & Connect MetaMask'
            }
          </Button>
          
          <Button 
            onClick={handleClose} 
            variant="outlined" 
            fullWidth
            sx={{ 
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'rgba(255, 255, 255, 0.7)',
              textTransform: 'none',
              borderRadius: 2,
              py: 1.2,
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'white'
              }
            }}
          >
            Cancel
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default MetaMaskModal;
