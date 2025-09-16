const express = require("express");
const router = express.Router();
const danhmucController = require("../controller/danhmucCTR");
const { verifyToken } = require('../middlewares/authMiddleware'); 


router.get("/getall", danhmucController.getAll);
router.get("/dropdown", danhmucController.getForDropdown);
router.get("/getbyid/:id", danhmucController.getById);


router.post("/create", verifyToken, danhmucController.create);
router.put("/update/:id", verifyToken, danhmucController.update);
router.delete("/delete/:id", verifyToken, danhmucController.delete);

module.exports = router;
