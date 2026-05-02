import styled from "styled-components";
const PageWrapper = styled.div`
  background-color: #f0f2f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
`;

const HeroSection = styled.section`
  text-align: center;
`;

const Tagline = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 2rem;
`;

export const StyledButton = styled.button`
  background-color: #4caf50; // Default background color
  color: white;
  padding: 15px 32px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.3);
  }

  &:last-child {
    background-color: #008cba;
    &:hover {
      background-color: #007b9a;
    }
  }
`;

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
  color: #333;
  font-family: "Arial", sans-serif;
  text-align: center;
  padding: 20px;
`;
export const InfoSection = styled.div`
  margin-top: 20px;
`;
const Title = styled.h2`
  font-size: 3.5rem;
  color: #007b9a; /* Example  */
  margin-bottom: 1rem;
`;
export const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f2f5;
`;

export const Section = styled.section`
  margin: 20px 0;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;
