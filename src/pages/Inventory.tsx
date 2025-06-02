import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronDown, Plus, Edit, ArrowUpDown } from 'lucide-react';

// Mock inventory data
const mockInventory = [
  {
    id: 1,
    name: 'Wireless Headphones',
    sku: 'WH-001',
    category: 'Electronics',
    price: 89.99,
    stock: 32,
    stockStatus: 'In Stock',
    reorderPoint: 10,
    supplier: 'AudioTech Inc.',
    lastUpdated: '2025-03-01',
    location: 'Warehouse A'
  },
  {
    id: 2,
    name: 'Smart Watch',
    sku: 'SW-002',
    category: 'Electronics',
    price: 199.99,
    stock: 18,
    stockStatus: 'In Stock',
    reorderPoint: 15,
    supplier: 'TechGadgets Ltd.',
    lastUpdated: '2025-03-02',
    location: 'Warehouse A'
  },
  {
    id: 3,
    name: 'Designer T-shirt',
    sku: 'TS-003',
    category: 'Clothing',
    price: 49.99,
    stock: 64,
    stockStatus: 'In Stock',
    reorderPoint: 20,
    supplier: 'Fashion World',
    lastUpdated: '2025-03-01',
    location: 'Warehouse B'
  },
  {
    id: 4,
    name: 'Bluetooth Speaker',
    sku: 'BS-004',
    category: 'Electronics',
    price: 109.99,
    stock: 27,
    stockStatus: 'In Stock',
    reorderPoint: 12,
    supplier: 'AudioTech Inc.',
    lastUpdated: '2025-03-03',
    location: 'Warehouse A'
  },
  {
    id: 5,
    name: 'Fitness Tracker',
    sku: 'FT-005',
    category: 'Electronics',
    price: 89.99,
    stock: 8,
    stockStatus: 'Low Stock',
    reorderPoint: 10,
    supplier: 'HealthTech Co.',
    lastUpdated: '2025-03-02',
    location: 'Warehouse A'
  },
  {
    id: 6,
    name: 'Standing Desk',
    sku: 'SD-006',
    category: 'Furniture',
    price: 299.99,
    stock: 7,
    stockStatus: 'Low Stock',
    reorderPoint: 8,
    supplier: 'OfficeFurniture Plus',
    lastUpdated: '2025-03-01',
    location: 'Warehouse C'
  },
  {
    id: 7,
    name: 'Ergonomic Chair',
    sku: 'EC-007',
    category: 'Furniture',
    price: 249.99,
    stock: 12,
    stockStatus: 'In Stock',
    reorderPoint: 10,
    supplier: 'OfficeFurniture Plus',
    lastUpdated: '2025-03-02',
    location: 'Warehouse C'
  },
  {
    id: 8,
    name: 'Coffee Maker',
    sku: 'CM-008',
    category: 'Home',
    price: 129.99,
    stock: 0,
    stockStatus: 'Out of Stock',
    reorderPoint: 5,
    supplier: 'Kitchen Essentials',
    lastUpdated: '2025-02-28',
    location: 'Warehouse B'
  }
];

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending' | null;
  }>({ key: '', direction: null });

  // Filter inventory based on search, category and status
  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.stockStatus === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort inventory
  const sortedInventory = [...filteredInventory].sort((a, b) => {
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
          <h2 className="text-2xl font-bold text-gray-900">Inventory</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your inventory levels, stock locations, and suppliers
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Inventory
          </button>
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
                placeholder="Search by product name or SKU..."
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

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">
                    Product
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('sku')}
                >
                  <div className="flex items-center">
                    SKU
                    {getSortIcon('sku')}
                  </div>
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
                  onClick={() => requestSort('stock')}
                >
                  <div className="flex items-center">
                    Stock
                    {getSortIcon('stock')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('stockStatus')}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon('stockStatus')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('location')}
                >
                  <div className="flex items-center">
                    Location
                    {getSortIcon('location')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('lastUpdated')}
                >
                  <div className="flex items-center">
                    Updated
                    {getSortIcon('lastUpdated')}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{item.sku}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.stock}</div>
                    <div className="text-xs text-gray-500">Reorder at: {item.reorderPoint}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${item.stockStatus === 'In Stock' 
                        ? 'bg-success-100 text-success-800' 
                        : item.stockStatus === 'Low Stock' 
                        ? 'bg-warning-100 text-warning-800' 
                        : 'bg-error-100 text-error-800'
                      }`}
                    >
                      {item.stockStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{item.location}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{item.lastUpdated}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 flex items-center justify-end">
                      <Edit className="h-4 w-4 mr-1" />
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty state */}
          {sortedInventory.length === 0 && (
            <div className="px-6 py-10 text-center">
              <p className="text-gray-500">No inventory items found matching your criteria.</p>
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

export default Inventory;