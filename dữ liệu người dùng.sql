USE FreshKeep;
GO



INSERT INTO NguoiDung(HoTen, Email, MatKhau)
VALUES
(N'Nguyễn Văn A','a@gmail.com','123456'),
(N'Trần Thị B','b@gmail.com','123456'),
(N'Lê Văn C','c@gmail.com','123456');



INSERT INTO TuLanh(TenTuLanh, MaNguoiDung)
VALUES
(N'Tủ lạnh nhà A',1),
(N'Tủ lạnh nhà B',2),
(N'Tủ lạnh nhà C',3);




INSERT INTO NganTu(TenNgan, MaTuLanh)
VALUES
(N'Ngăn mát',1),
(N'Ngăn đông',1),
(N'Ngăn mát',2),
(N'Ngăn đông',2),
(N'Ngăn mát',3),
(N'Ngăn đông',3);




INSERT INTO DanhMuc(TenDanhMuc)
VALUES
(N'Rau củ'),
(N'Thịt'),
(N'Hải sản'),
(N'Đồ uống'),
(N'Trái cây'),
(N'Sữa'),
(N'Gia vị');




INSERT INTO ThucPham
(
TenThucPham,
SoLuong,
DonVi,
NgayThem,
HanSuDung,
MaDanhMuc,
MaNgan
)
VALUES
(N'Cà chua',5,N'Quả','2026-06-14','2026-06-20',1,1),
(N'Rau cải',2,N'Bó','2026-06-14','2026-06-18',1,1),
(N'Thịt bò',1,N'Kg','2026-06-14','2026-06-17',2,2),
(N'Thịt gà',2,N'Kg','2026-06-14','2026-06-19',2,2),
(N'Cá hồi',1,N'Kg','2026-06-14','2026-06-16',3,2),
(N'Nước cam',4,N'Chai','2026-06-14','2026-07-01',4,3),
(N'Sữa tươi',2,N'Hộp','2026-06-14','2026-06-21',6,3),
(N'Táo',10,N'Quả','2026-06-14','2026-06-25',5,5),
(N'Chuối',6,N'Quả','2026-06-14','2026-06-18',5,5),
(N'Tương ớt',1,N'Chai','2026-06-14','2026-12-30',7,1);




INSERT INTO ThongBao
(
MaThucPham,
NoiDung,
DaDoc
)
VALUES
(3,N'Thịt bò sắp hết hạn',0),
(5,N'Cá hồi sắp hết hạn',0),
(9,N'Chuối sắp hết hạn',1);




INSERT INTO LichSu
(
MaThucPham,
HanhDong
)
VALUES
(1,N'Thêm thực phẩm'),
(2,N'Thêm thực phẩm'),
(3,N'Thêm thực phẩm'),
(3,N'Cập nhật số lượng'),
(5,N'Thêm thực phẩm'),
(7,N'Thêm thực phẩm'),
(9,N'Thêm thực phẩm');