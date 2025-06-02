// Orders.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Eye,
  Download,
  Calendar,
  ArrowUpDown,
} from "lucide-react";
import axiosInstance from "../components/AxiosInstance";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Order {
  _id: string;
  orderNumber: string;
  customer: string;
  user: { email: string };
  restaurant: { name: string };
  items: { quantity: number };
  createdAt: string;
  finalAmount: number;
  paymentStatus: string;
  orderStatus: string;
}

interface SortConfig {
  key: string;
  direction: "ascending" | "descending" | null;
}

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "", direction: null });
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const statuses = ["All", "PLACED", "Processing", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/api/orders");
        setOrders(response?.data?.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "All" || order.orderStatus === selectedStatus;
    const orderDate = new Date(order.createdAt);
    const matchesDate =
      (!startDate && !endDate) ||
      (startDate && endDate && orderDate >= startDate && orderDate <= endDate);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = (a as any)[sortConfig.key];
    const bValue = (b as any)[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" | null = "ascending";
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") direction = "descending";
      else if (sortConfig.direction === "descending") direction = null;
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    if (sortConfig.direction === "ascending") return <ChevronDown className="h-4 w-4 text-primary-500" />;
    if (sortConfig.direction === "descending") return <ChevronDown className="h-4 w-4 text-primary-500 rotate-180" />;
    return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
  };

  const exportCSV = () => {
    const csv = Papa.unparse(
      sortedOrders.map((o) => ({
        OrderID: o.orderNumber,
        Customer: o.customer,
        Email: o.user?.email,
        Restaurant: o.restaurant?.name,
        Items: o.items?.quantity,
        Date: new Date(o.createdAt).toLocaleString(),
        Amount: o.finalAmount,
        PaymentStatus: o.paymentStatus,
        OrderStatus: o.orderStatus,
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "orders.csv");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Order Report", 14, 14);
    const tableData = sortedOrders.map((o) => [
      o.orderNumber,
      o.customer,
      o.user?.email,
      o.restaurant?.name,
      o.items?.quantity,
      new Date(o.createdAt).toLocaleString(),
      o.finalAmount,
      o.paymentStatus,
      o.orderStatus,
    ]);
    doc.autoTable({
      head: [[
        "Order ID", "Customer", "Email", "Restaurant", "Items", "Date", "Amount", "Payment", "Status"
      ]],
      body: tableData,
      startY: 20,
    });
    doc.save("orders.pdf");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <p className="mt-1 text-sm text-gray-500">Manage your customer orders and track their status</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <div className="w-full max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders by ID, customer or email..."
                className="pl-10 input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {startDate && endDate && (
              <p className="text-sm text-gray-600 mt-2">
                Showing <strong>{filteredOrders.length}</strong> orders from{" "}
                {dayjs(startDate).format("DD MMM")} to {dayjs(endDate).format("DD MMM")}
              </p>
            )}
          </div>

          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <div className="relative">
              <select
                className="input h-10 pl-3 pr-10 py-2 appearance-none"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
{/* 
            <div className="relative inline-block">
              <button
                onClick={() => setOpen(!open)}
                className="btn btn-secondary h-10 flex items-center px-3"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {startDate && endDate
                  ? `${dayjs(startDate).format("DD MMM")} - ${dayjs(endDate).format("DD MMM")}`
                  : "Custom Date"}
              </button>
              {open && (
                <div className="absolute z-10 mt-2">
                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={([start, end]: [Date | null, Date | null]) => {
                      setStartDate(start);
                      setEndDate(end);
                      if (start && end) setOpen(false);
                    }}
                    inline
                  />
                </div>
              )}
            </div> */}

            <button onClick={exportCSV} className="btn btn-secondary h-10 flex items-center">
              <Download className="h-4 w-4 mr-2" /> CSV
            </button>
            <button onClick={exportPDF} className="btn btn-secondary h-10 flex items-center">
              <Download className="h-4 w-4 mr-2" /> PDF
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { label: "Order ID", key: "orderNumber" },
                  { label: "Customer", key: "customer" },
                  { label: "Email", key: "email" },
                  { label: "Restaurant", key: "restaurant" },
                  { label: "Items", key: "items" },
                  { label: "Date", key: "createdAt" },
                  { label: "Amount", key: "finalAmount" },
                  { label: "Payment", key: "paymentStatus" },
                  { label: "Status", key: "orderStatus" },
                ].map(({ label, key }) => (
                  <th
                    key={key}
                    onClick={() => requestSort(key)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  >
                    <div className="flex items-center">
                      {label} {getSortIcon(key)}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {sortedOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-30">
                  <td className="px-6 py-4 whitespace-nowrap">{order.orderNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.user?.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.restaurant?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.items?.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.finalAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.paymentStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.orderStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link to={`/orders/${order._id}`} className="text-primary-600 hover:text-primary-900 inline-flex items-center">
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
