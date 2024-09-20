 import React from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import Spline from "@splinetool/react-spline";
import ResponsiveAppBar from "../../Organisms/NavBar";
import { Avatar, Container, Grid, Link, styled } from "@mui/material";
import TaehoImage from "../../../Assets/Images/taeho.jpg";
import WenzhanImage from "../../../Assets/Images/wenzhan.jpg";
import ShowkotImage from "../../../Assets/Images/showkkot.jpg";
import GustavoImage from "../../../Assets/Images/gustavo.jpg";
import HaijanImage from "../../../Assets/Images/HaijanPhoto.jpg";
import JakeImage from "../../../Assets/Images/jake.jpg";
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

  const handleNormalRoute = () => navigate("/run-query");
  const handleMetaMaskRoute = () => {
    window.location.href = "https://metamask.web3db.org";
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
              The fundamental vision behind Web3DB is to return data ownership
              to the owner, enabling secure data sharing and fostering AI
              innovation. Utilizing spark nodes and IPFS, we are building a
              decentralized network for query processing without centralized
              coordination, with upcoming features like decentralized access
              control with encryption.
            </Typography>
            <Button
              variant="contained"
              onClick={handleMetaMaskRoute}
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
          Web3DB is redefining the landscape of digital sovereignty and data
          management through its commitment to decentralized, zero-trust
          computing and storage frameworks. At its core, Web3DB leverages
          advanced decentralized technologies to enable secure, autonomous data
          exchanges that empower individuals and organizations alike. By
          harnessing the power of blockchain, IPFS, and smart contract
          protocols, Web3DB introduces a new paradigm where data ownership and
          privacy are not just priorities but foundational principles.
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Our platform stands at the vanguard of the decentralized web movement,
          providing robust solutions for data integrity, verification, and
          distribution without reliance on centralized authorities. This not
          only enhances security and trust but also opens up unprecedented
          opportunities for innovation in AI, machine learning, and beyond.
          Through Web3DB, developers and researchers can access a global data
          marketplace, where insights and information are shared freely yet
          securely, catalyzing a new wave of technological advancements and
          applications.
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          The journey of Web3DB is marked by constant innovation, aiming to
          tackle some of the most pressing challenges in data security, privacy,
          and accessibility today. We are pioneering methods to streamline
          decentralized query processing, enhance data encryption protocols, and
          create a more resilient, efficient network for data storage and
          retrieval. Our mission is to build a future where data can move freely
          yet remain protected, empowering users worldwide to leverage their
          data in ways never before possible.
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
            Use Web3DB at your own risk. Web3DB is a research-purpose project
            that evolves and improves with state-of-the-art research conducted
            by the team. None of the authors, contributors, principal
            investigators, or anyone else connected with the team, in any way
            whatsoever, can be responsible for your use of the our platform.
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
          onClick={handleMetaMaskRoute}
          sx={{
            pointerEvents: "auto",
            backgroundColor: theme.palette.primary.main,
          }}
        >
          Explore Web3DB
        </Button>
      </Box>
    </Box>
  );
};

export default LandingPage;
