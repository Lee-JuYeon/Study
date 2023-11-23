# Connect MariaDB to GraphQL

```
// Create 'db_name' Database
CREATE DATABASE db_name 

// Move 'db_name' Database
USE db_name 

// Create 'WorkdCompany' Table
CREATE TABLE `WorkedCompany` (
  `userID` varchar(255) NOT NULL,
  `companyName` varchar(100) NOT NULL,
  `workStart` date,
  `workEnd` date,
  `position` varchar(100) NOT NULL,
  PRIMARY KEY (`userID`)
); 
```
* Create Database
    * `create database db_name;`
* Move `db_name` Database
    * `use db_name;`
* Create Table
    * ``
* create user for admin
* create user for READ - ONLY ( api clinet )
* set users privillege
* connect MariaDB to GraphQL
* call data from MariaDB on GraphQL