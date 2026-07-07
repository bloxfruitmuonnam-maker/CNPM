const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./cau_hinh/co_so_du_lieu');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'giao_dien_cong_cong')));

// Đăng ký các cổng API định tuyến
app.use('/api/items', require('./tuyen_duong/api_thuc_pham'));
app.use('/api/shopping', require('./tuyen_duong/api_di_cho'));
app.use('/api/roommates', require('./tuyen_duong/api_thanh_vien'));
app.use('/api/logs', require('./tuyen_duong/api_nhat_ky'));

// API đặc biệt lấy toàn bộ dữ liệu gộp lúc khởi động
app.get('/api/data', (req, res) => {
    res.json(db.readDB());
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'giao_dien_cong_cong', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`[FreshKeep] Hệ thống đang chạy mượt mà tại: http://localhost:${PORT}`);
});
