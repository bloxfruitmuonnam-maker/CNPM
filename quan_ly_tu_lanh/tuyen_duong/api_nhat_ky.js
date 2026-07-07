const express = require('express');
const router = express.Router();
const controller = require('../bo_dieu_khien/nhat_ky');

router.get('/', controller.layNhatKy);
router.post('/', controller.themNhatKy);

module.exports = router;
