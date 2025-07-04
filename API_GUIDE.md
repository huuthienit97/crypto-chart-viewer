# 🚀 Hướng dẫn sử dụng API thật cho Crypto Trading

## 📊 **Các API phổ biến và miễn phí:**

### 1. **Binance API** ⭐ (Khuyến nghị)
**Ưu điểm:** Miễn phí, dữ liệu realtime, nhiều cặp tiền, WebSocket
**Nhược điểm:** Rate limit, cần đăng ký cho một số tính năng

#### REST API Endpoints:
```javascript
// Giá 24h cho nhiều symbols
GET https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT"]

// Order book
GET https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=10

// Lịch sử giao dịch gần đây
GET https://api.binance.com/api/v3/trades?symbol=BTCUSDT&limit=50

// Kline/Candlestick data
GET https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=100
```

#### WebSocket Streams:
```javascript
// Ticker stream cho tất cả symbols
wss://stream.binance.com:9443/ws/!ticker@arr

// Ticker stream cho symbol cụ thể
wss://stream.binance.com:9443/ws/btcusdt@ticker

// Order book stream
wss://stream.binance.com:9443/ws/btcusdt@depth

// Trade stream
wss://stream.binance.com:9443/ws/btcusdt@trade
```

### 2. **CoinGecko API** ⭐
**Ưu điểm:** Miễn phí, không cần API key, dữ liệu đa dạng
**Nhược điểm:** Rate limit thấp, không có WebSocket

#### Endpoints:
```javascript
// Giá hiện tại
GET https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true

// Thông tin chi tiết coin
GET https://api.coingecko.com/api/v3/coins/bitcoin

// Market data
GET https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1
```

### 3. **Coinbase Pro API**
**Ưu điểm:** Miễn phí, dữ liệu chất lượng cao
**Nhược điểm:** Ít cặp tiền hơn Binance

#### Endpoints:
```javascript
// Ticker
GET https://api.pro.coinbase.com/products/BTC-USD/ticker

// Order book
GET https://api.pro.coinbase.com/products/BTC-USD/book?level=2

// Recent trades
GET https://api.pro.coinbase.com/products/BTC-USD/trades
```

### 4. **Kraken API**
**Ưu điểm:** Miễn phí, dữ liệu chính xác
**Nhược điểm:** Rate limit nghiêm ngặt

#### Endpoints:
```javascript
// Ticker
GET https://api.kraken.com/0/public/Ticker?pair=XBTUSD

// Order book
GET https://api.kraken.com/0/public/Depth?pair=XBTUSD&count=10
```

## 🔧 **Cách tích hợp vào ứng dụng:**

### 1. **Sử dụng Binance API (Đã tích hợp)**
```javascript
// Trong server.js
const { BinanceAPI } = require('./api-providers');
const binance = new BinanceAPI();

// Lấy dữ liệu
const tickers = await binance.getTicker24hr(['BTCUSDT', 'ETHUSDT']);
const orderBook = await binance.getOrderBook('BTCUSDT');
```

### 2. **Thêm CoinGecko API**
```javascript
// Thêm vào api-providers.js
const { CoinGeckoAPI } = require('./api-providers');
const coingecko = new CoinGeckoAPI();

// Lấy dữ liệu
const prices = await coingecko.getCurrentPrice('bitcoin,ethereum', 'usd');
```

### 3. **Kết hợp nhiều API**
```javascript
// Fallback strategy
async function getCryptoData(symbol) {
  try {
    // Thử Binance trước
    const binanceData = await binance.getTicker24hr([symbol]);
    if (binanceData.length > 0) return binanceData;
    
    // Fallback về CoinGecko
    const coingeckoData = await coingecko.getCurrentPrice(symbol);
    return coingeckoData;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    return null;
  }
}
```

## 📈 **API trả phí nâng cao:**

### 1. **Alpha Vantage**
- **Giá:** $49.99/tháng
- **Tính năng:** Dữ liệu chứng khoán, forex, crypto
- **Rate limit:** 500 requests/day (free), 1200/minute (paid)

### 2. **CoinAPI.io**
- **Giá:** $79/tháng
- **Tính năng:** Dữ liệu realtime từ 100+ exchanges
- **Rate limit:** 100 requests/day (free), unlimited (paid)

### 3. **CryptoCompare**
- **Giá:** $29/tháng
- **Tính năng:** Dữ liệu từ 200+ exchanges
- **Rate limit:** 100,000 requests/month (free)

## 🛡️ **Best Practices:**

### 1. **Rate Limiting**
```javascript
// Implement rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100 // tối đa 100 requests
});

app.use('/api/', limiter);
```

### 2. **Caching**
```javascript
// Cache dữ liệu để giảm API calls
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 30 }); // 30 giây

async function getCachedData(key, fetchFunction) {
  let data = cache.get(key);
  if (!data) {
    data = await fetchFunction();
    cache.set(key, data);
  }
  return data;
}
```

### 3. **Error Handling**
```javascript
// Xử lý lỗi API
async function safeApiCall(apiFunction) {
  try {
    return await apiFunction();
  } catch (error) {
    console.error('API Error:', error.message);
    // Fallback hoặc retry logic
    return null;
  }
}
```

## 🚀 **Tính năng nâng cao có thể thêm:**

1. **WebSocket cho realtime data**
2. **Historical data cho biểu đồ**
3. **Technical indicators**
4. **Portfolio tracking**
5. **Price alerts**
6. **Trading signals**
7. **News sentiment analysis**
8. **Social media sentiment**

## 📝 **Lưu ý quan trọng:**

- **Rate Limits:** Tuân thủ rate limits của API
- **Error Handling:** Luôn xử lý lỗi API
- **Caching:** Cache dữ liệu để tối ưu performance
- **Fallback:** Có strategy fallback khi API lỗi
- **Monitoring:** Monitor API usage và errors
- **Security:** Không expose API keys trong frontend

---

**Khuyến nghị:** Bắt đầu với Binance API vì nó miễn phí, có WebSocket realtime và dữ liệu đầy đủ nhất! 