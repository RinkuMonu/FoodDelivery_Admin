import React, { useEffect, useState, ChangeEvent } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../components/AxiosInstance';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Location {
  type: string;
  coordinates: [number, number];
}

interface Contact {
  phone: string;
  alternatePhone: string;
  email: string;
}

interface Timing {
  day: string;
  opening: string;
  closing: string;
  closed: boolean;
}

interface ServiceOptions {
  dineIn: boolean;
  takeaway: boolean;
  delivery: boolean;
}

interface FssaiLicense {
  number: string;
  expiryDate: string;
  image: string;
}

interface Documents {
  fssaiLicense: FssaiLicense;
  gstNumber: string;
  panCard: string;
}

interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
}

interface RestaurantFormData {
  _id: string | null;
  name: string;
  description: string;
  address: Address;
  location: Location;
  contact: Contact;
  cuisine: string[];
  timings: Timing[];
  priceRange: string;
  serviceOptions: ServiceOptions;
  deliveryRadius: number;
  minOrderAmount: number;
  avgDeliveryTime: number;
  deliveryFee: number;
  tags: string[];
  coverImage: string;
  offers: any[]; // Replace 'any' with a proper type if you know the structure
  discount: number;
  isActive: boolean;
  isVerified: boolean;
  isPromoted: boolean;
  bankDetails: BankDetails;
  documents: Documents;
}

const initialState: RestaurantFormData = {
  _id: null,
  name: '',
  description: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  },
  location: {
    type: 'Point',
    coordinates: [0, 0]
  },
  contact: {
    phone: '',
    alternatePhone: '',
    email: ''
  },
  cuisine: [],
  timings: [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ].map(day => ({ day, opening: '11:00', closing: '23:00', closed: false })),
  priceRange: '$$',
  serviceOptions: {
    dineIn: true,
    takeaway: true,
    delivery: true
  },
  deliveryRadius: 5,
  minOrderAmount: 0,
  avgDeliveryTime: 0,
  deliveryFee: 0,
  tags: [],
  coverImage: '',
  offers: [],
  discount: 0,
  isActive: true,
  isVerified: false,
  isPromoted: false,
  bankDetails: {
    accountName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: ''
  },
  documents: {
    fssaiLicense: {
      number: '',
      expiryDate: '',
      image: ''
    },
    gstNumber: '',
    panCard: ''
  }
};

const mergeRestaurantData = (initial: RestaurantFormData, restaurant: Partial<RestaurantFormData>): RestaurantFormData => ({
  ...initial,
  ...Object.fromEntries(
    Object.entries(restaurant)
      .filter(([key]) => key in initial) // Only keep keys that exist in initial state
      .map(([key, value]) => {
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          return [key, { ...initial[key as keyof RestaurantFormData], ...value }]; // Deep merge objects
        }
        return [key, value]; // Direct assignment for primitives/arrays
      })
  )
}) as RestaurantFormData;

const EditRestaurant: React.FC = () => {
  const [formData, setFormData] = useState<RestaurantFormData>(initialState);
  const location = useLocation();
  const restaurantData = location?.state?.restaurantData || null;

  useEffect(() => {
    console.log('.........formData', formData);
  }, [formData]);

  useEffect(() => {
    if (restaurantData) {
      setFormData(mergeRestaurantData(initialState, restaurantData));
    }
  }, [location.state?.restaurantData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedChange = (parent: keyof RestaurantFormData, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent] as any,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleArrayChange = (arrayName: keyof RestaurantFormData, index: number, field: string, value: any) => {
    setFormData(prev => {
      const newArray = [...(prev[arrayName] as any[])];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData._id && formData._id !== '') {
      try {
        const response = await axiosInstance.put(`/api/restaurants/${formData._id}`, formData);
        console.log('Success:', response.data);
        // Handle success
      } catch (error) {
        console.error('Error:', error);
        // Handle error
      }
    } else {
      try {
        const response = await axiosInstance.post('/api/restaurants', formData);
        console.log('Success:', response.data);
        // Handle success
      } catch (error) {
        console.error('Error:', error);
        // Handle error
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Restaurant Registration</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Street</label>
              <input
                type="text"
                name="street"
                value={formData.address.street}
                onChange={(e) => handleNestedChange('address', e)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={formData.address.city}
                onChange={(e) => handleNestedChange('address', e)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={formData.address.state}
                onChange={(e) => handleNestedChange('address', e)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.address.zipCode}
                onChange={(e) => handleNestedChange('address', e)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                name="country"
                value={formData.address.country}
                onChange={(e) => handleNestedChange('address', e)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>

        {/* Location Coordinates */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Location Coordinates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                value={formData.location.coordinates[1]}
                onChange={(e) => {
                  const newCoords = [...formData.location.coordinates];
                  newCoords[1] = parseFloat(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      coordinates: newCoords
                    }
                  }));
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                step="0.000001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                value={formData.location.coordinates[0]}
                onChange={(e) => {
                  const newCoords = [...formData.location.coordinates];
                  newCoords[0] = parseFloat(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      coordinates: newCoords
                    }
                  }));
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                step="0.000001"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.contact.phone}
                onChange={(e) => handleNestedChange('contact', e)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alternate Phone</label>
              <input
                type="tel"
                name="alternatePhone"
                value={formData.contact.alternatePhone}
                onChange={(e) => handleNestedChange('contact', e)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.contact.email}
                onChange={(e) => handleNestedChange('contact', e)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
          </div>
        </div>

        {/* Cuisine and Tags */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Cuisine & Tags</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cuisine Types (comma separated)</label>
              <input
                type="text"
                value={formData.cuisine.join(', ')}
                onChange={(e) => {
                  const cuisines = e.target.value.split(',').map(item => item.trim());
                  setFormData(prev => ({ ...prev, cuisine: cuisines }));
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(item => item.trim());
                  setFormData(prev => ({ ...prev, tags: tags }));
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>

        {/* Timings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Opening Hours</h2>
          <div className="space-y-4">
            {formData.timings.map((timing, index) => (
              <div key={timing.day} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="font-medium">{timing.day}</div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Opening Time</label>
                  <input
                    type="time"
                    value={timing.opening}
                    onChange={(e) => handleArrayChange('timings', index, 'opening', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Closing Time</label>
                  <input
                    type="time"
                    value={timing.closing}
                    onChange={(e) => handleArrayChange('timings', index, 'closing', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`closed-${timing.day}`}
                    checked={timing.closed}
                    onChange={(e) => handleArrayChange('timings', index, 'closed', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`closed-${timing.day}`} className="ml-2 block text-sm text-gray-700">
                    Closed
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Options */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Service Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="dineIn"
                checked={formData.serviceOptions.dineIn}
                onChange={(e) => handleNestedChange('serviceOptions', e)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Dine-In</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="takeaway"
                checked={formData.serviceOptions.takeaway}
                onChange={(e) => handleNestedChange('serviceOptions', e)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Takeaway</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="delivery"
                checked={formData.serviceOptions.delivery}
                onChange={(e) => handleNestedChange('serviceOptions', e)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Delivery</label>
            </div>
          </div>

          {formData.serviceOptions.delivery && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Delivery Radius (km)</label>
                <input
                  type="number"
                  name="deliveryRadius"
                  value={formData.deliveryRadius}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Minimum Order Amount</label>
                <input
                  type="number"
                  name="minOrderAmount"
                  value={formData.minOrderAmount}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Average Delivery Time (minutes)</label>
                <input
                  type="number"
                  name="avgDeliveryTime"
                  value={formData.avgDeliveryTime}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delivery Fee</label>
                <input
                  type="number"
                  name="deliveryFee"
                  value={formData.deliveryFee}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  min="0"
                />
              </div>
            </div>
          )}
        </div>

        {/* Pricing and Images */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Pricing & Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price Range</label>
              <select
                name="priceRange"
                value={formData.priceRange}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="$">$ (Budget)</option>
                <option value="$$">$$ (Moderate)</option>
                <option value="$$$">$$$ (Expensive)</option>
                <option value="$$$$">$$$$ (Luxury)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
              <input
                type="text"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Name</label>
              <input
                type="text"
                name="accountName"
                value={formData.bankDetails.accountName}
                onChange={(e) => handleNestedChange('bankDetails', e)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.bankDetails.accountNumber}
                onChange={(e) => handleNestedChange('bankDetails', e)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankDetails.bankName}
                onChange={(e) => handleNestedChange('bankDetails', e)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                value={formData.bankDetails.ifscCode}
                onChange={(e) => handleNestedChange('bankDetails', e)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">FSSAI License Number</label>
              <input
                type="text"
                name="number"
                value={formData.documents.fssaiLicense.number}
                onChange={(e) => handleNestedChange('documents', e)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">FSSAI Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.documents.fssaiLicense.expiryDate}
                onChange={(e) => handleNestedChange('documents', e)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">FSSAI License Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.documents.fssaiLicense.image}
                onChange={(e) => handleNestedChange('documents', e)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">GST Number</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.documents.gstNumber}
                onChange={(e) => handleNestedChange('documents', e)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">PAN Card Number</label>
              <input
                type="text"
                name="panCard"
                value={formData.documents.panCard}
                onChange={(e) => handleNestedChange('documents', e)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Active</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isVerified"
                checked={formData.isVerified}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Verified</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPromoted"
                checked={formData.isPromoted}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Promoted</label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRestaurant;