import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Tag, CheckSquare, XSquare } from 'lucide-react';

// Mock product data (in a real app, you would fetch this from an API)
const mockProduct = {
  id: 1,
  name: 'Wireless Headphones',
  sku: 'WH-001',
  description: 'Premium wireless headphones with noise cancellation, long battery life, and superior sound quality. These headphones are perfect for both casual listening and professional audio work.',
  price: 89.99,
  compareAtPrice: 119.99,
  cost: 45.00,
  category: 'Electronics',
  tags: ['Audio', 'Wireless', 'Bluetooth'],
  stock: 32,
  status: 'Active',
  vendor: 'AudioTech Inc.',
  weight: '0.5',
  weightUnit: 'kg',
  dimensions: '20 × 15 × 8',
  dimensionsUnit: 'cm',
  variants: [
    { id: 1, name: 'Black', sku: 'WH-001-BLK', stock: 20, price: 89.99 },
    { id: 2, name: 'White', sku: 'WH-001-WHT', stock: 12, price: 89.99 },
  ],
  images: [
    {
      id: 1,
      url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Wireless Headphones - Main'
    },
    {
      id: 2,
      url: 'https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Wireless Headphones - Side'
    },
    {
      id: 3,
      url: 'https://images.pexels.com/photos/4925916/pexels-photo-4925916.jpeg?auto=compress&cs=tinysrgb&w=600',
      alt: 'Wireless Headphones - Front'
    }
  ],
  createdAt: '2024-12-15',
  updatedAt: '2025-02-28'
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // In a real app, you would fetch product by ID from an API
  const product = mockProduct;
  
  const [activeImage, setActiveImage] = useState(product.images[0].url);
  const [activeTab, setActiveTab] = useState('details');

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
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <p className="mt-1 text-sm text-gray-500">
              SKU: {product.sku} • Updated {product.updatedAt}
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn btn-secondary flex items-center">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
          <button className="btn btn-primary flex items-center">
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Product Images */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-auto object-center object-cover"
              />
            </div>
            <div className="p-4 flex space-x-2 overflow-x-auto">
              {product.images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setActiveImage(image.url)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                    activeImage === image.url ? 'border-primary-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-center object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === 'details'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Product Details
                </button>
                <button
                  onClick={() => setActiveTab('variants')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === 'variants'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Variants
                </button>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === 'inventory'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Inventory
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                    <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Product Name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{product.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">SKU</dt>
                        <dd className="mt-1 text-sm text-gray-900">{product.sku}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Price</dt>
                        <dd className="mt-1 text-sm text-gray-900">${product.price.toFixed(2)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Compare at Price</dt>
                        <dd className="mt-1 text-sm text-gray-900">${product.compareAtPrice.toFixed(2)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Cost per Item</dt>
                        <dd className="mt-1 text-sm text-gray-900">${product.cost.toFixed(2)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Profit</dt>
                        <dd className="mt-1 text-sm text-success-600">${(product.price - product.cost).toFixed(2)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${product.status === 'Active' 
                              ? 'bg-success-100 text-success-800' 
                              : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {product.status}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Category</dt>
                        <dd className="mt-1 text-sm text-gray-900">{product.category}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Tags</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <div className="flex flex-wrap gap-2">
                            {product.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Description</h3>
                    <div className="mt-3 prose prose-sm max-w-none text-gray-500">
                      <p>{product.description}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Shipping Information</h3>
                    <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Weight</dt>
                        <dd className="mt-1 text-sm text-gray-900">{product.weight} {product.weightUnit}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
                        <dd className="mt-1 text-sm text-gray-900">{product.dimensions} {product.dimensionsUnit}</dd>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Variants Tab */}
              {activeTab === 'variants' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
                    <button className="btn btn-secondary text-sm">Add Variant</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {product.variants.map((variant) => (
                          <tr key={variant.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{variant.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variant.sku}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${variant.price.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.stock}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-primary-600 hover:text-primary-900 mr-3">Edit</button>
                              <button className="text-gray-600 hover:text-gray-900">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Inventory Tab */}
              {activeTab === 'inventory' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Inventory Summary</h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <dt className="text-sm font-medium text-gray-500">Total Stock</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{product.stock}</dd>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <dt className="text-sm font-medium text-gray-500">Available Variants</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{product.variants.length}</dd>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{product.updatedAt}</dd>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Inventory Management</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="track-inventory"
                            name="track-inventory"
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="track-inventory" className="font-medium text-gray-700">Track Inventory</label>
                          <p className="text-gray-500">Keep track of stock counts for this product</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="continue-selling"
                            name="continue-selling"
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="continue-selling" className="font-medium text-gray-700">Continue Selling When Out of Stock</label>
                          <p className="text-gray-500">Allow customers to purchase this product when it's out of stock</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button className="btn btn-primary">Update Inventory</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;