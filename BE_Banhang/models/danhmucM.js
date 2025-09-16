const { DataTypes } = require('sequelize');
const  sequelize  = require('../config/db');


const DanhMuc = sequelize.define('DanhMuc', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  ten_danh_muc: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  mo_ta: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'danh_muc',
  timestamps: false,

});

 DanhMuc.associate = function(models) {

    DanhMuc.hasMany(models.SanPham, {
      foreignKey: 'ma_danh_muc',
       onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
      as: 'san_pham'
    });
    
  };
module.exports=DanhMuc
