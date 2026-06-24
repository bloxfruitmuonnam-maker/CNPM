CREATE VIEW v_TuLanh_CuaNguoiDung AS
SELECT 
    nd.MaNguoiDung,
    nd.HoTen,
    nd.Email,
    tl.MaTuLanh,
    tl.TenTuLanh
FROM NguoiDung nd
JOIN TuLanh tl ON nd.MaNguoiDung = tl.MaNguoiDung;




CREATE VIEW v_NganTu_TheoTuLanh AS
SELECT 
    tl.MaTuLanh,
    tl.TenTuLanh,
    nt.MaNgan,
    nt.TenNgan
FROM TuLanh tl
JOIN NganTu nt ON tl.MaTuLanh = nt.MaTuLanh;







CREATE VIEW v_ThucPham_TheoNgan AS
SELECT 
    nt.MaNgan,
    nt.TenNgan,
    tp.MaThucPham,
    tp.TenThucPham,
    tp.SoLuong,
    tp.NgayNhap,
    tp.HanSuDung
FROM NganTu nt
JOIN ThucPham tp ON nt.MaNgan = tp.MaNgan;






CREATE VIEW v_ThucPham_SapHetHan AS
SELECT 
    tp.MaThucPham,
    tp.TenThucPham,
    tp.SoLuong,
    tp.HanSuDung,
    DATEDIFF(DAY, GETDATE(), tp.HanSuDung) AS SoNgayConLai
FROM ThucPham tp
WHERE tp.HanSuDung <= DATEADD(DAY, 3, GETDATE());






CREATE VIEW v_TongQuan_FreshKeep AS
SELECT 
    nd.HoTen,
    tl.TenTuLanh,
    nt.TenNgan,
    tp.TenThucPham,
    tp.HanSuDung
FROM NguoiDung nd
JOIN TuLanh tl ON nd.MaNguoiDung = tl.MaNguoiDung
JOIN NganTu nt ON tl.MaTuLanh = nt.MaTuLanh
JOIN ThucPham tp ON nt.MaNgan = tp.MaNgan;