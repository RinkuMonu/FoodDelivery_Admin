import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, ChevronDown, Edit, Trash2, ArrowUpDown } from 'lucide-react';

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 89.99,
    stock: 32,
    status: 'In Stock',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 2,
    name: 'Smart Watch',
    category: 'Electronics',
    price: 199.99,
    stock: 18,
    status: 'In Stock',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 3,
    name: 'Designer T-shirt',
    category: 'Clothing',
    price: 49.99,
    stock: 64,
    status: 'In Stock',
    image: 'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 4,
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    price: 109.99,
    stock: 27,
    status: 'In Stock',
    image: 'https://images.pexels.com/photos/1706694/pexels-photo-1706694.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 5,
    name: 'Fitness Tracker',
    category: 'Electronics',
    price: 89.99,
    stock: 15,
    status: 'Low Stock',
    image: 'https://images.pexels.com/photos/4482891/pexels-photo-4482891.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 6,
    name: 'Standing Desk',
    category: 'Furniture',
    price: 299.99,
    stock: 7,
    status: 'Low Stock',
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 7,
    name: 'Ergonomic Chair',
    category: 'Furniture',
    price: 249.99,
    stock: 12,
    status: 'In Stock',
    image: 'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 8,
    name: 'Coffee Maker',
    category: 'Home',
    price: 129.99,
    stock: 0,
    status: 'Out of Stock',
    image: 'https://images.pexels.com/photos/90763/coffee-machine-coffee-coffee-maker-90763.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending' | null;
  }>({ key: '', direction: null });

  // Filter products based on search, category and status
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key as keyof typeof a];
    const bValue = b[sortConfig.key as keyof typeof b];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' | null = 'ascending';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = null;
      }
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    if (sortConfig.direction === 'ascending') {
      return <ChevronDown className="h-4 w-4 text-primary-500" />;
    }
    if (sortConfig.direction === 'descending') {
      return <ChevronDown className="h-4 w-4 text-primary-500 rotate-180" />;
    }
    return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
  };

  const categories = ['All', 'Electronics', 'Clothing', 'Furniture', 'Home'];
  const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product inventory, prices, and availability
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/products/new" className="btn btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </div>
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
                placeholder="Search products..."
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
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
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
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

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('category')}
                >
                  <div className="flex items-center">
                    Category
                    {getSortIcon('category')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('price')}
                >
                  <div className="flex items-center">
                    Price
                    {getSortIcon('price')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('stock')}
                >
                  <div className="flex items-center">
                    Stock
                    {getSortIcon('stock')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon('status')}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded-md object-cover" 
                          src={product.image} 
                          alt={product.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">${product.price.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{product.stock}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${product.status === 'In Stock' 
                        ? 'bg-success-100 text-success-800' 
                        : product.status === 'Low Stock' 
                        ? 'bg-warning-100 text-warning-800' 
                        : 'bg-error-100 text-error-800'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link to={`/products/${product.id}`} className="text-primary-600 hover:text-primary-900">
                        View
                      </Link>
                      <Link to={`/products/${product.id}/edit`} className="text-gray-600 hover:text-gray-900">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button className="text-error-600 hover:text-error-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty state */}
          {sortedProducts.length === 0 && (
            <div className="px-6 py-10 text-center">
              <p className="text-gray-500">No products found matching your criteria.</p>
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{' '}
                <span className="font-medium">8</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
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
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  8
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

export default Products;