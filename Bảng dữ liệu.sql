CREATE DATABASE FreshKeep;
GO

USE FreshKeep;
GO



CREATE TABLE NguoiDung(
    MaNguoiDung INT IDENTITY(1,1) PRIMARY KEY,
    HoTen NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE,
    MatKhau NVARCHAR(255),
    NgayTao DATETIME DEFAULT GETDATE()
);



CREATE TABLE TuLanh(
    MaTuLanh INT IDENTITY(1,1) PRIMARY KEY,
    TenTuLanh NVARCHAR(100),
    MaNguoiDung INT,
    FOREIGN KEY (MaNguoiDung)
        REFERENCES NguoiDung(MaNguoiDung)
);



CREATE TABLE NganTu(
    MaNgan INT IDENTITY(1,1) PRIMARY KEY,
    TenNgan NVARCHAR(50),
    MaTuLanh INT,
    FOREIGN KEY (MaTuLanh)
        REFERENCES TuLanh(MaTuLanh)
);



CREATE TABLE DanhMuc(
    MaDanhMuc INT IDENTITY(1,1) PRIMARY KEY,
    TenDanhMuc NVARCHAR(100)
);


CREATE TABLE ThucPham(
    MaThucPham INT IDENTITY(1,1) PRIMARY KEY,
    TenThucPham NVARCHAR(100),
    SoLuong INT,
    DonVi NVARCHAR(20),
    NgayThem DATE,
    HanSuDung DATE,
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

    FOREIGN KEY (MaThucPham)
        REFERENCES ThucPham(MaThucPham)
);




CREATE TABLE LichSu(
    MaLichSu INT IDENTITY(1,1) PRIMARY KEY,
    MaThucPham INT,
    HanhDong NVARCHAR(100),
    ThoiGian DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (MaThucPham)
        REFERENCES ThucPham(MaThucPham)
);