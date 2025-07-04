// API Providers cho Crypto Data
const axios = require('axios');

class BinanceAPI {
  constructor() {
    this.baseUrl = 'https://api.binance.com/api/v3';
    this.wsUrl = 'wss://stream.binance.com:9443/ws';
  }

  // Lấy giá 24h cho nhiều symbols
  async getTicker24hr(symbols) {
    try {
      const symbolList = symbols.map(s => `"${s}"`).join(',');
      const response = await axios.get(`${this.baseUrl}/ticker/24hr?symbols=[${symbolList}]`);
      return response.data;
    } catch (error) {
      console.error('Binance API Error:', error.message);
      return [];
    }
  }

  // Lấy order book
  async getOrderBook(symbol, limit = 10) {
    try {
      const response = await axios.get(`${this.baseUrl}/depth?symbol=${symbol}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Binance Order Book Error:', error.message);
      return { bids: [], asks: [] };
    }
  }

  // Lấy lịch sử giao dịch
  async getRecentTrades(symbol, limit = 50) {
    try {
      const response = await axios.get(`${this.baseUrl}/trades?symbol=${symbol}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Binance Trades Error:', error.message);
      return [];
    }
  }
}

class CoinGeckoAPI {
  constructor() {
    this.baseUrl = 'https://api.coingecko.com/api/v3';
  }

  // Lấy giá hiện tại
  async getCurrentPrice(ids, vs_currencies = 'usd') {
    try {
      const response = await axios.get(`${this.baseUrl}/simple/price?ids=${ids}&vs_currencies=${vs_currencies}&include_24hr_change=true&include_24hr_vol=true`);
      return response.data;
    } catch (error) {
      console.error('CoinGecko API Error:', error.message);
      return {};
    }
  }

  // Lấy thông tin chi tiết coin
  async getCoinInfo(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/coins/${id}`);
      return response.data;
    } catch (error) {
      console.error('CoinGecko Coin Info Error:', error.message);
      return {};
    }
  }
}

class CoinbaseAPI {
  constructor() {
    this.baseUrl = 'https://api.pro.coinbase.com';
  }

  // Lấy ticker
  async getTicker(productId) {
    try {
      const response = await axios.get(`${this.baseUrl}/products/${productId}/ticker`);
      return response.data;
    } catch (error) {
      console.error('Coinbase API Error:', error.message);
      return {};
    }
  }

  // Lấy order book
  async getOrderBook(productId, level = 2) {
    try {
      const response = await axios.get(`${this.baseUrl}/products/${productId}/book?level=${level}`);
      return response.data;
    } catch (error) {
      console.error('Coinbase Order Book Error:', error.message);
      return { bids: [], asks: [] };
    }
  }
}

// Mapping cho các API
const API_MAPPINGS = {
  binance: {
    BTC: 'BTCUSDT',
    ETH: 'ETHUSDT',
    BNB: 'BNBUSDT',
    ADA: 'ADAUSDT',
    SOL: 'SOLUSDT',
    DOT: 'DOTUSDT',
    LINK: 'LINKUSDT',
    MATIC: 'MATICUSDT'
  },
  coingecko: {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    BNB: 'binancecoin',
    ADA: 'cardano',
    SOL: 'solana',
    DOT: 'polkadot',
    LINK: 'chainlink',
    MATIC: 'matic-network'
  },
  coinbase: {
    BTC: 'BTC-USD',
    ETH: 'ETH-USD',
    ADA: 'ADA-USD',
    SOL: 'SOL-USD'
  }
};

module.exports = {
  BinanceAPI,
  CoinGeckoAPI,
  CoinbaseAPI,
  API_MAPPINGS
}; 