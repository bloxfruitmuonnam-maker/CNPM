const express = require('express');
const router = express.Router();
const controller = require('../bo_dieu_khien/thanh_vien');

router.get('/', controller.layDanhSachThanhVien);
router.post('/', controller.themThanhVien);
router.put('/:id', controller.suaThanhVien);
router.delete('/:id', controller.xoaThanhVien);

module.exports = router;
