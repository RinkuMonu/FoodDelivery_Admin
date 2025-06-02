import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Users,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  DollarSign,
  Package,
  ShoppingCart,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../components/AxiosInstance";

// Demo data
const salesData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 2780 },
  { name: "May", value: 1890 },
  { name: "Jun", value: 2390 },
  { name: "Jul", value: 3490 },
  { name: "Aug", value: 4000 },
  { name: "Sep", value: 5000 },
  { name: "Oct", value: 6000 },
  { name: "Nov", value: 7000 },
  { name: "Dec", value: 9000 },
];

const revenueData = [
  { name: "Jan", value: 10000 },
  { name: "Feb", value: 8000 },
  { name: "Mar", value: 12000 },
  { name: "Apr", value: 7000 },
  { name: "May", value: 5000 },
  { name: "Jun", value: 6000 },
  { name: "Jul", value: 8500 },
  { name: "Aug", value: 9500 },
  { name: "Sep", value: 11000 },
  { name: "Oct", value: 14000 },
  { name: "Nov", value: 16000 },
  { name: "Dec", value: 21000 },
];

const categoryData = [
  { name: "Electronics", value: 35 },
  { name: "Clothing", value: 25 },
  { name: "Home", value: 20 },
  { name: "Sports", value: 12 },
  { name: "Beauty", value: 8 },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    date: "2025-03-01",
    total: 235.89,
    status: "Delivered",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    date: "2025-03-02",
    total: 125.99,
    status: "Processing",
  },
  {
    id: "ORD-003",
    customer: "Robert Johnson",
    date: "2025-03-03",
    total: 345.5,
    status: "Shipped",
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    date: "2025-03-03",
    total: 89.99,
    status: "Processing",
  },
  {
    id: "ORD-005",
    customer: "Michael Wilson",
    date: "2025-03-04",
    total: 432.75,
    status: "Pending",
  },
];

const topProducts = [
  { id: 1, name: "Wireless Headphones", sold: 142, revenue: 12780 },
  { id: 2, name: "Smart Watch", sold: 98, revenue: 19600 },
  { id: 3, name: "Designer T-shirt", sold: 87, revenue: 4350 },
  { id: 4, name: "Bluetooth Speaker", sold: 65, revenue: 7150 },
  { id: 5, name: "Fitness Tracker", sold: 59, revenue: 5310 },
];

const StatCard = ({
  title,
  value,
  icon,
  trend,
  percentage,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
  percentage: number;
  color: string;
}) => {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-2 rounded-md bg-${color}-100`}>{icon}</div>
      </div>
      <div className="mt-4 flex items-center">
        {trend === "up" ? (
          <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
        ) : trend === "down" ? (
          <TrendingDown className="h-4 w-4 text-error-500 mr-1" />
        ) : null}
        <span
          className={`text-sm font-medium ${
            trend === "up"
              ? "text-success-600"
              : trend === "down"
              ? "text-error-600"
              : "text-gray-500"
          }`}
        >
          {percentage}%{" "}
          {trend === "up" ? "increase" : trend === "down" ? "decrease" : ""}{" "}
          from last month
        </span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => {
      clearInterval(timer);
    };
  }, []);

  const hours = currentTime.getHours();
  let greeting = "";

  if (hours < 12) {
    greeting = "Good morning";
  } else if (hours < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

   const fetchOrder = async () => {
    try {
      const response = await axiosInstance.get("/api/orders"); // ✅ Await added
      setOrders(response?.data?.data || []); // ✅ Safe fallback
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]); // ✅ Fallback to empty array
    }
  };

  const ferchDashboadData = async()=>{
    try{
      const response = await axiosInstance.get("/api/dashboard/summary")
      console.log("dashboard data", response)
    }
    catch(err){
       console.error("Failed to fetch orders:", err);
    }
  }
 useEffect(() => {
 ferchDashboadData()
  fetchOrder();
}, []);
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
          {greeting}, {user?.name || "Admin"}
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Here's what's happening with your store today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$124,592.30"
          icon={<DollarSign className="h-6 w-6 text-primary-600" />}
          trend="up"
          percentage={12.5}
          color="primary"
        />
        <StatCard
          title="Total Orders"
          value="1,429"
          icon={<ShoppingCart className="h-6 w-6 text-accent-600" />}
          trend="up"
          percentage={8.2}
          color="accent"
        />
        <StatCard
          title="Total Customers"
          value="3,782"
          icon={<Users className="h-6 w-6 text-success-600" />}
          trend="up"
          percentage={4.6}
          color="success"
        />
        <StatCard
          title="Inventory Items"
          value="289"
          icon={<Package className="h-6 w-6 text-warning-600" />}
          trend="down"
          percentage={2.3}
          color="warning"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales Overview Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Sales Overview</h3>
            <select className="input py-1 px-2 text-sm" defaultValue="year">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0073ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0073ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0073ff"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Revenue</h3>
            <select className="input py-1 px-2 text-sm" defaultValue="year">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#f9c000"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Recent Orders</h3>
            <Link
              to="/orders"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          <div className="overflow-hidden">
            <div className="table-container">
              <table className="table">
                <thead className="bg-gray-50">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders?.map((order) => (
                    <tr key={order?.orderNumber} className="hover:bg-gray-50">
                      <td className="font-medium">{order?.orderNumber}</td>
                      <td>{order?.user?.email}</td>
                      <td>{new Date(order?.createdAt).toLocaleString()}</td>
                      <td>${order?.finalAmount?.toFixed(2)}</td>
                      <td>
                        <span
                          className={`badge ${
                            order?.status === "Delivered"
                              ? "badge-success"
                              : order.status === "Shipped"
                              ? "badge-success"
                              : order.status === "Processing"
                              ? "badge-warning"
                              : "badge-error"
                          }`}
                        >
                          {order?.orderStatus}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/orders/${order?._id}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Sales by Category</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#0073ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Top Products</h3>
          <Link
            to="/products"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all products
          </Link>
        </div>
        <div className="overflow-hidden">
          <div className="table-container">
            <table className="table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5">Product Name</th>
                  <th className="py-3.5">Units Sold</th>
                  <th className="py-3.5">Revenue</th>
                  <th className="py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-4 font-medium">{product.name}</td>
                    <td className="py-4">{product.sold}</td>
                    <td className="py-4">
                      ${product.revenue.toLocaleString()}
                    </td>
                    <td className="py-4">
                      <Link
                        to={`/products/${product.id}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
