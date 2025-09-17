const express = require("express");
const router = express.Router();
const khachHangController = require("../controller/khachhangCTR");

const { verifyToken } = require('../middlewares/authMiddleware');
router.get("/getall",khachHangController.getAll)
router.delete("/delete/:id", verifyToken, khachHangController.delete);
router.put("/toggle-status/:id", verifyToken, khachHangController.toggleStatus);
router.put("/update/:id", verifyToken, khachHangController.update);
router.put("/change-password/:id", verifyToken, khachHangController.changePassword);


module.exports = router;