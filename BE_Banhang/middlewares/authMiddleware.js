const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    // Lấy token từ cookie (nếu dùng cookie)
    const token = req.cookies.token;
    
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token không hợp lệ" });
  }
};