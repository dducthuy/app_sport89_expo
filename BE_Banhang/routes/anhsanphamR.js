const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const anhSpController = require("../controller/anhsanphamCTR");

// Upload nhiều ảnh 1 lần
router.post(
  "/upload/:ma_san_pham",
  upload.array("anh", 10),  // max 10 ảnh
  anhSpController.uploadAnh
);


router.get("/getbyid/:id",anhSpController.getbyid)

module.exports = router;
