const express = require("express");
const router = express.Router();
const khachHangController = require("../controller/khachhangCTR");
const auth = require('../middlewares/authMiddleware'); // Auth middleware

// Public routes (không cần auth)
router.post("/register", khachHangController.register);
router.post("/login", khachHangController.login);

// Admin routes (cần auth - dành cho admin)
router.get("/getall", auth, khachHangController.getAll);
router.get("/getbyid/:id", auth, khachHangController.getById);
router.delete("/delete/:id", auth, khachHangController.delete);
router.put("/toggle-status/:id", auth, khachHangController.toggleStatus);

// Customer routes (cần auth - khách hàng tự cập nhật)
router.put("/update/:id", auth, khachHangController.update);
router.put("/change-password/:id", auth, khachHangController.changePassword);

module.exports = router;