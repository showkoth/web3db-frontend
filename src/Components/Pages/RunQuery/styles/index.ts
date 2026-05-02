import styled from "styled-components";
import { Button, Container, Dropdown } from "react-bootstrap";

export const QueryContainer = styled(Container)`
  padding: 40px;
  border-radius: 10px;
  background-color: #f6f9fc; // Add a subtle background color
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
`;

export const StyledButton = styled(Button as any)`
  width: 150px;
  font-size: 16px;
  background-color: #007bff; // Default color
  border: none;

  &:hover {
    background-color: #0056b3; // Darker shade on hover
    transform: translateY(-2px); // Lift the button a bit for a dynamic effect
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }

  &:active {
    background-color: #004085; // Even darker shade on active
  }
`;

export const StyledDropdown = styled(Dropdown)`
  .btn-secondary {
    background-color: #2e43587c; // Slightly grayish background
    border: none;

    &:hover {
      background-color: #ced4da; // Darker on hover
    }

    &:focus,
    &:active {
      box-shadow: none; // Remove the default blue outline on focus/active
    }
  }
`;
