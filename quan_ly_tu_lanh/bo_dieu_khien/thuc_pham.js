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
