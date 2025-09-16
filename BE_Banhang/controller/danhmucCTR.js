const DanhMuc = require('../models/danhmucM'); 
const { Op } = require('sequelize');

const danhmucController = {
  // Lấy tất cả danh mục

getAll: async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;
    
    let whereCondition = {};
    
    if (search) {
      whereCondition.ten_danh_muc = {
        [Op.like]: `%${search}%`
      };
    }
    
    const result = await DanhMuc.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['ten_danh_muc', 'ASC']] // ✅ Sửa: dùng ten_danh_muc thay vì createdAt
    });
    
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách danh mục thành công',
      data: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(result.count / limit),
        totalItems: result.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Lỗi khi lấy danh sách danh mục:', err);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server khi lấy danh sách danh mục',
      error: err.message 
    });
  }
},
  // Lấy danh mục theo ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const danhMuc = await DanhMuc.findByPk(id, {
        include: [
          {
            association: 'san_pham',
            attributes: ['id', 'ten_san_pham', 'gia_ban', 'trang_thai']
          }
        ]
      });
      
      if (!danhMuc) {
        return res.status(404).json({ 
          success: false,
          message: 'Không tìm thấy danh mục' 
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Lấy thông tin danh mục thành công',
        data: danhMuc
      });
    } catch (err) {
      console.error('Lỗi khi lấy danh mục:', err);
      res.status(500).json({ 
        success: false,
        message: 'Lỗi server khi lấy danh mục',
        error: err.message 
      });
    }
  },

  // Tạo danh mục mới
  create: async (req, res) => {
    try {
      const { ten_danh_muc, mo_ta } = req.body;
      
      // Validation
      if (!ten_danh_muc || ten_danh_muc.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Tên danh mục không được để trống'
        });
      }
      
      // Kiểm tra tên danh mục đã tồn tại (kiểm tra thủ công vì không có unique constraint)
      const existingDanhMuc = await DanhMuc.findOne({
        where: {
          ten_danh_muc: ten_danh_muc.trim()
        }
      });
      
      if (existingDanhMuc) {
        return res.status(400).json({
          success: false,
          message: 'Tên danh mục đã tồn tại'
        });
      }
      
      const newDanhMuc = await DanhMuc.create({ 
        ten_danh_muc: ten_danh_muc.trim(), 
        mo_ta: mo_ta ? mo_ta.trim() : null
      });
      
      res.status(201).json({
        success: true,
        message: 'Tạo danh mục thành công',
        data: newDanhMuc
      });
    } catch (err) {
      console.error('Lỗi khi tạo danh mục:', err);
      res.status(400).json({ 
        success: false,
        message: 'Lỗi khi tạo danh mục',
        error: err.message 
      });
    }
  },

  // Cập nhật danh mục
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { ten_danh_muc, mo_ta } = req.body;
      
      const danhMuc = await DanhMuc.findByPk(id);
      if (!danhMuc) {
        return res.status(404).json({ 
          success: false,
          message: 'Không tìm thấy danh mục' 
        });
      }
      
      // Validation tên danh mục nếu được cập nhật
      if (ten_danh_muc && ten_danh_muc.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Tên danh mục không được để trống'
        });
      }
      
      // Kiểm tra tên danh mục đã tồn tại (ngoại trừ chính nó)
      if (ten_danh_muc && ten_danh_muc.trim() !== danhMuc.ten_danh_muc) {
        const existingDanhMuc = await DanhMuc.findOne({
          where: {
            ten_danh_muc: ten_danh_muc.trim(),
            id: { [Op.ne]: id }
          }
        });
        
        if (existingDanhMuc) {
          return res.status(400).json({
            success: false,
            message: 'Tên danh mục đã tồn tại'
          });
        }
      }
      
      // Chuẩn bị dữ liệu cập nhật
      const updateData = {};
      if (ten_danh_muc !== undefined) {
        updateData.ten_danh_muc = ten_danh_muc.trim();
      }
      if (mo_ta !== undefined) {
        updateData.mo_ta = mo_ta ? mo_ta.trim() : null;
      }
      
      await danhMuc.update(updateData);
      
      res.status(200).json({
        success: true,
        message: 'Cập nhật danh mục thành công',
        data: danhMuc
      });
    } catch (err) {
      console.error('Lỗi khi cập nhật danh mục:', err);
      res.status(400).json({ 
        success: false,
        message: 'Lỗi khi cập nhật danh mục',
        error: err.message 
      });
    }
  },

  // Xóa danh mục
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      
      const danhMuc = await DanhMuc.findByPk(id);
      if (!danhMuc) {
        return res.status(404).json({ 
          success: false,
          message: 'Không tìm thấy danh mục' 
        });
      }
      
      // Kiểm tra xem danh mục có sản phẩm không
      const sanPhamCount = await danhMuc.countSan_pham();
      if (sanPhamCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Không thể xóa danh mục vì còn ${sanPhamCount} sản phẩm đang sử dụng`
        });
      }
      
      await danhMuc.destroy();
      
      res.status(200).json({ 
        success: true,
        message: 'Đã xóa danh mục thành công' 
      });
    } catch (err) {
      console.error('Lỗi khi xóa danh mục:', err);
      res.status(500).json({ 
        success: false,
        message: 'Lỗi server khi xóa danh mục',
        error: err.message 
      });
    }
  },

  // Lấy danh sách danh mục cho dropdown (không phân trang)
  getForDropdown: async (req, res) => {
    try {
      const danhMucs = await DanhMuc.findAll({
        attributes: ['id', 'ten_danh_muc'],
        order: [['ten_danh_muc', 'ASC']]
      });
      
      res.status(200).json({
        success: true,
        message: 'Lấy danh sách danh mục thành công',
        data: danhMucs
      });
    } catch (err) {
      console.error('Lỗi khi lấy danh sách danh mục cho dropdown:', err);
      res.status(500).json({ 
        success: false,
        message: 'Lỗi server',
        error: err.message 
      });
    }
  }
};

module.exports = danhmucController;
