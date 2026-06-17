const express = require('express');
const mongoose = require('mongoose');
const Food = require('./models/Food'); // Import Schema vừa tạo ở trên

const app = express();
app.use(express.json()); // Middleware để đọc dữ liệu JSON từ Body Request

// Kết nối tới cơ sở dữ liệu MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/freshkeep';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Kết nối thành công tới MongoDB Database'))
  .catch((err) => console.error('Lỗi kết nối database:', err));


/**
 * @route   POST /api/foods
 * @desc    Thêm mới một thực phẩm vào tủ lạnh
 * @access  Public
 */
app.post('/api/foods', async (req, res) => {
  try {
    const { name, category, purchaseDate, expiryDate, compartment, quantity } = req.body;

    // Kiểm tra ràng buộc cơ bản: Ngày hết hạn phải sau ngày mua
    const buyDate = purchaseDate ? new Date(purchaseDate) : new Date();
    const expDate = new Date(expiryDate);

    if (expDate <= buyDate) {
      return res.status(400).json({
        success: false,
        message: 'Ngày hết hạn phải xảy ra sau ngày mua thực phẩm.'
      });
    }

    // Khởi tạo thực phẩm mới
    const newFood = new Food({
      name,
      category,
      purchaseDate: buyDate,
      expiryDate: expDate,
      compartment,
      quantity
    });

    const savedFood = await newFood.save();
    return res.status(201).json({
      success: true,
      data: savedFood
    });

  } catch (error) {
    // Xử lý lỗi validation từ Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, errors: messages });
    }

    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi hệ thống khi thêm thực phẩm.',
      error: error.message
    });
  }
});


/**
 * @route   GET /api/foods
 * @desc    Lấy danh sách thực phẩm (có bộ lọc theo vị trí ngăn tủ)
 * @access  Public
 */
app.get('/api/foods', async (req, res) => {
  try {
    const { compartment } = req.query;
    let queryFilter = {};

    // Nếu người dùng truyền query parameter ?compartment=xxx, áp dụng bộ lọc
    if (compartment) {
      if (!['dong', 'mat', 'rau_cu'].includes(compartment)) {
        return res.status(400).json({
          success: false,
          message: 'Vị trí ngăn lọc không hợp lệ. Vui lòng chọn: dong, mat, hoặc rau_cu.'
        });
      }
      queryFilter.compartment = compartment;
    }

    // Lấy danh sách thực phẩm dựa theo filter
    // Đồng thời sắp xếp (sort) theo ngày hết hạn tăng dần (sắp hết hạn sẽ hiển thị lên trước)
    const foods = await Food.find(queryFilter).sort({ expiryDate: 1 });

    return res.status(200).json({
      success: true,
      count: foods.length,
      data: foods
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi hệ thống khi lấy danh sách thực phẩm.',
      error: error.message
    });
  }
});




const shareRoutes = require("./routes/share");
// Đăng ký route chia sẻ
app.use("/share", shareRoutes);



// Khởi chạy Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server FreshKeep đang hoạt động tại cổng ${PORT}`);
});
