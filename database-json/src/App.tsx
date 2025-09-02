import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import RunQuery from "./Components/Pages/RunQuery";
import SeeTables from "./Components/Pages/SeeTables";
import { SqlProvider } from "./context/SqlContext";
import { Web3Provider } from "./context/Web3Context";
import { PolicyProvider } from "./context/PolicyContext";
import SideBar from "./Components/Organisms/SideBar";
import ResponsiveAppBar from "./Components/Organisms/NavBar";
import LandingPage from "./Components/Pages/LandingPage";
interface MainLayoutProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  children: React.ReactNode;
}

// Layout component with sidebar and navbar
const MainLayout: React.FC<MainLayoutProps> = ({
  toggleSidebar,
  isSidebarOpen,
  children,
}) => {
  const ContentContainer = styled.div`
    margin-left: ${isSidebarOpen ? "250px" : "0"};
    transition: margin-left 0.3s;
    padding-top: 70px; /* Add space for fixed navbar */
  `;

  const NavBarContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1100;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
  `;

  return (
    <>
      <NavBarContainer>
        <ResponsiveAppBar />
      </NavBarContainer>
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <ContentContainer>
        {children}
      </ContentContainer>
    </>
  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="App">
        <Web3Provider>
          <PolicyProvider>
            <SqlProvider>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route 
                  path="/query" 
                  element={
                    <MainLayout
                      toggleSidebar={toggleSidebar}
                      isSidebarOpen={isSidebarOpen}
                    >
                      <RunQuery />
                    </MainLayout>
                  } 
                />
                <Route 
                  path="/schema" 
                  element={
                    <MainLayout
                      toggleSidebar={toggleSidebar}
                      isSidebarOpen={isSidebarOpen}
                    >
                      <SeeTables />
                    </MainLayout>
                  } 
                />
                <Route
                  path="*"
                  element={
                    <MainLayout
                      toggleSidebar={toggleSidebar}
                      isSidebarOpen={isSidebarOpen}
                    >
                      <RunQuery />
                    </MainLayout>
                  }
                />
              </Routes>
            </SqlProvider>
          </PolicyProvider>
        </Web3Provider>
      </div>
    </Router>
  );
}

export default App;
