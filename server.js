const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const WebSocket = require('ws');
const path = require('path');

// Fallback API - CoinGecko
async function fetchCoinGeckoData() {
  try {
    const ids = 'bitcoin,ethereum,binancecoin,cardano,solana';
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`);
    
    const mapping = {
      bitcoin: 'BTC',
      ethereum: 'ETH',
      binancecoin: 'BNB',
      cardano: 'ADA',
      solana: 'SOL'
    };
    
    Object.entries(response.data).forEach(([id, data]) => {
      const symbol = mapping[id];
      if (symbol && cryptoData[symbol]) {
        cryptoData[symbol] = {
          price: data.usd,
          change24h: data.usd_24h_change || 0,
          volume: data.usd_24h_vol || 0
        };
      }
    });
    
    console.log('Đã lấy dữ liệu từ CoinGecko API');
    io.emit('cryptoUpdate', cryptoData);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ CoinGecko:', error.message);
  }
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/build')));

// Dữ liệu thật từ Binance API
const cryptoData = {
  BTC: { price: 0, change24h: 0, volume: 0 },
  ETH: { price: 0, change24h: 0, volume: 0 },
  BNB: { price: 0, change24h: 0, volume: 0 },
  ADA: { price: 0, change24h: 0, volume: 0 },
  SOL: { price: 0, change24h: 0, volume: 0 },
  DOT: { price: 0, change24h: 0, volume: 0 },
  LINK: { price: 0, change24h: 0, volume: 0 },
  MATIC: { price: 0, change24h: 0, volume: 0 },
  XRP: { price: 0, change24h: 0, volume: 0 },
  DOGE: { price: 0, change24h: 0, volume: 0 },
  AVAX: { price: 0, change24h: 0, volume: 0 },
  UNI: { price: 0, change24h: 0, volume: 0 },
  LTC: { price: 0, change24h: 0, volume: 0 },
  BCH: { price: 0, change24h: 0, volume: 0 },
  ATOM: { price: 0, change24h: 0, volume: 0 },
  NEAR: { price: 0, change24h: 0, volume: 0 },
  ALGO: { price: 0, change24h: 0, volume: 0 },
  VET: { price: 0, change24h: 0, volume: 0 },
  ICP: { price: 0, change24h: 0, volume: 0 },
  FIL: { price: 0, change24h: 0, volume: 0 }
};

// Mapping symbols cho Binance API
const symbolMapping = {
  BTC: 'BTCUSDT',
  ETH: 'ETHUSDT',
  BNB: 'BNBUSDT',
  ADA: 'ADAUSDT',
  SOL: 'SOLUSDT',
  DOT: 'DOTUSDT',
  LINK: 'LINKUSDT',
  MATIC: 'MATICUSDT',
  XRP: 'XRPUSDT',
  DOGE: 'DOGEUSDT',
  AVAX: 'AVAXUSDT',
  UNI: 'UNIUSDT',
  LTC: 'LTCUSDT',
  BCH: 'BCHUSDT',
  ATOM: 'ATOMUSDT',
  NEAR: 'NEARUSDT',
  ALGO: 'ALGOUSDT',
  VET: 'VETUSDT',
  ICP: 'ICPUSDT',
  FIL: 'FILUSDT'
};

// Order book thật từ Binance
const orderBooks = {};

// Hàm lấy order book thật từ Binance
async function fetchOrderBook(symbol) {
  try {
    const binanceSymbol = symbolMapping[symbol];
    if (!binanceSymbol) return;
    
    const response = await axios.get(`https://api.binance.com/api/v3/depth?symbol=${binanceSymbol}&limit=10`);
    
    orderBooks[symbol] = {
      bids: response.data.bids.map(bid => ({
        price: parseFloat(bid[0]),
        amount: parseFloat(bid[1])
      })),
      asks: response.data.asks.map(ask => ({
        price: parseFloat(ask[0]),
        amount: parseFloat(ask[1])
      }))
    };
  } catch (error) {
    console.error(`Lỗi khi lấy order book cho ${symbol}:`, error.message);
  }
}

// Trading history mẫu
const tradingHistory = [];

// Hàm lấy dữ liệu thật từ Binance API
async function fetchBinanceData() {
  try {
    // Lấy dữ liệu từng symbol một để tránh lỗi format
    const promises = Object.values(symbolMapping).map(async (binanceSymbol) => {
      try {
        const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`);
        return response.data;
      } catch (error) {
        console.error(`Lỗi khi lấy dữ liệu cho ${binanceSymbol}:`, error.message);
        return null;
      }
    });
    
    const results = await Promise.all(promises);
    
    results.forEach(ticker => {
      if (ticker) {
        const symbol = Object.keys(symbolMapping).find(key => symbolMapping[key] === ticker.symbol);
        if (symbol) {
          cryptoData[symbol] = {
            price: parseFloat(ticker.lastPrice),
            change24h: parseFloat(ticker.priceChangePercent),
            volume: parseFloat(ticker.volume) * parseFloat(ticker.lastPrice)
          };
        }
      }
    });
    
    // Gửi dữ liệu realtime cho tất cả clients
    io.emit('cryptoUpdate', cryptoData);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ Binance:', error.message);
  }
}

// Kết nối WebSocket Binance cho dữ liệu realtime
const binanceWs = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

binanceWs.on('open', () => {
  console.log('Đã kết nối WebSocket Binance');
});

binanceWs.on('message', (data) => {
  try {
    const tickers = JSON.parse(data);
    
    tickers.forEach(ticker => {
      const symbol = Object.keys(symbolMapping).find(key => symbolMapping[key] === ticker.s);
      if (symbol) {
        cryptoData[symbol] = {
          price: parseFloat(ticker.c), // Close price
          change24h: parseFloat(ticker.P), // Price change percent
          volume: parseFloat(ticker.v) * parseFloat(ticker.c) // Volume * price
        };
      }
    });
    
    // Gửi dữ liệu realtime cho tất cả clients
    io.emit('cryptoUpdate', cryptoData);
  } catch (error) {
    console.error('Lỗi khi xử lý dữ liệu WebSocket:', error.message);
  }
});

binanceWs.on('error', (error) => {
  console.error('Lỗi WebSocket Binance:', error);
});

// Lấy dữ liệu ban đầu
fetchBinanceData();

// Backup: Cập nhật giá crypto mỗi 10 giây từ REST API (nếu WebSocket lỗi)
cron.schedule('*/10 * * * * *', () => {
  fetchBinanceData();
});

// Fallback: Sử dụng CoinGecko nếu Binance lỗi
cron.schedule('*/30 * * * * *', () => {
  // Kiểm tra xem có dữ liệu từ Binance không
  const hasData = Object.values(cryptoData).some(data => data.price > 0);
  if (!hasData) {
    console.log('Không có dữ liệu từ Binance, sử dụng CoinGecko...');
    fetchCoinGeckoData();
  }
});

// Cập nhật order book mỗi 3 giây
cron.schedule('*/3 * * * * *', () => {
  Object.keys(symbolMapping).forEach(symbol => {
    fetchOrderBook(symbol);
  });
  
  io.emit('orderBookUpdate', orderBooks);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Gửi dữ liệu ban đầu
  socket.emit('cryptoUpdate', cryptoData);
  socket.emit('orderBookUpdate', orderBooks);
  socket.emit('tradingHistory', tradingHistory);
  
  // Xử lý đặt lệnh
  socket.on('placeOrder', (orderData) => {
    const order = {
      id: uuidv4(),
      symbol: orderData.symbol,
      type: orderData.type, // 'buy' hoặc 'sell'
      price: orderData.price,
      amount: orderData.amount,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    tradingHistory.push(order);
    
    // Thêm vào order book
    if (order.type === 'buy') {
      orderBooks[order.symbol].bids.push({
        price: order.price,
        amount: order.amount
      });
      orderBooks[order.symbol].bids.sort((a, b) => b.price - a.price);
    } else {
      orderBooks[order.symbol].asks.push({
        price: order.price,
        amount: order.amount
      });
      orderBooks[order.symbol].asks.sort((a, b) => a.price - b.price);
    }
    
    // Broadcast cho tất cả clients
    io.emit('newOrder', order);
    io.emit('orderBookUpdate', orderBooks);
    io.emit('tradingHistory', tradingHistory);
  });
  
  // Xử lý hủy lệnh
  socket.on('cancelOrder', (orderId) => {
    const orderIndex = tradingHistory.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      tradingHistory[orderIndex].status = 'cancelled';
      io.emit('orderCancelled', orderId);
      io.emit('tradingHistory', tradingHistory);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API endpoints
app.get('/api/crypto', (req, res) => {
  res.json(cryptoData);
});

// API để lấy dữ liệu lịch sử cho biểu đồ
app.get('/api/history/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const binanceSymbol = symbolMapping[symbol];
    
    if (!binanceSymbol) {
      return res.json({ error: 'Symbol không hợp lệ' });
    }
    // Lấy interval và limit từ query, mặc định 1m và 100
    const interval = req.query.interval || '1m';
    const limit = req.query.limit || 100;
    // Lấy dữ liệu kline (candlestick) từ Binance
    const response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=${limit}`);
    const historyData = response.data.map(kline => ({
      time: new Date(kline[0]).toLocaleString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }),
      price: parseFloat(kline[4]), // Close price
      volume: parseFloat(kline[5])
    }));
    res.json(historyData);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu lịch sử:', error.message);
    res.json({ error: 'Không thể lấy dữ liệu lịch sử' });
  }
});

app.get('/api/orderbook/:symbol', (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  res.json(orderBooks[symbol] || { bids: [], asks: [] });
});

app.get('/api/history', (req, res) => {
  res.json(tradingHistory);
});

// Test API endpoints
app.get('/api/test/binance', async (req, res) => {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT');
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.get('/api/test/coingecko', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.get('/api/force-update', async (req, res) => {
  await fetchBinanceData();
  res.json({ success: true, message: 'Đã cập nhật dữ liệu' });
});

// API proxy lấy tin tức crypto từ CryptoPanic
app.get('/api/news', async (req, res) => {
  try {
    const response = await axios.get('https://cryptopanic.com/api/v1/posts/', {
      params: {
        auth_token: 'demo',
        public: 'true'
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Không lấy được tin tức' });
  }
});

// Catch-all: return React index.html cho mọi route không phải API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`);
  console.log(`Truy cập: http://localhost:${PORT}`);
}); 