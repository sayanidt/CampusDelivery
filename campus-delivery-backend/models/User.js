// This file is optional - just for documentation
// The actual schema is in the MySQL database

/*
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  roll_number VARCHAR(50) UNIQUE NOT NULL,
  room VARCHAR(50),
  hostel ENUM('Boys', 'Girls') NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/
 
