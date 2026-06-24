CREATE DATABASE FreshKeep;
GO

USE FreshKeep;
GO

CREATE TABLE NguoiDung(
    MaNguoiDung INT IDENTITY(1,1) PRIMARY KEY,
    HoTen NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    MatKhau NVARCHAR(255) NOT NULL,
    SoDienThoai NVARCHAR(20),
    NgayTao DATETIME DEFAULT GETDATE()
);


CREATE TABLE TuLanh(
    MaTuLanh INT IDENTITY(1,1) PRIMARY KEY,
    TenTuLanh NVARCHAR(100) NOT NULL,
    ViTri NVARCHAR(100),
    MaNguoiDung INT NOT NULL,

    FOREIGN KEY (MaNguoiDung)
    REFERENCES NguoiDung(MaNguoiDung)
);



CREATE TABLE NganTu(
    MaNgan INT IDENTITY(1,1) PRIMARY KEY,
    TenNgan NVARCHAR(50) NOT NULL,
    MaTuLanh INT NOT NULL,

    FOREIGN KEY (MaTuLanh)
    REFERENCES TuLanh(MaTuLanh)
);



CREATE TABLE DanhMuc(
    MaDanhMuc INT IDENTITY(1,1) PRIMARY KEY,
    TenDanhMuc NVARCHAR(100) NOT NULL
);




CREATE TABLE ThucPham(
    MaThucPham INT IDENTITY(1,1) PRIMARY KEY,
    TenThucPham NVARCHAR(100) NOT NULL,
    SoLuong INT,
    DonVi NVARCHAR(20),
    NgayThem DATE,
    HanSuDung DATE,
    TrangThai NVARCHAR(30),
    GhiChu NVARCHAR(255),
    HinhAnh NVARCHAR(255),
    MaDanhMuc INT,
    MaNgan INT,

    FOREIGN KEY (MaDanhMuc)
    REFERENCES DanhMuc(MaDanhMuc),

    FOREIGN KEY (MaNgan)
    REFERENCES NganTu(MaNgan)
);





CREATE TABLE ThongBao(
    MaThongBao INT IDENTITY(1,1) PRIMARY KEY,
    MaThucPham INT,
    NoiDung NVARCHAR(255),
    DaDoc BIT DEFAULT 0,
    NgayThongBao DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (MaThucPham)
    REFERENCES ThucPham(MaThucPham)
);





CREATE TABLE LichSu(
    MaLichSu INT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiDung INT,
    MaThucPham INT,
    HanhDong NVARCHAR(100),
    ThoiGian DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (MaNguoiDung)
    REFERENCES NguoiDung(MaNguoiDung),
    FOREIGN KEY (MaThucPham)
    REFERENCES ThucPham(MaThucPham)
);






CREATE TABLE CongThucMonAn(
    MaCongThuc INT IDENTITY(1,1) PRIMARY KEY,
    TenMon NVARCHAR(100) NOT NULL,
    MoTa NVARCHAR(MAX),
    NguyenLieu NVARCHAR(MAX),
    CachLam NVARCHAR(MAX),
    HinhAnh NVARCHAR(255)
);





CREATE TABLE ChiTietCongThuc(
    MaCongThuc INT,
    MaThucPham INT,
    SoLuongCan INT,
    PRIMARY KEY(MaCongThuc,MaThucPham),
    FOREIGN KEY (MaCongThuc)
    REFERENCES CongThucMonAn(MaCongThuc),
    FOREIGN KEY (MaThucPham)
    REFERENCES ThucPham(MaThucPham)
);





CREATE TABLE ThanhVienTuLanh
(
    MaThanhVien INT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiDung INT NOT NULL,
    MaTuLanh INT NOT NULL,
    VaiTro NVARCHAR(20) DEFAULT N'ThanhVien',
    NgayThamGia DATE DEFAULT GETDATE(),

    FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung),
    FOREIGN KEY (MaTuLanh) REFERENCES TuLanh(MaTuLanh)
);










CREATE TABLE LoiMoiThamGia
(
    MaLoiMoi INT IDENTITY(1,1),
    MaNguoiGui INT,
    MaNguoiNhan INT,
    MaTuLanh INT,
    TrangThai NVARCHAR(20)
);