import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../ThemeContext';

const HeaderContainer = styled.header`
  background: ${props => props.theme.colors.header};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(45deg, #00ff88, #00d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  margin: 5px 0 0 0;
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.connected ? '#00ff88' : '#ff4757'};
  animation: ${props => props.connected ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const ThemeToggle = styled.button`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.border};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Header = ({ isConnected }) => {
  const theme = useTheme();

  return (
    <HeaderContainer theme={theme}>
      <div>
        <Title>🚀 Crypto Chart Viewer</Title>
        <Subtitle theme={theme}>Xem biểu đồ giá crypto realtime từ Binance</Subtitle>
      </div>
      <RightSection>
        <ConnectionStatus theme={theme}>
          <StatusDot connected={isConnected} />
          <span>{isConnected ? 'Đã kết nối' : 'Đang kết nối...'}</span>
        </ConnectionStatus>
        <ThemeToggle theme={theme} onClick={theme.toggleTheme}>
          {theme.isDarkMode ? '☀️' : '🌙'} 
          {theme.isDarkMode ? 'Light' : 'Dark'}
        </ThemeToggle>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header; 