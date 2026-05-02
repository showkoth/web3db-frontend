import { NavLink } from "react-router-dom";
import styled from "styled-components";
export const SideBarContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !["isOpen"].includes(prop),
})<{ isOpen: boolean }>`
  position: fixed;
  top: 70px; /* Position below the navbar */
  left: ${({ isOpen }) => (isOpen ? "0" : "-250px")};
  height: calc(100% - 70px); /* Adjust height to account for navbar */
  width: 250px;
  background-color: #343a40;
  color: white;
  padding: 20px;
  overflow-y: auto;
  transition: left 0.3s;
  z-index: 1050; /* Below navbar but above other content */
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
`;

export const ToggleSidebarButton = styled.button`
  position: fixed;
  top: 80px; /* Position below the navbar */
  left: 0;
  background: rgba(255, 255, 255, 0.8); // Semi-transparent white
  color: #343a40; // Dark text to contrast the light background
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); // A subtle shadow to lift the button a bit
  border-radius: 0 10px 10px 0; // Rounded edges on the right side for aesthetics
  z-index: 1050;
`;

export const MenuTitle = styled.h5`
  margin-bottom: 20px;
  font-size: 1.5rem;
`;

export const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

export const NavItem = styled.li`
  margin-bottom: 10px;
`;

export const StyledNavLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  padding: 12px 18px;
  display: block;
  border-radius: 25px; // rounded corners
  transition: all 0.3s ease; // smooth transitions on hover and active states
  box-shadow: none;

  &:hover {
    background-color: #575c65; // slightly lighter than active state for distinction
    text-decoration: none;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1); // subtle shadow on hover
  }

  &.active {
    background-color: #495057;
    text-decoration: none; // removed the underline
    box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.2); // more pronounced shadow for active state
  }
`;
