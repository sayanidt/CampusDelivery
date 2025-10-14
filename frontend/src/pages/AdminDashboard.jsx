import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const { data } = await api.get('/orders/all');
      setOrders(data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        alert('Access denied');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchAllOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      'Ordered': 'bg-blue-100 text-blue-700',
      'Out_for_Delivery': 'bg-yellow-100 text-yellow-700',
      'Delivered': 'bg-green-100 text-green-700',
      'Collected': 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-red-600 to-pink-600 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-red-100 text-sm">Campus Delivery Management</p>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-white">👤 {user.name}</span>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition font-medium"
            >
              User View
            </button>
            <button 
              onClick={handleLogout} 
              className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Orders ({filteredOrders.length})</h2>
          
          <div className="flex gap-2">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>All</button>
            <button onClick={() => setFilter('Ordered')} className={`px-4 py-2 rounded-lg ${filter === 'Ordered' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>Ordered</button>
            <button onClick={() => setFilter('Out_for_Delivery')} className={`px-4 py-2 rounded-lg ${filter === 'Out_for_Delivery' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700'}`}>Out for Delivery</button>
            <button onClick={() => setFilter('Delivered')} className={`px-4 py-2 rounded-lg ${filter === 'Delivered' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}>Delivered</button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">User Details</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tracking ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Site</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{order.user_name}</div>
                        <div className="text-sm text-gray-500">{order.user_email}</div>
                        <div className="text-sm text-gray-500">📞 {order.user_phone}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm">{order.tracking_id}</td>
                      <td className="px-4 py-3">{order.ecommerce_site}</td>
                      <td className="px-4 py-3 font-semibold text-green-600">₹{order.item_amount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${order.payment_type === 'Prepaid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {order.payment_type}
                        </span>
                      </td>
                      <td className="px-4 py-3">{order.delivery_location.replace('_', ' ')}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="Ordered">Ordered</option>
                          <option value="Out_for_Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Collected">Collected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
