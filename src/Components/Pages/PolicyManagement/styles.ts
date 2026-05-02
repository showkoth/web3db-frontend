import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 70px);
`;

export const PolicyHeader = styled.div`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 123, 255, 0.2);

  h2 {
    margin: 0 0 10px 0;
    font-size: 2rem;
    font-weight: 600;
  }

  p {
    margin: 5px 0;
    opacity: 0.9;
    font-size: 1.1rem;
  }
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

export const StatsCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;

  h4 {
    font-size: 2.5rem;
    margin: 0 0 10px 0;
    color: #007bff;
    font-weight: 700;
  }

  p {
    margin: 0;
    color: #6c757d;
    font-size: 1rem;
    font-weight: 500;
  }
`;

export const PolicyCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;

  h3 {
    margin: 0 0 20px 0;
    color: #343a40;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

export const PolicyContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007bff;
`;

export const PolicyItem = styled.div`
  margin-bottom: 15px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const PolicyIndex = styled.div`
  background: #007bff;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
`;

export const PolicyTable = styled.div`
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
  font-size: 14px;
`;

export const PolicySql = styled.div`
  font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
  background: white;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  font-size: 13px;
  line-height: 1.4;
  color: #495057;
  word-break: break-all;
`;

export const CreatePolicyForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-weight: 600;
  color: #495057;
  font-size: 14px;
`;

export const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

export const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }
`;

export const Button = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: #0056b3;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const DeleteButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: #c82333;
    transform: scale(1.05);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

export const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
  font-weight: 500;
`;

export const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #c3e6cb;
  font-weight: 500;
`;

// Enhanced Success Modal/Popup
export const SuccessModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 2000;
  min-width: 400px;
  text-align: center;
  animation: slideInScale 0.3s ease-out;

  @keyframes slideInScale {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1999;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #28a745, #20c997);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 40px;
  color: white;
  animation: bounceIn 0.5s ease-out 0.2s both;

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const ModalTitle = styled.h3`
  color: #28a745;
  margin: 0 0 15px 0;
  font-size: 1.8rem;
  font-weight: 600;
`;

export const ModalMessage = styled.p`
  color: #6c757d;
  margin: 0 0 30px 0;
  font-size: 1.1rem;
  line-height: 1.5;
`;

export const ModalButton = styled.button`
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Toast Notification (Alternative to Modal)
export const ToastContainer = styled.div`
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Toast = styled.div<{ type: 'success' | 'error' }>`
  background: ${props => props.type === 'success' 
    ? 'linear-gradient(135deg, #28a745, #20c997)' 
    : 'linear-gradient(135deg, #dc3545, #c82333)'};
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  min-width: 300px;
  animation: slideInRight 0.3s ease-out;

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

export const ToastIcon = styled.div`
  font-size: 20px;
  animation: bounceIn 0.5s ease-out 0.1s both;

  @keyframes bounceIn {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export const ToastMessage = styled.div`
  flex: 1;
  font-size: 14px;
`;

export const ToastCloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.8;
  padding: 0;
  margin: 0;
  line-height: 1;

  &:hover {
    opacity: 1;
  }
`;

export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const PolicyList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;

  h3 {
    margin-bottom: 15px;
    color: #495057;
  }

  p {
    margin: 10px 0;
    font-size: 1.1rem;
  }
`;

export const ExampleQueries = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;

  h4 {
    margin: 0 0 15px 0;
    color: #495057;
    font-size: 1.2rem;
  }
`;

export const ExampleQuery = styled.div`
  margin-bottom: 15px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid #dee2e6;

  p {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #495057;
  }

  code {
    display: block;
    font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
    background: #f8f9fa;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    color: #495057;
    border: 1px solid #e9ecef;
    margin-bottom: 8px;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;
