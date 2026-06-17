const express = require("express");
const router = express.Router();
const { sql } = require("../db");

// ===============================
// Lấy danh sách thành viên của tủ lạnh
// GET /share/members/:maTuLanh
// ===============================
router.get("/members/:maTuLanh", async (req, res) => {

    const maTuLanh = req.params.maTuLanh;

    try {

        const result = await sql.query`
            SELECT
                nd.MaNguoiDung,
                nd.HoTen,
                nd.Email,
                tv.VaiTro,
                tv.NgayThamGia
            FROM ThanhVienTuLanh tv
            JOIN NguoiDung nd
            ON tv.MaNguoiDung = nd.MaNguoiDung
            WHERE tv.MaTuLanh = ${maTuLanh}
        `;

        res.json(result.recordset);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Lỗi lấy danh sách thành viên"
        });

    }

});


// ===============================
// Thêm thành viên vào tủ lạnh
// POST /share/add-member
// ===============================
router.post("/add-member", async (req, res) => {

    const {
        MaNguoiDung,
        MaTuLanh,
        VaiTro
    } = req.body;

    try {

        await sql.query`
            INSERT INTO ThanhVienTuLanh
            (
                MaNguoiDung,
                MaTuLanh,
                VaiTro
            )

            VALUES

            (
                ${MaNguoiDung},
                ${MaTuLanh},
                ${VaiTro || "ThanhVien"}
            )
        `;

        res.json({
            message: "Thêm thành viên thành công"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Không thể thêm thành viên"
        });

    }

});


// ===============================
// Xóa thành viên khỏi tủ lạnh
// DELETE /share/remove-member/:maNguoiDung/:maTuLanh
// ===============================
router.delete("/remove-member/:maNguoiDung/:maTuLanh", async (req, res) => {

    const maNguoiDung = req.params.maNguoiDung;
    const maTuLanh = req.params.maTuLanh;

    try {

        await sql.query`
            DELETE
            FROM ThanhVienTuLanh

            WHERE

            MaNguoiDung = ${maNguoiDung}

            AND

            MaTuLanh = ${maTuLanh}
        `;

        res.json({
            message: "Đã xóa thành viên"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Không thể xóa thành viên"
        });

    }

});


// ===============================
// Lấy danh sách thực phẩm chung
// GET /share/foods/:maTuLanh
// ===============================
router.get("/foods/:maTuLanh", async (req, res) => {

    const maTuLanh = req.params.maTuLanh;

    try {

        const result = await sql.query`
            SELECT tp.*

            FROM ThucPham tp

            JOIN NganTu nt

            ON tp.MaNgan = nt.MaNgan

            WHERE nt.MaTuLanh = ${maTuLanh}
        `;

        res.json(result.recordset);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Lỗi lấy danh sách thực phẩm"
        });

    }

});

module.exports = router;