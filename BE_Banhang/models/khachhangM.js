const { DataTypes } = require('sequelize');
const  sequelize  = require('../config/db');



const KhachHang = sequelize.define('KhachHang', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue:DataTypes.UUIDV4
  },
  ho_ten: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  
    validate: {
      isEmail: true
    }
  },
  mat_khau: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  so_dien_thoai: {
    type: DataTypes.STRING(15)
  },
  dia_chi: {
    type: DataTypes.TEXT
  },
  ngay_sinh: {
    type: DataTypes.DATEONLY
  },
  gioi_tinh: {
    type: DataTypes.ENUM('Nam', 'Nữ'),
    defaultValue: 'Nam'
  },
  trang_thai: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'khach_hang',
  timestamps: false,
  

 
});


KhachHang.associate =function(models){

 
   KhachHang.hasMany(models.GioHang, {
    foreignKey: 'ma_khach_hang',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'gio_hang'
  });
 KhachHang.hasMany(models.DonHang, {
    foreignKey: 'ma_khach_hang',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'don_hang'
  });


}


module.exports=KhachHang