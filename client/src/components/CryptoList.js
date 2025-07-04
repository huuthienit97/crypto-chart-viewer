import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../ThemeContext';
import CryptoNews from './CryptoNews';

const Container = styled.div`
  background: ${props => props.theme.colors.card};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
`;

const Title = styled.h3`
  margin-bottom: 15px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 16px;
  text-align: center;
`;

const CryptoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
`;

const CryptoItem = styled.div`
  background: ${props => props.selected ? props.theme.colors.primary + '20' : props.theme.colors.surface};
  border: 1px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary + '15'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CryptoName = styled.div`
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
  color: ${props => props.theme.colors.text};
`;

const CryptoPrice = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
  margin-bottom: 2px;
`;

const CryptoChange = styled.div`
  font-size: 11px;
  color: ${props => props.positive ? props.theme.colors.primary : props.theme.colors.secondary};
`;

const CryptoList = ({ cryptoData, selectedCrypto, onSelectCrypto }) => {
  const theme = useTheme();
  
  // Danh sách tất cả crypto có sẵn
  const allCryptos = [
    'BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'DOT', 'LINK', 'MATIC',
    'XRP', 'DOGE', 'AVAX', 'UNI', 'LTC', 'BCH', 'ATOM', 'NEAR',
    'ALGO', 'VET', 'ICP', 'FIL'
  ];

  return (
    <>
      <Container theme={theme}>
        <Title theme={theme}>📊 Danh sách Crypto</Title>
        <CryptoGrid>
          {allCryptos.map(crypto => {
            const data = cryptoData[crypto];
            const isSelected = selectedCrypto === crypto;
            
            return (
              <CryptoItem
                key={crypto}
                selected={isSelected}
                theme={theme}
                onClick={() => onSelectCrypto(crypto)}
              >
                <CryptoName theme={theme}>{crypto}</CryptoName>
                <CryptoPrice theme={theme}>
                  ${data?.price ? data.price.toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  }) : '0.00'}
                </CryptoPrice>
                <CryptoChange positive={data?.change24h >= 0} theme={theme}>
                  {data?.change24h ? (data.change24h >= 0 ? '+' : '') + data.change24h.toFixed(2) + '%' : '0.00%'}
                </CryptoChange>
              </CryptoItem>
            );
          })}
        </CryptoGrid>
      </Container>
      <CryptoNews />
    </>
  );
};

export default CryptoList; 