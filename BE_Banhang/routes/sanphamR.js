const express = require('express');
const router = express.Router();
const sanPhamController = require('../controller/sanphamCTR');



router.get('/getall', sanPhamController.getAllSanPham);
router.post('/create',sanPhamController.createSanPham);
router.put('/update/:id',sanPhamController.updateSanPham);
router.delete('/delete/:id',sanPhamController.delete)
router.get('/getbyid/:id',sanPhamController.getSanPhamById)
router.get("/getbydanhmuc/:id",sanPhamController.getSanPhamTheoDanhMuc)


module.exports = router;