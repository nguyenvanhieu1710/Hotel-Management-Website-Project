-- Tạo database
CREATE DATABASE HotelManagement;
GO
USE HotelManagement;
GO

-- Room type table
CREATE TABLE RoomType (
    RoomTypeId INT identity(1,1) PRIMARY KEY,
    RoomTypeName NVARCHAR(50) NOT NULL,
    MaximumNumberOfGuests INT NOT NULL,
    Description NVARCHAR(255) NOT NULL,
	Deleted BIT DEFAULT 0  not null
);
GO

-- Room table
CREATE TABLE Room (
    RoomId INT identity(1,1) PRIMARY KEY,
    RoomTypeId INT,
    Price Decimal NOT NULL,
    NumberOfFloor int NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    Description NVARCHAR(255) NOT NULL,
	Deleted BIT DEFAULT 0  not null,
    FOREIGN KEY (RoomTypeId) REFERENCES RoomType(RoomTypeId)
);
GO

-- Device Type table
CREATE TABLE DeviceType (
    DeviceTypeId INT identity(1,1) PRIMARY KEY,
    DeviceTypeName NVARCHAR(50) NOT NULL,
    Description NVARCHAR(255) NOT NULL,
	Deleted BIT DEFAULT 0  not null
);
GO

-- Device table
CREATE TABLE Device (
    DeviceId INT identity(1,1) PRIMARY KEY,
    DeviceName NVARCHAR(50) NOT NULL,
    DeviceTypeId INT,
    RoomId INT,
    Price Decimal NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    Description NVARCHAR(255) NOT NULL,
	Deleted BIT DEFAULT 0  not null,
    FOREIGN KEY (DeviceTypeId) REFERENCES DeviceType(DeviceTypeId),
    FOREIGN KEY (RoomId) REFERENCES Room(RoomId)
);
GO

-- Account Table
CREATE TABLE Account (
    AccountId INT identity(1,1) PRIMARY KEY,
    AccountName VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role VARCHAR(50) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Status VARCHAR(50) NOT NULL,
    CreationDate DATE NOT NULL,
	Deleted BIT DEFAULT 0  not null
);
GO

-- Users table
CREATE TABLE Users (
    UserId INT PRIMARY KEY,
    IdentificationNumber NVARCHAR(20) NOT NULL,
    UserName NVARCHAR(50) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Gender NVARCHAR(10) NOT NULL,
    PhoneNumber NVARCHAR(15) NOT NULL,
    Address NVARCHAR(255) NOT NULL,
    Deleted BIT DEFAULT 0  not null,
	FOREIGN KEY (UserId) REFERENCES Account(AccountId)
);
GO

-- Event table
CREATE TABLE EventType (
    EventTypeId INT identity(1,1) PRIMARY KEY,
    EventTypeName NVARCHAR(50) NOT NULL,
    Description NVARCHAR(255) NOT NULL,
	Deleted BIT DEFAULT 0  not null
);
GO

-- Event table
CREATE TABLE Event (
    EventId INT identity(1,1) PRIMARY KEY,
    EventName NVARCHAR(50) NOT NULL,
    EventTypeId INT,
    UserId INT,
    OrganizationDay Date NOT NULL,
    StartTime Datetime NOT NULL,
    EndTime Datetime NOT NULL,
    OrganizationLocation NVARCHAR(255) NOT NULL,
    TotalCost Decimal NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    Description NVARCHAR(255) NOT NULL,
	Deleted BIT DEFAULT 0  not null,
    FOREIGN KEY (EventTypeId) REFERENCES EventType(EventTypeId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO


-- Booking Votes table
CREATE TABLE BookingVotes (
    BookingVotesId INT identity(1,1) PRIMARY KEY,
    UserId INT,
    BookingDate DATE NOT NULL,
    CheckinDate DATE NOT NULL,
    CheckoutDate DATE NOT NULL,
    Note NVARCHAR(255) NOT NULL,
	Deleted BIT DEFAULT 0  not null,
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

-- Booking Votes Detail table
CREATE TABLE BookingVotesDetail (
    BookingVotesDetailId INT identity(1,1) PRIMARY KEY,
    BookingVotesId INT,
    RoomId INT,
    Note NVARCHAR(255) NOT NULL,
	Deleted BIT DEFAULT 0  not null,
    FOREIGN KEY (BookingVotesId) REFERENCES BookingVotes(BookingVotesId),
    FOREIGN KEY (RoomId) REFERENCES Room(RoomId)
);
GO

-- Service Type table
CREATE TABLE ServiceType (
    ServiceTypeId INT identity(1,1) PRIMARY KEY,
    ServiceTypeName NVARCHAR(50) NOT NULL,
    Description NVARCHAR(255) NOT NULL,
	Deleted BIT DEFAULT 0  not null
);
GO

-- Service table
CREATE TABLE Service (
    ServiceId INT identity(1,1) PRIMARY KEY,
    ServiceName NVARCHAR(50) NOT NULL,
    ServiceTypeId INT,
    Price Decimal NOT NULL,
    Description NVARCHAR(255) NOT NULL,
	Deleted BIT DEFAULT 0  not null,
    FOREIGN KEY (ServiceTypeId) REFERENCES ServiceType(ServiceTypeId)
);
GO

-- Service Votes table
CREATE TABLE ServiceVotes (
    ServiceVotesId INT identity(1,1) PRIMARY KEY,
    ServiceId INT,
    Quantity INT NOT NULL,
    TotalAmount Decimal NOT NULL,
	Deleted BIT DEFAULT 0  not null,
    FOREIGN KEY (ServiceId) REFERENCES Service(ServiceId)
);
GO

-- Rent Room table
CREATE TABLE RentRoomVotes (
    RentRoomVotesId INT identity(1,1) PRIMARY KEY,
    UserId INT,
    ActualCheckinDate DATE NOT NULL,
    ActualCheckoutDate DATE NOT NULL,
    TotalAmount Decimal NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    Note NVARCHAR(255) NOT NULL,
	Deleted BIT DEFAULT 0  not null,
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

-- Rent Room Detail table
CREATE TABLE RentRoomVotesDetail (
    RentRoomVotesDetailId INT identity(1,1) PRIMARY KEY,
    RentRoomVotesId INT,
    RoomId INT,
	ServiceVotesId INT,
    TotalCostOfThisRoom Decimal NOT NULL,
    Note NVARCHAR(255) NOT NULL,
	Deleted BIT DEFAULT 0  not null,
    FOREIGN KEY (RentRoomVotesId) REFERENCES RentRoomVotes(RentRoomVotesId),
    FOREIGN KEY (RoomId) REFERENCES Room(RoomId),
	FOREIGN KEY (ServiceVotesId) REFERENCES ServiceVotes(ServiceVotesId)
);
GO

-- Staff table
CREATE TABLE Staff (
    StaffId INT PRIMARY KEY,
    StaffName NVARCHAR(50) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Gender NVARCHAR(10) NOT NULL,
    PhoneNumber NVARCHAR(15) NOT NULL,
    Address NVARCHAR(255) NOT NULL,
    Position NVARCHAR(50) NOT NULL,
    Salary Decimal NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    WorkStartDate DATE NOT NULL,
    Description NVARCHAR(255) NOT NULL,
	Deleted BIT DEFAULT 0  not null,
	FOREIGN KEY (StaffId) REFERENCES Account(AccountId)
);
GO

-- Bill table
CREATE TABLE Bill (
    BillId INT identity(1,1) PRIMARY KEY,
    RentRoomVotesId INT,
    UserId INT,
    StaffId INT,
    CreationDate DATE NOT NULL,
    TotalAmount Decimal NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    Note NVARCHAR(255) NOT NULL,
	Deleted BIT DEFAULT 0  not null,
    FOREIGN KEY (RentRoomVotesId) REFERENCES RentRoomVotes(RentRoomVotesId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (StaffId) REFERENCES Staff(StaffId)
);
GO

-- ==========================> Stored Procedure <=======================================
-- stored procedures of Account table --
-- create procedure sp_Account_get_data_by_id (@AccountId int)
-- as
-- 	begin
-- 		select * from Account where AccountId = @AccountId and Deleted = 0
-- 	end;
-- go
-- create procedure sp_Account_get_data_by_AccountName_and_Password(
-- @Account_AccountName nvarchar(100), @Account_Password NVARCHAR(100))
-- as 
-- 	begin
-- 		select * from Account
-- 		where AccountName = @Account_AccountName and Password = @Account_Password and Deleted = 0
-- 	end
-- go
-- create procedure sp_Account_create (@Account_AccountName NVARCHAR(100), 
-- @Account_Password NVARCHAR(100))
-- as
-- 	begin
-- 		insert into Account values(@Account_AccountName, @Account_Password, N'User',
-- 		N'defaut@gmail.com', N'Offline', GETDATE(), 0);
-- 		DECLARE @AccountId INT;
-- 		SET @AccountId = SCOPE_IDENTITY ();
-- 		insert into Users
-- 		values(@AccountId, N'123456789', @Account_AccountName, '1985-12-20', N'Nam', '0123456789',
-- 		N'defaut@gmail.com', 'Ha Noi', 0);
-- 	end;
-- go
-- -- ==========================> stored procedures of User table <=======================================
-- create procedure sp_User_create (@User_SoCMND NVARCHAR(100), @User_TenUser NVARCHAR(100), 
-- @User_NgaySinh DATE, @User_GioiTinh NVARCHAR(10), @User_SoDienThoai NVARCHAR(20), 
-- @User_Email nvarchar(100), @User_DiaChi NVARCHAR(100))
-- as
-- 	begin
-- 		-- phải thêm 3 số ngẫu nhiên ở cuối để tránh trùng lặp tên tài khoản --
-- 		declare @ramdomNumber nvarchar(3)
-- 		declare @Account_AccountName nvarchar(100)
-- 		set @ramdomNumber = cast(cast(rand() * 1000 as int) as nvarchar)
-- 		set @Account_AccountName = CONCAT(@User_TenUser, @ramdomNumber)
-- 		insert into Account values(@Account_AccountName, N'123', N'User',
-- 			N'defaut@gmail.com', N'Offline', GETDATE(), 0);
-- 		DECLARE @AccountId INT;
-- 		SET @AccountId = SCOPE_IDENTITY ();
-- 		insert into User
-- 		values(@AccountId, @User_SoCMND, @User_TenUser, @User_NgaySinh,
-- 		@User_GioiTinh, @User_SoDienThoai, @User_Email, @User_DiaChi, 0);
-- 	end;
-- go
-- create procedure sp_User_update (@UserId int, @User_SoCMND NVARCHAR(100), 
-- @User_TenUser NVARCHAR(100), @User_NgaySinh DATE, @User_GioiTinh NVARCHAR(10), 
-- @User_SoDienThoai NVARCHAR(20), @User_Email nvarchar(100), @User_DiaChi NVARCHAR(100),
-- @User_Deleted bit)
-- as
-- 	begin
-- 		IF @User_Deleted = 1
-- 		begin
-- 			update Account
-- 			set Deleted = @User_Deleted
-- 			where AccountId = @UserId
-- 		end
-- 		update User
-- 		set SoCMND = @User_SoCMND, TenUser = @User_TenUser, 
-- 			NgaySinh = @User_NgaySinh, GioiTinh = @User_GioiTinh,
-- 			SoDienThoai = @User_SoDienThoai, Email = @User_Email, 
-- 			DiaChi = @User_DiaChi, Deleted = @User_Deleted
-- 		where UserId = @UserId
-- 	end;
-- go
-- create procedure sp_User_delete (@UserId int)
-- as
-- 	begin
-- 		Delete from User
-- 		where UserId = @UserId
-- 		Delete from Account
-- 		where AccountId = @UserId
-- 	end;
-- go
-- create procedure sp_User_get_all
-- as
-- 	begin
-- 		select * from User where Deleted = 0
-- 	end;
-- go
-- create procedure sp_User_get_data_by_id (@UserId int)
-- as
-- 	begin
-- 		select * from User where UserId = @UserId and Deleted = 0
-- 	end;
-- go
-- create procedure sp_User_get_data_by_AccountName_and_Password
-- (@Account_AccountName NVARCHAR(100), @Account_Password NVARCHAR(100))
-- as
-- 	begin 
-- 		select * from User where UserId in (
-- 			select AccountId from Account 
-- 			where AccountName = @Account_AccountName and Password = @Account_Password)
-- 			and Deleted = 0
-- 	end;
-- go
-- create procedure sp_User_search (@TenUser nvarchar(100))
-- as
-- 	begin
-- 		select * from User 
-- 		where (LOWER(TenUser) like '%' + LOWER(@TenUser) + '%') and Deleted = 0
-- 	end;
-- go
-- create procedure sp_User_pagination (@User_pageNumber int, @User_pageSize int)
-- as
-- 	begin
-- 		declare @NumberOfRecordsToIgnore int
-- 		set @NumberOfRecordsToIgnore = (@User_pageNumber - 1) * @User_pageSize;
-- 		select * from User
-- 		where Deleted = 0
-- 		order by UserId
-- 		offset @NumberOfRecordsToIgnore rows
-- 		fetch next @User_pageSize rows only;
-- 	end
-- go
-- create procedure sp_User_deleted_pagination (@User_pageNumber int, @User_pageSize int)
-- as
-- 	begin
-- 		declare @NumberOfRecordsToIgnore int
-- 		set @NumberOfRecordsToIgnore = (@User_pageNumber - 1) * @User_pageSize;
-- 		select * from User
-- 		where Deleted = 1
-- 		order by UserId
-- 		offset @NumberOfRecordsToIgnore rows
-- 		fetch next @User_pageSize rows only;
-- 	end
-- go
-- create procedure sp_User_search_pagination (@User_pageNumber int, @User_pageSize int,
-- @TenUser nvarchar(100))
-- as
-- 	begin
-- 		declare @NumberOfRecordsToIgnore int
-- 		set @NumberOfRecordsToIgnore = (@User_pageNumber - 1) * @User_pageSize;
-- 		select * from User
-- 		where (LOWER(TenUser) like '%' + LOWER(@TenUser) + '%') and Deleted = 0
-- 		order by UserId
-- 		offset @NumberOfRecordsToIgnore rows
-- 		fetch next @User_pageSize rows only;
-- 	end
-- go
-- -- ==========================> stored procedures of Staff table <=======================================
-- create procedure sp_Staff_create (@Staff_StaffName NVARCHAR(100), 
-- @Staff_Birthday DATE, @Staff_PhoneNumber NVARCHAR(20), @Staff_Image NVARCHAR(MAX),
-- @Staff_Gender NVARCHAR(10), @Staff_Address NVARCHAR(100), @Staff_Position nvarchar(50))
-- as
-- 	begin
-- 		-- phải thêm 3 số ngẫu nhiên ở cuối để tránh trùng lặp tên tài khoản --
-- 		declare @ramdomNumber nvarchar(3)
-- 		declare @acccount_Name nvarchar(100)
-- 		set @ramdomNumber = cast(cast(rand() * 1000 as int) as nvarchar)
-- 		set @acccount_Name = CONCAT(@Staff_StaffName, @ramdomNumber)
-- 		insert into Account values(@acccount_Name, N'123', N'Staff', GETDATE(), 
-- 			0, N'defaut@gmail.com', N'Offline', 0)
-- 		DECLARE @account_Id INT;
-- 		SET @account_Id = SCOPE_IDENTITY ();
-- 		insert into Staff
-- 		values(@account_Id, @Staff_StaffName, @Staff_Birthday, @Staff_PhoneNumber, @Staff_Image,
-- 			@Staff_Gender, @Staff_Address, @Staff_Position, 0);
-- 	end;
-- go
-- create procedure sp_Staff_update (@Staff_Id int, @Staff_StaffName NVARCHAR(100), 
-- @Staff_Birthday DATE, @Staff_PhoneNumber NVARCHAR(20), @Staff_Image NVARCHAR(MAX),
-- @Staff_Gender NVARCHAR(10), @Staff_Address NVARCHAR(100), @Staff_Position nvarchar(50),
-- @Staff_Deleted bit)
-- as
-- 	begin
-- 		IF @Staff_Deleted = 1
-- 		begin
-- 			update Account
-- 			set Deleted = @Staff_Deleted
-- 			where AccountId = @Staff_Id
-- 		end
-- 		update Staff
-- 		set StaffName = @Staff_StaffName, Birthday = @Staff_Birthday, 
-- 			PhoneNumber = @Staff_PhoneNumber, Image = @Staff_Image, 
-- 			Gender = @Staff_Gender, Address = @Staff_Address, 
-- 			Position = @Staff_Position, Deleted = @Staff_Deleted		
-- 		where StaffId = @Staff_Id
-- 	end;
-- go
-- create procedure sp_Staff_delete (@Staff_Id int)
-- as
-- 	begin
-- 		Delete from Staff
-- 		where StaffId = @Staff_Id
-- 		Delete from Account
-- 		where AccountId = @Staff_Id
-- 	end;
-- go
-- create procedure sp_Staff_all
-- as
-- 	begin
-- 		select * from Staff where Deleted = 0
-- 	end;
-- go
-- create procedure sp_Staff_get_data_by_id (@Staff_Id int)
-- as
-- 	begin
-- 		select * from Staff where StaffId = @Staff_Id and Deleted = 0
-- 	end;
-- go
-- create procedure sp_Staff_search (@Staff_Name nvarchar(100))
-- as
-- 	begin
-- 		select * from Staff 
-- 		where (LOWER(StaffName) like '%' + LOWER(@Staff_Name) + '%') and Deleted = 0
-- 	end;
-- go
-- create procedure sp_Staff_pagination (@Staff_pageNumber int, @Staff_pageSize int)
-- as
-- 	begin
-- 		declare @NumberOfRecordsToIgnore int
-- 		set @NumberOfRecordsToIgnore = (@Staff_pageNumber - 1) * @Staff_pageSize;
-- 		select * from Staff
-- 		where Deleted = 0
-- 		order by StaffId
-- 		offset @NumberOfRecordsToIgnore rows
-- 		fetch next @Staff_pageSize rows only;
-- 	end
-- go
-- create procedure sp_Staff_deleted_pagination (@Staff_pageNumber int, @Staff_pageSize int)
-- as
-- 	begin
-- 		declare @NumberOfRecordsToIgnore int
-- 		set @NumberOfRecordsToIgnore = (@Staff_pageNumber - 1) * @Staff_pageSize;
-- 		select * from Staff
-- 		where Deleted = 1
-- 		order by StaffId
-- 		offset @NumberOfRecordsToIgnore rows
-- 		fetch next @Staff_pageSize rows only;
-- 	end
-- go
-- create procedure sp_Staff_search_pagination (@Staff_pageNumber int, @Staff_pageSize int,
-- @Staff_Name nvarchar(100))
-- as
-- 	begin
-- 		declare @NumberOfRecordsToIgnore int
-- 		set @NumberOfRecordsToIgnore = (@Staff_pageNumber - 1) * @Staff_pageSize;
-- 		select * from Staff
-- 		where (LOWER(StaffName) like '%' + LOWER(@Staff_Name) + '%') and Deleted = 0
-- 		order by StaffId
-- 		offset @NumberOfRecordsToIgnore rows
-- 		fetch next @Staff_pageSize rows only;
-- 	end
-- go