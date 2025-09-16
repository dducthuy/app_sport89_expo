const express = require("express");
const router = express.Router();
const authCRl=require("../controller/authCTR")

// router.post("/register", register);
router.post("/login", authCRl.login);
router.post("/register",authCRl.register)
module.exports = router;