INSERT INTO NguoiDung(HoTen,Email,MatKhau)
VALUES
(N'Nguyễn Văn A','a@gmail.com','123456');

INSERT INTO TuLanh(TenTuLanh,MaNguoiDung)
VALUES
(N'Tủ lạnh nhà',1);

INSERT INTO NganTu(TenNgan,MaTuLanh)
VALUES
(N'Ngăn mát',1),
(N'Ngăn đông',1);

INSERT INTO DanhMuc(TenDanhMuc)
VALUES
(N'Rau củ'),
(N'Thịt'),
(N'Đồ uống'),
(N'Trái cây');

INSERT INTO ThucPham
(TenThucPham,SoLuong,DonVi,NgayThem,HanSuDung,MaDanhMuc,MaNgan)
VALUES
(N'Sữa tươi',2,N'Hộp','2026-06-14','2026-06-20',3,1),
(N'Thịt bò',1,N'Kg','2026-06-14','2026-06-18',2,2);



