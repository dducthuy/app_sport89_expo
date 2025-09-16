
const DonHang = require('../models/donhangM');
const ChiTietDonHang = require('../models/chitietdonhangM');
const KhachHang = require('../models/khachhangM');
const SanPham = require('../models/sanphamM');
const { Op } = require('sequelize');
const sequelize = require('../config/db');

class DonHangController {
  // Tạo đơn hàng mới
 static async createDonHang(req, res) {
  const t = await sequelize.transaction();
  try {
    const {
      ma_khach_hang,
      phi_ship = 0,
      giam_gia = 0,
      dia_chi_giao,
      sdt_nhan,
      ten_nguoi_nhan,
      phuong_thuc_thanh_toan = 'COD',
      ghi_chu,
      ngay_giao,
      chi_tiet_don_hang
    } = req.body;

    // Validate dữ liệu bắt buộc
    const missingFields = [];
    if (!ma_khach_hang) missingFields.push('ma_khach_hang');
    if (!dia_chi_giao) missingFields.push('dia_chi_giao');
    if (!sdt_nhan) missingFields.push('sdt_nhan');
    if (!ten_nguoi_nhan) missingFields.push('ten_nguoi_nhan');
    if (!chi_tiet_don_hang || chi_tiet_don_hang.length === 0) missingFields.push('chi_tiet_don_hang');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc',
        missing: missingFields
      });
    }

    // Check khách hàng tồn tại
    const khachHang = await KhachHang.findByPk(ma_khach_hang, { transaction: t });
    if (!khachHang) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Khách hàng không tồn tại' });
    }

    // Tính tổng tiền
    const tong_tien = chi_tiet_don_hang.reduce((sum, item) => sum + parseFloat(item.thanh_tien), 0);
    const thanh_toan = tong_tien + parseFloat(phi_ship) - parseFloat(giam_gia);

    // Tạo đơn hàng
    const donHang = await DonHang.create({
      ma_khach_hang,
      tong_tien,
      phi_ship,
      giam_gia,
      thanh_toan,
      dia_chi_giao,
      sdt_nhan,
      ten_nguoi_nhan,
      phuong_thuc_thanh_toan,
      ghi_chu,
      ngay_giao
    }, { transaction: t });

    // Tạo chi tiết đơn hàng và trừ số lượng sản phẩm
    for (const item of chi_tiet_don_hang) {
      // Tạo chi tiết
      await ChiTietDonHang.create({
        ...item,
        ma_don_hang: donHang.id
      }, { transaction: t });

      // Trừ số lượng sản phẩm
      const sanPham = await SanPham.findByPk(item.ma_san_pham, { transaction: t });
      if (!sanPham) {
        await t.rollback();
        return res.status(404).json({ success: false, message: `Sản phẩm ${item.ten_san_pham} không tồn tại` });
      }
      if (sanPham.so_luong_ton< item.so_luong) {
        await t.rollback();
        return res.status(400).json({ success: false, message: `Số lượng sản phẩm ${item.ten_san_pham} không đủ` });
      }
      await sanPham.update({ so_luong: sanPham.so_luong_ton- item.so_luong_ton}, { transaction: t });
    }

    await t.commit();

    const result = await DonHang.findByPk(donHang.id, {
      include: [
        { model: KhachHang, as: 'khach_hang', attributes: ['id', 'ho_ten', 'email', 'so_dien_thoai', 'dia_chi'] },
        { model: ChiTietDonHang, as: 'chi_tiet_don_hang' }
      ]
    });

    res.status(201).json({ success: true, message: 'Tạo đơn hàng thành công', data: result });

  } catch (error) {
    await t.rollback();
    console.error('Lỗi tạo đơn hàng:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
}



  // Lấy tất cả đơn hàng với phân trang
  static async getAllDonHang(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        trang_thai, 
        phuong_thuc_thanh_toan,
        ma_khach_hang,
        search 
      } = req.query;
      
      const offset = (page - 1) * limit;
      const whereClause = {};

      // Lọc theo trạng thái
      if (trang_thai) {
        whereClause.trang_thai = trang_thai;
      }

      // Lọc theo phương thức thanh toán
      if (phuong_thuc_thanh_toan) {
        whereClause.phuong_thuc_thanh_toan = phuong_thuc_thanh_toan;
      }

      // Lọc theo khách hàng
      if (ma_khach_hang) {
        whereClause.ma_khach_hang = ma_khach_hang;
      }

      // Tìm kiếm theo mã đơn hàng hoặc tên người nhận
      if (search) {
        whereClause[Op.or] = [
          { ma_don_hang: { [Op.like]: `%${search}%` } },
          { ten_nguoi_nhan: { [Op.like]: `%${search}%` } },
          { sdt_nhan: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows } = await DonHang.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: KhachHang,
            as: 'khach_hang',
            attributes: ['id', 'ho_ten', 'email', 'so_dien_thoai', 'dia_chi']
          },
          {
            model: ChiTietDonHang,
            as: 'chi_tiet_don_hang',
            include: [
              {
                model: SanPham,
                as: 'san_pham',
                attributes: ['id', 'ten_san_pham', 'hinh_anh']
              }
            ]
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['ngay_dat', 'DESC']]
      });

      res.json({
        success: true,
        data: rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Lỗi lấy danh sách đơn hàng:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  // Lấy đơn hàng theo ID
  static async getDonHangById(req, res) {
    try {
      const { id } = req.params;

      const donHang = await DonHang.findByPk(id, {
        include: [
          {
            model: KhachHang,
            as: 'khach_hang',
            attributes: ['id', 'ho_ten', 'email', 'so_dien_thoai', 'dia_chi']
          },
          {
            model: ChiTietDonHang,
            as: 'chi_tiet_don_hang'
          }
        ]
      });

      if (!donHang) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      res.json({
        success: true,
        data: donHang
      });
    } catch (error) {
      console.error('Lỗi lấy đơn hàng:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  // Cập nhật đơn hàng
  static async updateDonHang(req, res) {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Lấy đơn hàng
    const donHang = await DonHang.findByPk(id, {
      include: [{ model: ChiTietDonHang, as: 'chi_tiet_don_hang' }],
      transaction: t
    });

    if (!donHang) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    // Kiểm tra trạng thái đơn hàng
    if (donHang.trang_thai === 'Đã giao' || donHang.trang_thai === 'Đã hủy') {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Không thể cập nhật đơn hàng đã giao hoặc đã hủy'
      });
    }

    // Cập nhật chi tiết đơn hàng nếu có
    if (updateData.chi_tiet_don_hang) {
      const oldDetails = donHang.chi_tiet_don_hang;

      // Trả lại số lượng cũ vào kho
      for (const item of oldDetails) {
        const sp = await SanPham.findByPk(item.ma_san_pham, { transaction: t });
        if (sp) {
          sp.so_luong += item.so_luong;
          await sp.save({ transaction: t });
        }
      }

      // Xóa chi tiết cũ
      await ChiTietDonHang.destroy({ where: { ma_don_hang: donHang.id }, transaction: t });

      // Thêm chi tiết mới
      const chiTietData = updateData.chi_tiet_don_hang.map(item => ({
        ...item,
        ma_don_hang: donHang.id
      }));
      await ChiTietDonHang.bulkCreate(chiTietData, { transaction: t });

      // Trừ số lượng mới từ kho
      for (const item of chiTietData) {
        const sp = await SanPham.findByPk(item.ma_san_pham, { transaction: t });
        if (sp) {
          sp.so_luong -= item.so_luong;
          if (sp.so_luong < 0) throw new Error(`Sản phẩm ${sp.ten_san_pham} không đủ kho`);
          await sp.save({ transaction: t });
        }
      }

      // Tính tổng tiền từ chi tiết mới
      const tong_tien = chiTietData.reduce((sum, item) => sum + parseFloat(item.thanh_tien || 0), 0);
      updateData.tong_tien = tong_tien;
      const phi_ship = parseFloat(updateData.phi_ship ?? donHang.phi_ship);
      const giam_gia = parseFloat(updateData.giam_gia ?? donHang.giam_gia);
      updateData.thanh_toan = tong_tien + phi_ship - giam_gia;
    } else {
      // Nếu không thay đổi chi tiết, vẫn tính lại thanh toán nếu phi_ship/giam_gia thay đổi
      if (updateData.phi_ship || updateData.giam_gia) {
        const tong_tien = parseFloat(updateData.tong_tien ?? donHang.tong_tien);
        const phi_ship = parseFloat(updateData.phi_ship ?? donHang.phi_ship);
        const giam_gia = parseFloat(updateData.giam_gia ?? donHang.giam_gia);
        updateData.thanh_toan = tong_tien + phi_ship - giam_gia;
      }
    }

    // Cập nhật đơn hàng
    await donHang.update(updateData, { transaction: t });

    await t.commit();

    // Lấy lại đơn hàng mới
    const result = await DonHang.findByPk(donHang.id, {
      include: [
        { model: KhachHang, as: 'khach_hang', attributes: ['id', 'ho_ten', 'email', 'so_dien_thoai', 'dia_chi'] },
        { model: ChiTietDonHang, as: 'chi_tiet_don_hang', include: [{ model: SanPham, as: 'san_pham', attributes: ['id', 'ten_san_pham', 'hinh_anh'] }] }
      ]
    });

    res.json({
      success: true,
      message: 'Cập nhật đơn hàng thành công',
      data: result
    });

  } catch (error) {
    await t.rollback();
    console.error('Lỗi cập nhật đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
}

  // Cập nhật trạng thái đơn hàng
  static async updateTrangThai(req, res) {
    try {
      const { id } = req.params;
      const { trang_thai } = req.body;

      const validStates = ['Chờ xử lý', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy'];
      if (!validStates.includes(trang_thai)) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái không hợp lệ'
        });
      }

      const donHang = await DonHang.findByPk(id);
      if (!donHang) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      // Kiểm tra logic chuyển trạng thái
      const currentState = donHang.trang_thai;
      if (currentState === 'Đã giao' || currentState === 'Đã hủy') {
        return res.status(400).json({
          success: false,
          message: 'Không thể thay đổi trạng thái đơn hàng đã hoàn thành'
        });
      }

      await donHang.update({ trang_thai });

      res.json({
        success: true,
        message: `Cập nhật trạng thái thành "${trang_thai}" thành công`,
        data: donHang
      });
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  // Hủy đơn hàng
  static async huyDonHang(req, res) {
    try {
      const { id } = req.params;
      const { ly_do_huy } = req.body;

      const donHang = await DonHang.findByPk(id);
      if (!donHang) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      if (donHang.trang_thai === 'Đã giao' || donHang.trang_thai === 'Đã hủy') {
        return res.status(400).json({
          success: false,
          message: 'Không thể hủy đơn hàng đã giao hoặc đã hủy'
        });
      }

      await donHang.update({
        trang_thai: 'Đã hủy',
        ghi_chu: ly_do_huy ? `${donHang.ghi_chu || ''}\nLý do hủy: ${ly_do_huy}` : donHang.ghi_chu
      });

      res.json({
        success: true,
        message: 'Hủy đơn hàng thành công',
        data: donHang
      });
    } catch (error) {
      console.error('Lỗi hủy đơn hàng:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  // Xóa đơn hàng (soft delete hoặc hard delete)
  static async deleteDonHang(req, res) {
    try {
      const { id } = req.params;

      const donHang = await DonHang.findByPk(id);
      if (!donHang) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      await donHang.destroy();

      res.json({
        success: true,
        message: 'Xóa đơn hàng thành công'
      });
    } catch (error) {
      console.error('Lỗi xóa đơn hàng:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  // Thống kê đơn hàng
  static async thongKeDonHang(req, res) {
    try {
      const { tu_ngay, den_ngay } = req.query;
      
      let whereClause = {};
      if (tu_ngay && den_ngay) {
        whereClause.ngay_dat = {
          [Op.between]: [tu_ngay, den_ngay]
        };
      }

      // Thống kê theo trạng thái
      const thongKeTheoTrangThai = await DonHang.findAll({
        where: whereClause,
        attributes: [
          'trang_thai',
          [sequelize.fn('COUNT', sequelize.col('id')), 'so_luong'],
          [sequelize.fn('SUM', sequelize.col('thanh_toan')), 'tong_tien']
        ],
        group: ['trang_thai']
      });

      // Thống kê theo phương thức thanh toán
      const thongKeTheoThanhToan = await DonHang.findAll({
        where: whereClause,
        attributes: [
          'phuong_thuc_thanh_toan',
          [sequelize.fn('COUNT', sequelize.col('id')), 'so_luong'],
          [sequelize.fn('SUM', sequelize.col('thanh_toan')), 'tong_tien']
        ],
        group: ['phuong_thuc_thanh_toan']
      });

      // Tổng quan
      const tongQuan = await DonHang.findOne({
        where: whereClause,
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'tong_don_hang'],
          [sequelize.fn('SUM', sequelize.col('thanh_toan')), 'tong_doanh_thu'],
          [sequelize.fn('AVG', sequelize.col('thanh_toan')), 'gia_tri_trung_binh']
        ]
      });

      res.json({
        success: true,
        data: {
          tong_quan: tongQuan,
          theo_trang_thai: thongKeTheoTrangThai,
          theo_thanh_toan: thongKeTheoThanhToan
        }
      });
    } catch (error) {
      console.error('Lỗi thống kê đơn hàng:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }
}

module.exports = DonHangController;