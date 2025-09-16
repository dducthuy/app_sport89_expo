const { DataTypes } = require("sequelize");
const  sequelize  = require("../config/db");

const ThuongHieu = sequelize.define(
  "ThuongHieu",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    ten_thuong_hieu: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    logo: {
      type: DataTypes.STRING(255),
    },
    trang_thai: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "thuong_hieu",
    timestamps: false,
   
  }
);
 ThuongHieu.associate = function(models) {
    
    ThuongHieu.hasMany(models.SanPham, {
      foreignKey: 'ma_thuong_hieu',
      as: 'san_pham'
    });
    
  };

module.exports=ThuongHieu