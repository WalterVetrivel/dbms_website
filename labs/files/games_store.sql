-- Online game store: starter script for the lab exercises
-- DBMS Study Guide: https://waltervetrivel.github.io/dbms_website/labs/
--
-- Builds the games_store database as it is at the end of Lab Exercise 3
-- (tables, keys and foreign keys), with the sample data from Exercise 4.
-- Use it to start Exercises 4 to 8 if you missed the earlier ones.
-- Exercise 6 adds CurrentPrice and Offers; Exercise 8 needs them.
--
-- WARNING: it deletes any existing games_store database first.
-- Run it in the MySQL command line client with:  SOURCE C:/path/to/games_store.sql
-- or open it in MySQL Workbench and press the lightning button (Execute).
-- Tested to run on MySQL 8.4 LTS.

DROP DATABASE IF EXISTS games_store;
CREATE DATABASE games_store;
USE games_store;

-- Exercise 1 tables, with the keys and constraints from Exercise 2
CREATE TABLE Users (
  UserID      int PRIMARY KEY,
  Username    varchar(191) NOT NULL,
  Email       varchar(191) NOT NULL,
  Password    varchar(255) NOT NULL,
  DateOfBirth date,
  Location    varchar(191),
  CONSTRAINT Users_UNQ_1 UNIQUE (Username),
  CONSTRAINT Users_UNQ_2 UNIQUE (Email)
);

CREATE TABLE Developers (
  DeveloperID       int PRIMARY KEY,
  DeveloperName     varchar(191),
  DeveloperLocation varchar(191)
);

CREATE TABLE Publishers (
  PublisherID       int PRIMARY KEY,
  PublisherName     varchar(191),
  PublisherLocation varchar(191)
);

-- Foreign keys from Exercise 3
CREATE TABLE Games (
  GameID      int PRIMARY KEY,
  Title       varchar(191),
  ReleaseDate date,
  DeveloperID int,
  PublisherID int,
  Genre       varchar(191),
  Description text,
  BasePrice   decimal(10, 2),
  Rating      decimal(10, 2),
  CONSTRAINT Games_CHK CHECK (BasePrice > 0),
  CONSTRAINT Games_FK_1 FOREIGN KEY (DeveloperID)
    REFERENCES Developers (DeveloperID) ON DELETE SET NULL,
  CONSTRAINT Games_FK_2 FOREIGN KEY (PublisherID)
    REFERENCES Publishers (PublisherID) ON DELETE SET NULL
);

CREATE TABLE Cart (
  UserID int,
  GameID int,
  PRIMARY KEY (UserID, GameID),
  CONSTRAINT Cart_FK_1 FOREIGN KEY (UserID)
    REFERENCES Users (UserID) ON DELETE CASCADE,
  CONSTRAINT Cart_FK_2 FOREIGN KEY (GameID)
    REFERENCES Games (GameID) ON DELETE CASCADE
);

-- Exercise 2 tables
CREATE TABLE Transactions (
  TransactionID   int PRIMARY KEY AUTO_INCREMENT,
  TransactionDate date,
  UserID          int,
  CONSTRAINT Transactions_FK FOREIGN KEY (UserID)
    REFERENCES Users (UserID) ON DELETE SET NULL
);

CREATE TABLE PurchaseHistory (
  TransactionID int,
  GameID        int,
  SalePrice     decimal(10, 2),
  PRIMARY KEY (TransactionID, GameID),
  CONSTRAINT Purchase_FK_1 FOREIGN KEY (TransactionID)
    REFERENCES Transactions (TransactionID) ON DELETE CASCADE,
  CONSTRAINT Purchase_FK_2 FOREIGN KEY (GameID)
    REFERENCES Games (GameID) ON DELETE CASCADE
);

-- Rows from Exercises 2 and 3
INSERT INTO Users VALUES (1, 'test', 'test@test.com', '123456', '2000-01-01', 'Australia');
INSERT INTO Developers VALUES (500, 'Nintendo', 'Japan');
INSERT INTO Publishers VALUES (700, 'Nintendo', 'Japan');
INSERT INTO Games VALUES
  (101, 'Super Mario Bros', '1985-09-13', 500, 700, 'Platformer',
   'Play as Mario and rescue Princess Peach from Bowser', 40, 10),
  (102, 'Pokemon Black', '2010-09-18', NULL, 700, 'RPG',
   'Best game in the Pokemon franchise', 50, 10);

-- Sample data from Exercise 4
INSERT INTO Users VALUES
  (2, 'arjun', 'arjun@example.com', 'arjun@123', '2004-03-14', 'India'),
  (3, 'meera', 'meera@example.com', 'meera#456', '2005-07-21', 'India'),
  (4, 'liam',  'liam@example.com',  'liam$789',  '2003-11-02', 'Australia'),
  (5, 'yuki',  'yuki@example.com',  'yuki&321',  '2004-01-30', 'Japan');

INSERT INTO Developers VALUES
  (502, 'Capcom', 'Japan'),
  (503, 'Remedy Entertainment', 'Finland'),
  (504, 'Rockstar North', 'United Kingdom'),
  (505, 'Santa Monica Studio', 'USA'),
  (506, 'CD Projekt Red', 'Poland');

INSERT INTO Publishers VALUES
  (701, 'Capcom', 'Japan'),
  (702, 'Sony Interactive Entertainment', 'USA'),
  (703, 'Rockstar Games', 'USA'),
  (704, 'Epic Games', 'USA'),
  (705, 'CD Projekt', 'Poland'),
  (706, 'Ubisoft', 'France');

INSERT INTO Games VALUES
  (103, 'Resident Evil 2', '2019-01-25', 502, 701, 'Survival Horror',
   'Leon and Claire try to escape Raccoon City', 1999.00, 9.20),
  (104, 'Resident Evil 4', '2023-03-24', 502, 701, 'Survival Horror',
   'Leon is sent to rescue the president''s daughter', 2999.00, 9.50),
  (105, 'Resident Evil Village', '2021-05-07', 502, 701, 'Survival Horror',
   'Ethan searches a strange village for his daughter', 1499.00, 8.40),
  (106, 'Devil May Cry 5', '2019-03-08', 502, 701, 'Action',
   'Three demon hunters fight to save the city', 999.00, 8.80),
  (107, 'Alan Wake 2', '2023-10-27', 503, 704, 'Survival Horror',
   'A writer and an FBI agent face a dark story', 2499.00, 8.90),
  (108, 'God of War', '2018-04-20', 505, 702, 'Action Adventure',
   'Kratos and his son journey across the Norse lands', 3299.00, 9.40),
  (109, 'Grand Theft Auto V', '2013-09-17', 504, 703, 'Action Adventure',
   'Three criminals plan heists in Los Santos', 1499.00, 9.60),
  (110, 'The Witcher 3: Wild Hunt', '2015-05-19', 506, 705, 'RPG',
   'Geralt hunts monsters while searching for Ciri', 999.00, 9.30),
  (111, 'The Legend of Zelda: Breath of the Wild', '2017-03-03', 500, 700, 'Adventure',
   'Link explores Hyrule to defeat Calamity Ganon', 4999.00, 9.70),
  (112, 'Animal Crossing: New Horizons', '2020-03-20', 500, 700, 'Simulation',
   'Build a quiet life on a desert island', 4499.00, 6.90);

INSERT INTO Transactions VALUES
  (1, '2026-07-01', 2),
  (2, '2026-07-03', 3),
  (3, '2026-07-10', 4),
  (4, '2026-08-02', 2),
  (5, '2026-08-15', 5),
  (6, '2026-09-01', 3);

INSERT INTO PurchaseHistory VALUES
  (1, 104, 2999.00), (1, 109, 1499.00),
  (2, 104, 2999.00), (2, 110,  999.00),
  (3, 104, 2499.00), (3, 108, 3299.00),
  (4, 109, 1499.00), (4, 111, 4999.00),
  (5, 104, 2999.00), (5, 110,  999.00),
  (6, 103, 1999.00);

INSERT INTO Cart VALUES
  (1, 105), (1, 107),
  (2, 112);
