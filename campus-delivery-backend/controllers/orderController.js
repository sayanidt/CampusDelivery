const db = require('../config/db');

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { trackingId, ecommerceSite, itemAmount, paymentType, deliveryLocation, notes } = req.body;

    // Validate required fields
    if (!trackingId || !ecommerceSite || !itemAmount || !paymentType || !deliveryLocation) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check for duplicate tracking ID for this user
    const [existing] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? AND tracking_id = ?',
      [userId, trackingId]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'This tracking ID is already added' });
    }

    // Insert order
    const [result] = await db.query(
      'INSERT INTO orders (user_id, tracking_id, ecommerce_site, item_amount, payment_type, delivery_location, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, trackingId, ecommerceSite, itemAmount, paymentType, deliveryLocation, notes || null]
    );

    res.status(201).json({
      message: 'Order created successfully',
      id: result.insertId,
      trackingId,
      status: 'Ordered'
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Ordered', 'Out_for_Delivery', 'Delivered', 'Collected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const [result] = await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', status });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
    );
    
    res.json(orders);
  } catch (err) {
    console.error('Get all orders error:', err);
    res.status(500).json({ error: err.message });
  }
};
 
