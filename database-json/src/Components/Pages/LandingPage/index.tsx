 import React from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import Spline from "@splinetool/react-spline";
import ResponsiveAppBar from "../../Organisms/NavBar";
import WalletModal from "../../Organisms/WalletModal";
import { Avatar, Container, Grid, Link, styled } from "@mui/material";
import TaehoImage from "../../../Assets/Images/taeho.jpg";
import WenzhanImage from "../../../Assets/Images/wenzhan.jpg";
import ShowkotImage from "../../../Assets/Images/showkot.jpg";
import GustavoImage from "../../../Assets/Images/gustavo.jpg";
import HaijanImage from "../../../Assets/Images/HaijanPhoto.jpg";
import JakeImage from "../../../Assets/Images/jake.jpg";
import ChandanImage from "../../../Assets/Images/ChandanImage.jpg";
import NSFLogoURL from "../../../Assets/Images/NsfGrant.png"; // Placeholder URL for NSF logo
import NDLogoURL from "../../../Assets/Images/NotreDame.png"; // Placeholder - Replace with actual URL
import UGALogoURL from "../../../Assets/Images/UGA.png"; // Placeholder - Replace with actual URL
import LaunchIcon from "@mui/icons-material/Launch";

const teamMembers = [
  {
    name: "Gustavo Aniceto",
    role: "Lead Developer",
    university: "University of Notre Dame",
    imgUrl: GustavoImage,
    profileUrl: "https://www.linkedin.com/in/gustavoaniceto/",
  },
  {
    name: "Showkot Hossain",
    role: "Lead Developer",
    university: "University of Notre Dame",
    imgUrl: ShowkotImage,
    profileUrl:
      "https://www.linkedin.com/in/showkoth/",
  },
  {
    name: "Jake Chandler",
    role: "Lead Developer",
    university: "University of Georgia",
    imgUrl: JakeImage,
    profileUrl: "https://www.linkedin.com/in/jake-chandler-a50203219/",
  },
  {
    name: "Chandan Narayana",
    role: "Lead Developer",
    university: "University of Georgia",
    imgUrl: ChandanImage,
    profileUrl: "https://www.linkedin.com/in/chandan-narayana-53b5671a2/",
  }
];
const principalInvestigators = [
  {
    name: "Taeho Jung",
    role: "Associate Professor",
    university: "University of Notre Dame",
    imgUrl: TaehoImage,
    profileUrl: "https://sites.nd.edu/taeho-jung/",
  },
  {
    name: "WenZhan Song",
    role: "Professor",
    university: "University of Georgia",
    imgUrl: WenzhanImage,
    profileUrl: "https://sensorweb.engr.uga.edu/index.php/song/",
  },
  {
    name: "Haijian Sun",
    role: "Assistant Professor",
    university: "University of Georgia",
    imgUrl: HaijanImage,
    profileUrl: "https://esi.uga.edu/",
  },
];

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  margin: "auto",
  border: `2px solid ${theme.palette.primary.light}`,
}));

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isWalletModalOpen, setIsWalletModalOpen] = React.useState(false);
  
  const handleDemoClick = () => {
    setIsWalletModalOpen(true);
  };

  const handleWalletConnectSuccess = () => {
    console.log("MetaMask connected successfully, navigating to /query");
    setIsWalletModalOpen(false);
    // Navigate to the demo/query page after successful connection
    navigate("/query");
  };

  return (
    <Box
      sx={{
        backgroundColor: "#00020f",
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
      }}
    >
      <ResponsiveAppBar></ResponsiveAppBar>

      {!isMobile && (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              "& .spline-container": {},
            }}
          >
            <Spline
              scene="https://prod.spline.design/G-ZkNll36P6FOfVW/scene.splinecode"
              className="spline-container"
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backdropFilter: "blur(5px)",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                pointerEvents: "none",
              }}
            />
            {/* Gradient separator at bottom */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "150px",
                background: "linear-gradient(transparent, #00020f)",
                pointerEvents: "none",
                zIndex: 5
              }}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "18%",
              left: "8%",
              maxWidth: "45%",
              zIndex: 2,
              color: "white",
              pointerEvents: "none",
            }}
          >
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{
                fontFamily: "monospace",
                fontWeight: 800,
                letterSpacing: ".4rem",
                color: "inherit",
                textAlign: "left",
                fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                background: "linear-gradient(45deg, #00D4FF, #4CAF50, #FF9800)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 30px rgba(0, 212, 255, 0.5)",
                mb: 2
              }}
            >
              WEB3DB.ORG
            </Typography>
            
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ 
                textAlign: "left",
                lineHeight: 1.2,
                mb: 3,
                fontSize: { xs: "1.5rem", md: "2rem", lg: "2.5rem" },
                fontWeight: 600,
                color: "#E0E0E0"
              }}
            >
              Decentralized Zero-Trust Computing and Storage
            </Typography>

            <Typography
              variant="h6"
              gutterBottom
              sx={{ 
                my: 4, 
                textAlign: "left",
                lineHeight: 1.7,
                maxWidth: "90%",
                fontSize: { xs: "1rem", md: "1.1rem", lg: "1.25rem" },
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: 400
              }}
            >
              The core vision behind Web3DB is to restore data ownership to individuals, empowering them with fine-grained access control, secure query processing, and safe data sharing. By leveraging blockchain, IPFS, and trusted execution environments (TEEs), we are building a decentralized, unified relational database network that anyone can join and contribute to.
            </Typography>

            {/* Key Features Highlights */}
            <Box sx={{ 
              display: "flex", 
              gap: 3, 
              mb: 4, 
              flexWrap: "wrap",
              pointerEvents: "none"
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: "1.5rem" }}>🔒</Typography>
                <Typography sx={{ 
                  color: "#00D4FF", 
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", md: "1rem" }
                }}>
                  Zero-Trust Security
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: "1.5rem" }}>🌐</Typography>
                <Typography sx={{ 
                  color: "#4CAF50", 
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", md: "1rem" }
                }}>
                  Blockchain Powered
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: "1.5rem" }}>⚡</Typography>
                <Typography sx={{ 
                  color: "#FF9800", 
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", md: "1rem" }
                }}>
                  Universal SQL Interface
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Button
                variant="contained"
                onClick={handleDemoClick}
                size="large"
                sx={{
                  pointerEvents: "auto",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  background: "linear-gradient(45deg, #00D4FF 30%, #4CAF50 90%)",
                  border: "none",
                  borderRadius: 2,
                  boxShadow: "0 8px 25px rgba(0, 212, 255, 0.3)",
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(45deg, #0099CC 30%, #2E7D32 90%)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 35px rgba(0, 212, 255, 0.4)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                🚀 Try Demo
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => window.location.href = "https://docs.web3db.org/docs/intro"}
                size="large"
                sx={{
                  pointerEvents: "auto",
                  px: 3,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transform: "translateY(-2px)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                📖 Documentation
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Mobile Hero Section */}
      {isMobile && (
        <Container sx={{ py: 8, textAlign: "center" }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontFamily: "monospace",
              fontWeight: 800,
              letterSpacing: ".3rem",
              fontSize: { xs: "2rem", sm: "2.5rem" },
              background: "linear-gradient(45deg, #00D4FF, #4CAF50, #FF9800)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2
            }}
          >
            WEB3DB.ORG
          </Typography>
          
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ 
              color: "#E0E0E0",
              mb: 3,
              lineHeight: 1.3,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              fontWeight: 600
            }}
          >
            Decentralized Zero-Trust Computing and Storage
          </Typography>

          {/* Mobile Feature Highlights */}
          <Box sx={{ 
            display: "flex", 
            justifyContent: "center",
            gap: 2, 
            mb: 4, 
            flexWrap: "wrap"
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: "1.2rem" }}>🔒</Typography>
              <Typography sx={{ 
                color: "#00D4FF", 
                fontWeight: 600,
                fontSize: "0.85rem"
              }}>
                Secure
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: "1.2rem" }}>🌐</Typography>
              <Typography sx={{ 
                color: "#4CAF50", 
                fontWeight: 600,
                fontSize: "0.85rem"
              }}>
                Decentralized
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: "1.2rem" }}>⚡</Typography>
              <Typography sx={{ 
                color: "#FF9800", 
                fontWeight: 600,
                fontSize: "0.85rem"
              }}>
                Fast
              </Typography>
            </Box>
          </Box>
          
          <Typography
            variant="body1"
            sx={{ 
              color: "rgba(255, 255, 255, 0.9)",
              mb: 4,
              lineHeight: 1.6,
              textAlign: "justify",
              fontSize: { xs: "0.95rem", sm: "1rem" }
            }}
          >
            The core vision behind Web3DB is to restore data ownership to individuals, empowering them with fine-grained access control, secure query processing, and safe data sharing. By leveraging blockchain, IPFS, and trusted execution environments (TEEs), we are building a decentralized, unified relational database network that anyone can join and contribute to.
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={handleDemoClick}
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                background: "linear-gradient(45deg, #00D4FF 30%, #4CAF50 90%)",
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(45deg, #0099CC 30%, #2E7D32 90%)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              🚀 Try Demo
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => window.location.href = "https://docs.web3db.org/docs/intro"}
              sx={{
                px: 3,
                py: 1.5,
                fontSize: "0.9rem",
                color: "white",
                borderColor: "rgba(255, 255, 255, 0.3)",
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)"
                }
              }}
            >
              📖 Docs
            </Button>
          </Box>
        </Container>
      )}

      {/* Clear separator section */}
      <Box sx={{ 
        height: "100px", 
        background: "linear-gradient(to bottom, transparent, #00020f)",
        position: "relative",
        zIndex: 8
      }} />

      <Container
        sx={{
          color: "white",
          py: 8,
          maxWidth: "lg",
          textAlign: "center",
          px: { xs: 2, sm: 3, md: 4 },
          position: "relative",
          zIndex: 15,
          backgroundColor: "#00020f"
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{ 
            fontWeight: 700, 
            mb: 6, 
            textAlign: "center",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" }
          }}
        >
          Why Web3DB?
        </Typography>
        
        <Grid container spacing={4} sx={{ mb: 8, position: "relative", zIndex: 11 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              textAlign: "center", 
              p: 4,
              backgroundColor: "rgba(0, 212, 255, 0.15)",
              borderRadius: 3,
              border: "2px solid rgba(0, 212, 255, 0.4)",
              height: "100%",
              position: "relative",
              zIndex: 12,
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 15px 40px rgba(0, 212, 255, 0.3)",
                backgroundColor: "rgba(0, 212, 255, 0.2)",
              }
            }}>
              <Typography variant="h4" sx={{ mb: 3, fontSize: "3rem" }}>🔒</Typography>
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                mb: 3, 
                color: "#00D4FF",
                fontSize: { xs: "1.2rem", md: "1.5rem" }
              }}>
                Zero-Trust Security
              </Typography>
              <Typography variant="body1" sx={{ 
                lineHeight: 1.8,
                fontSize: { xs: "0.9rem", md: "1rem" }
              }}>
                Decentralized architecture with trusted execution environments ensuring your data remains end-to-end encrypted.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              textAlign: "center", 
              p: 4,
              backgroundColor: "rgba(76, 175, 80, 0.15)",
              borderRadius: 3,
              border: "2px solid rgba(76, 175, 80, 0.4)",
              height: "100%",
              position: "relative",
              zIndex: 12,
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 15px 40px rgba(76, 175, 80, 0.3)",
                backgroundColor: "rgba(76, 175, 80, 0.2)",
              }
            }}>
              <Typography variant="h4" sx={{ mb: 3, fontSize: "3rem" }}>🌐</Typography>
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                mb: 3, 
                color: "#4CAF50",
                fontSize: { xs: "1.2rem", md: "1.5rem" }
              }}>
                Blockchain Powered
              </Typography>
              <Typography variant="body1" sx={{ 
                lineHeight: 1.8,
                fontSize: { xs: "0.9rem", md: "1rem" }
              }}>
                Built on blockchain and IPFS for true data ownership, integrity verification, and censorship resistance.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              textAlign: "center", 
              p: 4,
              backgroundColor: "rgba(255, 152, 0, 0.15)",
              borderRadius: 3,
              border: "2px solid rgba(255, 152, 0, 0.4)",
              height: "100%",
              position: "relative",
              zIndex: 12,
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 15px 40px rgba(255, 152, 0, 0.3)",
                backgroundColor: "rgba(255, 152, 0, 0.2)",
              }
            }}>
              <Typography variant="h4" sx={{ mb: 3, fontSize: "3rem" }}>⚡</Typography>
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                mb: 3, 
                color: "#FF9800",
                fontSize: { xs: "1.2rem", md: "1.5rem" }
              }}>
                Universal SQL Interface
              </Typography>
              <Typography variant="body1" sx={{ 
                lineHeight: 1.8,
                fontSize: { xs: "0.9rem", md: "1rem" }
              }}>
                Easy-to-use universal SQL interface with secure query processing. Open source and extensible for all developers.
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        {/* Stats Section */}
        <Box sx={{ 
          my: 10, 
          p: 6, 
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          borderRadius: 3,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)"
        }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ 
              fontWeight: 700, 
              mb: 6, 
              textAlign: "center",
              color: "#00D4FF"
            }}
          >
            A platform that guarantees individual data ownership, privacy, and secure computation altogether.
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: "#00D4FF", mb: 1 }}>
                  100%
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  Decentralized Storage
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: "#4CAF50", mb: 1 }}>
                  Zero
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  Single Points of Failure
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: "#FF9800", mb: 1 }}>
                  SQL
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  Universal Query Interface
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: "#E91E63", mb: 1 }}>
                  TEE
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  Secured by Hardware
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Use Cases Section */}
        {/* <Box sx={{ my: 10 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ 
              fontWeight: 700, 
              mb: 6, 
              textAlign: "center",
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" }
            }}
          >
            🎯 Real-World Applications
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} lg={4}>
              <Box sx={{ 
                p: 4,
                backgroundColor: "rgba(76, 175, 80, 0.1)",
                borderRadius: 3,
                border: "2px solid rgba(76, 175, 80, 0.3)",
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 30px rgba(76, 175, 80, 0.2)",
                }
              }}>
                <Typography variant="h4" sx={{ mb: 3, fontSize: "2.5rem" }}>🏥</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#4CAF50" }}>
                  Healthcare Data Management
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6, color: "rgba(255, 255, 255, 0.9)" }}>
                  Secure patient records with fine-grained access control. Enable research while protecting privacy through zero-trust architecture.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Box sx={{ 
                p: 4,
                backgroundColor: "rgba(33, 150, 243, 0.1)",
                borderRadius: 3,
                border: "2px solid rgba(33, 150, 243, 0.3)",
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 30px rgba(33, 150, 243, 0.2)",
                }
              }}>
                <Typography variant="h4" sx={{ mb: 3, fontSize: "2.5rem" }}>🏦</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#2196F3" }}>
                  Financial Services
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6, color: "rgba(255, 255, 255, 0.9)" }}>
                  Transparent financial data with immutable audit trails. Enable compliance reporting while maintaining data sovereignty.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Box sx={{ 
                p: 4,
                backgroundColor: "rgba(156, 39, 176, 0.1)",
                borderRadius: 3,
                border: "2px solid rgba(156, 39, 176, 0.3)",
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 30px rgba(156, 39, 176, 0.2)",
                }
              }}>
                <Typography variant="h4" sx={{ mb: 3, fontSize: "2.5rem" }}>🏭</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#9C27B0" }}>
                  Supply Chain Tracking
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6, color: "rgba(255, 255, 255, 0.9)" }}>
                  End-to-end traceability with verified data integrity. Build trust through transparent and immutable supply chain records.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Box sx={{ 
                p: 4,
                backgroundColor: "rgba(255, 152, 0, 0.1)",
                borderRadius: 3,
                border: "2px solid rgba(255, 152, 0, 0.3)",
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 30px rgba(255, 152, 0, 0.2)",
                }
              }}>
                <Typography variant="h4" sx={{ mb: 3, fontSize: "2.5rem" }}>🎓</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#FF9800" }}>
                  Academic Research
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6, color: "rgba(255, 255, 255, 0.9)" }}>
                  Collaborative research data sharing with verified provenance. Enable reproducible science while protecting intellectual property.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Box sx={{ 
                p: 4,
                backgroundColor: "rgba(244, 67, 54, 0.1)",
                borderRadius: 3,
                border: "2px solid rgba(244, 67, 54, 0.3)",
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 30px rgba(244, 67, 54, 0.2)",
                }
              }}>
                <Typography variant="h4" sx={{ mb: 3, fontSize: "2.5rem" }}>🌱</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#F44336" }}>
                  IoT Data Management
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6, color: "rgba(255, 255, 255, 0.9)" }}>
                  Secure IoT sensor data collection and analysis. Enable real-time insights while ensuring data integrity and privacy.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Box sx={{ 
                p: 4,
                backgroundColor: "rgba(0, 188, 212, 0.1)",
                borderRadius: 3,
                border: "2px solid rgba(0, 188, 212, 0.3)",
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 30px rgba(0, 188, 212, 0.2)",
                }
              }}>
                <Typography variant="h4" sx={{ mb: 3, fontSize: "2.5rem" }}>🏛️</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#00BCD4" }}>
                  Government Services
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6, color: "rgba(255, 255, 255, 0.9)" }}>
                  Transparent public records with citizen privacy protection. Enable open governance while maintaining security and compliance.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box> */}

        {/* Call to Action Section */}
        <Box sx={{ 
          my: 10, 
          p: 8, 
          backgroundColor: "rgba(0, 212, 255, 0.1)",
          borderRadius: 3,
          border: "2px solid rgba(0, 212, 255, 0.3)",
          textAlign: "center",
          backdropFilter: "blur(10px)"
        }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ 
              fontWeight: 700, 
              mb: 3,
              color: "#00D4FF"
            }}
          >
            🚀 Ready to Get Started?
          </Typography>
          <Typography
            variant="h6"
            sx={{ 
              mb: 4,
              color: "rgba(255, 255, 255, 0.9)",
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.6
            }}
          >
            Join the decentralized database revolution. Experience the power of Web3DB with our interactive demo or explore our comprehensive documentation.
          </Typography>
          <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={handleDemoClick}
              size="large"
              sx={{
                px: 6,
                py: 2,
                fontSize: "1.2rem",
                fontWeight: 600,
                background: "linear-gradient(45deg, #00D4FF 30%, #4CAF50 90%)",
                borderRadius: 3,
                textTransform: "none",
                boxShadow: "0 8px 25px rgba(0, 212, 255, 0.4)",
                "&:hover": {
                  background: "linear-gradient(45deg, #0099CC 30%, #2E7D32 90%)",
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 35px rgba(0, 212, 255, 0.5)"
                },
                transition: "all 0.3s ease"
              }}
            >
              🎯 Launch Demo Now
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => window.location.href = "https://docs.web3db.org/docs/intro"}
              size="large"
              startIcon={<LaunchIcon />}
              sx={{
                px: 4,
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 500,
                color: "white",
                borderColor: "rgba(255, 255, 255, 0.5)",
                borderWidth: 2,
                borderRadius: 3,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#00D4FF",
                  backgroundColor: "rgba(0, 212, 255, 0.1)",
                  transform: "translateY(-2px)",
                  color: "#00D4FF"
                },
                transition: "all 0.3s ease"
              }}
            >
              Read Documentation
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ my: 6, borderRadius: 2, overflow: "hidden" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              p: 2,
              backgroundColor: "error.main",
              color: "white",
              textAlign: "center",
            }}
          >
            DISCLAIMER
          </Typography>
          <Typography
            variant="body2"
            sx={{
              p: 2,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              color: "black",
              textAlign: "center",
            }}
          >
            Use Web3DB at your own risk. Web3DB is a research-oriented project that evolves alongside ongoing state-of-the-art research conducted by our team. The authors, contributors, principal investigators, and affiliated parties assume no responsibility for any consequences arising from the use of this platform.
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          mt: 8, 
          mb: 6,
          fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" }
        }}>
          Meet the Team
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mb: 8 }}>
          {teamMembers.map((member) => (
            <Grid item xs={12} sm={6} md={3} key={member.name}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  p: 3,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 3,
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 30px rgba(0, 212, 255, 0.2)"
                  }
                }}
              >
                <StyledAvatar src={member.imgUrl} alt={member.name} />
                <Typography variant="h6" sx={{ textAlign: "center" }}>
                  <Link
                    href={member.profileUrl}
                    target="_blank"
                    rel="noopener"
                    sx={{ 
                      color: "white", 
                      textDecoration: "none",
                      "&:hover": { color: "#00D4FF" }
                    }}
                  >
                    {member.name}
                    <LaunchIcon sx={{ fontSize: "1rem", ml: 0.5 }} />
                  </Link>
                </Typography>
                <Typography variant="body2" sx={{ textAlign: "center", opacity: 0.8 }}>
                  {member.role}
                </Typography>
                <Typography variant="caption" sx={{ textAlign: "center", color: "#00D4FF" }}>
                  {member.university}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="h4"
          sx={{ 
            fontWeight: 700, 
            mt: 6, 
            mb: 6, 
            textAlign: "center",
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" }
          }}
        >
          Principal Investigators
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mb: 8 }}>
          {principalInvestigators.map((pi) => (
            <Grid item xs={12} sm={6} md={4} key={pi.name}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  p: 4,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 3,
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 30px rgba(76, 175, 80, 0.2)"
                  }
                }}
              >
                <StyledAvatar src={pi.imgUrl} alt={pi.name} />
                <Typography variant="h6" sx={{ textAlign: "center" }}>
                  <Link
                    href={pi.profileUrl}
                    target="_blank"
                    rel="noopener"
                    sx={{ 
                      color: "white", 
                      textDecoration: "none",
                      "&:hover": { color: "#4CAF50" }
                    }}
                  >
                    {pi.name}
                    <LaunchIcon sx={{ fontSize: "1rem", ml: 0.5 }} />
                  </Link>
                </Typography>
                <Typography variant="body2" sx={{ textAlign: "center", opacity: 0.8 }}>
                  {pi.role}
                </Typography>
                <Typography variant="caption" sx={{ textAlign: "center", color: "#4CAF50" }}>
                  {pi.university}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* NSF Grant and University Affiliations */}
        <Box sx={{ 
          mt: 8, 
          mb: 8, 
          textAlign: "center",
          p: 4,
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          borderRadius: 3,
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          <Typography variant="h4" gutterBottom sx={{ 
            fontWeight: 700,
            mb: 4,
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }
          }}>
            Supported By
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ 
            mb: 4, 
            lineHeight: 1.6,
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" }
          }}>
            This project is sponsored by NSF under Grant No. OAC-2312973 & OAC-2312974 and Cascarilla Blockchain Endowment Fund.
          </Typography>
          <Box sx={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            gap: 4,
            flexWrap: "wrap",
            mt: 4 
          }}>
            <img
              src={NSFLogoURL}
              alt="NSF Logo"
              style={{ 
                height: 80, 
                objectFit: "contain",
                filter: "brightness(0.9)"
              }}
            />
            <img
              src={NDLogoURL}
              alt="Notre Dame Logo"
              style={{ 
                height: 60, 
                objectFit: "contain",
                filter: "brightness(0.9)"
              }}
            />
            <img
              src={UGALogoURL}
              alt="UGA Logo"
              style={{ 
                height: 70, 
                objectFit: "contain",
                filter: "brightness(0.9)"
              }}
            />
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ 
          mt: 8, 
          py: 4, 
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          textAlign: "center"
        }}>
          <Typography variant="body2" sx={{ 
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "0.9rem"
          }}>
            © 2025 Web3DB. Developed and maintained by Showkot Hossain. All rights reserved.
          </Typography>
        </Box>
      </Container>
      
            <WalletModal
        open={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSuccess={handleWalletConnectSuccess}
        onDisconnect={() => setIsWalletModalOpen(false)}
      />
    </Box>
  );
};

export default LandingPage;
