import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import MenuIcon from "@mui/icons-material/Menu";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../../../context/Web3Context";
import MetaMaskModal from "../MetaMaskModal";
import Web3DBLogo from "../Web3DBLogo";

const pages = ["Home", "Demo", "Documentation"];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [isMetaMaskModalOpen, setIsMetaMaskModalOpen] = React.useState(false);
  const [anchorElWallet, setAnchorElWallet] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { isConnected, account, disconnectWallet } = useWeb3();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenWalletMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElWallet(event.currentTarget);
  };

  const handleCloseWalletMenu = () => {
    setAnchorElWallet(null);
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    handleCloseWalletMenu();
  };

  const handlePageClick = (page: string) => {
    if (page === "Documentation") {
      window.location.href = "https://docs.web3db.org/docs/intro";
    }
    if (page === "Demo") {
      if (isConnected) {
        // If already connected, go directly to the query page
        navigate("/run-query");
      } else {
        // If not connected, show MetaMask modal
        setIsMetaMaskModalOpen(true);
      }
    }
    if (page === "Home") {
      navigate("/");
    }
    // Handle other page navigations if necessary
    handleCloseNavMenu();
  };

  const handleMetaMaskSuccess = () => {
    setIsMetaMaskModalOpen(false);
    // Navigate to the demo/query page after successful connection
    navigate("/run-query");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "transparent" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Web3DBLogo sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} size={32} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            onClick={() => navigate("/")}
            sx={{
              mr: 3,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8
              }
            }}
          >
            WEB3DB
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handlePageClick(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Web3DBLogo sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} size={28} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            onClick={() => navigate("/")}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8
              }
            }}
          >
            WEB3DB
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handlePageClick(page)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Wallet Status */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
            {isConnected ? (
              <>
                <Chip
                  icon={<AccountBalanceWalletIcon />}
                  label={`${account?.slice(0, 6)}...${account?.slice(-4)}`}
                  variant="outlined"
                  onClick={handleOpenWalletMenu}
                  sx={{ 
                    color: "white", 
                    borderColor: "white",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)"
                    }
                  }}
                />
                <Menu
                  anchorEl={anchorElWallet}
                  open={Boolean(anchorElWallet)}
                  onClose={handleCloseWalletMenu}
                >
                  <MenuItem onClick={handleDisconnectWallet}>
                    Disconnect Wallet
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                onClick={() => setIsMetaMaskModalOpen(true)}
                variant="outlined"
                startIcon={<AccountBalanceWalletIcon />}
                sx={{ 
                  color: "white", 
                  borderColor: "white",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)"
                  }
                }}
              >
                Connect Wallet
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      <MetaMaskModal
        open={isMetaMaskModalOpen}
        onClose={() => setIsMetaMaskModalOpen(false)}
        onSuccess={handleMetaMaskSuccess}
        onDisconnect={() => setIsMetaMaskModalOpen(false)}
      />
    </AppBar>
  );
}
export default ResponsiveAppBar;
