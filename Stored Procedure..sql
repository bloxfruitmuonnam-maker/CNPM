CREATE PROCEDURE sp_ThemThucPham
(
    @TenThucPham NVARCHAR(100),
    @SoLuong INT,
    @DonVi NVARCHAR(20),
    @NgayThem DATE,
    @HanSuDung DATE,
    @TrangThai NVARCHAR(30),
    @GhiChu NVARCHAR(255),
    @HinhAnh NVARCHAR(255),
    @MaDanhMuc INT,
    @MaNgan INT
)
AS
BEGIN
INSERT INTO ThucPham
(
TenThucPham,
SoLuong,
DonVi,
NgayThem,
HanSuDung,
TrangThai,
GhiChu,
HinhAnh,
MaDanhMuc,
MaNgan
)
VALUES
(
@TenThucPham,
@SoLuong,
@DonVi,
@NgayThem,
@HanSuDung,
@TrangThai,
@GhiChu,
@HinhAnh,
@MaDanhMuc,
@MaNgan
);
END;




CREATE PROCEDURE sp_CapNhatThucPham
@MaThucPham INT,
@SoLuong INT,
@HanSuDung DATE
AS
BEGIN
UPDATE ThucPham
SET
SoLuong=@SoLuong,
HanSuDung=@HanSuDung
WHERE MaThucPham=@MaThucPham;
END;





CREATE PROCEDURE sp_XoaThucPham
@MaThucPham INT
AS
BEGIN
DELETE FROM ThucPham
WHERE MaThucPham=@MaThucPham;
END;




CREATE PROCEDURE sp_DanhSachThucPham
AS
BEGIN
SELECT *
FROM ThucPham;
END;






CREATE PROCEDURE sp_TimThucPhamTheoTen
@Ten NVARCHAR(100)
AS
BEGIN
SELECT *
FROM ThucPham
WHERE TenThucPham LIKE '%' + @Ten + '%';
END;





CREATE PROCEDURE sp_ThucPhamSapHetHan
AS
BEGIN
SELECT *
FROM ThucPham
WHERE HanSuDung <= DATEADD(DAY,3,GETDATE());
END;





CREATE PROCEDURE sp_ThongKeDanhMuc
AS
BEGIN
SELECT
d.TenDanhMuc,
COUNT(*) SoLuong
FROM ThucPham t
JOIN DanhMuc d
ON t.MaDanhMuc=d.MaDanhMuc
GROUP BY d.TenDanhMuc;
END;





CREATE PROCEDURE sp_XemTheoNgan
@MaNgan INT
AS
BEGIN
SELECT *
FROM ThucPham
WHERE MaNgan=@MaNgan;
END;







CREATE PROCEDURE sp_ThemCongThuc
@TenMon NVARCHAR(100),
@MoTa NVARCHAR(MAX),
@NguyenLieu NVARCHAR(MAX),
@CachLam NVARCHAR(MAX),
@HinhAnh NVARCHAR(255)
AS
BEGIN
INSERT INTO CongThucMonAn
(
TenMon,
MoTa,
NguyenLieu,
CachLam,
HinhAnh
)
VALUES
(
@TenMon,
@MoTa,
@NguyenLieu,
@CachLam,
@HinhAnh
);
END;







CREATE PROCEDURE sp_GoiYCongThuc
AS
BEGIN
SELECT DISTINCT
c.MaCongThuc,
c.TenMon,
c.MoTa
FROM CongThucMonAn c
JOIN ChiTietCongThuc ct
ON c.MaCongThuc=ct.MaCongThuc
JOIN ThucPham t
ON ct.MaThucPham=t.MaThucPham;
END;



