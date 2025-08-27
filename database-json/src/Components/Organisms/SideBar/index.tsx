import React from "react";
import {
  SideBarContainer,
  MenuTitle,
  CloseButton,
  ToggleSidebarButton,
  NavItem,
  NavList,
  StyledNavLink,
} from "./styles";

const SideBar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({
  isOpen,
  toggleSidebar,
}) => {
  return (
    <>
      <SideBarContainer isOpen={isOpen}>
        <CloseButton onClick={toggleSidebar}>
          &times; {/* This is an "X" close icon */}
        </CloseButton>
        <MenuTitle>Menu</MenuTitle>
        <NavList>
          <NavItem>
            <StyledNavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Home
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink
              to="/schema"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Schema
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink
              to="/query"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Query
            </StyledNavLink>
          </NavItem>
          {/* You can continue adding more navigation items as needed */}
        </NavList>
      </SideBarContainer>
      {!isOpen && (
        <ToggleSidebarButton onClick={toggleSidebar}>
          &#9776;
        </ToggleSidebarButton>
      )}
    </>
  );
};

export default SideBar;
