import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart } from 'recharts';
import { useTheme } from '../ThemeContext';

const Container = styled.div`
  background: ${props => props.theme.colors.card};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  height: 400px;
  transition: all 0.3s ease;
`;

const Title = styled.h3`
  margin-bottom: 15px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TimeFrameButtons = styled.div`
  display: flex;
  gap: 5px;
`;

const TimeButton = styled.button`
  padding: 5px 10px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.active ? props.theme.colors.primary + '30' : props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary + '20'};
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  width: 100%;
`;

const CoinInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
`;

const CoinLogo = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #eee;
`;

const CoinName = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const CoinDetail = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

// Mapping timeFrame sang interval Binance
const timeFrameToInterval = {
  '1H': '1h',
  '4H': '4h',
  '1D': '1d',
  '1W': '1w'
};

const INTERPOLATE_STEPS = 8;

const COINGECKO_IDS = {
  BTC: 'bitcoin', ETH: 'ethereum', BNB: 'binancecoin', ADA: 'cardano', SOL: 'solana', DOT: 'polkadot', LINK: 'chainlink',
  MATIC: 'matic-network', XRP: 'ripple', DOGE: 'dogecoin', AVAX: 'avalanche-2', UNI: 'uniswap', LTC: 'litecoin', BCH: 'bitcoin-cash',
  ATOM: 'cosmos', NEAR: 'near', ALGO: 'algorand', VET: 'vechain', ICP: 'internet-computer', FIL: 'filecoin'
};

const TradingChart = ({ selectedCrypto, cryptoData }) => {
  const [timeFrame, setTimeFrame] = useState('1H');
  const [chartData, setChartData] = useState([]);
  const [isRealtime, setIsRealtime] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [interpolating, setInterpolating] = useState(false);
  const [lastBinancePrice, setLastBinancePrice] = useState(null);
  const [coinInfo, setCoinInfo] = useState(null);
  const [coinInfoLoading, setCoinInfoLoading] = useState(false);
  const theme = useTheme();

  // Mượt biểu đồ khi giá Binance thay đổi
  useEffect(() => {
    if (!isRealtime) return;
    let intervalId;
    let lastPrice = chartData.length > 0 ? chartData[chartData.length - 1].price : null;
    let steps = 0;
    let interpolateFrom = lastPrice;
    let interpolateTo = lastPrice;
    let interpolateDelta = 0;

    intervalId = setInterval(() => {
      const binancePrice = cryptoData[selectedCrypto]?.price;
      if (!binancePrice) return;
      // Nếu giá Binance thay đổi lớn, bắt đầu nội suy
      if (lastBinancePrice !== binancePrice) {
        interpolateFrom = lastPrice ?? binancePrice;
        interpolateTo = binancePrice;
        interpolateDelta = (interpolateTo - interpolateFrom) / INTERPOLATE_STEPS;
        steps = 1;
        setLastBinancePrice(binancePrice);
        setInterpolating(true);
      }
      let newPrice;
      if (interpolating && steps <= INTERPOLATE_STEPS) {
        // Nội suy dần
        newPrice = interpolateFrom + interpolateDelta * steps;
        steps++;
        if (steps > INTERPOLATE_STEPS) setInterpolating(false);
      } else {
        // Nếu không nội suy, random nhỏ quanh giá cuối cùng
        const base = binancePrice;
        const variation = (Math.random() - 0.5) * 0.002; // ±0.1%
        newPrice = base * (1 + variation);
      }
      const now = new Date();
      const newDataPoint = {
        time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        price: parseFloat(newPrice.toFixed(2)),
        volume: cryptoData[selectedCrypto]?.volume || 0
      };
      setChartData(prevData => {
        const updatedData = [...prevData, newDataPoint];
        return updatedData.length > 50 ? updatedData.slice(-50) : updatedData;
      });
      lastPrice = newPrice;
    }, 500);
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cryptoData, selectedCrypto, isRealtime]);

  // Lấy dữ liệu lịch sử thật từ API
  useEffect(() => {
    const fetchHistoryData = async () => {
      setIsLoading(true);
      try {
        const interval = timeFrameToInterval[timeFrame] || '1h';
        const response = await fetch(`/api/history/${selectedCrypto}?interval=${interval}&limit=100`);
        const data = await response.json();
        
        if (data.error) {
          console.error('Lỗi khi lấy dữ liệu lịch sử:', data.error);
          return;
        }
        
        if (data.length > 0) {
          setChartData(data);
        }
      } catch (error) {
        console.error('Lỗi khi fetch dữ liệu lịch sử:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedCrypto) {
      fetchHistoryData();
    }
  }, [selectedCrypto, timeFrame]);

  // Lấy thông tin chi tiết coin từ CoinGecko
  useEffect(() => {
    const fetchCoinInfo = async () => {
      setCoinInfo(null);
      setCoinInfoLoading(true);
      const id = COINGECKO_IDS[selectedCrypto];
      if (!id) return setCoinInfoLoading(false);
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
        const data = await res.json();
        setCoinInfo(data);
      } catch (e) {
        setCoinInfo(null);
      } finally {
        setCoinInfoLoading(false);
      }
    };
    fetchCoinInfo();
  }, [selectedCrypto]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const price = payload[0].value;
      const volume = payload[0].payload.volume;
      const index = payload[0].payload && chartData.findIndex(d => d.time === payload[0].payload.time);
      let percentChange = null;
      if (index > 0) {
        const prevPrice = chartData[index - 1].price;
        percentChange = ((price - prevPrice) / prevPrice) * 100;
      }
      return (
        <div style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '8px',
          padding: '12px',
          color: theme.colors.text,
          fontSize: '13px',
          minWidth: 160,
          boxShadow: '0 4px 12px rgba(0,0,0,0.18)'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>⏰ {label}</div>
          <div style={{ color: theme.colors.primary, fontWeight: 'bold', marginBottom: 2 }}>💰 ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style={{ color: theme.colors.textSecondary, marginBottom: 2 }}>📊 Volume: {volume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          {percentChange !== null && (
            <div style={{ color: percentChange >= 0 ? theme.colors.primary : theme.colors.secondary }}>
              {percentChange >= 0 ? '▲' : '▼'} {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Xác định màu line: tăng thì xanh, giảm thì đỏ
  let lineColor = theme.colors.primary;
  if (chartData.length > 1 && chartData[chartData.length - 1].price < chartData[0].price) {
    lineColor = theme.colors.secondary;
  }

  return (
    <Container theme={theme}>
      {/* Thông tin chi tiết coin */}
      <CoinInfoRow>
        {coinInfoLoading ? (
          <CoinDetail theme={theme}>Đang tải thông tin coin...</CoinDetail>
        ) : coinInfo ? (
          <>
            <CoinLogo src={coinInfo.image?.thumb || coinInfo.image?.small} alt={coinInfo.name} />
            <CoinName>{coinInfo.name} ({coinInfo.symbol?.toUpperCase()})</CoinName>
            <CoinDetail theme={theme}>Rank #{coinInfo.market_cap_rank}</CoinDetail>
            <CoinDetail theme={theme}>Market Cap: ${coinInfo.market_data?.market_cap?.usd?.toLocaleString('en-US')}</CoinDetail>
            <CoinDetail theme={theme}>Volume 24h: ${coinInfo.market_data?.total_volume?.usd?.toLocaleString('en-US')}</CoinDetail>
          </>
        ) : (
          <CoinDetail theme={theme}>Không có dữ liệu coin</CoinDetail>
        )}
      </CoinInfoRow>
      {/* Bảng thông tin chi tiết coin */}
      {coinInfo && coinInfo.market_data && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          marginBottom: '12px',
          fontSize: '12px',
          color: theme.colors.textSecondary
        }}>
          <div><b>Open 24h</b><br/>${coinInfo.market_data?.current_price?.usd && coinInfo.market_data?.price_change_24h ? (coinInfo.market_data.current_price.usd - coinInfo.market_data.price_change_24h).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}</div>
          <div><b>High 24h</b><br/>${coinInfo.market_data?.high_24h?.usd?.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '-'}</div>
          <div><b>Low 24h</b><br/>${coinInfo.market_data?.low_24h?.usd?.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '-'}</div>
          <div><b>Close</b><br/>${coinInfo.market_data?.current_price?.usd?.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '-'}</div>
          <div><b>%Change 24h</b><br/><span style={{color: coinInfo.market_data?.price_change_percentage_24h >= 0 ? theme.colors.primary : theme.colors.secondary}}>{coinInfo.market_data?.price_change_percentage_24h ? (coinInfo.market_data.price_change_percentage_24h >= 0 ? '+' : '') + coinInfo.market_data.price_change_percentage_24h.toFixed(2) + '%' : '-'}</span></div>
          <div><b>Total Supply</b><br/>{coinInfo.market_data?.total_supply?.toLocaleString('en-US') || '-'}</div>
          <div><b>Circulating</b><br/>{coinInfo.market_data?.circulating_supply?.toLocaleString('en-US') || '-'}</div>
          <div><b>ATH</b><br/>${coinInfo.market_data?.ath?.usd?.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '-'}</div>
          <div><b>ATL</b><br/>${coinInfo.market_data?.atl?.usd?.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '-'}</div>
        </div>
      )}
      <Title theme={theme}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <span>📈 Biểu đồ giá - {selectedCrypto}</span>
            {(chartData.length > 0) ? (
              <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginTop: '4px' }}>
                <span style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                  ${chartData[chartData.length - 1].price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span style={{
                  color: (chartData[chartData.length - 1].price - chartData[0].price) >= 0 ? theme.colors.primary : theme.colors.secondary,
                  marginLeft: '8px'
                }}>
                  {((chartData[chartData.length - 1].price - chartData[0].price) >= 0 ? '+' : '') +
                    (((chartData[chartData.length - 1].price - chartData[0].price) / chartData[0].price * 100).toFixed(2))}%
                </span>
              </div>
            ) : (
              cryptoData[selectedCrypto] && (
                <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginTop: '4px' }}>
                  <span style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                    ${cryptoData[selectedCrypto].price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span style={{
                    color: cryptoData[selectedCrypto].change24h >= 0 ? theme.colors.primary : theme.colors.secondary,
                    marginLeft: '8px'
                  }}>
                    {cryptoData[selectedCrypto].change24h >= 0 ? '+' : ''}{cryptoData[selectedCrypto].change24h?.toFixed(2)}%
                  </span>
                </div>
              )
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <TimeFrameButtons>
              {['1H', '4H', '1D', '1W'].map(tf => (
                <TimeButton
                  key={tf}
                  active={timeFrame === tf}
                  theme={theme}
                  onClick={() => setTimeFrame(tf)}
                >
                  {tf}
                </TimeButton>
              ))}
            </TimeFrameButtons>
            <TimeButton
              active={isRealtime}
              theme={theme}
              onClick={() => setIsRealtime(!isRealtime)}
              style={{ fontSize: '10px', padding: '4px 8px' }}
            >
              {isRealtime ? '🟢 Live' : '🔴 Pause'}
            </TimeButton>
            <TimeButton
              theme={theme}
              onClick={() => {
                setChartData([]);
                // Trigger reload
                const event = new Event('reload');
                window.dispatchEvent(event);
              }}
              style={{ fontSize: '10px', padding: '4px 8px' }}
            >
              🔄 Refresh
            </TimeButton>
          </div>
        </div>
      </Title>
      
      <ChartContainer>
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          fontSize: '12px', 
          color: isRealtime ? theme.colors.primary : theme.colors.textSecondary,
          zIndex: 10 
        }}>
          {isRealtime ? '🟢 Live' : '🔴 Paused'}
        </div>
        
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: theme.colors.textSecondary, fontSize: '14px' }}>
            📊 Đang tải dữ liệu lịch sử...
          </div>
        ) : chartData.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: theme.colors.textSecondary, fontSize: '14px' }}>
            📊 Không có dữ liệu cho {selectedCrypto}
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
                <XAxis dataKey="time" minTickGap={20} tick={{ fill: theme.colors.textSecondary, fontSize: 12 }} />
                <YAxis domain={['auto', 'auto']} tick={{ fill: theme.colors.textSecondary, fontSize: 12 }} width={60} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="price"
                  dot={false}
                  stroke={lineColor}
                  strokeWidth={2.5}
                  isAnimationActive={false}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
            {/* Biểu đồ volume */}
            <ResponsiveContainer width="100%" height={60}>
              <BarChart data={chartData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Bar dataKey="volume"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                  fill={theme.colors.primary}
                  {
                    ...{
                      shape: (props) => {
                        const { x, y, width, height, index } = props;
                        const prev = chartData[index - 1]?.price;
                        const curr = chartData[index]?.price;
                        const color = prev !== undefined && curr < prev ? theme.colors.secondary : theme.colors.primary;
                        return <rect x={x} y={y} width={width} height={height} fill={color} rx={2} />;
                      }
                    }
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
        
        {/* Hiển thị thông tin giá min/max */}
        {chartData.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
            fontSize: '11px',
            color: theme.colors.textSecondary
          }}>
            <span>
              📉 Min: ${Math.min(...chartData.map(d => d.price)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span>
              📈 Max: ${Math.max(...chartData.map(d => d.price)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span>
              📊 Range: ${(Math.max(...chartData.map(d => d.price)) - Math.min(...chartData.map(d => d.price))).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </ChartContainer>
    </Container>
  );
};

export default TradingChart; 