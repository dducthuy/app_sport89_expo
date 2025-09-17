const sequelize = require("../config/db");
const Giohang = require("../models/giohangM");
const Sanpham = require("../models/sanphamM");
const Khachhang = require("../models/khachhangM");
const { Op, json } = require("sequelize");

exports.getAllbyid = async (req, res) => {
  try {
    const { id } = req.params;

    const checkUser = await Khachhang.findByPk(id);
    if (!checkUser) {
      return res.status(404).json({
        success: false,
        message: "khách hàng không tồn tại",
      });
    }

    const giohang = await Giohang.findAll({
      where: { ma_khach_hang: id },
      include: [{ model: Sanpham, as: "san_pham" }],
    });
    res.status(200).json({
      success: true,
      message: "lấy giỏ hàng thành công",
      data: giohang,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createGioHang = async (req, res) => {
  try {
    const { ma_khach_hang, ma_san_pham, so_luong } = req.body;

    let gioHang = await Giohang.findOne({
      where: { ma_khach_hang, ma_san_pham },
    });

    if (gioHang) {
      gioHang.so_luong += so_luong || 1;
      await gioHang.save();
    } else {
      gioHang = await Giohang.create({
        ma_khach_hang,
        ma_san_pham,
        so_luong: so_luong || 1,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Thành công!',
      data: gioHang
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteGiohang=async(req,res)=>{



    try{
      const {id}=req.params
      const giohang = await Giohang.findByPk(id)

      if(!giohang){
        return res.status(404).json({
            success:false,
            message:"Giỏ hàng không tồn tại"
        })
      }

      await giohang.destroy()
      res.status(200),json({
          success:true,
          message:"thành công!"

      }
      )
      
    }
    catch(error){
        res.status(500).json({error: message})


    }
}
exports.updategiohang = async (req,res)=>{
    try{
        const {id} =req.params
        const {so_luong}=req.body
        let giohang = await Giohang.findByPk(id)
        if(!giohang){
            return res.status(404).json({
                success:false,
                message:"gio hang ko ton tai"
            })
        }

        giohang.so_luong =so_luong
         await giohang.save()

         res.status(200).json({
            success:true,
            message:"oke"
        
         })




    }
   catch(error){
    res.status(500).json({

        error: message
    })
   }



}