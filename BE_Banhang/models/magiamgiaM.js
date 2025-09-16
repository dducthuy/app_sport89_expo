const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const MaGiamGia = sequelize.define('MaGiamGia', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue:DataTypes.UUIDV4
  },
  ma_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  ten_ma: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  gia_tri_giam: {
    type: DataTypes.DECIMAL(12, 0),
    allowNull: false
  },
  loai_giam: {
    type: DataTypes.ENUM('Tiền mặt', 'Phần trăm'),
    defaultValue: 'Tiền mặt'
  },
  don_hang_toi_thieu: {
    type: DataTypes.DECIMAL(12, 0),
    defaultValue: 0
  },
  so_luong: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  da_su_dung: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ngay_bat_dau: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  ngay_ket_thuc: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  trang_thai: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'ma_giam_gia',
  timestamps: false,
  
  validate: {
    ngayHopLe() {
      if (this.ngay_bat_dau >= this.ngay_ket_thuc) {
        throw new Error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
      }
    }
  }
});
module.exports=MaGiamGia
