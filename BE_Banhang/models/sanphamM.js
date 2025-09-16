const { DataTypes } = require('sequelize');
const  sequelize  = require('../config/db');


const SanPham = sequelize.define('SanPham', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  ten_san_pham: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  mo_ta: {
    type: DataTypes.TEXT
  },
  ma_danh_muc: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "danh_muc",
      key: 'id'
    }
  },
  ma_thuong_hieu: {
    type: DataTypes.UUID,
    references: {
      model: "thuong_hieu",
      key: 'id'
    }
  },
  gia_ban: {
    type: DataTypes.DECIMAL(12, 0),
    allowNull: false
  },
  gia_khuyen_mai: {
    type: DataTypes.DECIMAL(12, 0)
  },
  so_luong_ton: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  hinh_anh: {
    type: DataTypes.STRING(255)
  },
  trang_thai: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'san_pham',
  timestamps: false,


});

SanPham.associate = (models) => {
  SanPham.belongsTo(models.DanhMuc, {
    foreignKey: 'ma_danh_muc',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'danh_muc'
  });

  SanPham.belongsTo(models.ThuongHieu, {
    foreignKey: 'ma_thuong_hieu',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'thuong_hieu'
  });

  SanPham.hasMany(models.DanhGia, {
    foreignKey: 'ma_san_pham',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'danh_gia'
  });

  SanPham.hasMany(models.ChiTietDonHang, {
    foreignKey: 'ma_san_pham',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'chi_tiet_don_hang'
  });

  SanPham.hasMany(models.GioHang, {
    foreignKey: 'ma_san_pham',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'gio_hang'
  });
};

module.exports=SanPham