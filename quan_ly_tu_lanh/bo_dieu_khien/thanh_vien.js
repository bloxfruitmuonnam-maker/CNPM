const db = require('../cau_hinh/co_so_du_lieu');

exports.layDanhSachThanhVien = (req, res) => {
    const data = db.readDB();
    res.json(data.roommates);
};

exports.themThanhVien = (req, res) => {
    const data = db.readDB();
    const thanhVienMoi = req.body;
    data.roommates.push(thanhVienMoi);
    db.writeDB(data);
    res.status(201).json(thanhVienMoi);
};

exports.suaThanhVien = (req, res) => {
    const data = db.readDB();
    const { id } = req.params;
    data.roommates = data.roommates.map(m => m.id === id ? { ...m, ...req.body } : m);
    db.writeDB(data);
    res.json({ success: true });
};

exports.xoaThanhVien = (req, res) => {
    const data = db.readDB();
    const { id } = req.params;
    data.roommates = data.roommates.filter(m => m.id !== id);
    db.writeDB(data);
    res.json({ success: true });
};
