
const AnhSP = require("../models/anhsanphamM");
const SanPham = require("../models/sanphamM");

const sequelize = require('../config/db');


const uploadAnh = async (req, res) => {
  try {
    const { ma_san_pham } = req.params

    // Kiểm tra sản phẩm tồn tại
    const sanpham = await SanPham.findByPk(ma_san_pham);
    if (!sanpham) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Nếu không có file
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Chưa chọn ảnh nào" });
    }

    // Lưu từng ảnh vào database
    const anhList = await Promise.all(
      req.files.map(async (file) => {
        return await AnhSP.create({
          ma_san_pham,
          url: `/uploads/${file.filename}`,
        });
      })
    );

    return res.status(201).json({
      message: "Upload ảnh thành công",
      data: anhList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

const getbyid= async (req,res)=>{

    try{ 

        const {id} =req.params
        const sanpham = await SanPham.findByPk(id,{
            include:[
                {
                    model:AnhSP,
                    as: "anh_sp",
                    attributes:["id","url"]
                }
            ]
        })
        if(!sanpham){
            return res.status(400).json({
                success:false,
                message:"san pham ko ton tai"
                
            })
        }
        res.status(200).json({
             success: false,
            message:"oke",
            data:sanpham
            
        })




      
    }
    catch(err){
        res.status(500).json({
            err: message
        })
    }
}

module.exports = { uploadAnh,getbyid };
