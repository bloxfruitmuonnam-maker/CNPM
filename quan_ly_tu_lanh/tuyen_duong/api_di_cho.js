const express = require('express');
const router = Router = express.Router();
const controller = require('../bo_dieu_khien/di_cho');

router.get('/', controller.layDanhSachDiCho);
router.post('/', controller.themDoCanMua);
router.put('/:id', controller.suaTrangThaiMua);
router.delete('/:id', controller.xoaDoCanMua);

module.exports = router;
