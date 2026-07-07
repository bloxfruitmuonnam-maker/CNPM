const db = require('../cau_hinh/co_so_du_lieu');

exports.layDanhSachDiCho = (req, res) => {
    const data = db.readDB();
    res.json(data.shoppingList);
};

exports.themDoCanMua = (req, res) => {
    const data = db.readDB();
    const doMoi = req.body;
    data.shoppingList.push(doMoi);
    db.writeDB(data);
    res.status(201).json(doMoi);
};

exports.suaTrangThaiMua = (req, res) => {
    const data = db.readDB();
    const { id } = req.params;
    data.shoppingList = data.shoppingList.map(item => item.id === id ? { ...item, ...req.body } : item);
    db.writeDB(data);
    res.json({ success: true });
};

exports.xoaDoCanMua = (req, res) => {
    const data = db.readDB();
    const { id } = req.params;
    data.shoppingList = data.shoppingList.filter(item => item.id !== id);
    db.writeDB(data);
    res.json({ success: true });
};
