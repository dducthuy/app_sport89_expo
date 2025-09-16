const KhachHang = require("../models/khachhangM");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Đăng ký
exports.register = async (req, res) => {
  try {
    const { ho_ten, email, mat_khau, so_dien_thoai, dia_chi, ngay_sinh, gioi_tinh } = req.body;

    // Check thiếu thông tin
    if (!ho_ten || !email || !mat_khau) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc: họ tên, email, mật khẩu",
      });
    }

    // Check email trùng
    const existing = await KhachHang.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email đã được sử dụng",
      });
    }


    const hashedPassword = await bcrypt.hash(mat_khau, 10);

    const newUser = await KhachHang.create({
      ho_ten,
      email,
      mat_khau: hashedPassword,
      so_dien_thoai,
      dia_chi,
      ngay_sinh,
      gioi_tinh,
    });

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: {
        id: newUser.id,
        ho_ten: newUser.ho_ten,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, mat_khau } = req.body;

    // Check thiếu input
    if (!email || !mat_khau) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email và mật khẩu",
      });
    }

    const user = await KhachHang.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Sai email hoặc mật khẩu!",
      });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(mat_khau, user.mat_khau);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Sai email hoặc mật khẩu!",
      });
    }

    // Tạo JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    // Gửi cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true nếu deploy https
      maxAge: 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        ho_ten: user.ho_ten,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
