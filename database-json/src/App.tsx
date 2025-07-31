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
import SideBar from "./Components/Organisms/SideBar";
import LandingPage from "./Components/Pages/LandingPage";
interface MainLayoutProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// Layout component with sidebar
const MainLayout: React.FC<MainLayoutProps> = ({
  toggleSidebar,
  isSidebarOpen,
}) => {
  const ContentContainer = styled.div`
    margin-left: ${isSidebarOpen ? "250px" : "0"};
    transition: margin-left 0.3s;
  `;

  return (
    <>
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <ContentContainer>
        <Routes>
          <Route path="/run-query" element={<RunQuery />} />
          <Route path="/see-table" element={<SeeTables />} />
          <Route path="*" element={<RunQuery />} />
        </Routes>
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
          <SqlProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route 
                path="/run-query" 
                element={
                  <MainLayout
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                  />
                } 
              />
              <Route 
                path="/see-table" 
                element={
                  <MainLayout
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                  />
                } 
              />
              <Route
                path="*"
                element={
                  <MainLayout
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                  />
                }
              />
            </Routes>
          </SqlProvider>
        </Web3Provider>
      </div>
    </Router>
  );
}

export default App;
