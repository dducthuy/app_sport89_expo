const ChiTietDonHang = require('../models/chitietdonhangM');
const DonHang = require('../models/donhangM');
const SanPham = require('../models/sanphamM');
const { Op } = require('sequelize');
const sequelize = require('../config/db');

class ChiTietDonHangController {
  // Thêm sản phẩm vào đơn hàng
  static async addChiTietDonHang(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const {
        ma_don_hang,
        ma_san_pham,
        so_luong
      } = req.body;

      // Validate dữ liệu đầu vào
      if (!ma_don_hang || !ma_san_pham || !so_luong || so_luong < 1) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc hoặc số lượng không hợp lệ'
        });
      }

      // Kiểm tra đơn hàng có tồn tại không
      const donHang = await DonHang.findByPk(ma_don_hang, { transaction });
      if (!donHang) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Đơn hàng không tồn tại'
        });
      }

      // Kiểm tra trạng thái đơn hàng
      if (donHang.trang_thai !== 'Chờ xử lý' && donHang.trang_thai !== 'Đã xác nhận') {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Không thể thêm sản phẩm vào đơn hàng đã được xử lý'
        });
      }

      // Kiểm tra sản phẩm có tồn tại không
      const sanPham = await SanPham.findByPk(ma_san_pham, { transaction });
      if (!sanPham) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Sản phẩm không tồn tại'
        });
      }

      // Kiểm tra sản phẩm đã có trong đơn hàng chưa
      const existingItem = await ChiTietDonHang.findOne({
        where: { ma_don_hang, ma_san_pham },
        transaction
      });

      let chiTietDonHang;
      const thanh_tien = parseFloat(sanPham.gia_ban) * parseInt(so_luong);

      if (existingItem) {
        // Nếu đã có thì cập nhật số lượng
        const newSoLuong = existingItem.so_luong + parseInt(so_luong);
        const newThanhTien = parseFloat(sanPham.gia_ban) * newSoLuong;
        
        chiTietDonHang = await existingItem.update({
          so_luong: newSoLuong,
          thanh_tien: newThanhTien,
          gia_ban: sanPham.gia_ban // Cập nhật giá bán hiện tại
        }, { transaction });
      } else {
        // Tạo mới chi tiết đơn hàng
        chiTietDonHang = await ChiTietDonHang.create({
          ma_don_hang,
          ma_san_pham,
          ten_san_pham: sanPham.ten_san_pham,
          gia_ban: sanPham.gia_ban,
          so_luong: parseInt(so_luong),
          thanh_tien
        }, { transaction });
      }

      // Cập nhật tổng tiền đơn hàng
      await this.updateTongTienDonHang(ma_don_hang, transaction);

      await transaction.commit();

      // Trả về chi tiết đơn hàng với thông tin sản phẩm
      const result = await ChiTietDonHang.findByPk(chiTietDonHang.id, {
        include: [
          {
            model: SanPham,
            as: 'san_pham',
            attributes: ['id', 'ten_san_pham', 'gia_ban', 'hinh_anh']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Thêm sản phẩm vào đơn hàng thành công',
        data: result
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Lỗi thêm chi tiết đơn hàng:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  // Lấy tất cả chi tiết của một đơn hàng
  static async getChiTietByDonHang(req, res) {
    try {
      const { ma_don_hang } = req.params;

      // Kiểm tra đơn hàng có tồn tại không
      const donHang = await DonHang.findByPk(ma_don_hang);
      if (!donHang) {
        return res.status(404).json({
          success: false,
          message: 'Đơn hàng không tồn tại'
        });
      }

      const chiTietDonHang = await ChiTietDonHang.findAll({
        where: { ma_don_hang },
        include: [
          {
            model: SanPham,
            as: 'san_pham',
            attributes: ['id', 'ten_san_pham', 'gia_ban', 'hinh_anh', 'mo_ta']
          }
        ],
        order: [['id', 'ASC']]
      });

      res.json({
        success: true,
        data: chiTietDonHang,
        don_hang: {
          id: donHang.id,
          ma_don_hang: donHang.ma_don_hang,
          trang_thai: donHang.trang_thai,
          tong_tien: donHang.tong_tien
        }
      });
    } catch (error) {
      console.error('Lỗi lấy chi tiết đơn hàng:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  // Lấy chi tiết đơn hàng theo ID
  static async getChiTietById(req, res) {
    try {
      const { id } = req.params;

      const chiTiet = await ChiTietDonHang.findByPk(id, {
        include: [
          {
            model: DonHang,
            as: 'don_hang',
            attributes: ['id', 'ma_don_hang', 'trang_thai']
          },
          {
            model: SanPham,
            as: 'san_pham',
            attributes: ['id', 'ten_san_pham', 'gia_ban', 'hinh_anh', 'mo_ta']
          }
        ]
      });

      if (!chiTiet) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy chi tiết đơn hàng'
        });
      }

      res.json({
        success: true,
        data: chiTiet
      });
    } catch (error) {
      console.error('Lỗi lấy chi tiết đơn hàng:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  // Cập nhật chi tiết đơn hàng
  static async updateChiTietDonHang(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const { id } = req.params;
      const { so_luong, gia_ban } = req.body;

      // Validate dữ liệu
      if (so_luong && so_luong < 1) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Số lượng phải lớn hơn 0'
        });
      }

      const chiTiet = await ChiTietDonHang.findByPk(id, {
        include: [
          {
            model: DonHang,
            as: 'don_hang'
          }
        ],
        transaction
      });

      if (!chiTiet) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy chi tiết đơn hàng'
        });
      }

      // Kiểm tra trạng thái đơn hàng
      if (chiTiet.don_hang.trang_thai !== 'Chờ xử lý' && chiTiet.don_hang.trang_thai !== 'Đã xác nhận') {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Không thể cập nhật chi tiết đơn hàng đã được xử lý'
        });
      }

      // Chuẩn bị dữ liệu cập nhật
      const updateData = {};
      if (so_luong) updateData.so_luong = so_luong;
      if (gia_ban) updateData.gia_ban = gia_ban;

      // Tính lại thành tiền
      const newSoLuong = so_luong || chiTiet.so_luong;
      const newGiaBan = gia_ban || chiTiet.gia_ban;
      updateData.thanh_tien = parseFloat(newGiaBan) * parseInt(newSoLuong);

      await chiTiet.update(updateData, { transaction });

      // Cập nhật tổng tiền đơn hàng
      await this.updateTongTienDonHang(chiTiet.ma_don_hang, transaction);

      await transaction.commit();

      // Lấy lại chi tiết đã cập nhật
      const updatedChiTiet = await ChiTietDonHang.findByPk(id, {
        include: [
          {
            model: SanPham,
            as: 'san_pham',
            attributes: ['id', 'ten_san_pham', 'hinh_anh']
          }
        ]
      });

      res.json({
        success: true,
        message: 'Cập nhật chi tiết đơn hàng thành công',
        data: updatedChiTiet
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Lỗi cập nhật chi tiết đơn hàng:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  // Xóa chi tiết đơn hàng
  static async deleteChiTietDonHang(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const { id } = req.params;

      const chiTiet = await ChiTietDonHang.findByPk(id, {
        include: [
          {
            model: DonHang,
            as: 'don_hang'
          }
        ],
        transaction
      });

      if (!chiTiet) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy chi tiết đơn hàng'
        });
      }

      // Kiểm tra trạng thái đơn hàng
      if (chiTiet.don_hang.trang_thai !== 'Chờ xử lý' && chiTiet.don_hang.trang_thai !== 'Đã xác nhận') {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa chi tiết đơn hàng đã được xử lý'
        });
      }

      const ma_don_hang = chiTiet.ma_don_hang;
      await chiTiet.destroy({ transaction });

      // Cập nhật tổng tiền đơn hàng
      await this.updateTongTienDonHang(ma_don_hang, transaction);

      await transaction.commit();

      res.json({
        success: true,
        message: 'Xóa chi tiết đơn hàng thành công'
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Lỗi xóa chi tiết đơn hàng:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  // Xóa tất cả chi tiết của một đơn hàng
  static async deleteAllChiTietByDonHang(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const { ma_don_hang } = req.params;

      // Kiểm tra đơn hàng
      const donHang = await DonHang.findByPk(ma_don_hang, { transaction });
      if (!donHang) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Đơn hàng không tồn tại'
        });
      }

      if (donHang.trang_thai !== 'Chờ xử lý' && donHang.trang_thai !== 'Đã xác nhận') {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa chi tiết đơn hàng đã được xử lý'
        });
      }

      const deletedCount = await ChiTietDonHang.destroy({
        where: { ma_don_hang },
        transaction
      });

      // Cập nhật tổng tiền đơn hàng về 0
      await donHang.update({ tong_tien: 0, thanh_toan: donHang.phi_ship - donHang.giam_gia }, { transaction });

      await transaction.commit();

      res.json({
        success: true,
        message: `Đã xóa ${deletedCount} chi tiết đơn hàng`
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Lỗi xóa chi tiết đơn hàng:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  // Thống kê chi tiết đơn hàng
  static async thongKeChiTiet(req, res) {
    try {
      const { tu_ngay, den_ngay, ma_don_hang } = req.query;
      
      let whereClause = {};
      let donHangWhereClause = {};

      if (ma_don_hang) {
        whereClause.ma_don_hang = ma_don_hang;
      }

      if (tu_ngay && den_ngay) {
        donHangWhereClause.ngay_dat = {
          [Op.between]: [tu_ngay, den_ngay]
        };
      }

      // Thống kê sản phẩm bán chạy
      const sanPhamBanChay = await ChiTietDonHang.findAll({
        attributes: [
          'ma_san_pham',
          'ten_san_pham',
          [sequelize.fn('SUM', sequelize.col('so_luong')), 'tong_so_luong'],
          [sequelize.fn('SUM', sequelize.col('thanh_tien')), 'tong_doanh_thu'],
          [sequelize.fn('COUNT', sequelize.col('ChiTietDonHang.id')), 'so_don_hang']
        ],
        include: [
          {
            model: DonHang,
            as: 'don_hang',
            where: donHangWhereClause,
            attributes: []
          },
          {
            model: SanPham,
            as: 'san_pham',
            attributes: ['hinh_anh']
          }
        ],
        where: whereClause,
        group: ['ma_san_pham', 'ten_san_pham'],
        order: [[sequelize.fn('SUM', sequelize.col('so_luong')), 'DESC']],
        limit: 10
      });

      // Thống kê tổng quan
      const tongQuan = await ChiTietDonHang.findOne({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('ChiTietDonHang.id')), 'tong_chi_tiet'],
          [sequelize.fn('SUM', sequelize.col('so_luong')), 'tong_so_luong_ban'],
          [sequelize.fn('SUM', sequelize.col('thanh_tien')), 'tong_doanh_thu'],
          [sequelize.fn('AVG', sequelize.col('thanh_tien')), 'gia_tri_trung_binh']
        ],
        include: [
          {
            model: DonHang,
            as: 'don_hang',
            where: donHangWhereClause,
            attributes: []
          }
        ],
        where: whereClause
      });

      res.json({
        success: true,
        data: {
          tong_quan: tongQuan,
          san_pham_ban_chay: sanPhamBanChay
        }
      });
    } catch (error) {
      console.error('Lỗi thống kê chi tiết đơn hàng:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  // Hàm hỗ trợ: Cập nhật tổng tiền đơn hàng
  static async updateTongTienDonHang(ma_don_hang, transaction) {
    try {
      const result = await ChiTietDonHang.findOne({
        where: { ma_don_hang },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('thanh_tien')), 'tong_tien']
        ],
        transaction
      });

      const tong_tien = result.dataValues.tong_tien || 0;
      
      const donHang = await DonHang.findByPk(ma_don_hang, { transaction });
      if (donHang) {
        const thanh_toan = parseFloat(tong_tien) + parseFloat(donHang.phi_ship) - parseFloat(donHang.giam_gia);
        await donHang.update({
          tong_tien: tong_tien,
          thanh_toan: thanh_toan
        }, { transaction });
      }
    } catch (error) {
      console.error('Lỗi cập nhật tổng tiền đơn hàng:', error);
      throw error;
    }
  }
}

module.exports = ChiTietDonHangController;