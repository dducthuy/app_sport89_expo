const KhachHang = require('../models/KhachHang');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Lấy tất cả khách hàng
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, gioi_tinh, trang_thai } = req.query;
    const offset = (page - 1) * limit;
    
    let whereCondition = {};
    
    // Tìm kiếm theo tên hoặc email
    if (search) {
      whereCondition[Op.or] = [
        { ho_ten: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { so_dien_thoai: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Lọc theo giới tính
    if (gioi_tinh) {
      whereCondition.gioi_tinh = gioi_tinh;
    }
    
    // Lọc theo trạng thái
    if (trang_thai !== undefined) {
      whereCondition.trang_thai = trang_thai === 'true';
    }
    
    const result = await KhachHang.findAndCountAll({
      where: whereCondition,
      attributes: { exclude: ['mat_khau'] }, // Không trả về mật khẩu
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['ho_ten', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách khách hàng thành công',
      data: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(result.count / limit),
        totalItems: result.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Lỗi khi lấy danh sách khách hàng:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách khách hàng',
      error: err.message
    });
  }
};

// Lấy khách hàng theo ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const khachHang = await KhachHang.findByPk(id, {
      attributes: { exclude: ['mat_khau'] },
      include: [
        {
          association: 'gio_hang',
          attributes: ['id', 'so_luong']
        },
        {
          association: 'don_hang',
          attributes: ['id', 'tong_tien', 'trang_thai']
        }
      ]
    });
    
    if (!khachHang) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách hàng'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Lấy thông tin khách hàng thành công',
      data: khachHang
    });
  } catch (err) {
    console.error('Lỗi khi lấy khách hàng:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy khách hàng',
      error: err.message
    });
  }
};

// Đăng ký khách hàng mới
exports.register = async (req, res) => {
  try {
    const {
      ho_ten,
      email,
      mat_khau,
      so_dien_thoai,
      dia_chi,
      ngay_sinh,
      gioi_tinh
    } = req.body;

    // Validation
    if (!ho_ten || !email || !mat_khau) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: họ tên, email, mật khẩu'
      });
    }

    // Kiểm tra email đã tồn tại
    const existingKhachHang = await KhachHang.findOne({
      where: { email: email.toLowerCase() }
    });

    if (existingKhachHang) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Mã hóa mật khẩu
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(mat_khau, saltRounds);

    // Tạo khách hàng mới
    const newKhachHang = await KhachHang.create({
      ho_ten: ho_ten.trim(),
      email: email.toLowerCase().trim(),
      mat_khau: hashedPassword,
      so_dien_thoai,
      dia_chi,
      ngay_sinh,
      gioi_tinh: gioi_tinh || 'Nam'
    });

    // Trả về thông tin khách hàng (không bao gồm mật khẩu)
    const { mat_khau: _, ...khachHangData } = newKhachHang.toJSON();

    res.status(201).json({
      success: true,
      message: 'Đăng ký khách hàng thành công',
      data: khachHangData
    });
  } catch (err) {
    console.error('Lỗi khi đăng ký khách hàng:', err);
    res.status(400).json({
      success: false,
      message: 'Lỗi khi đăng ký khách hàng',
      error: err.message
    });
  }
};

// Đăng nhập khách hàng
exports.login = async (req, res) => {
  try {
    const { email, mat_khau } = req.body;

    // Validation
    if (!email || !mat_khau) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu email hoặc mật khẩu'
      });
    }

    // Tìm khách hàng theo email
    const khachHang = await KhachHang.findOne({
      where: { 
        email: email.toLowerCase(),
        trang_thai: true 
      }
    });

    if (!khachHang) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(mat_khau, khachHang.mat_khau);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { 
        id: khachHang.id, 
        email: khachHang.email,
        role: 'customer'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Trả về thông tin khách hàng và token
    const { mat_khau: _, ...khachHangData } = khachHang.toJSON();

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        khachHang: khachHangData,
        token
      }
    });
  } catch (err) {
    console.error('Lỗi khi đăng nhập:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập',
      error: err.message
    });
  }
};

// Cập nhật thông tin khách hàng
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ho_ten,
      so_dien_thoai,
      dia_chi,
      ngay_sinh,
      gioi_tinh
    } = req.body;

    const khachHang = await KhachHang.findByPk(id);
    if (!khachHang) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách hàng'
      });
    }

    // Chuẩn bị dữ liệu cập nhật
    const updateData = {};
    if (ho_ten !== undefined) updateData.ho_ten = ho_ten.trim();
    if (so_dien_thoai !== undefined) updateData.so_dien_thoai = so_dien_thoai;
    if (dia_chi !== undefined) updateData.dia_chi = dia_chi;
    if (ngay_sinh !== undefined) updateData.ngay_sinh = ngay_sinh;
    if (gioi_tinh !== undefined) updateData.gioi_tinh = gioi_tinh;

    await khachHang.update(updateData);

    // Trả về thông tin đã cập nhật (không bao gồm mật khẩu)
    const { mat_khau: _, ...khachHangData } = khachHang.toJSON();

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin khách hàng thành công',
      data: khachHangData
    });
  } catch (err) {
    console.error('Lỗi khi cập nhật khách hàng:', err);
    res.status(400).json({
      success: false,
      message: 'Lỗi khi cập nhật khách hàng',
      error: err.message
    });
  }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { mat_khau_cu, mat_khau_moi } = req.body;

    // Validation
    if (!mat_khau_cu || !mat_khau_moi) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu mật khẩu cũ hoặc mật khẩu mới'
      });
    }

    const khachHang = await KhachHang.findByPk(id);
    if (!khachHang) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách hàng'
      });
    }

    // Kiểm tra mật khẩu cũ
    const isOldPasswordValid = await bcrypt.compare(mat_khau_cu, khachHang.mat_khau);
    if (!isOldPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu cũ không đúng'
      });
    }

    // Mã hóa mật khẩu mới
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(mat_khau_moi, saltRounds);

    await khachHang.update({ mat_khau: hashedNewPassword });

    res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (err) {
    console.error('Lỗi khi đổi mật khẩu:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đổi mật khẩu',
      error: err.message
    });
  }
};

// Khóa/mở khóa tài khoản khách hàng
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const khachHang = await KhachHang.findByPk(id);
    if (!khachHang) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách hàng'
      });
    }

    await khachHang.update({ trang_thai: !khachHang.trang_thai });

    res.status(200).json({
      success: true,
      message: `${khachHang.trang_thai ? 'Kích hoạt' : 'Khóa'} tài khoản thành công`,
      data: { trang_thai: khachHang.trang_thai }
    });
  } catch (err) {
    console.error('Lỗi khi thay đổi trạng thái khách hàng:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: err.message
    });
  }
};

// Xóa khách hàng (hard delete)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const khachHang = await KhachHang.findByPk(id);
    if (!khachHang) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách hàng'
      });
    }

    await khachHang.destroy();

    res.status(200).json({
      success: true,
      message: 'Xóa khách hàng thành công'
    });
  } catch (err) {
    console.error('Lỗi khi xóa khách hàng:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa khách hàng',
      error: err.message
    });
  }
};