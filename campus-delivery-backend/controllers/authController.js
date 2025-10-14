const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
  try {
    const { name, email, rollNumber, room, hostel, phone, password } = req.body;
    
    // Validate required fields
    if (!name || !email || !rollNumber || !hostel || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if user already exists
    const [existing] = await db.query(
      'SELECT * FROM users WHERE email = ? OR roll_number = ?',
      [email, rollNumber]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email or roll number already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Insert user (default role is 'user')
    const [result] = await db.query(
      'INSERT INTO users (name, email, roll_number, room, hostel, phone, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, rollNumber, room || null, hostel, phone || null, hashedPassword, 'user']
    );

    res.status(201).json({ 
      message: 'User registered successfully',
      id: result.insertId, 
      name, 
      email, 
      rollNumber 
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Find user
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT with role
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        rollNumber: user.roll_number,
        hostel: user.hostel,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
};
