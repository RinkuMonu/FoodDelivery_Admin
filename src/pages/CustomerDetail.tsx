import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  ShoppingCart, 
  CreditCard, 
  MapPin, 
  UserX,
  Edit,
  Heart,
  ShoppingBag,
  Clock,
  Download,
  Trash2,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from '../components/AxiosInstance';

// Mock customer data (in a real app, you would fetch this from an API)
const mockCustomer = {
  id: 3,
  name: 'Robert Johnson',
  email: 'robert.johnson@example.com',
  phone: '+1 (555) 345-6789',
  location: 'Chicago, USA',
  joinDate: '2025-01-15',
  totalOrders: 8,
  totalSpent: 1245.75,
  lastOrder: '2025-03-02',
  status: 'Active',
  avatar: 'https://ui-avatars.com/api/?name=Robert+Johnson&background=0073ff&color=fff',
  address: {
    line1: '789 Oak Avenue',
    line2: 'Suite 301',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    country: 'United States'
  },
  recentOrders: [
    { id: 'ORD-001', date: '2025-03-02', total: 345.50, status: 'Delivered', items: 5 },
    { id: 'ORD-002', date: '2025-02-15', total: 189.99, status: 'Delivered', items: 2 },
    { id: 'ORD-003', date: '2025-02-03', total: 245.75, status: 'Delivered', items: 3 },
    { id: 'ORD-004', date: '2025-01-22', total: 189.99, status: 'Delivered', items: 2 },
    { id: 'ORD-005', date: '2025-01-15', total: 274.52, status: 'Delivered', items: 4 }
  ],
  wishlist: [
    { id: 1, name: 'Wireless Headphones', price: 89.99, image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 2, name: 'Smart Watch', price: 199.99, image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300' }
  ],
  paymentMethods: [
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '5555', expiry: '10/26', isDefault: false }
  ],
  monthlySpending: [
    { month: 'Jan', amount: 274.52 },
    { month: 'Feb', amount: 435.74 },
    { month: 'Mar', amount: 345.50 }
  ],
  notes: 'Prefers to be contacted via email. Interested in tech gadgets and premium audio equipment.'
};

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  console.log("iddddddddddd",id)
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [userDetails , setUserDetails] = useState("")
  
  // In a real app, you would fetch customer by ID from an API
  const customer = mockCustomer;
   useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axiosInstance.get(`/api/users/${id}`);
        console.log("responseeeeeeeeee", response);
        setUserDetails(response?.data?.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch restaurants.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [ ]);
  
  const [activeTab, setActiveTab] = useState('orders');
  const [note, setNote] = useState(customer.notes || '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full overflow-hidden">
              <img 
                src={customer.avatar} 
                alt={customer.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
              <p className="mt-1 text-sm text-gray-500">
                Customer since {customer.joinDate} • {customer.totalOrders} orders
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn btn-secondary flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </button>
          <button className="btn btn-secondary flex items-center">
            <UserX className="h-4 w-4 mr-2" />
            Deactivate
          </button>
          <button className="btn btn-primary flex items-center">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
        </div>
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === 'orders'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === 'wishlist'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Wishlist
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === 'analytics'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Analytics
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === 'notes'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Notes
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                    <div className="flex items-center">
                      <button className="btn btn-secondary text-sm flex items-center mr-2">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </button>
                      <Link to="/orders/new" className="btn btn-primary text-sm flex items-center">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Create Order
                      </Link>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Items
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {customer.recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.items}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${order.total.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${order.status === 'Delivered' 
                                  ? 'bg-success-100 text-success-800' 
                                  : order.status === 'Shipped' 
                                  ? 'bg-primary-100 text-primary-800' 
                                  : order.status === 'Processing' 
                                  ? 'bg-warning-100 text-warning-800' 
                                  : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link to={`/orders/${order.id}`} className="text-primary-600 hover:text-primary-900">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Wishlist Items</h3>
                    <div className="flex items-center">
                      <button className="btn btn-secondary text-sm flex items-center">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Create Order from Wishlist
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {customer.wishlist.length > 0 ? (
                      customer.wishlist.map((item) => (
                        <div key={item.id} className="border rounded-lg overflow-hidden flex">
                          <div className="w-20 h-20 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4 flex flex-col justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                              <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between items-center">
                              <Link to={`/products/${item.id}`} className="text-sm text-primary-600 hover:text-primary-900">
                                View Product
                              </Link>
                              <button className="text-gray-500 hover:text-gray-700">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-8 border rounded-lg bg-gray-50">
                        <Heart className="h-12 w-12 text-gray-300 mx-auto" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No Wishlist Items</h3>
                        <p className="mt-1 text-sm text-gray-500">This customer hasn't added any items to their wishlist yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Order History Analysis</h3>
                  </div>
                  
                  <div className="mb-8">
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Monthly Spending</h4>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={customer.monthlySpending} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value) => [`$${value}`, 'Amount']}
                            cursor={{ fill: 'rgba(0, 115, 255, 0.1)' }}
                          />
                          <Bar dataKey="amount" fill="#0073ff" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="p-2 rounded-md bg-primary-100 mr-4">
                          <ShoppingBag className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Orders</p>
                          <p className="mt-1 text-lg font-semibold text-gray-900">{customer.totalOrders}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="p-2 rounded-md bg-success-100 mr-4">
                          <CreditCard className="h-6 w-6 text-success-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Spent</p>
                          <p className="mt-1 text-lg font-semibold text-gray-900">${customer.totalSpent.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="p-2 rounded-md bg-accent-100 mr-4">
                          <Clock className="h-6 w-6 text-accent-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Last Order</p>
                          <p className="mt-1 text-lg font-semibold text-gray-900">{customer.lastOrder}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Customer Notes</h3>
                    <p className="mt-1 text-sm text-gray-500">Add and manage notes about this customer</p>
                  </div>
                  
                  <div>
                    <label htmlFor="customer-notes" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="customer-notes"
                        name="customer-notes"
                        rows={6}
                        className="input"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add notes about this customer..."
                      />
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button className="btn btn-primary">
                        Save Notes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Contact Information</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={`mailto:${customer.email}`} className="text-primary-600 hover:text-primary-900">
                      {customer.email}
                    </a>
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    Phone
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={`tel:${customer.phone}`} className="text-primary-600 hover:text-primary-900">
                      {customer.phone}
                    </a>
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    Location
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{customer.location}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    Customer Since
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{customer.joinDate}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Address</h3>
              <button className="text-sm text-primary-600 hover:text-primary-900">Edit</button>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <address className="text-sm not-italic text-gray-900">
                <p>{customer.name}</p>
                <p>{customer.address.line1}</p>
                {customer.address.line2 && <p>{customer.address.line2}</p>}
                <p>{customer.address.city}, {customer.address.state} {customer.address.zipCode}</p>
                <p>{customer.address.country}</p>
              </address>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Payment Methods</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                {customer.paymentMethods.map((method) => (
                  <div key={method.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CreditCard className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {method.type} •••• {method.last4}
                          {method.isDefault && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              Default
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;