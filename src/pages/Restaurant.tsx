import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Eye,
  Download,
  ArrowUpDown,
  Pencil,
  Trash,
} from "lucide-react";
import axiosInstance from "../components/AxiosInstance";

// Define TypeScript interfaces
interface Address {
  city: string;
  // Add other address properties if needed
}

interface Restaurant {
  _id: string;
  name: string;
  address: Address;
  rating: number;
  avgDeliveryTime: string;
  type: string;
  tags: string;
}

type SortDirection = "ascending" | "descending" | null;
type SortConfig = {
  key: keyof Restaurant | "";
  direction: SortDirection;
};

const Restaurant = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: null,
  });
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/restaurants");
      setRestaurants(response?.data?.data || []);
      setError(null);
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

  // Filter restaurants based on search
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      restaurant._id.toLowerCase().includes(searchLower) ||
      restaurant.name.toLowerCase().includes(searchLower)
    );
  });

  // Sort restaurants
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (!sortConfig.key || sortConfig.direction === null) return 0;

    const aValue = a[sortConfig.key as keyof Restaurant];
    const bValue = b[sortConfig.key as keyof Restaurant];

    // Handle different value types
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "ascending"
        ? aValue - bValue
        : bValue - aValue;
    }

    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();

    if (aString < bString) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aString > bString) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof Restaurant) => {
    let direction: SortDirection = "ascending";
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descending";
      } else if (sortConfig.direction === "descending") {
        direction = null;
      }
    }
    
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Restaurant) => {
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

  const handleDelete = async (restaurantId: string) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await axiosInstance.delete(`/api/restaurants/${restaurantId}`);
        fetchRestaurants();
      } catch (error: any) {
        console.error("Delete error:", error);
        alert(
          error.response?.data?.message || error.message || "Delete failed"
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Restaurants</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your restaurants and their details
        </p>
      </div>
      <div className="mb-4">
        <Link 
          to="/edit" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Restaurant
        </Link>
      </div>

      {loading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-red-500 text-center py-4">{error}</div>}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <div className="w-full max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search restaurants by ID or name..."
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <button className="btn btn-secondary h-10 flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Restaurants Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.N
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center">
                    Restaurant Name
                    {getSortIcon("name")}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
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
                  onClick={() => requestSort("avgDeliveryTime")}
                >
                  <div className="flex items-center">
                    Avg Delivery Time
                    {getSortIcon("avgDeliveryTime")}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedRestaurants.map((restaurant, index) => (
                <tr key={restaurant._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {restaurant.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {restaurant.address?.city || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {restaurant.rating}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {restaurant.avgDeliveryTime}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {restaurant.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {restaurant.tags}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      to={`/viewrestaurant/${restaurant._id}`}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                    <Link
                      to={`/edit`}
                      state={{ restaurantData: restaurant }}
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
          {!loading && sortedRestaurants.length === 0 && (
            <div className="px-6 py-10 text-center">
              <p className="text-gray-500">
                {searchTerm
                  ? "No restaurants found matching your search."
                  : "No restaurants available."}
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
                <span className="font-medium">
                  {sortedRestaurants.length}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {sortedRestaurants.length}
                </span>{" "}
                results
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