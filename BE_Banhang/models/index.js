const  sequelize  = require("../config/db");

const AnhSP =require("./anhsanphamM")
const DanhMuc = require("./danhmucM");
const ThuongHieu = require("./thuonghieuM");
const SanPham = require("./sanphamM");
const KhachHang = require("./khachhangM");
const GioHang = require("./giohangM");
const DonHang = require("./donhangM");
const ChiTietDonHang = require("./chitietdonhangM");
const Admin = require("./adminM");
const MaGiamGia = require("./magiamgiaM");
const DanhGia = require("./danhgiaM");
const db = {
  sequelize,
  DanhMuc,
  ThuongHieu,
  SanPham,
  KhachHang,
  GioHang,
  DonHang,
  ChiTietDonHang,
  Admin,
  MaGiamGia,
  DanhGia,
  AnhSP
};
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
module.exports = db;






// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
