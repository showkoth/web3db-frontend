 import React from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import Spline from "@splinetool/react-spline";
import ResponsiveAppBar from "../../Organisms/NavBar";
import MetaMaskModal from "../../Organisms/MetaMaskModal";
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
  const [isMetaMaskModalOpen, setIsMetaMaskModalOpen] = React.useState(false);
  
  const handleDemoClick = () => {
    setIsMetaMaskModalOpen(true);
  };

  const handleMetaMaskSuccess = () => {
    console.log("MetaMask connected successfully, navigating to /run-query");
    setIsMetaMaskModalOpen(false);
    // Navigate to the demo/query page after successful connection
    navigate("/run-query");
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
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
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
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "20%",
              left: isMobile ? "5%" : "15%",
              maxWidth: isMobile ? "90%" : "35%",
              zIndex: 2,
              color: "white",
              pointerEvents: "none",
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".5rem",
                color: "inherit",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              WEB3DB.ORG
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ textAlign: isMobile ? "center" : "left" }}
            >
              Decentralized Zero-Trust Computing and Storage
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ my: 6, textAlign: isMobile ? "center" : "left" }}
            >
              The core vision behind Web3DB is to restore data ownership to individuals, empowering them with fine-grained access control, secure query processing, and safe data sharing. By leveraging blockchain, IPFS, and trusted execution environments (TEEs), we are building a decentralized, unified relational database network that anyone can join and contribute to.
            </Typography>
            <Button
              variant="contained"
              onClick={handleDemoClick}
              sx={{
                pointerEvents: "auto",
                alignSelf: isMobile ? "center" : "flex-start",
              }}
            >
              Try Demo
            </Button>
          </Box>
        </Box>
      )}

      <Container
        sx={{
          color: "white",
          py: 8,
          mt: isMobile ? 0 : "5vh",
          maxWidth: "lg",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
        >
          Empowering Innovation with Web3DB
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Web3DB is reshaping digital sovereignty and data management through a decentralized, zero-trust approach to computing and storage. At its core, it empowers individuals and organizations with secure, autonomous data exchange by leveraging trusted execution environments (TEEs), blockchain, IPFS, and smart contracts. In this new paradigm, data ownership and privacy are not just priorities—they are foundational principles.
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Our platform stands at the forefront of the decentralized web movement, delivering robust solutions for data integrity, verification, and distribution—free from centralized control. This approach not only strengthens security and trust but also unlocks new possibilities for innovation across healthcare, AI, machine learning, and beyond. By enabling a global data marketplace, Web3DB allows developers and researchers to share insights and information securely, driving the next wave of technological breakthroughs.


        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Web3DB’s journey is defined by continuous innovation, addressing today’s most critical challenges in data security, privacy, and accessibility. We are pioneering advanced methods for secure query processing, strengthening encryption protocols, and building a more resilient and efficient network for data storage and retrieval. Our mission is to create a future where data can move freely yet remain protected—empowering users around the world to harness their data in transformative new ways.
        </Typography>
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
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 6, mb: 3 }}>
          Meet the Innovators
        </Typography>
        <Grid container spacing={5} justifyContent="center">
          {teamMembers.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.name}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <StyledAvatar src={member.imgUrl} alt={member.name} />
                <Typography variant="h6">
                  <Link
                    href={member.profileUrl}
                    target="_blank"
                    rel="noopener"
                    sx={{ color: "white" }}
                  >
                    {member.name}
                    <LaunchIcon sx={{ fontSize: "1rem", ml: 0.5 }} />
                  </Link>
                </Typography>
                <Typography variant="body2">
                  {member.role}, {member.university}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mt: 8, mb: 3, textAlign: "center" }}
        >
          Principal Investigators
        </Typography>
        <Grid container spacing={5} justifyContent="center">
          {principalInvestigators.map((pi) => (
            <Grid item xs={12} sm={6} key={pi.name}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <StyledAvatar src={pi.imgUrl} alt={pi.name} />
                <Typography variant="h6">
                  <Link
                    href={pi.profileUrl}
                    target="_blank"
                    rel="noopener"
                    sx={{ color: "white" }}
                  >
                    {pi.name}
                    <LaunchIcon sx={{ fontSize: "1rem", ml: 0.5 }} />
                  </Link>
                </Typography>
                <Typography variant="body2">
                  {pi.role}, {pi.university}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* NSF Grant and University Affiliations */}
        <Box sx={{ mt: 12, mb: 8, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            NSF Grant, Cascarilla Blockchain Endowment Fund, and University
            Affiliations
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
          This project is sponsored by NSF under Grant No. OAC-2312973 & OAC-2312974 and Cascarilla Blockchain Endowment Fund.
            {/* Placeholder for NSF logo */}
          </Typography>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <img
              src={NSFLogoURL}
              alt="NSF Logo"
              style={{ width: 100, margin: 10 }}
            />
            {/* Add Notre Dame and UGA logos using NDLogoURL and UGALogoURL */}
            <img
              src={NDLogoURL}
              alt="Notre Dame Logo"
              style={{ width: 300, margin: 10 }}
            />
            <img
              src={UGALogoURL}
              alt="UGA Logo"
              style={{ width: 200, margin: 10 }}
            />
          </Box>
        </Box>
      </Container>

      <Box sx={{ textAlign: "center", py: 8 }}>
        <Button
          variant="contained"
          onClick={handleDemoClick}
          sx={{
            pointerEvents: "auto",
            backgroundColor: theme.palette.primary.main,
          }}
        >
          Explore Web3DB
        </Button>
      </Box>
      
      <MetaMaskModal
        open={isMetaMaskModalOpen}
        onClose={() => setIsMetaMaskModalOpen(false)}
        onSuccess={handleMetaMaskSuccess}
        onDisconnect={() => setIsMetaMaskModalOpen(false)}
      />
    </Box>
  );
};

export default LandingPage;
