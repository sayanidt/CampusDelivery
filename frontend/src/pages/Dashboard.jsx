import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    pending: 0,
    thisWeek: 0,
    totalValue: 0
  });
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/my');
      setOrders(data);
      calculateStats(data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orderData) => {
    const total = orderData.length;
    const delivered = orderData.filter(o => o.status === 'Delivered' || o.status === 'Collected').length;
    const pending = orderData.filter(o => o.status === 'Ordered' || o.status === 'Out_for_Delivery').length;
    const totalValue = orderData.reduce((sum, order) => sum + parseFloat(order.item_amount), 0);
    
    // Calculate this week's orders
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeek = orderData.filter(o => new Date(o.created_at) > oneWeekAgo).length;

    setStats({ total, delivered, pending, thisWeek, totalValue });
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

  const getStatusIcon = (status) => {
    const icons = {
      'Ordered': '📦',
      'Out_for_Delivery': '🚚',
      'Delivered': '✅',
      'Collected': '🎉'
    };
    return icons[status] || '📦';
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
    const matchesSearch = order.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.ecommerce_site.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const quickStats = [
    { label: 'Total Packages', value: stats.total, color: 'bg-blue-500' },
    { label: 'Delivered', value: stats.delivered, color: 'bg-green-500' },
    { label: 'In Transit', value: stats.pending, color: 'bg-yellow-500' },
    { label: 'This Week', value: stats.thisWeek, color: 'bg-purple-500' }
  ];

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Ordered', value: 'Ordered' },
    { label: 'In Transit', value: 'Out_for_Delivery' },
    { label: 'Delivered', value: 'Delivered' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold">KL</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-secondary">Campus Delivery</h1>
                <p className="text-xs text-gray-500">Welcome back, {user.name?.split(' ')[0]}</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-surface rounded-2xl p-4 shadow-soft">
              <div className="flex items-center">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mr-3`}>
                  <span className="text-white text-xl font-bold">{stat.value}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary">{stat.label}</p>
                  {stat.label === 'Total Value' && (
                    <p className="text-xs text-gray-500">₹{stats.totalValue.toFixed(0)}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-surface rounded-2xl shadow-soft p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by tracking ID or platform..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Add Package Button */}
            <Link
              to="/create-order"
              className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors text-sm shadow-md whitespace-nowrap"
            >
              + Add Package
            </Link>
          </div>

          {/* Filters */}
          <div className="flex space-x-2 mt-4 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  activeFilter === filter.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="bg-surface rounded-2xl shadow-soft p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your packages...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-surface rounded-2xl shadow-soft p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="text-lg font-semibold text-secondary mb-2">No packages found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || activeFilter !== 'all' 
                ? 'Try adjusting your search or filter' 
                : 'Start tracking your first delivery'}
            </p>
            <Link
              to="/create-order"
              className="inline-flex items-center px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium"
            >
              Add Your First Package
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-surface rounded-2xl shadow-soft p-4 hover:shadow-medium transition-shadow">
                <div className="flex items-start justify-between">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {/* Platform Icon */}
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white font-bold text-xs">
                        {order.ecommerce_site.substring(0, 2)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-secondary text-sm">{order.tracking_id}</p>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {order.receiver_name && `For ${order.receiver_name} • `}
                          ₹{order.item_amount} • {order.ecommerce_site}
                        </p>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">Delivery:</span> {order.delivery_location.replace('_', ' ')}
                      </div>
                      <div>
                        <span className="font-medium">Payment:</span> {order.payment_type}
                      </div>
                    </div>

                    {order.notes && (
                      <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg">
                        {order.notes}
                      </p>
                    )}

                    <p className="text-xs text-gray-400 mt-3">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Status Icon */}
                  <div className="text-2xl ml-4">
                    {getStatusIcon(order.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
