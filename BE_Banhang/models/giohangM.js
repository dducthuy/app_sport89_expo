const { DataTypes } = require('sequelize');
const  sequelize  = require('../config/db');


const GioHang = sequelize.define('GioHang', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue:DataTypes.UUIDV4
  },
  ma_khach_hang: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "khach_hang",
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
  so_luong: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    }
  }
}, {
  tableName: 'gio_hang',
  timestamps: true,
  createdAt: 'ngay_them',
  updatedAt: 'ngay_cap_nhat'
});

GioHang.associate = (models) => {

  GioHang.belongsTo(models.KhachHang, {
    foreignKey: 'ma_khach_hang',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'khach_hang'
  });


  GioHang.belongsTo(models.SanPham, {
    foreignKey: 'ma_san_pham',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'san_pham'
  });
};



module.exports=GioHang