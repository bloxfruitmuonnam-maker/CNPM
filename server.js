const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Food = require('./Food');
const User = require('./User');
const SharedList = require('./SharedList');

const app = express();
app.use(express.json());

// ======================
// MongoDB Connection
// ======================

const MONGO_URI =
process.env.MONGO_URI ||
'mongodb://localhost:27017/freshkeep';

mongoose.connect(MONGO_URI)
.then(() =>
console.log('Kết nối thành công tới MongoDB Database')
)
.catch((err) =>
console.error('Lỗi kết nối database:', err)
);

// ======================
// JWT Middleware
// ======================

const authMiddleware = (req, res, next) => {

try {

```
const token =
  req.headers.authorization;

if (!token) {

  return res.status(401).json({
    success: false,
    message: 'Chưa đăng nhập'
  });

}

const decoded = jwt.verify(
  token.replace('Bearer ', ''),
  'freshkeep_secret'
);

req.user = decoded;

next();
```

} catch (error) {

```
return res.status(401).json({
  success: false,
  message: 'Token không hợp lệ'
});
```

}

};

// ======================
// AUTH APIs (#44)
// ======================

app.post('/api/auth/register', async (req, res) => {

try {

```
const {
  fullName,
  email,
  password
} = req.body;

const existingUser =
  await User.findOne({ email });

if (existingUser) {

  return res.status(400).json({
    success: false,
    message: 'Email đã tồn tại'
  });

}

const hashedPassword =
  await bcrypt.hash(password, 10);

const user =
  await User.create({
    fullName,
    email,
    password: hashedPassword
  });

res.status(201).json({
  success: true,
  data: user
});
```

} catch (error) {

```
res.status(500).json({
  success: false,
  error: error.message
});
```

}

});

app.post('/api/auth/login', async (req, res) => {

try {

```
const {
  email,
  password
} = req.body;

const user =
  await User.findOne({ email });

if (!user) {

  return res.status(404).json({
    success: false,
    message: 'Không tìm thấy tài khoản'
  });

}

const match =
  await bcrypt.compare(
    password,
    user.password
  );

if (!match) {

  return res.status(401).json({
    success: false,
    message: 'Sai mật khẩu'
  });

}

const token = jwt.sign(
  {
    id: user._id,
    email: user.email
  },
  'freshkeep_secret',
  {
    expiresIn: '7d'
  }
);

res.json({
  success: true,
  token
});
```

} catch (error) {

```
res.status(500).json({
  success: false,
  error: error.message
});
```

}

});

// ======================
// FOOD APIs (#43)
// ======================

app.post('/api/foods', async (req, res) => {

try {

```
const {
  name,
  category,
  purchaseDate,
  expiryDate,
  compartment,
  quantity
} = req.body;

const buyDate =
  purchaseDate
    ? new Date(purchaseDate)
    : new Date();

const expDate =
  new Date(expiryDate);

if (expDate <= buyDate) {

  return res.status(400).json({
    success: false,
    message:
      'Ngày hết hạn phải xảy ra sau ngày mua thực phẩm.'
  });

}

const newFood =
  new Food({
    name,
    category,
    purchaseDate: buyDate,
    expiryDate: expDate,
    compartment,
    quantity
  });

const savedFood =
  await newFood.save();

res.status(201).json({
  success: true,
  data: savedFood
});
```

} catch (error) {

```
res.status(500).json({
  success: false,
  error: error.message
});
```

}

});

app.get('/api/foods', async (req, res) => {

try {

```
const {
  compartment
} = req.query;

let queryFilter = {};

if (compartment) {

  queryFilter.compartment =
    compartment;

}

const foods =
  await Food.find(queryFilter)
    .sort({
      expiryDate: 1
    });

res.json({
  success: true,
  count: foods.length,
  data: foods
});
```

} catch (error) {

```
res.status(500).json({
  success: false,
  error: error.message
});
```

}

});

// ======================
// SHARED LIST APIs (#45)
// ======================

app.post(
'/api/shared-lists',
authMiddleware,
async (req, res) => {

```
try {

  const list =
    await SharedList.create({

      ownerId:
        req.user.id,

      memberEmail:
        req.body.memberEmail,

      foods: []

    });

  res.status(201).json({
    success: true,
    data: list
  });

} catch (error) {

  res.status(500).json({
    success: false,
    error: error.message
  });

}
```

}
);

app.get(
'/api/shared-lists',
authMiddleware,
async (req, res) => {

```
try {

  const lists =
    await SharedList.find()
      .populate('ownerId')
      .populate('foods');

  res.json({
    success: true,
    data: lists
  });

} catch (error) {

  res.status(500).json({
    success: false,
    error: error.message
  });

}
```

}
);

// ======================
// START SERVER
// ======================

const PORT =
process.env.PORT || 5000;

app.listen(PORT, () => {

console.log(
`Server FreshKeep đang hoạt động tại cổng ${PORT}`
);

});
