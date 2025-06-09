import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  Download,
  Calendar,
  ArrowUpDown,
  Pencil,
  Trash,
} from "lucide-react";
import axiosInstance from "../components/AxiosInstance";

interface WalletTransaction {
  _id: string;
  userId: string;
  amount: number;
  type: string;
  status: string;
  paymentMethod: string;
  description: string;
  createdAt: string;
  // Add other fields as needed
}

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("All");
  const [dateRange, setDateRange] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | null;
  }>({ key: "", direction: null });
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || transaction.type === selectedType;
    const matchesStatus =
      selectedStatus === "All" || transaction.status === selectedStatus;
    const matchesPaymentMethod =
      selectedPaymentMethod === "All" ||
      transaction.paymentMethod === selectedPaymentMethod;

    return matchesSearch && matchesType && matchesStatus && matchesPaymentMethod;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key as keyof typeof a];
    const bValue = b[sortConfig.key as keyof typeof b];

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" | null = "ascending";
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descending";
      } else if (sortConfig.direction === "descending") {
        direction = null;
      }
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    if (sortConfig.direction === "ascending") {
      return <ChevronDown className="h-4 w-4 text-primary-500" />;
    }
    if (sortConfig.direction === "descending") {
      return <ChevronDown className="h-4 w-4 text-primary-500 rotate-180" />;
    }
    return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
  };

  const types = ["All", "credit", "debit"];
  const statuses = ["All", "pending", "completed", "failed"];
  const paymentMethods = ["All", "wallet", "card", "netbanking"];
  const dateRanges = [
    "All",
    "Today",
    "Yesterday",
    "Last 7 days",
    "Last 30 days",
    "This month",
    "Last month",
    "Custom",
  ];

  const fetchWalletTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Build query parameters
      const params: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      };

      if (searchTerm) params.search = searchTerm;
      if (selectedType !== "All") params.type = selectedType;
      if (selectedStatus !== "All") params.status = selectedStatus;
      if (selectedPaymentMethod !== "All") params.paymentMethod = selectedPaymentMethod;
      if (sortConfig.key && sortConfig.direction) {
        params.sortBy = sortConfig.key;
        params.order = sortConfig.direction === "ascending" ? "asc" : "desc";
      }

      // Handle date ranges
      if (dateRange !== "All" && dateRange !== "Custom") {
        const now = new Date();
        const start = new Date();
        
        switch (dateRange) {
          case "Today":
            start.setHours(0, 0, 0, 0);
            break;
          case "Yesterday":
            start.setDate(start.getDate() - 1);
            start.setHours(0, 0, 0, 0);
            const yesterdayEnd = new Date(start);
            yesterdayEnd.setHours(23, 59, 59, 999);
            params.startDate = start.toISOString().split('T')[0];
            params.endDate = yesterdayEnd.toISOString().split('T')[0];
            break;
          case "Last 7 days":
            start.setDate(start.getDate() - 7);
            params.startDate = start.toISOString().split('T')[0];
            params.endDate = now.toISOString().split('T')[0];
            break;
          case "Last 30 days":
            start.setDate(start.getDate() - 30);
            params.startDate = start.toISOString().split('T')[0];
            params.endDate = now.toISOString().split('T')[0];
            break;
          case "This month":
            start.setDate(1);
            params.startDate = start.toISOString().split('T')[0];
            params.endDate = now.toISOString().split('T')[0];
            break;
          case "Last month":
            start.setMonth(start.getMonth() - 1);
            start.setDate(1);
            const end = new Date(start);
            end.setMonth(end.getMonth() + 1);
            end.setDate(0);
            params.startDate = start.toISOString().split('T')[0];
            params.endDate = end.toISOString().split('T')[0];
            break;
        }
      } else if (dateRange === "Custom" && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const response = await axiosInstance.get("/api/wallet/all", { params });
      
      if (response.data?.success) {
        setTransactions(response.data.data);
        setPagination({
          ...pagination,
          total: response.data.total || 0,
        });
      } else {
        setError("Failed to fetch wallet transactions");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch wallet transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletTransactions();
  }, [
    searchTerm,
    selectedType,
    selectedStatus,
    selectedPaymentMethod,
    dateRange,
    startDate,
    endDate,
    sortConfig,
    pagination.page,
    pagination.limit,
  ]);

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination({ ...pagination, limit: newLimit, page: 1 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Wallet Transactions</h2>
        <p className="mt-1 text-sm text-gray-500">
          View and manage wallet transactions
        </p>
      </div>
     
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <div className="w-full max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search transactions by description..."
                className="pl-10 input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <div className="relative">
              <select
                className="input h-10 pl-3 pr-10 py-2 appearance-none"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
            <div className="relative">
              <select
                className="input h-10 pl-3 pr-10 py-2 appearance-none"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
            <div className="relative">
              <select
                className="input h-10 pl-3 pr-10 py-2 appearance-none"
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
            <div className="relative">
              <select
                className="input h-10 pl-3 pr-10 py-2 appearance-none"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                {dateRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
            {dateRange === "Custom" && (
              <div className="flex gap-2">
                <input
                  type="date"
                  className="input h-10"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                  type="date"
                  className="input h-10"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            )}
            <button className="btn btn-secondary h-10 flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("_id")}
                >
                  <div className="flex items-center">
                    Transaction ID
                    {getSortIcon("_id")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("amount")}
                >
                  <div className="flex items-center">
                    Amount
                    {getSortIcon("amount")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("type")}
                >
                  <div className="flex items-center">
                    Type
                    {getSortIcon("type")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon("status")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("paymentMethod")}
                >
                  <div className="flex items-center">
                    Payment Method
                    {getSortIcon("paymentMethod")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("createdAt")}
                >
                  <div className="flex items-center">
                    Date
                    {getSortIcon("createdAt")}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : sortedTransactions.length > 0 ? (
                sortedTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {transaction._id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        transaction.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.type === "credit" ? "+" : "-"} {transaction.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === "credit" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === "completed" 
                          ? "bg-green-100 text-green-800" 
                          : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {transaction.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {transaction.description}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              className="btn btn-secondary"
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </button>
            <button 
              className="ml-3 btn btn-secondary"
              disabled={pagination.page * pagination.limit >= pagination.total}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
                <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
                <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">Rows per page:</span>
                <select
                  className="input h-10 pl-3 pr-8 py-2"
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                >
                  {[5, 10, 20, 50, 100].map((limit) => (
                    <option key={limit} value={limit}>
                      {limit}
                    </option>
                  ))}
                </select>
              </div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button 
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronDown className="h-5 w-5 rotate-90" />
                </button>
                {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => i + 1)
                  .slice(Math.max(0, pagination.page - 3), Math.min(Math.ceil(pagination.total / pagination.limit), pagination.page + 2))
                  .map((pageNum) => (
                    <button
                      key={pageNum}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === pagination.page
                          ? "bg-primary-50 border-primary-500 text-primary-600"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}
                <button 
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  disabled={pagination.page * pagination.limit >= pagination.total}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  <span className="sr-only">Next</span>
                  <ChevronDown className="h-5 w-5 -rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;