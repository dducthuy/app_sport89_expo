const express = require("express");
const router = express.Router();

const donhangController = require("../controller/donhangCTR");
const { verifyToken } = require('../middlewares/authMiddleware');



router.get("/getall", donhangController.getAllDonHang);
router.get("/getbyid/:id", donhangController.getDonHangById);

router.put("/update/:id", verifyToken, donhangController.updateDonHang)
router.put("/updatetrangthai/:id", verifyToken, donhangController.updateTrangThai);
router.post("/create", verifyToken, donhangController.createDonHang);
router.delete("/delete/:id", verifyToken, donhangController.deleteDonHang);
router.put("/huy/:id", verifyToken, donhangController.huyDonHang);
router.get("/thongke", verifyToken, donhangController.thongKeDonHang);  
    
module.exports = router;

