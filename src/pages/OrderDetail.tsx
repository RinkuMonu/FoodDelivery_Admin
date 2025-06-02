import React, { useEffect, useState } from 'react';
import axiosInstance from '../components/AxiosInstance';
import { useParams } from 'react-router-dom';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Contact {
  phone: string;
  alternatePhone: string;
  email: string;
}

interface Restaurant {
  _id: string;
  name: string;
  address: Address;
  contact: Contact;
}

interface FoodItem {
  _id: string;
  name: string;
  veg: boolean;
}

interface Item {
  _id: string;
  foodItem: FoodItem;
  quantity: number;
  price: number;
  subtotal: number;
}

interface OrderStatusTimeline {
  _id: string;
  status: string;
  timestamp: string;
  note: string;
}

interface Order {
  orderNumber: string;
  restaurant: Restaurant;
  items: Item[];
  deliveryFee: number;
  taxAmount: number;
  packagingCharges: number;
  discountAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  estimatedDeliveryTime: string;
  specialInstructions: string;
  orderStatusTimeline: OrderStatusTimeline[];
  createdAt: string;
}

interface Props {
  orderId: string;
}

const OrderDetailsPage: React.FC<Props> = ({ orderId }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { id } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get(`/api/orders/${id}`);
        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          setError('Failed to fetch order');
        }
      } catch (err) {
        setError('API error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400">
        <div className="text-white text-xl font-semibold animate-pulse">Loading Order Details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-600 bg-opacity-80 text-white font-semibold text-lg rounded-md px-4">
        <p className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg">{error}</p>
      </div>
    );
  }

  if (!order) return null;

  const {
    orderNumber,
    restaurant,
    items,
    deliveryFee,
    taxAmount,
    packagingCharges,
    discountAmount,
    paymentMethod,
    paymentStatus,
    orderStatus,
    estimatedDeliveryTime,
    specialInstructions,
    orderStatusTimeline,
    createdAt,
  } = order;

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const finalAmount = subtotal + deliveryFee + taxAmount + packagingCharges - discountAmount;

  // Status badge color logic
  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-400 text-yellow-900',
    COMPLETED: 'bg-green-500 text-green-100',
    CANCELLED: 'bg-red-500 text-red-100',
    PROCESSING: 'bg-blue-500 text-blue-100',
    DELIVERED: 'bg-green-600 text-green-50',
  };

  const paymentStatusColors: Record<string, string> = {
    PENDING: 'text-red-500 font-semibold',
    COMPLETED: 'text-green-600 font-semibold',
    FAILED: 'text-red-700 font-bold',
    REFUNDED: 'text-purple-600 font-semibold',
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 via-indigo-50 to-purple-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Order Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white rounded-3xl p-8 shadow-xl ring-1 ring-purple-300">
          <h1 className="text-4xl font-extrabold mb-1 flex items-center gap-3">
            <span>🧾</span> Order <span className="text-yellow-300">#{orderNumber}</span>
          </h1>
          <p className="text-lg font-semibold flex items-center gap-2">
            Status:
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[orderStatus] || 'bg-gray-300 text-gray-800'}`}>
              {orderStatus.toUpperCase()}
            </span>
          </p>
          <p className="mt-1 text-sm opacity-80 flex items-center gap-1">
            <span>📅</span> Placed on: {new Date(createdAt).toLocaleString()}
          </p>
          <p className="mt-1 text-sm opacity-80 flex items-center gap-1">
            <span>⏰</span> Estimated Delivery: {new Date(estimatedDeliveryTime).toLocaleTimeString()}
          </p>
        </div>

        {/* Grid container for major sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left side: Restaurant and Payment Info */}
          <div className="space-y-8">

            {/* Restaurant Info */}
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-200 hover:shadow-indigo-400 transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2 text-indigo-800">
                🍽️ Restaurant Details
              </h2>
              <p className="text-xl font-semibold">{restaurant?.name}</p>
              <p className="text-sm text-gray-600 mt-1">
                {restaurant?.address?.street}, {restaurant?.address?.city}, {restaurant?.address?.state} - {restaurant?.address?.zipCode}
              </p>
              <p className="text-sm text-gray-700 mt-2 flex items-center gap-2">
                <span>📞</span> {restaurant?.contact?.phone}
              </p>
              <p className="text-sm text-gray-700 flex items-center gap-2">
                <span>📧</span> {restaurant?.contact?.email}
              </p>
            </section>

            {/* Payment Info */}
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-200 hover:shadow-indigo-400 transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2 text-indigo-800">
                💳 Payment Information
              </h2>
              <p className="text-lg font-medium">Method: <span className="text-indigo-600">{paymentMethod}</span></p>
              <p>
                Status:{" "}
                <span className={paymentStatusColors[paymentStatus] || 'text-gray-600 font-medium'}>
                  {paymentStatus.toUpperCase()}
                </span>
              </p>
            </section>
          </div>

          {/* Right side: Ordered Items and Price Summary */}
          <div className="space-y-8">

            {/* Ordered Items */}
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-200 hover:shadow-indigo-400 transition-shadow duration-300 max-h-[420px] overflow-y-auto">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-indigo-800">
                🛒 Ordered Items
              </h2>
              <ul className="divide-y divide-gray-200 border-t border-b border-gray-300 rounded-md overflow-hidden">
                {items.map((item) => (
                  <li
                    key={item._id}
                    className="flex justify-between items-center bg-gradient-to-r from-indigo-50 via-white to-indigo-50 hover:from-indigo-100 hover:to-indigo-100 transition rounded-none py-4 px-6"
                  >
                    <div>
                      <p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        {item.foodItem.name}
                        {item.foodItem.veg ? (
                          <span className="inline-block bg-green-200 text-green-800 rounded-full text-xs px-2 py-0.5 font-semibold">Veg</span>
                        ) : (
                          <span className="inline-block bg-red-200 text-red-800 rounded-full text-xs px-2 py-0.5 font-semibold">Non-Veg</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-indigo-700 text-lg">₹{item.subtotal.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Price Summary */}
            <section className="bg-gradient-to-r from-indigo-100 to-purple-200 rounded-2xl shadow-lg p-6 border border-purple-300">
              <h2 className="text-2xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                💰 Price Summary
              </h2>

              <div className="grid grid-cols-2 gap-3 text-purple-900 text-lg font-semibold">
                <p>Subtotal:</p>
                <p>₹{subtotal.toFixed(2)}</p>

                <p>Tax:</p>
                <p>₹{taxAmount.toFixed(2)}</p>

                <p>Delivery Fee:</p>
                <p>₹{deliveryFee.toFixed(2)}</p>

                <p>Packaging Charges:</p>
                <p>₹{packagingCharges.toFixed(2)}</p>

                <p className="text-red-700">Discount:</p>
                <p className="text-red-700">- ₹{discountAmount.toFixed(2)}</p>

                <hr className="col-span-2 border-purple-500 opacity-70 my-2" />

                <p className="text-2xl font-extrabold">Final Amount:</p>
                <p className="text-2xl font-extrabold">₹{finalAmount.toFixed(2)}</p>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom row: Order Timeline and Special Instructions side by side if wide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Order Timeline */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-200 hover:shadow-indigo-400 transition-shadow duration-300 max-h-[320px] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-indigo-800">
              🕑 Order Timeline
            </h2>
            <ul className="space-y-4 pr-2">
              {orderStatusTimeline.map((status) => (
                <li key={status._id} className="border-l-4 border-indigo-500 pl-4">
                  <p className="font-semibold text-indigo-700">
                    {status.status}{" "}
                    <span className="text-sm font-normal text-gray-600 ml-3">
                      ({new Date(status.timestamp).toLocaleString()})
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 italic">{status.note}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Special Instructions */}
          {specialInstructions ? (
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-200 hover:shadow-indigo-400 transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2 text-indigo-800">
                📝 Special Instructions
              </h2>
              <p className="text-gray-700 italic">{specialInstructions}</p>
            </section>
          ) : (
            // If no special instructions keep grid balanced with empty div
            <div />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;


