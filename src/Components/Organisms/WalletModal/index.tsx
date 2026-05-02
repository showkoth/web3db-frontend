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
  Card,
  CardContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { useWeb3 } from '../../../context/Web3Context';
import { usePolicy } from '../../../context/PolicyContext';
import { WalletType } from '../../../context/Web3Context';

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onDisconnect?: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ open, onClose, onSuccess, onDisconnect }) => {
  const { connectWallet, disconnectWallet, isConnected, availableWallets, error, account, connectedWallet } = useWeb3();
  const { isLoadingPolicies, policyCount } = usePolicy();
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [selectedWallet, setSelectedWallet] = React.useState<WalletType | null>(null);

  const handleConnect = async (walletType: WalletType) => {
    setIsConnecting(true);
    setSelectedWallet(walletType);
    try {
      await connectWallet(walletType);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
      setSelectedWallet(null);
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
    setSelectedWallet(null);
    onClose();
  };

  // Get wallet display info
  const getWalletDisplayInfo = (walletType: WalletType) => {
    switch (walletType) {
      case WalletType.METAMASK:
        return { name: 'MetaMask', icon: '🦊', color: '#F6851B' };
      case WalletType.COINBASE:
        return { name: 'Coinbase Wallet', icon: '🔵', color: '#0052FF' };
      default:
        return { name: 'Wallet', icon: '💼', color: '#00D4FF' };
    }
  };

  // If already connected, show success message
  if (isConnected && account) {
    const connectedWalletInfo = connectedWallet ? getWalletDisplayInfo(connectedWallet) : { name: 'Wallet', icon: '💼', color: '#00D4FF' };
    
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
                background: `linear-gradient(135deg, ${connectedWalletInfo.color} 0%, #4CAF50 100%)`,
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
              Connected to {connectedWalletInfo.name}!
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
              {isLoadingPolicies 
                ? "Setting up your access policies..." 
                : policyCount === 0 
                  ? "Creating default access policy for demo data..." 
                  : `You're all set! Found ${policyCount} access ${policyCount === 1 ? 'policy' : 'policies'}. Now you can access all Web3DB features.`
              }
            </Typography>

            {isLoadingPolicies && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CircularProgress size={24} sx={{ color: '#00D4FF' }} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4 }}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              onClick={handleContinueToDemo} 
              variant="contained" 
              fullWidth 
              size="large"
              disabled={isLoadingPolicies}
              sx={{ 
                background: isLoadingPolicies 
                  ? 'rgba(0, 212, 255, 0.3)'
                  : 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                color: 'white',
                fontWeight: 700,
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  background: isLoadingPolicies 
                    ? 'rgba(0, 212, 255, 0.3)'
                    : 'linear-gradient(135deg, #00B8E6 0%, #0088BB 100%)',
                  transform: isLoadingPolicies ? 'none' : 'translateY(-1px)',
                  boxShadow: isLoadingPolicies ? 'none' : '0 8px 25px rgba(0, 212, 255, 0.3)'
                },
                '&:disabled': {
                  color: 'rgba(255, 255, 255, 0.7)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {isLoadingPolicies ? 'Setting up...' : 'Continue to Demo →'}
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
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              border: '3px solid rgba(0, 212, 255, 0.2)',
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 50, color: 'white' }} />
          </Box>
          
          <Typography variant="h4" fontWeight={700} color="white" gutterBottom>
            Connect to Web3DB
          </Typography>
          
          <Typography variant="body1" color="rgba(255, 255, 255, 0.8)" paragraph sx={{ mb: 4 }}>
            Choose your preferred wallet to access the demo
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

          {/* Wallet Selection Cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            {availableWallets.map((wallet) => {
              const displayInfo = getWalletDisplayInfo(wallet.type);
              const isWalletConnecting = isConnecting && selectedWallet === wallet.type;
              
              return (
                <Card
                  key={wallet.type}
                  onClick={() => !isConnecting && handleConnect(wallet.type)}
                  sx={{
                    background: wallet.installed
                      ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 153, 204, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(128, 128, 128, 0.1) 0%, rgba(96, 96, 96, 0.1) 100%)',
                    border: wallet.installed
                      ? '2px solid rgba(0, 212, 255, 0.3)'
                      : '2px solid rgba(128, 128, 128, 0.3)',
                    borderRadius: 2,
                    cursor: wallet.installed && !isConnecting ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    '&:hover': wallet.installed && !isConnecting ? {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0, 212, 255, 0.2)',
                      borderColor: 'rgba(0, 212, 255, 0.5)'
                    } : {}
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: wallet.installed
                          ? `linear-gradient(135deg, ${displayInfo.color} 0%, ${displayInfo.color}CC 100%)`
                          : 'linear-gradient(135deg, #888 0%, #666 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                      }}
                    >
                      {displayInfo.icon}
                    </Box>
                    <Box sx={{ flex: 1, textAlign: 'left' }}>
                      <Typography variant="h6" color="white" fontWeight={600}>
                        {displayInfo.name}
                      </Typography>
                      <Typography variant="body2" color={wallet.installed ? 'rgba(255, 255, 255, 0.7)' : 'rgba(128, 128, 128, 0.8)'}>
                        {wallet.installed ? 'Ready to connect' : 'Not installed'}
                      </Typography>
                    </Box>
                    <Box>
                      {isWalletConnecting ? (
                        <CircularProgress size={24} sx={{ color: displayInfo.color }} />
                      ) : wallet.installed ? (
                        <Typography color={displayInfo.color} fontWeight={600}>
                          Connect →
                        </Typography>
                      ) : (
                        <Typography color="rgba(128, 128, 128, 0.8)" fontSize="0.8rem">
                          Install
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>

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
      </DialogActions>
    </Dialog>
  );
};

export default WalletModal;
