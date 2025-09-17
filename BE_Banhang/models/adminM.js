
const { DataTypes } = require("sequelize");
const  sequelize  = require("../config/db");


const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
     defaultValue:DataTypes.UUIDV4
  },
  ten_dang_nhap: {
    type: DataTypes.STRING(50),
    allowNull: false,
  
  },
  mat_khau: {
    type: DataTypes.STRING(255),
    allowNull: false
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
  quyen_han: {
    type: DataTypes.ENUM('Admin', 'Nhân viên'),
    defaultValue: 'Nhân viên'
  },
  trang_thai: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'admin',
  timestamps: true,
  createdAt: 'ngay_tao',
  updatedAt: 'ngay_cap_nhat'
});


module.exports=Admin