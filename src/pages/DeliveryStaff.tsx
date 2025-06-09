import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronDown,
  Mail,
  User,
  ArrowUpDown,
  Pencil,
  Trash,
} from "lucide-react";
import axiosInstance from "../components/AxiosInstance";

interface Rider {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  profilePicture?: string;
  isActive: boolean;
  assignedOrders?: number;
  totalDeliveries?: number;
  rating?: number;
  vehicleNumber?: string;
  earnings?: number;
  status?: string;
}

interface ApiResponse {
  data: {
    data: Rider[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  };
}

const DeliveryStaff = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | null;
  }>({ key: "", direction: null });
  const [riders, setRiders] = useState<Rider[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    limit: 10,
    total: 0,
  });
const filteredRiders = Array.isArray(riders)
  ? riders.filter((rider) => {
      const matchesSearch =
        rider?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const statusText = rider?.isActive === true ? "available" : "unavailable";
      const matchesStatus =
        selectedStatus === "All" || statusText === selectedStatus;

      return matchesSearch && matchesStatus;
    })
  : [];


  // Sort riders
  const sortedRiders = [...filteredRiders].sort((a, b) => {
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

  const statuses = ["All", "available", "unavailable"];

const fetchRiders = async (page: number = 1, limit: number = 10) => {
  try {
    setLoading(true);
    const response = await axiosInstance.get(`api/riders?page=${page}&limit=${limit}`);

    const ridersArray = response.data?.data || []; // <-- flat array
    setRiders(ridersArray);

    // Optional: if no pagination is provided in your API, fallback to this:
    setPagination({
      page,
      pages: 1, // or Math.ceil(ridersArray.length / limit) if you're paginating on frontend
      limit,
      total: ridersArray.length,
    });
  } catch (err) {
    console.error("Failed to fetch riders:", err);
    setError("Failed to fetch riders.");
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchRiders();
  }, []);

  const handleDelete = async (riderId: string) => {
    try {
      const response = await axiosInstance.delete(`/api/riders/${riderId}`);
      if (response.data?.success) {
        fetchRiders(pagination.page, pagination.limit);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchRiders(newPage, pagination.limit);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Delivery Staff</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your delivery staff accounts and view their delivery history
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
                placeholder="Search riders by name, email or location..."
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
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
            <button className="btn btn-secondary h-10 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Riders Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("fullName")}
                >
                  <div className="flex items-center">
                    Rider
                    {getSortIcon("fullName")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("mobile")}
                >
                  <div className="flex items-center">
                    Mobile No.
                    {getSortIcon("mobile")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("assignedOrders")}
                >
                  <div className="flex items-center">
                    Assigned Orders
                    {getSortIcon("assignedOrders")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("totalDeliveries")}
                >
                  <div className="flex items-center">
                    Total Deliveries
                    {getSortIcon("totalDeliveries")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("rating")}
                >
                  <div className="flex items-center">
                    Rating
                    {getSortIcon("rating")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("vehicleNumber")}
                >
                  <div className="flex items-center">
                    Vehicle No.
                    {getSortIcon("vehicleNumber")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("earnings")}
                >
                  <div className="flex items-center">
                    Earnings
                    {getSortIcon("earnings")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("isActive")}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon("isActive")}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : sortedRiders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center">
                    No riders found matching your criteria.
                  </td>
                </tr>
              ) : (
                sortedRiders.map((rider) => (
                  <tr key={rider._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={rider.profilePicture || "/avatar-placeholder.png"}
                            alt={rider.fullName}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {rider.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {rider.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {rider.mobile}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {rider.assignedOrders || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {rider.totalDeliveries || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {rider.rating?.toFixed(1) || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {rider.vehicleNumber || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        ${rider.earnings?.toFixed(2) || "0.00"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rider.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {rider.isActive ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/riders/${rider._id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(rider._id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="btn btn-secondary"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="ml-3 btn btn-secondary"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronDown className="h-5 w-5 rotate-90" />
                </button>
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pagination.page === pageNum
                          ? "bg-primary-50 border-primary-500 text-primary-600"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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

export default DeliveryStaff;