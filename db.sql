CREATE DATABASE IF NOT EXISTS worklearn;
USE worklearn;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(255) NOT NULL,  -- Added for user's full name
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','company') NOT NULL DEFAULT 'user',
  verified BOOLEAN NOT NULL DEFAULT FALSE,  -- Added for email verification status
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);