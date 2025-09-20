var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sequelize = require('./config/db');
const swaggerDocs = require("./swagger");
require("dotenv").config();
const cors = require('cors');

// Router
const SanPhamR = require("./routes/sanphamR");
const auth = require("./routes/authR");
const danhmucR=require("./routes/danhmucR")
const donhangR=require("./routes/donhhangR")
const giohangR=require("./routes/giohangR")
const khachHangR=require("./routes/khachhangR")
const anhSpRoutes = require("./routes/anhsanphamR");
const PORT = process.env.PORT;

var app = express();

// CORS
app.use(
  cors({
    // In a production environment, you should specify the exact domain of your frontend.
    // For development, reflecting the origin is a common practice, but be aware of security implications.
    origin: (origin, callback) => {
      callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Swagger
swaggerDocs(app, PORT);

// Middleware
app.use(logger('dev'));
app.use(express.json());                          // parse JSON body
app.use(express.urlencoded({ extended: true }));  // parse form-urlencoded
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // cho phép truy cập ảnh
// Routes
app.use("/api/san-pham", SanPhamR);
app.use("/api/auth", auth);
app.use("/api/danh-muc",danhmucR)
app.use("/api/don-hang",donhangR)
app.use("/api/gio-hang",giohangR)
app.use("/api/khach-hang",khachHangR)
app.use("/api/anhsp", anhSpRoutes);
// catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});


// DB connect
async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true }); // Hoặc force: true nếu dev
    console.log('✅ Database đồng bộ xong!');
  } catch (err) {
    console.error('❌ Lỗi đồng bộ database:', err);
  }
}

syncDatabase();
module.exports = app;
