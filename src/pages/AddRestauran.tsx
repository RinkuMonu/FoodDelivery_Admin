import React, { useState, ChangeEvent, FormEvent } from 'react';
import axiosInstance from '../components/AxiosInstance';
import axios from 'axios';

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
  alternatePhone?: string;
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

interface Offer {
  title: string;
  code: string;
  discountPercent?: number;
  minOrderValue?: number;
}

interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
}

interface FSSAILicense {
  number: string;
  expiryDate: string;
  image?: File;
}

interface Documents {
  fssaiLicense: FSSAILicense;
  gstNumber: string;
  panCard: string;
}

interface RestaurantFormData {
  name: string;
  description: string;
  address: Address;
  location: Location;
  contact: Contact;
  cuisine: string[];
  timings: Timing[];
  priceRange: string;
  serviceOptions: ServiceOptions;
  deliveryRadius?: number;
  minOrderAmount?: number;
  avgDeliveryTime?: number;
  deliveryFee?: number;
  tags: string[];
  coverImage?: File;
  offers: Offer[];
  discount?: number;
  isActive: boolean;
  isVerified: boolean;
  isPromoted: boolean;
  bankDetails: BankDetails;
  documents: Documents;
}

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", 
  "Thursday", "Friday", "Saturday", "Sunday"
];

const AddRestaurant: React.FC = () => {
  const [formData, setFormData] = useState<RestaurantFormData>({
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
    timings: daysOfWeek.map(day => ({
      day,
      opening: '10:00',
      closing: '22:00',
      closed: false
    })),
    priceRange: '$$',
    serviceOptions: {
      dineIn: true,
      takeaway: true,
      delivery: true
    },
    deliveryRadius: 5,
    minOrderAmount: 200,
    avgDeliveryTime: 30,
    deliveryFee: 40,
    tags: [],
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
        expiryDate: ''
      },
      gstNumber: '',
      panCard: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (field === 'coverImage') {
        setFormData(prev => ({
          ...prev,
          coverImage: file
        }));
      } else if (field === 'fssaiLicenseImage') {
        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            fssaiLicense: {
              ...prev.documents.fssaiLicense,
              image: file
            }
          }
        }));
      }
    }
  };

  const handleArrayChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim())
    }));
  };

  const handleTimingChange = (
    index: number,
    field: keyof Timing,
    value: string | boolean
  ) => {
    setFormData(prev => {
      const newTimings = [...prev.timings];
      newTimings[index] = { ...newTimings[index], [field]: value };
      return { ...prev, timings: newTimings };
    });
  };

 const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // Step 1: Create restaurant without file fields
    const createPayload = {
      ...formData,
      coverImage: undefined,
      documents: {
        ...formData.documents,
        fssaiLicense: {
          number: formData.documents.fssaiLicense.number,
          expiryDate: formData.documents.fssaiLicense.expiryDate,
        }
      }
    };

    const { data: createdRestaurant } = await axiosInstance.post('/api/restaurants', createPayload);
    const newRestaurantId = createdRestaurant._id;
    setRestaurantId(newRestaurantId);
    setSuccess(true);

    // Step 2: Upload images
    const uploadPromises: Promise<any>[] = [];

    if (formData.coverImage) {
      const coverFormData = new FormData();
      coverFormData.append('image', formData.coverImage);

      uploadPromises.push(
        axios.post(`/api/restaurants/${newRestaurantId}/images`, coverFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      );
    }

    if (formData.documents.fssaiLicense.image) {
      const licenseFormData = new FormData();
      licenseFormData.append('image', formData.documents.fssaiLicense.image);

      uploadPromises.push(
        axiosInstance.post(`/api/restaurants/${newRestaurantId}/documents/fssai`, licenseFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      );
    }

    await Promise.all(uploadPromises);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || err.message);
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('An unknown error occurred');
    }
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Restaurant</h1>
      
      {success && (
        <div className="bg-green-100 text-green-700 p-4 mb-4 rounded">
          Restaurant created successfully! ID: {restaurantId}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
          Error: {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Restaurant Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Price Range</label>
              <select
                name="priceRange"
                value={formData.priceRange}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="$">$ (Budget)</option>
                <option value="$$">$$ (Moderate)</option>
                <option value="$$$">$$$ (Premium)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block mb-2">Cuisine IDs (comma separated)</label>
              <input
                type="text"
                value={formData.cuisine.join(', ')}
                onChange={(e) => handleArrayChange(e, 'cuisine')}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => handleArrayChange(e, 'tags')}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Street</label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">City</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">State</label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">ZIP Code</label>
              <input
                type="text"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Country</label>
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>

        {/* Location Coordinates */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Location Coordinates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Latitude</label>
              <input
                type="number"
                value={formData.location.coordinates[1]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    coordinates: [
                      prev.location.coordinates[0],
                      parseFloat(e.target.value) || 0
                    ]
                  }
                }))}
                className="w-full p-2 border rounded"
                step="any"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Longitude</label>
              <input
                type="number"
                value={formData.location.coordinates[0]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    coordinates: [
                      parseFloat(e.target.value) || 0,
                      prev.location.coordinates[1]
                    ]
                  }
                }))}
                className="w-full p-2 border rounded"
                step="any"
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Phone</label>
              <input
                type="tel"
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Alternate Phone</label>
              <input
                type="tel"
                name="contact.alternatePhone"
                value={formData.contact.alternatePhone || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2">Email</label>
              <input
                type="email"
                name="contact.email"
                value={formData.contact.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Opening Hours</h2>
          <div className="space-y-3">
            {formData.timings.map((timing, index) => (
              <div key={timing.day} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-2 font-medium">{timing.day}</div>
                <div className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={timing.closed}
                    onChange={(e) => handleTimingChange(index, 'closed', e.target.checked)}
                    className="mr-2"
                  />
                  <span>Closed</span>
                </div>
                {!timing.closed && (
                  <>
                    <div className="col-span-3">
                      <label>Opening</label>
                      <input
                        type="time"
                        value={timing.opening}
                        onChange={(e) => handleTimingChange(index, 'opening', e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="col-span-3">
                      <label>Closing</label>
                      <input
                        type="time"
                        value={timing.closing}
                        onChange={(e) => handleTimingChange(index, 'closing', e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Service Options */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Service Options</h2>
          <div className="flex space-x-4">
            {Object.entries(formData.serviceOptions).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  id={key}
                  checked={value as boolean}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    serviceOptions: {
                      ...prev.serviceOptions,
                      [key]: e.target.checked
                    }
                  }))}
                  className="mr-2"
                />
                <label htmlFor={key} className="capitalize">
                  {key}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Information */}
        {formData.serviceOptions.delivery && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Delivery Radius (km)</label>
                <input
                  type="number"
                  name="deliveryRadius"
                  value={formData.deliveryRadius}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Min. Order Amount (₹)</label>
                <input
                  type="number"
                  name="minOrderAmount"
                  value={formData.minOrderAmount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Avg. Delivery Time (min)</label>
                <input
                  type="number"
                  name="avgDeliveryTime"
                  value={formData.avgDeliveryTime}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Delivery Fee (₹)</label>
                <input
                  type="number"
                  name="deliveryFee"
                  value={formData.deliveryFee}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* Images */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'coverImage')}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Restaurant'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRestaurant;