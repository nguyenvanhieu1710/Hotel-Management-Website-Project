CREATE DATABASE HotelManagement;
USE HotelManagement;

-- Room type table
CREATE TABLE RoomType (
    RoomTypeId INT AUTO_INCREMENT PRIMARY KEY,
    RoomTypeName VARCHAR(50) NOT NULL,
    Description VARCHAR(255) NOT NULL,
    Deleted BOOLEAN DEFAULT 0 NOT NULL
);

-- Room table
CREATE TABLE Room (
    RoomId INT AUTO_INCREMENT PRIMARY KEY,
    RoomTypeId INT,
    RoomImage VARCHAR(10000) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    NumberOfFloor INT NOT NULL,
    MaximumNumberOfGuests INT NOT NULL,
    Status VARCHAR(50) NOT NULL,
    Description VARCHAR(255) NOT NULL,
    RoomArea DECIMAL(10,2) NOT NULL,
    Amenities TEXT,
    RoomDetail TEXT,
    Deleted BOOLEAN DEFAULT 0 NOT NULL,
    FOREIGN KEY (RoomTypeId) REFERENCES RoomType(RoomTypeId)
);

-- Device Type table
CREATE TABLE DeviceType (
    DeviceTypeId INT AUTO_INCREMENT PRIMARY KEY,
    DeviceTypeName VARCHAR(50) NOT NULL,
    Description VARCHAR(255) NOT NULL,
    Deleted BOOLEAN DEFAULT 0 NOT NULL
);

-- Device table
CREATE TABLE Device (
    DeviceId INT AUTO_INCREMENT PRIMARY KEY,
    DeviceName VARCHAR(50) NOT NULL,
    DeviceTypeId INT,
    RoomId INT,
    DeviceImage VARCHAR(10000) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Status VARCHAR(50) NOT NULL,
    Description VARCHAR(255) NOT NULL,
    Deleted BOOLEAN DEFAULT 0 NOT NULL,
    FOREIGN KEY (DeviceTypeId) REFERENCES DeviceType(DeviceTypeId),
    FOREIGN KEY (RoomId) REFERENCES Room(RoomId)
);

-- Account Table
CREATE TABLE Account (
    AccountId INT AUTO_INCREMENT PRIMARY KEY,
    AccountName VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role VARCHAR(50) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Status VARCHAR(50) NOT NULL,
    CreationDate DATE NOT NULL,
    Deleted BOOLEAN DEFAULT 0 NOT NULL
);

-- Users table
CREATE TABLE Users (
    UserId INT PRIMARY KEY,
    IdentificationNumber VARCHAR(20) NOT NULL,
    UserName VARCHAR(50) NOT NULL,
    UserImage VARCHAR(10000) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Gender VARCHAR(10) NOT NULL,
    PhoneNumber VARCHAR(15) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    Deleted BOOLEAN DEFAULT 0 NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Account(AccountId)
);

-- EventType table
CREATE TABLE EventType (
    EventTypeId INT AUTO_INCREMENT PRIMARY KEY,
    EventTypeName VARCHAR(50) NOT NULL,
    Description VARCHAR(255) NOT NULL,
    Deleted BOOLEAN DEFAULT 0 NOT NULL
);

-- Event table
CREATE TABLE Event (
    EventId INT AUTO_INCREMENT PRIMARY KEY,
    EventName VARCHAR(50) NOT NULL,
    EventTypeId INT,
    EventImage VARCHAR(10000) NOT NULL,
    OrganizationDay DATE NOT NULL,
    StartTime DATETIME NOT NULL,
    EndTime DATETIME NOT NULL,
    OrganizationLocation VARCHAR(255) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Status VARCHAR(50) NOT NULL,
    Description VARCHAR(255) NOT NULL,
    Deleted BOOLEAN DEFAULT 0 NOT NULL,
    FOREIGN KEY (EventTypeId) REFERENCES EventType(EventTypeId)
);

-- EventVotes table
CREATE TABLE EventVotes (
	EventVotesId INT AUTO_INCREMENT PRIMARY KEY,
    EventId INT,
    UserId INT,    
    TotalAmount DECIMAL(10,2) NOT NULL,
    Deleted BOOLEAN DEFAULT 0 NOT NULL,
    FOREIGN KEY (EventId) REFERENCES Event(EventId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- BookingVotes table
CREATE TABLE BookingVotes (
    BookingVotesId INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT,
    BookingDate DATE NOT NULL,
    CheckinDate DATE NOT NULL,
    CheckoutDate DATE NOT NULL,
    Note VARCHAR(255) NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    Status VARCHAR(50) NOT NULL,
    Deleted BOOLEAN DEFAULT 0 NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- BookingVotesDetail table
CREATE TABLE BookingVotesDetail (
    BookingVotesDetailId INT AUTO_INCREMENT PRIMARY KEY,
    BookingVotesId INT,
    RoomId INT,
    RoomPrice DECIMAL(10,2) NOT NULL,
    Note VARCHAR(255) NOT NULL,
    Deleted BOOLEAN DEFAULT 0 NOT NULL,
    FOREIGN KEY (BookingVotesId) REFERENCES BookingVotes(BookingVotesId),
    FOREIGN KEY (RoomId) REFERENCES Room(RoomId)
);

-- ServiceType table
CREATE TABLE ServiceType (
    ServiceTypeId INT AUTO_INCREMENT PRIMARY KEY,
    ServiceTypeName VARCHAR(50) NOT NULL,
    Description VARCHAR(255) NOT NULL,
    Deleted BOOLEAN DEFAULT 0 NOT NULL
);

-- Service table
CREATE TABLE Service (
    ServiceId INT AUTO_INCREMENT PRIMARY KEY,
    ServiceName VARCHAR(50) NOT NULL,
    ServiceTypeId INT,
    ServiceImage VARCHAR(10000) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Description VARCHAR(255) NOT NULL,
    Deleted BOOLEAN DEFAULT 0 NOT NULL,
    FOREIGN KEY (ServiceTypeId) REFERENCES ServiceType(ServiceTypeId)
);

-- ServiceVotes table
CREATE TABLE ServiceVotes (
    ServiceVotesId INT AUTO_INCREMENT PRIMARY KEY,
    ServiceId INT,
	UserId INT,
    Quantity INT NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    Deleted BOOLEAN DEFAULT 0 NOT NULL,
    FOREIGN KEY (ServiceId) REFERENCES Service(ServiceId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- RentRoomVotes table
CREATE TABLE RentRoomVotes (
    RentRoomVotesId INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT,
    ActualCheckinDate DATE NOT NULL,
    ActualCheckoutDate DATE NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    Status VARCHAR(50) NOT NULL,
    Note VARCHAR(255) NOT NULL,
    Deleted BOOLEAN DEFAULT 0 NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- RentRoomVotesDetail table
CREATE TABLE RentRoomVotesDetail (
    RentRoomVotesDetailId INT AUTO_INCREMENT PRIMARY KEY,
    RentRoomVotesId INT,
    RoomId INT,
    RoomPrice DECIMAL(10,2) NOT NULL,
    Note VARCHAR(255) NOT NULL,
    Deleted BOOLEAN DEFAULT 0 NOT NULL,
    FOREIGN KEY (RentRoomVotesId) REFERENCES RentRoomVotes(RentRoomVotesId),
    FOREIGN KEY (RoomId) REFERENCES Room(RoomId)
);

-- Staff table
CREATE TABLE Staff (
    StaffId INT PRIMARY KEY,
    StaffName VARCHAR(50) NOT NULL,
    StaffImage VARCHAR(10000) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Gender VARCHAR(10) NOT NULL,
    PhoneNumber VARCHAR(15) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    Position VARCHAR(50) NOT NULL,
    Salary DECIMAL(10,2) NOT NULL,
    Status VARCHAR(50) NOT NULL,
    WorkStartDate DATE NOT NULL,
    Description VARCHAR(255) NOT NULL,
    Deleted BOOLEAN DEFAULT 0 NOT NULL,
    FOREIGN KEY (StaffId) REFERENCES Account(AccountId)
);

-- Bill table
CREATE TABLE Bill (
    BillId INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT,
    CreationDate DATE NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    Status VARCHAR(50) NOT NULL,
    Note VARCHAR(255) NOT NULL,
    Deleted BOOLEAN DEFAULT 0 NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Evaluation table
CREATE TABLE Evaluation (
	EvaluationId INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT,
    RoomId INT,
    Rating INT NOT NULL,
    Comment TEXT NOT NULL,
    Status VARCHAR(50) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    Deleted BOOLEAN DEFAULT 0 NOT NULL,
    FOREIGN KEY (RoomId) REFERENCES Room(RoomId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);