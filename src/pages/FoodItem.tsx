import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Eye,
  Download,
  Pencil,
  Trash,
} from "lucide-react";
import axiosInstance from "../components/AxiosInstance";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  ingredients: string;
  spicyLevel: string;
  [key: string]: any;
}

interface MenuResponse {
  data: MenuItem[];
  page: number;
  pages: number;
}

const FoodItem = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | null;
  }>({ key: "", direction: null });
  const [restaurants, setRestaurants] = useState<MenuItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRestaurants = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<MenuResponse>(`/api/menus?page=${page}`);
      const res = response.data;
      setRestaurants(res.data);
      setCurrentPage(res.page);
      setTotalPages(res.pages);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch restaurants.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(currentPage);
  }, [currentPage]);

  const handleDelete = async (
    restaurantId: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axiosInstance.delete(`/api/menus/${restaurantId}`);
      if (response.data?.success) {
        fetchRestaurants(currentPage);
        return { success: true };
      } else {
        return {
          success: false,
          message: response.data?.message || "Delete failed",
        };
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        };
      }
      return {
        success: false,
        message: "Unknown error",
      };
    }
  };

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" | null = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (sortConfig.key === key && sortConfig.direction === "descending") {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key)
      return <ChevronDown className="h-4 w-4 text-gray-400" />;
    return (
      <ChevronDown
        className={`h-4 w-4 text-primary-500 ${
          sortConfig.direction === "descending" ? "rotate-180" : ""
        }`}
      />
    );
  };

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Menus</h2>
        <p className="mt-1 text-sm text-gray-500">Manage your Menu and edit their status</p>
      </div>

      <div>
        <Link to="/editfooditem" className="btn btn-primary">
          Add Menu
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Search + Export */}
        <div className="p-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <div className="w-full max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search menus by name or description..."
                className="pl-10 input"
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "name",
                  "description",
                  "price",
                  "discountedPrice",
                  "ingredients",
                  "spicyLevel",
                ].map((key) => (
                  <th
                    key={key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort(key)}
                  >
                    <div className="flex items-center">
                      {key}
                      {getSortIcon(key)}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedRestaurants
                .filter((item) =>
                  item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((restaurant) => (
                  <tr key={restaurant._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{restaurant.name}</td>
                    <td className="px-6 py-4">{restaurant.description}</td>
                    <td className="px-6 py-4">₹{restaurant.price}</td>
                    <td className="px-6 py-4">₹{restaurant.discountedPrice}</td>
                    <td className="px-6 py-4">{restaurant.ingredients}</td>
                    <td className="px-6 py-4">{restaurant.spicyLevel}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/viewfooditem/${restaurant._id}`}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                      <Link
                        to={`/editfooditem`}
                        state={{ initialData: restaurant }}
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

          {!loading && restaurants.length === 0 && (
            <div className="px-6 py-10 text-center text-gray-500">No menus found.</div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="text-sm text-gray-700">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </div>
          <div>
            <nav className="inline-flex">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-l bg-white disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border ${
                    page === currentPage ? "bg-primary-100 font-bold" : "bg-white"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-r bg-white disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
