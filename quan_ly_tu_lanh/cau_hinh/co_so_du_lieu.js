const fs = require('fs');
const path = require('path');
const FILE_CSDL = path.join(__dirname, '..', 'co_so_du_lieu.json');

const du_lieu_mac_dinh = {
    items: [
        { id: '1', name: 'Sữa tươi TH True Milk', quantity: '2 hộp 1L', category: 'Sữa & Đồ hộp', compartment: 'Cánh tủ', storage_location: 'Cánh tủ', expiryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], isPediatricCritical: false, isCustom: false },
        { id: '2', name: 'Thịt bò Mỹ phi lê', quantity: '500g', category: 'Thịt & Hải sản', compartment: 'Ngăn đông', storage_location: 'Ngăn đông', expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], isPediatricCritical: false, isCustom: false },
        { id: '3', name: 'Ức gà phi lê', quantity: '1kg', category: 'Thịt & Hải sản', compartment: 'Ngăn đông', storage_location: 'Ngăn đông', expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], isPediatricCritical: false, isCustom: false },
        { id: '4', name: 'Ớt chuông đỏ', quantity: '3 quả', category: 'Rau củ & Trái cây', compartment: 'Ngăn mát', storage_location: 'Ngăn mát', expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], isPediatricCritical: false, isCustom: false },
        { id: '5', name: 'Sữa bột ăn dặm cho bé', quantity: '1 hộp', category: 'Sữa & Đồ hộp', compartment: 'Ngăn đồ ăn dặm', storage_location: 'Ngăn đồ ăn dặm', expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], isPediatricCritical: true, isCustom: false },
        { id: '6', name: 'Hành tây', quantity: '2 củ', category: 'Rau củ & Trái cây', compartment: 'Ngăn rau củ', storage_location: 'Ngăn rau củ', expiryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], isPediatricCritical: false, isCustom: false },
        { id: '7', name: 'Bông cải xanh', quantity: '1 cây', category: 'Rau củ & Trái cây', compartment: 'Ngăn rau củ', storage_location: 'Ngăn rau củ', expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], isPediatricCritical: false, isCustom: false }
    ],
    shoppingList: [
        { id: 's1', name: 'Trứng gà tươi', quantity: '10 quả', category: 'Sữa & Đồ hộp', checked: false },
        { id: 's2', name: 'Rau chân vịt', quantity: '2 bó', category: 'Rau củ & Trái cây', checked: false }
    ],
    roommates: [
        { id: 'u1', name: 'Nguyễn Thị Mai', avatar: '👩‍🍼', role: 'Mẹ bỉm sữa', isAdmin: true },
        { id: 'u2', name: 'Trần Thu Thảo', avatar: '👩‍🎓', role: 'Sinh viên', isAdmin: false },
        { id: 'u3', name: 'Bố trẻ nhỏ', avatar: '🙋‍♂️', role: 'Chồng', isAdmin: false }
    ],
    syncLogs: [
        { id: 1, text: 'Hệ thống đã sẵn sàng và kết nối cơ sở dữ liệu chung.', time: '10:00 AM' }
    ]
};

function readDB() {
    if (!fs.existsSync(FILE_CSDL)) {
        fs.writeFileSync(FILE_CSDL, JSON.stringify(du_lieu_mac_dinh, null, 4), 'utf-8');
        return du_lieu_mac_dinh;
    }
    const content = fs.readFileSync(FILE_CSDL, 'utf-8');
    return JSON.parse(content);
}

function writeDB(data) {
    fs.writeFileSync(FILE_CSDL, JSON.stringify(data, null, 4), 'utf-8');
}

module.exports = { readDB, writeDB };
```

#### Tệp `bo_dieu_khien/thuc_pham.js`
```javascript
const db = require('../cau_hinh/co_so_du_lieu');

exports.layTatCaThucPham = (req, res) => {
    const data = db.readDB();
    res.json(data.items);
};

exports.themThucPham = (req, res) => {
    const data = db.readDB();
    const thucPhamMoi = req.body;
    data.items.unshift(thucPhamMoi);
    db.writeDB(data);
    res.status(201).json(thucPhamMoi);
};

exports.suaThucPham = (req, res) => {
    const data = db.readDB();
    const { id } = req.params;
    data.items = data.items.map(item => item.id === id ? { ...item, ...req.body } : item);
    db.writeDB(data);
    res.json({ success: true });
};

exports.xoaThucPham = (req, res) => {
    const data = db.readDB();
    const { id } = req.params;
    data.items = data.items.filter(item => item.id !== id);
    db.writeDB(data);
    res.json({ success: true });
};
