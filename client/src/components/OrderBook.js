import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  padding: 20px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  margin-bottom: 15px;
  color: #a0aec0;
  font-size: 16px;
  text-align: center;
`;

const OrderBookContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div`
  flex: 1;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${props => props.type === 'asks' ? '#ff4757' : '#00ff88'};
`;

const OrderList = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 12px;
  border-radius: 4px;
  margin: 2px 0;
  background: ${props => props.type === 'asks' 
    ? 'rgba(255, 71, 87, 0.1)' 
    : 'rgba(0, 255, 136, 0.1)'
  };
  border-left: 3px solid ${props => props.type === 'asks' ? '#ff4757' : '#00ff88'};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.type === 'asks' 
      ? 'rgba(255, 71, 87, 0.2)' 
      : 'rgba(0, 255, 136, 0.2)'
    };
  }
`;

const Price = styled.span`
  color: ${props => props.type === 'asks' ? '#ff4757' : '#00ff88'};
  font-weight: 600;
`;

const Amount = styled.span`
  color: #a0aec0;
`;

const Spread = styled.div`
  text-align: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 12px;
  color: #a0aec0;
  margin: 10px 0;
`;

const OrderBook = ({ orderBook, selectedCrypto }) => {
  if (!orderBook) {
    return (
      <Container>
        <Title>📚 Order Book</Title>
        <div style={{ textAlign: 'center', color: '#a0aec0' }}>
          Không có dữ liệu cho {selectedCrypto}
        </div>
      </Container>
    );
  }

  const { bids = [], asks = [] } = orderBook;
  
  // Tính spread
  const bestBid = bids[0]?.price || 0;
  const bestAsk = asks[0]?.price || 0;
  const spread = bestAsk - bestBid;
  const spreadPercentage = bestBid > 0 ? (spread / bestBid) * 100 : 0;

  return (
    <Container>
      <Title>📚 Order Book - {selectedCrypto}</Title>
      
      <OrderBookContent>
        <Section>
          <SectionTitle type="asks">🔴 Asks (Bán)</SectionTitle>
          <OrderList>
            {asks.slice(0, 10).map((ask, index) => (
              <OrderItem key={index} type="asks">
                <Price type="asks">${ask.price.toFixed(2)}</Price>
                <Amount>{ask.amount.toFixed(3)}</Amount>
              </OrderItem>
            ))}
          </OrderList>
        </Section>

        <Spread>
          Spread: ${spread.toFixed(2)} ({spreadPercentage.toFixed(2)}%)
        </Spread>

        <Section>
          <SectionTitle type="bids">🟢 Bids (Mua)</SectionTitle>
          <OrderList>
            {bids.slice(0, 10).map((bid, index) => (
              <OrderItem key={index} type="bids">
                <Price type="bids">${bid.price.toFixed(2)}</Price>
                <Amount>{bid.amount.toFixed(3)}</Amount>
              </OrderItem>
            ))}
          </OrderList>
        </Section>
      </OrderBookContent>
    </Container>
  );
};

export default OrderBook; 