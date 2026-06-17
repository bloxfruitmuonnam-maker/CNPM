USE FreshKeep;
GO




INSERT INTO NguoiDung(HoTen, Email, MatKhau, SoDienThoai)
VALUES
(N'Nguyễn Văn A','a@gmail.com','123456','0912345678'),
(N'Trần Thị B','b@gmail.com','123456','0923456789'),
(N'Lê Văn C','c@gmail.com','123456','0934567890');




INSERT INTO TuLanh(TenTuLanh, ViTri, MaNguoiDung)
VALUES
(N'Tủ lạnh nhà A',N'Phòng bếp',1),
(N'Tủ lạnh nhà B',N'Phòng bếp',2),
(N'Tủ lạnh nhà C',N'Phòng ăn',3);




INSERT INTO NganTu(TenNgan, MaTuLanh)
VALUES
(N'Ngăn mát',1),
(N'Ngăn đông',1),
(N'Ngăn rau',1),

(N'Ngăn mát',2),
(N'Ngăn đông',2),

(N'Ngăn mát',3),
(N'Ngăn đông',3);




INSERT INTO DanhMuc(TenDanhMuc)
VALUES
(N'Rau củ'),
(N'Thịt'),
(N'Hải sản'),
(N'Trái cây'),
(N'Đồ uống'),
(N'Sữa'),
(N'Gia vị');




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
(N'Cà chua',5,N'Quả','2026-06-14','2026-06-20',N'Còn sử dụng',N'Để làm salad','cachua.jpg',1,3),
(N'Rau cải',2,N'Bó','2026-06-14','2026-06-18',N'Còn sử dụng',NULL,'raucai.jpg',1,3),
(N'Thịt bò',1,N'Kg','2026-06-14','2026-06-17',N'Sắp hết hạn',NULL,'thitbo.jpg',2,2),
(N'Cá hồi',1,N'Kg','2026-06-14','2026-06-16',N'Sắp hết hạn',NULL,'cahoi.jpg',3,2),
(N'Táo',10,N'Quả','2026-06-14','2026-06-25',N'Còn sử dụng',NULL,'tao.jpg',4,1),
(N'Chuối',6,N'Quả','2026-06-14','2026-06-18',N'Còn sử dụng',NULL,'chuoi.jpg',4,1),
(N'Sữa tươi',2,N'Hộp','2026-06-14','2026-06-21',N'Còn sử dụng',NULL,'sua.jpg',6,1),
(N'Nước cam',4,N'Chai','2026-06-14','2026-07-01',N'Còn sử dụng',NULL,'nuoccam.jpg',5,4),
(N'Tương ớt',1,N'Chai','2026-06-14','2026-12-30',N'Còn sử dụng',NULL,'tuongot.jpg',7,1),
(N'Thịt gà',2,N'Kg','2026-06-14','2026-06-22',N'Còn sử dụng',NULL,'thitga.jpg',2,5);





INSERT INTO ThongBao
(
MaThucPham,
NoiDung,
DaDoc
)
VALUES
(3,N'Thịt bò sắp hết hạn',0),
(4,N'Cá hồi sắp hết hạn',0),
(6,N'Chuối nên sử dụng sớm',1);




INSERT INTO LichSu
(
MaNguoiDung,
MaThucPham,
HanhDong
)
VALUES
(1,1,N'Thêm thực phẩm'),
(1,3,N'Cập nhật số lượng'),
(1,4,N'Thêm thực phẩm'),
(2,8,N'Thêm thực phẩm'),
(2,10,N'Thêm thực phẩm'),
(3,5,N'Thêm thực phẩm'),
(3,6,N'Chuyển ngăn');




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
N'Salad cà chua',
N'Món salad đơn giản',
N'Cà chua, rau cải',
N'Rửa sạch, cắt nhỏ và trộn đều.',
'salad.jpg'
),

(
N'Sinh tố chuối',
N'Đồ uống giải nhiệt',
N'Chuối, sữa tươi',
N'Cho vào máy xay và xay nhuyễn.',
'sinhto.jpg'
),

(
N'Thịt bò xào',
N'Món xào đơn giản',
N'Thịt bò',
N'Ướp gia vị và xào trên lửa lớn.',
'thitboxao.jpg'
);




INSERT INTO ChiTietCongThuc
(
MaCongThuc,
MaThucPham,
SoLuongCan
)

VALUES
(1,1,2),
(1,2,1),
(2,6,2),
(2,7,1),
(3,3,1);





INSERT INTO ThanhVienTuLanh
(MaNguoiDung,MaTuLanh,VaiTro)
VALUES
(1,1,N'Chu'),
(2,1,N'ThanhVien'),
(3,1,N'ThanhVien');
