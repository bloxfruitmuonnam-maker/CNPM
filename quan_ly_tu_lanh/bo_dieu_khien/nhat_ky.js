const db = require('../cau_hinh/co_so_du_lieu');

exports.layNhatKy = (req, res) => {
    const data = db.readDB();
    res.json(data.syncLogs);
};

exports.themNhatKy = (req, res) => {
    const data = db.readDB();
    const dongLogMoi = req.body;
    data.syncLogs.unshift(dongLogMoi);
    db.writeDB(data);
    res.status(201).json(dongLogMoi);
};
