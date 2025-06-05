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

// Mock order data

const Restaurant = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [dateRange, setDateRange] = useState("All");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | null;
  }>({ key: "", direction: null });
  const [restaurants, setRestaurants] = useState([]);
  const [Loading, setLoading] = useState();
  const [error, setError] = useState();

  // Filter orders based on search, status, and date range
  const filteredOrders = restaurants.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || order.status === selectedStatus;

    // Date filtering would be more complex in a real app
    const matchesDate = true; // Simplified for mock data

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
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

  const statuses = [
    "All",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];
  const dateRanges = [
    "All",
    "Today",
    "Yesterday",
    "Last 7 days",
    "Last 30 days",
    "This month",
    "Last month",
  ];

const fetchRestaurants = async () => {
  try {
    const response = await axiosInstance.get("/api/restaurants");
    console.log("responseeeeeeeeee", response);
    setRestaurants(response?.data?.data);
  } catch (err) {
    console.error(err);
    setError("Failed to fetch restaurants.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchRestaurants();
}, []);

const handleDelete = async (
  restaurantId: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await axiosInstance.delete(
      `/api/restaurants/${restaurantId}`
    );
    if (response.data?.success) {
      // Re-fetch the updated list of restaurants
      fetchRestaurants();
      return { success: true };
    } else {
      return {
        success: false,
        message: response.data?.message || "Delete failed",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Server error",
    };
  }
};


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Restaurants</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your customer orders and track their status
        </p>
      </div>
      <div>
        <Link to="/addrestaurant">Add Restaurant</Link>
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
                placeholder="Search orders by ID, customer or email..."
                className="pl-10 input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            {/* <div className="relative">
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
            </div> */}
            {/* <div className="relative">
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
            </div> */}
            {/* <button className="btn btn-secondary h-10 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Custom Date
            </button> */}
            <button className="btn btn-secondary h-10 flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("id")}
                >
                  <div className="flex items-center">
                    S.N
                    {getSortIcon("id")}
                  </div>
                </th>

                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("restaurant")}
                >
                  <div className="flex items-center">
                    Restaurant Name
                    {getSortIcon("restaurant")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("address")}
                >
                  <div className="flex items-center">
                    Address
                    {getSortIcon("address")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("wallet")}
                >
                  <div className="flex items-center">
                    Wallet Balance
                    {getSortIcon("wallet")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("credit")}
                >
                  <div className="flex items-center">
                    Total Credit
                    {getSortIcon("credit")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("SettleMent")}
                >
                  <div className="flex items-center">
                    Total SettleMent
                    {getSortIcon("SettleMent")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("tags")}
                >
                  <div className="flex items-center">
                    Tags
                    {getSortIcon("tags")}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedOrders.map((restaurant, index) => (
                <tr key={restaurant._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {restaurant?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {restaurant?.address?.city}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {restaurant.rating}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {restaurant?.avgDeliveryTime}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="ml-1 text-xs text-gray-500">
                      ({restaurant?.type} )
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="ml-1 text-xs text-gray-500">
                      ({restaurant?.tags} )
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      to={`/viewreataurant/${restaurant._id}`}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>

                    <Link
                      to={`/viewreataurant`}
                      className="text-yellow-600 hover:text-yellow-900 inline-flex items-center"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(restaurant._id)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty state */}
          {sortedOrders.length === 0 && (
            <div className="px-6 py-10 text-center">
              <p className="text-gray-500">
                No orders found matching your criteria.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="btn btn-secondary">Previous</button>
            <button className="ml-3 btn btn-secondary">Next</button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">8</span> of{" "}
                <span className="font-medium">8</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <ChevronDown className="h-5 w-5 rotate-90" />
                </button>
                <button className="bg-primary-50 border-primary-500 text-primary-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
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

export default Restaurant;
