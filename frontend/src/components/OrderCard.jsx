export default function OrderCard({ order }) {
  const getStatusColor = (status) => {
    const colors = {
      'Ordered': 'bg-blue-100 text-blue-700',
      'Out_for_Delivery': 'bg-yellow-100 text-yellow-700',
      'Delivered': 'bg-green-100 text-green-700',
      'Collected': 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{order.tracking_id}</h3>
          <p className="text-gray-600">{order.ecommerce_site}</p>
          <p className="text-sm text-gray-500">₹{order.item_amount} • {order.payment_type}</p>
          <p className="text-sm text-gray-500">{order.delivery_location.replace('_', ' ')}</p>
          {order.notes && <p className="text-sm mt-2">{order.notes}</p>}
        </div>
        <span className={`px-3 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
          {order.status.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
}
