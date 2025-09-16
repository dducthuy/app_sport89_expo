const { DataTypes } = require('sequelize');
const  sequelize  = require('../config/db');


const DonHang = sequelize.define('DonHang', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
   defaultValue:DataTypes.UUIDV4
  },
  ma_khach_hang: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model:"khach_hang" ,
      key: 'id'
    }
  },
  tong_tien: {
    type: DataTypes.DECIMAL(12, 0),
    allowNull: false
  },
  phi_ship: {
    type: DataTypes.DECIMAL(12, 0),
    defaultValue: 0
  },
  giam_gia: {
    type: DataTypes.DECIMAL(12, 0),
    defaultValue: 0
  },
  thanh_toan: {
    type: DataTypes.DECIMAL(12, 0),
    allowNull: false
  },
  dia_chi_giao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sdt_nhan: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  ten_nguoi_nhan: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  trang_thai: {
    type: DataTypes.ENUM('Chờ xử lý', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy'),
    defaultValue: 'Chờ xử lý'
  },
  phuong_thuc_thanh_toan: {
    type: DataTypes.ENUM('COD', 'Banking', 'Momo', 'ZaloPay'),
    defaultValue: 'COD'
  },
  ghi_chu: {
    type: DataTypes.TEXT
  },
  ngay_giao: {
    type: DataTypes.DATEONLY
  }
}, {
  tableName: 'don_hang',
  timestamps: true,
  createdAt: 'ngay_dat',
  updatedAt: 'ngay_cap_nhat',
 
});

DonHang.associate = (models) => {
  // Đơn hàng thuộc về 1 khách hàng
  DonHang.belongsTo(models.KhachHang, {
    foreignKey: 'ma_khach_hang',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'khach_hang'
  });

  // Đơn hàng có nhiều chi tiết đơn hàng
  DonHang.hasMany(models.ChiTietDonHang, {
    foreignKey: 'ma_don_hang',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'chi_tiet_don_hang'
  });
};


module.exports=DonHang