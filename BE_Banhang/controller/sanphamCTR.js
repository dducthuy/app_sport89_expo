const { SanPham, DanhMuc, ThuongHieu, DanhGia,AnhSP } = require('../models');
const { Op, Sequelize } = require("sequelize");

exports.getAllSanPham = async (req, res) => {
  try {
    const sanPham = await SanPham.findAll({
      include: [
        { model: DanhMuc, as: 'danh_muc', attributes: ['id', 'ten_danh_muc'] },
        { model: ThuongHieu, as: 'thuong_hieu', attributes: ['id', 'ten_thuong_hieu'] },
        {
          model: DanhGia,
          as: 'danh_gia',
          attributes: []
        },
        {
          model:AnhSP,
          as:'anh_sp',
          attributes:['id','url']
        }
      ],
      attributes: {
        include: [
          [Sequelize.fn('COUNT', Sequelize.col('danh_gia.id')), 'so_luot_danh_gia'],
          [Sequelize.fn('AVG', Sequelize.col('danh_gia.so_sao')), 'trung_binh_sao']
        ]
      },
      group: [
        'SanPham.id',
        'danh_muc.id',
        'thuong_hieu.id',
         'anh_sp.id'
      ],
    });

    res.status(200).json(sanPham);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    res.status(500).json({ error: error.message });
  }
};
exports.getSanPhamTheoDanhMuc = async (req, res) => {
  try {
    const { id } = req.params; // id danh mục

    const sanPham = await SanPham.findAll({
      where: { ma_danh_muc: id },
      include: [
        { model: DanhMuc, as: 'danh_muc', attributes: ['id', 'ten_danh_muc'] },
        { model: ThuongHieu, as: 'thuong_hieu', attributes: ['id', 'ten_thuong_hieu'] },
        {
          model: DanhGia,
          as: 'danh_gia',
          attributes: []
        },
        {
          model: AnhSP,
          as: 'anh_sp',
          attributes: ['id', 'url']
        }
      ],
      attributes: {
        include: [
          [Sequelize.fn('COUNT', Sequelize.col('danh_gia.id')), 'so_luot_danh_gia'],
          [Sequelize.fn('AVG', Sequelize.col('danh_gia.so_sao')), 'trung_binh_sao']
        ]
      },
      group: [
        'SanPham.id',
        'danh_muc.id',
        'thuong_hieu.id',
        'anh_sp.id'
      ],
    });

    res.status(200).json(sanPham);
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm theo danh mục:', error);
    res.status(500).json({ error: error.message });
  }
};
exports.createSanPham = async (req, res) => {
  try {
    const {
      ten_san_pham,
      mo_ta,
      ma_danh_muc,
      ma_thuong_hieu,
      gia_ban,
      gia_khuyen_mai,
      so_luong_ton,
      hinh_anh,
      trang_thai
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!ten_san_pham || !ma_danh_muc || !gia_ban) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: tên sản phẩm, mã danh mục, giá bán'
      });
    }

    const newSanPham = await SanPham.create({
      ten_san_pham,
      mo_ta,
      ma_danh_muc,
      ma_thuong_hieu,
      gia_ban: parseFloat(gia_ban),
      gia_khuyen_mai: gia_khuyen_mai ? parseFloat(gia_khuyen_mai) : null,
      so_luong_ton: so_luong_ton || 0,
      hinh_anh,
      trang_thai: trang_thai !== undefined ? trang_thai : true
    });

    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: newSanPham
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server khi tạo sản phẩm',
      error: error.message 
    });
  }
};
exports.delete = async(req,res)=>{
    try{
        const {id}=req.params
        const sp=await SanPham.findByPk(id);
        if(!sp){

            return res.status(404).json({
                success:false,
                message:"sản phẩm không tồn tại!"
                

            })
        }
         await sp.destroy();

      res.status(200).json({
        success: true,
        message: 'Xóa thành công'
      });


    }

    catch(error){
        res.status(500).json({

            success:false,
            message:"lỗi xóa sản phẩm",
            error:error.message

        })


    }

}



exports.updateSanPham = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ten_san_pham,
      mo_ta,
      ma_danh_muc,
      ma_thuong_hieu,
      gia_ban,
      gia_khuyen_mai,
      so_luong_ton,
      hinh_anh,
      trang_thai
    } = req.body;


    const existingSanPham = await SanPham.findByPk(id);
    if (!existingSanPham) {
      return res.status(404).json({
        success: false,
        message: "Mã sản phẩm không tồn tại!"
      });
    }


    if (ma_danh_muc) {
      const danhMuc = await DanhMuc.findByPk(ma_danh_muc);
      if (!danhMuc) {
        return res.status(400).json({
          success: false,
          message: 'Danh mục không tồn tại'
        });
      }
    }

 
    if (ma_thuong_hieu) {
      const thuongHieu = await ThuongHieu.findByPk(ma_thuong_hieu);
      if (!thuongHieu) {
        return res.status(400).json({
          success: false,
          message: 'Thương hiệu không tồn tại'
        });
      }
    }

    // Chuẩn bị dữ liệu cập nhật
    const updateData = {};
    if (ten_san_pham !== undefined) updateData.ten_san_pham = ten_san_pham;
    if (mo_ta !== undefined) updateData.mo_ta = mo_ta;
    if (ma_danh_muc !== undefined) updateData.ma_danh_muc = ma_danh_muc;
    if (ma_thuong_hieu !== undefined) updateData.ma_thuong_hieu = ma_thuong_hieu;
    if (gia_ban !== undefined) updateData.gia_ban = parseFloat(gia_ban);
    if (gia_khuyen_mai !== undefined) {
      updateData.gia_khuyen_mai = gia_khuyen_mai ? parseFloat(gia_khuyen_mai) : null;
    }
    if (so_luong_ton !== undefined) updateData.so_luong_ton = so_luong_ton;
    if (hinh_anh !== undefined) updateData.hinh_anh = hinh_anh;
    if (trang_thai !== undefined) updateData.trang_thai = trang_thai;


    await existingSanPham.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: existingSanPham
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi update",
      error: error.message
    });
  }
};
exports.getSanPhamById = async (req, res) => {
  try {
    const { id } = req.params;

    const sanPham = await SanPham.findByPk(id, {
      include: [
        {
          model: DanhMuc,
          as: 'danh_muc',
          attributes: ['id', 'ten_danh_muc']
        },
        {
          model: ThuongHieu,
          as: 'thuong_hieu',
          attributes: ['id', 'ten_thuong_hieu']
        }
      ]
    });

    if (!sanPham) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại!"
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lấy thông tin sản phẩm thành công',
      data: sanPham
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin sản phẩm",
      error: error.message
    });
  }
};