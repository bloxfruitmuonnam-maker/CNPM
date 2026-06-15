CREATE TRIGGER trg_ThongBaoSapHetHan
ON ThucPham
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO ThongBao
    (
        MaThucPham,
        NoiDung,
        DaDoc,
        NgayThongBao
    )
    SELECT
        i.MaThucPham,
        N'Thực phẩm "' + i.TenThucPham +
        N'" sắp hết hạn vào ' +
        CONVERT(NVARCHAR(10), i.HanSuDung, 103),
        0,
        GETDATE()
    FROM inserted i
    WHERE DATEDIFF(DAY, GETDATE(), i.HanSuDung) BETWEEN 0 AND 3;
END;
GO






CREATE TRIGGER trg_LuuLichSuThem
ON ThucPham
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO LichSu
    (
        MaNguoiDung,
        MaThucPham,
        HanhDong,
        ThoiGian
    )
    SELECT
        1,
        i.MaThucPham,
        N'Thêm thực phẩm',
        GETDATE()
    FROM inserted i;
END;
GO







CREATE TRIGGER trg_LuuLichSuCapNhat
ON ThucPham
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO LichSu
    (
        MaNguoiDung,
        MaThucPham,
        HanhDong,
        ThoiGian
    )
    SELECT
        1,
        i.MaThucPham,
        N'Cập nhật thực phẩm',
        GETDATE()
    FROM inserted i;
END;
GO






CREATE TRIGGER trg_LuuLichSuXoa
ON ThucPham
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO LichSu
    (
        MaNguoiDung,
        MaThucPham,
        HanhDong,
        ThoiGian
    )
    SELECT
        1,
        d.MaThucPham,
        N'Xóa thực phẩm',
        GETDATE()
    FROM deleted d;
END;
GO