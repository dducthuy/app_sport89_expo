const { DataTypes } = require('sequelize');
const  sequelize  = require('../config/db');



const ChiTietDonHang = sequelize.define('ChiTietDonHang', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
     defaultValue:DataTypes.UUIDV4
  },
  ma_don_hang: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "don_hang",
      key: 'id'
    }
  },
  ma_san_pham: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "san_pham",
      key: 'id'
    }
  },
  ten_san_pham: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  gia_ban: {
    type: DataTypes.DECIMAL(12, 0),
    allowNull: false
  },
  so_luong: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  thanh_tien: {
    type: DataTypes.DECIMAL(12, 0),
    allowNull: false
  }
}, {
  tableName: 'chi_tiet_don_hang',
  timestamps: false
});

ChiTietDonHang.associate = (models) => {
  // Chi tiết đơn hàng thuộc về 1 đơn hàng
  ChiTietDonHang.belongsTo(models.DonHang, {
    foreignKey: 'ma_don_hang',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'don_hang'
  });

  ChiTietDonHang.belongsTo(models.SanPham, {
    foreignKey: 'ma_san_pham',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'san_pham'
  });
};


module.exports=ChiTietDonHang