# 🚀 Huuthien Crypto Trading - Ứng dụng giao dịch crypto realtime

Ứng dụng web realtime cho giao dịch cryptocurrency với giao diện hiện đại và các tính năng chuyên nghiệp.

## ✨ Tính năng chính

- **📊 Giá crypto realtime** - Cập nhật giá theo thời gian thực
- **📈 Biểu đồ giá** - Hiển thị biến động giá với nhiều khung thời gian
- **📚 Order Book** - Hiển thị sổ lệnh mua/bán realtime
- **💰 Đặt lệnh giao dịch** - Mua/bán crypto với giao diện trực quan
- **📋 Lịch sử giao dịch** - Theo dõi và quản lý các lệnh đã đặt
- **🔄 WebSocket realtime** - Kết nối realtime với server
- **📱 Responsive design** - Tương thích với mọi thiết bị

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Realtime communication
- **node-cron** - Scheduled tasks
- **uuid** - Unique ID generation

### Frontend
- **React.js** - UI framework
- **Socket.IO Client** - Realtime client
- **Recharts** - Chart library
- **Styled Components** - CSS-in-JS styling

## 🚀 Cài đặt và chạy

### 1. Clone repository
```bash
git clone <repository-url>
cd huuthien-realtime-crypto
```

### 2. Cài đặt dependencies cho backend
```bash
npm install
```

### 3. Cài đặt dependencies cho frontend
```bash
cd client
npm install
cd ..
```

### 4. Chạy ứng dụng

#### Chạy backend (Terminal 1)
```bash
npm run dev
```
Server sẽ chạy trên `http://localhost:5000`

#### Chạy frontend (Terminal 2)
```bash
cd client
npm start
```
Frontend sẽ chạy trên `http://localhost:3000`

### 5. Truy cập ứng dụng
Mở trình duyệt và truy cập: `http://localhost:3000`

## 📁 Cấu trúc dự án

```
huuthien-realtime-crypto/
├── server.js              # Server chính
├── package.json           # Dependencies backend
├── client/                # Frontend React app
│   ├── public/
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   │   ├── Header.js
│   │   │   │   ├── CryptoList.js
│   │   │   │   ├── TradingChart.js
│   │   │   │   ├── OrderBook.js
│   │   │   │   ├── TradingForm.js
│   │   │   │   └── TradingHistory.js
│   │   │   ├── App.js         # Component chính
│   │   │   ├── index.js       # Entry point
│   │   │   └── index.css      # Global styles
│   │   └── package.json       # Dependencies frontend
│   └── README.md
```

## 🎯 Cách sử dụng

### 1. Xem danh sách crypto
- Danh sách crypto hiển thị ở panel bên trái
- Click vào crypto để chọn và xem chi tiết

### 2. Xem biểu đồ giá
- Biểu đồ hiển thị ở panel giữa
- Chọn khung thời gian: 1H, 4H, 1D, 1W
- Dữ liệu cập nhật realtime

### 3. Xem Order Book
- Order book hiển thị ở panel bên phải
- Xem lệnh mua (bids) và bán (asks)
- Theo dõi spread giữa giá mua và bán

### 4. Đặt lệnh giao dịch
- Nhập giá và số lượng muốn giao dịch
- Click "Mua" hoặc "Bán"
- Lệnh sẽ xuất hiện trong lịch sử giao dịch

### 5. Quản lý lệnh
- Xem tất cả lệnh trong lịch sử giao dịch
- Hủy lệnh đang chờ xử lý
- Theo dõi trạng thái lệnh

## 🔧 Tùy chỉnh

### Thêm crypto mới
Chỉnh sửa `cryptoData` trong `server.js`:
```javascript
const cryptoData = {
  BTC: { price: 45000, change24h: 2.5, volume: 2500000000 },
  ETH: { price: 3200, change24h: -1.2, volume: 1800000000 },
  // Thêm crypto mới ở đây
  NEW: { price: 100, change24h: 0.5, volume: 50000000 }
};
```

### Thay đổi tần suất cập nhật
Chỉnh sửa cron schedule trong `server.js`:
```javascript
// Cập nhật giá mỗi 2 giây
cron.schedule('*/2 * * * * *', () => {
  // Code cập nhật giá
});

// Cập nhật order book mỗi 1 giây
cron.schedule('*/1 * * * * *', () => {
  // Code cập nhật order book
});
```

## 🌟 Tính năng nâng cao có thể thêm

- **🔐 Authentication** - Đăng nhập/đăng ký user
- **💼 Portfolio** - Quản lý tài sản crypto
- **📊 Advanced Charts** - Biểu đồ nến, volume, indicators
- **🔔 Notifications** - Thông báo giá, lệnh
- **📱 Mobile App** - Ứng dụng mobile
- **🌐 Real API** - Kết nối API thật từ Binance, Coinbase
- **💾 Database** - Lưu trữ dữ liệu vào database
- **🔒 Security** - Bảo mật nâng cao

## 📝 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

---

**Lưu ý**: Đây là ứng dụng demo với dữ liệu mẫu. Không sử dụng cho giao dịch thật! 