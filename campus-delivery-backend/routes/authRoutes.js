const express = require('express');
const { register, login } = require('../controllers/authController');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// TEMPORARY: Create admin account - remove after creating admin
router.get('/setup-admin', async (req, res) => {
  try {
    // Hash password properly
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    console.log('Generated hash:', hashedPassword);
    
    // Delete existing admin
    await db.query('DELETE FROM users WHERE email = ?', ['admin@campus.com']);
    
    // Insert new admin
    const [result] = await db.query(
      'INSERT INTO users (name, email, roll_number, room, hostel, role, phone, password, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['Admin', 'admin@campus.com', 'ADMIN001', 'A-101', 'Boys', 'admin', '1234567890', hashedPassword, true]
    );
    
    res.json({ 
      message: 'Admin created successfully!',
      email: 'admin@campus.com',
      password: 'admin123',
      id: result.insertId 
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
