const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên thực phẩm là bắt buộc'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Danh mục thực phẩm là bắt buộc'], // ví dụ: Sữa, Thịt, Trái cây...
    trim: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now, // Mặc định là ngày hiện tại nếu không truyền vào
  },
  expiryDate: {
    type: Date,
    required: [true, 'Ngày hết hạn là bắt buộc'],
  },
  compartment: {
    type: String,
    required: [true, 'Vị trí ngăn tủ là bắt buộc'],
    enum: {
      values: ['dong', 'mat', 'rau_cu'], // Khớp với các giá trị bộ lọc ở Front-end
      message: 'Vị trí ngăn chỉ có thể là: dong (Ngăn đông), mat (Ngăn mát), rau_cu (Ngăn rau củ)',
    },
  },
  quantity: {
    type: String,
    default: '1', // Ví dụ: 500g, 2 hộp, 4 quả...
  }
}, {
  timestamps: true // Tự động tạo createdAt và updatedAt
});

// Tạo index để tối ưu hóa hiệu năng khi truy vấn tìm kiếm theo ngăn tủ
FoodSchema.index({ compartment: 1 });

module.exports = mongoose.model('Food', FoodSchema);