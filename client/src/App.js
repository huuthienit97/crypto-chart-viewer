import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import { ThemeProvider, useTheme } from './ThemeContext';
import Header from './components/Header';
import CryptoList from './components/CryptoList';
import TradingChart from './components/TradingChart';

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: all 0.3s ease;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  height: calc(100vh - 80px);
`;

const LeftPanel = styled.div`
  background: ${props => props.theme.colors.card};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
`;

const CenterPanel = styled.div`
  background: ${props => props.theme.colors.card};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
`;

function AppContent() {
  const [isConnected, setIsConnected] = useState(false);
  const [cryptoData, setCryptoData] = useState({});
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const theme = useTheme();

  useEffect(() => {
    const newSocket = io('http://localhost:5001');

    newSocket.on('connect', () => {
      console.log('Đã kết nối với server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Đã ngắt kết nối với server');
      setIsConnected(false);
    });

    newSocket.on('cryptoUpdate', (data) => {
      setCryptoData(data);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <AppContainer theme={theme}>
      <Header isConnected={isConnected} />
      <MainContent>
        <LeftPanel theme={theme}>
          <CryptoList 
            cryptoData={cryptoData} 
            selectedCrypto={selectedCrypto}
            onSelectCrypto={setSelectedCrypto}
          />
        </LeftPanel>
        
        <CenterPanel theme={theme}>
          <TradingChart 
            selectedCrypto={selectedCrypto}
            cryptoData={cryptoData}
          />
        </CenterPanel>
      </MainContent>
    </AppContainer>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App; 