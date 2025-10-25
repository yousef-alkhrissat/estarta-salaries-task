CREATE TABLE IF NOT EXISTS UserEntity (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserName VARCHAR(255) NOT NULL,
    NationalNumber VARCHAR(255) UNIQUE NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Phone VARCHAR(255) NOT NULL,
    isActive BOOLEAN DEFAULT 1
);
CREATE TABLE IF NOT EXISTS SalaryEntity (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Year INTEGER NOT NULL,
    Month INTEGER NOT NULL,
    Salary DECIMAL(10,2) NOT NULL,
    UserID INTEGER NOT NULL,
    FOREIGN KEY (UserID) REFERENCES UserEntity(ID)
);

CREATE TABLE IF NOT EXISTS LogEntry (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Level VARCHAR(50) NOT NULL,
    Message TEXT NOT NULL,
    Context VARCHAR(255),
    UserId INTEGER,
    NationalNumber VARCHAR(255),
    AdditionalData TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO UserEntity (ID, UserName, NationalNumber, Email, Phone, isActive) VALUES
(1, 'jdoe', 'NAT1001', 'jdoe@example.com', '0791111111', 1),
(2, 'asalem', 'NAT1002', 'asalem@example.com', '0792222222', 1),
(3, 'rhamdan', 'NAT1003', 'rhamdan@example.com', '0793333333', 0),
(4, 'lbarakat', 'NAT1004', 'lbarakat@example.com', '0794444444', 1),
(5, 'mfaris', 'NAT1005', 'mfaris@example.com', '0795555555', 1),
(6, 'nsaleh', 'NAT1006', 'nsaleh@example.com', '0796666666', 0),
(7, 'zobeidat', 'NAT1007', 'zobeidat@example.com', '0797777777', 1),
(8, 'ahalaseh', 'NAT1008', 'ahalaseh@example.com', '0798888888', 1),
(9, 'tkhalaf', 'NAT1009', 'tkhalaf@example.com', '0799999999', 0),
(10, 'sshaheen', 'NAT1010', 'sshaheen@example.com', '0781010101', 1),
(11, 'tmart', 'NAT1011', 'tmart@example.com', '0781099101', 0),
(12, 'aali', 'NAT1012', 'aali@example.com', '0781088101', 1);

INSERT INTO SalaryEntity (ID, Year, Month, Salary, UserID) VALUES
(1, 2025, 1, 1200.00, 1),
(2, 2025, 2, 1300.00, 1),
(3, 2025, 3, 1400.00, 1),
(4, 2025, 5, 1500.00, 1),
(5, 2025, 6, 1600.00, 1),
(6, 2025, 1, 900.00, 2),
(7, 2025, 2, 950.00, 2),
(8, 2025, 3, 980.00, 2),
(9, 2025, 4, 1100.00, 2),
(10, 2025, 5, 1150.00, 2),
(11, 2025, 1, 400.00, 3),
(15, 2025, 5, 800.00, 3),
(16, 2025, 1, 2000.00, 4),
(17, 2025, 2, 2050.00, 4),
(18, 2025, 3, 2100.00, 4),
(19, 2025, 4, 2200.00, 4),
(20, 2025, 5, 2300.00, 4),
(21, 2025, 1, 600.00, 5),
(22, 2025, 2, 700.00, 5),
(23, 2025, 3, 750.00, 5),
(25, 2025, 5, 850.00, 5),
(26, 2025, 11, 1500.00, 6),
(27, 2025, 12, 1550.00, 6),
(28, 2025, 1, 1600.00, 6),
(29, 2025, 2, 1650.00, 6),
(30, 2025, 3, 1700.00, 6),
(31, 2025, 4, 2000.00, 6),
(32, 2025, 1, 1000.00, 7),
(33, 2025, 2, 1100.00, 7),
(34, 2025, 3, 1150.00, 7),
(35, 2025, 4, 1200.00, 7),
(36, 2025, 5, 1250.00, 7),
(37, 2025, 6, 1350.00, 7),
(38, 2025, 7, 1500.00, 7),
(39, 2025, 10, 2200.00, 8),
(40, 2025, 11, 2300.00, 8),
(41, 2025, 12, 2400.00, 8),
(42, 2025, 1, 2500.00, 8),
(43, 2025, 2, 2600.00, 8),
(44, 2025, 3, 2800.00, 8),
(45, 2025, 1, 1700.00, 9),
(46, 2025, 2, 1750.00, 9),
(47, 2025, 6, 1800.00, 9),
(48, 2025, 7, 1850.00, 9),
(49, 2025, 8, 1900.00, 9),
(50, 2025, 1, 800.00, 10),
(51, 2025, 2, 850.00, 10),
(52, 2025, 3, 900.00, 10),
(53, 2025, 8, 950.00, 10),
(54, 2025, 9, 1000.00, 10),
(55, 2025, 10, 1200.00, 10);

CREATE INDEX IF NOT EXISTS idx_user_national_number ON UserEntity(NationalNumber);
CREATE INDEX IF NOT EXISTS idx_user_active ON UserEntity(isActive);
CREATE INDEX IF NOT EXISTS idx_salary_user_id ON SalaryEntity(UserID);
CREATE INDEX IF NOT EXISTS idx_salary_year_month ON SalaryEntity(Year, Month);

SELECT 'Users count: ' || COUNT(*) as info FROM UserEntity;
SELECT 'Salaries count: ' || COUNT(*) as info FROM SalaryEntity;
