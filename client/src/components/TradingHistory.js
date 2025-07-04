import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  padding: 20px;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  margin-bottom: 15px;
  color: #a0aec0;
  font-size: 16px;
`;

const HistoryList = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 300px;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-left: 3px solid ${props => props.type === 'buy' ? '#00ff88' : '#ff4757'};
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const OrderInfo = styled.div`
  flex: 1;
`;

const OrderType = styled.div`
  font-weight: bold;
  color: ${props => props.type === 'buy' ? '#00ff88' : '#ff4757'};
  font-size: 14px;
`;

const OrderDetails = styled.div`
  font-size: 12px;
  color: #a0aec0;
  margin-top: 4px;
`;

const OrderStatus = styled.div`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  margin-left: 10px;
  background: ${props => {
    switch (props.status) {
      case 'completed': return 'rgba(0, 255, 136, 0.2)';
      case 'cancelled': return 'rgba(255, 71, 87, 0.2)';
      default: return 'rgba(255, 193, 7, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'completed': return '#00ff88';
      case 'cancelled': return '#ff4757';
      default: return '#ffc107';
    }
  }};
`;

const CancelButton = styled.button`
  background: rgba(255, 71, 87, 0.2);
  border: 1px solid rgba(255, 71, 87, 0.3);
  color: #ff4757;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 10px;
  
  &:hover {
    background: rgba(255, 71, 87, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #a0aec0;
  padding: 40px 20px;
  font-size: 14px;
`;

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const TradingHistory = ({ history, onCancelOrder }) => {
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <Container>
      <Title>📋 Lịch sử giao dịch</Title>
      
      <HistoryList>
        {sortedHistory.length === 0 ? (
          <EmptyState>
            Chưa có lệnh giao dịch nào
          </EmptyState>
        ) : (
          sortedHistory.map((order) => (
            <HistoryItem key={order.id} type={order.type}>
              <OrderInfo>
                <OrderType type={order.type}>
                  {order.type === 'buy' ? '🟢 Mua' : '🔴 Bán'} {order.symbol}
                </OrderType>
                <OrderDetails>
                  ${order.price.toFixed(2)} × {order.amount.toFixed(3)} = ${(order.price * order.amount).toFixed(2)}
                  <br />
                  {formatTime(order.timestamp)}
                </OrderDetails>
              </OrderInfo>
              
              <OrderStatus status={order.status}>
                {order.status === 'completed' && 'Hoàn thành'}
                {order.status === 'cancelled' && 'Đã hủy'}
                {order.status === 'pending' && 'Đang chờ'}
              </OrderStatus>
              
              {order.status === 'pending' && (
                <CancelButton
                  onClick={() => onCancelOrder(order.id)}
                >
                  Hủy
                </CancelButton>
              )}
            </HistoryItem>
          ))
        )}
      </HistoryList>
    </Container>
  );
};

export default TradingHistory; 