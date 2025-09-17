const express = require('express');
const router = express.Router();
const gioHangController = require('../controller/giohangCTR');
const { verifyToken } = require('../middlewares/authMiddleware');  

router.get('/getbykhachhang/:id', verifyToken, gioHangController.getAllbyid);
router.post("/create",verifyToken,gioHangController.createGioHang)
router.put("/update/:id",verifyToken,gioHangController.updategiohang)
router.delete("/delete/:id",verifyToken,gioHangController.deleteGiohang)

module.exports = router;