const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AnhSP = sequelize.define("AnhSP", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,        // <-- viết đúng
    defaultValue: DataTypes.UUIDV4,
  },
  ma_san_pham: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "san_pham",
      key: "id",
    },
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "anh_sp",
  timestamps: false,
});

// Định nghĩa quan hệ
AnhSP.associate = (models) => {
  AnhSP.belongsTo(models.SanPham, {
    foreignKey: "ma_san_pham",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: "san_pham",
  });
};

module.exports = AnhSP;
