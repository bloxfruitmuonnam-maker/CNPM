const express = require('express');
const router = express.Router();
const controller = require('../bo_dieu_khien/thuc_pham');

router.get('/', controller.layTatCaThucPham);
router.post('/', controller.themThucPham);
router.put('/:id', controller.suaThucPham);
router.delete('/:id', controller.xoaThucPham);

module.exports = router;
