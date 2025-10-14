// This file is optional - just for documentation
// The actual schema is in the MySQL database

/*
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tracking_id VARCHAR(255) NOT NULL,
  ecommerce_site ENUM('Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Nykaa', 'Meesho', 'Others') NOT NULL,
  item_amount DECIMAL(10,2) NOT NULL,
  payment_type ENUM('Prepaid', 'COD') NOT NULL,
  delivery_location ENUM('Boys_Parking', 'Girls_Parking') NOT NULL,
  status ENUM('Ordered', 'Out_for_Delivery', 'Delivered', 'Collected') DEFAULT 'Ordered',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_tracking_per_user (user_id, tracking_id)
);
*/
 
