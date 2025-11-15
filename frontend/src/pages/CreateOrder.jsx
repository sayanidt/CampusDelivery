import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CreateOrder() {
  const [formData, setFormData] = useState({
    receiverName: '',
    trackingId: '',
    ecommerceSite: 'Amazon',
    customEcommerceSite: '',
    itemAmount: '',
    paymentType: 'Prepaid',
    deliveryLocation: 'Boys_Parking',
    notes: '',
    includePhone: false,
    receiverPhone: '',
    estimatedDelivery: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ecommercePlatforms = [
    { name: 'Amazon', color: 'bg-orange-500' },
    { name: 'Flipkart', color: 'bg-blue-600' },
    { name: 'Myntra', color: 'bg-pink-500' },
    { name: 'Ajio', color: 'bg-yellow-600' },
    { name: 'Nykaa', color: 'bg-purple-500' },
    { name: 'Meesho', color: 'bg-red-500' },
    { name: 'Others', color: 'bg-gray-500' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submitData = {
      receiverName: formData.receiverName,
      trackingId: formData.trackingId,
      ecommerceSite: formData.ecommerceSite === 'Others' ? formData.customEcommerceSite : formData.ecommerceSite,
      customEcommerceSite: formData.ecommerceSite === 'Others' ? formData.customEcommerceSite : null,
      itemAmount: formData.itemAmount,
      paymentType: formData.paymentType,
      deliveryLocation: formData.deliveryLocation,
      notes: formData.notes,
      receiverPhone: formData.includePhone ? formData.receiverPhone : null
    };

    try {
      await api.post('/orders/create', submitData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-secondary">Add New Package</h1>
            </div>
            <div className="text-sm text-gray-600">Step 1 of 1</div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-surface rounded-2xl shadow-soft p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Package Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4">Package Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Receiver Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Who will receive this package?"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    value={formData.receiverName}
                    onChange={(e) => setFormData({...formData, receiverName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Tracking ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter tracking number"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-mono"
                    value={formData.trackingId}
                    onChange={(e) => setFormData({...formData, trackingId: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-3">
                Shopping Platform *
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {ecommercePlatforms.map((platform) => (
                  <button
                    key={platform.name}
                    type="button"
                    onClick={() => setFormData({...formData, ecommerceSite: platform.name})}
                    className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                      formData.ecommerceSite === platform.name
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className={`w-8 h-8 ${platform.color} rounded-lg mx-auto mb-2`}></div>
                    {platform.name}
                  </button>
                ))}
              </div>

              {formData.ecommerceSite === 'Others' && (
                <div className="mt-4">
                  <input
                    type="text"
                    required
                    placeholder="Specify the platform"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    value={formData.customEcommerceSite}
                    onChange={(e) => setFormData({...formData, customEcommerceSite: e.target.value})}
                  />
                </div>
              )}
            </div>

            {/* Order Information */}
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4">Order Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Package Value *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      value={formData.itemAmount}
                      onChange={(e) => setFormData({...formData, itemAmount: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Payment Method *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    value={formData.paymentType}
                    onChange={(e) => setFormData({...formData, paymentType: e.target.value})}
                  >
                    <option value="Prepaid">Prepaid (Already Paid)</option>
                    <option value="COD">Cash on Delivery</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4">Delivery Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Campus Delivery Point *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: 'Boys_Parking', label: 'Boys Hostel Parking' },
                    { value: 'Girls_Parking', label: 'Girls Hostel Parking' }
                  ].map((location) => (
                    <button
                      key={location.value}
                      type="button"
                      onClick={() => setFormData({...formData, deliveryLocation: location.value})}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.deliveryLocation === location.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{location.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4">Additional Information</h3>
              
              {/* Phone Number Option */}
              <div className="mb-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                    checked={formData.includePhone}
                    onChange={(e) => setFormData({...formData, includePhone: e.target.checked})}
                  />
                  <span className="text-sm font-medium text-secondary">
                    Add receiver's phone number for delivery updates
                  </span>
                </label>
              </div>

              {formData.includePhone && (
                <div className="mb-4">
                  <input
                    type="tel"
                    required
                    placeholder="Receiver's phone number"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    value={formData.receiverPhone}
                    onChange={(e) => setFormData({...formData, receiverPhone: e.target.value})}
                  />
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  placeholder="Any special delivery instructions..."
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 border border-border text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium disabled:opacity-60"
              >
                {loading ? 'Adding Package...' : 'Add Package'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
