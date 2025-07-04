import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  padding: 20px;
`;

const Title = styled.h3`
  margin-bottom: 15px;
  color: #a0aec0;
  font-size: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 12px;
  color: #a0aec0;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 10px 12px;
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BuyButton = styled(Button)`
  background: linear-gradient(135deg, #00ff88 0%, #00d4aa 100%);
  color: #0a0e1a;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 255, 136, 0.3);
  }
`;

const SellButton = styled(Button)`
  background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
  color: white;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 71, 87, 0.3);
  }
`;

const CurrentPrice = styled.div`
  text-align: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 18px;
  font-weight: bold;
  color: #00ff88;
`;

const TradingForm = ({ selectedCrypto, currentPrice, onPlaceOrder }) => {
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e, type) => {
    e.preventDefault();
    
    if (!price || !amount) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const orderData = {
      type,
      price: parseFloat(price),
      amount: parseFloat(amount)
    };

    onPlaceOrder(orderData);
    
    // Reset form
    setPrice('');
    setAmount('');
  };

  return (
    <Container>
      <Title>💰 Đặt lệnh giao dịch</Title>
      <CurrentPrice>
        ${currentPrice?.toLocaleString() || '0'}
      </CurrentPrice>
      
      <Form>
        <InputGroup>
          <Label>Giá (USD)</Label>
          <Input
            type="number"
            placeholder="Nhập giá..."
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            min="0"
          />
        </InputGroup>
        
        <InputGroup>
          <Label>Số lượng ({selectedCrypto})</Label>
          <Input
            type="number"
            placeholder="Nhập số lượng..."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.001"
            min="0"
          />
        </InputGroup>
        
        <ButtonGroup>
          <BuyButton
            onClick={(e) => handleSubmit(e, 'buy')}
            disabled={!price || !amount}
          >
            🟢 Mua
          </BuyButton>
          <SellButton
            onClick={(e) => handleSubmit(e, 'sell')}
            disabled={!price || !amount}
          >
            🔴 Bán
          </SellButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default TradingForm; 