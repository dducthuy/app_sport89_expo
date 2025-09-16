const { DataTypes } = require('sequelize');
const  sequelize  = require('../config/db');

const DanhGia = sequelize.define('DanhGia', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue:DataTypes.UUIDV4
  },
  ma_san_pham: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "san_pham",
      key: 'id'
    }
  },
  ma_khach_hang: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "khach_hang",
      key: 'id'
    }
  },
  so_sao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  noi_dung: {
    type: DataTypes.TEXT
  },
  trang_thai: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'danh_gia',
  timestamps: true,
  createdAt: 'ngay_danh_gia',
  updatedAt: false
});


DanhGia.associate =function(models){

 DanhGia.belongsTo(models.SanPham, {
    foreignKey: 'ma_san_pham',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'san_pham'
  });


    DanhGia.belongsTo(models.KhachHang, {
    foreignKey: 'ma_khach_hang',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'khach_hang'
  });




}


module.exports=DanhGia