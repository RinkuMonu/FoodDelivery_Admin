import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../components/AxiosInstance';
import { useParams } from 'react-router-dom';

const MenuForm = ({ menuData, onSuccess }) => {
 const { _id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    discountedPrice: 0,
    category: '',
    veg: true,
    spicyLevel: 'Medium',
    ingredients: [],
    allergens: [],
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    },
    preparationTime: 0,
    serveSize: '',
    customizations: [],
    isAvailable: true
  });

  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // For edit mode, populate form when menuData changes
  useEffect(() => {
    if (menuData) {
      setFormData(menuData);
    }
  }, [menuData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim())
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Add or Update menu
      if (menuData?._id) {
        // Edit existing menu
        response = await axiosInstance.put(
          '/api/menus',
          { ...formData, _id },
          { headers }
        );
      } else {
        // Add new menu
        response = await axiosInstance.post(
          '/api/menus',
          formData,
          { headers }
        );
      }

      // Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        await axiosInstance.post(
          `/api/menus/${"6842d19cf66e90cf0ea2e2f3"}/upload-image`,
          formData,
       
        );
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving menu:', error);
      alert('Error saving menu. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        {menuData ? 'Edit Menu Item' : 'Add New Menu Item'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="2"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Discounted Price (₹)</label>
            <input
              type="number"
              name="discountedPrice"
              value={formData.discountedPrice}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Available</label>
          </div>
        </div>

        {/* Category and Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="veg"
              checked={formData.veg}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Vegetarian</label>
          </div>
          
          <div>
            <label className="block mb-1">Spicy Level</label>
            <select
              name="spicyLevel"
              value={formData.spicyLevel}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Mild">Mild</option>
              <option value="Medium">Medium</option>
              <option value="Hot">Hot</option>
            </select>
          </div>
        </div>

        {/* Ingredients and Allergens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Ingredients (comma separated)</label>
            <input
              type="text"
              value={formData.ingredients.join(', ')}
              onChange={(e) => handleArrayChange('ingredients', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">Allergens (comma separated)</label>
            <input
              type="text"
              value={formData.allergens.join(', ')}
              onChange={(e) => handleArrayChange('allergens', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Nutritional Info */}
        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2">Nutritional Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block mb-1">Calories</label>
              <input
                type="number"
                value={formData.nutritionalInfo.calories}
                onChange={(e) => handleNestedChange('nutritionalInfo', 'calories', e.target.value)}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>
            {/* Repeat for protein, carbs, fat, fiber */}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-1">Menu Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
          {menuData?.image?.url && (
            <div className="mt-2">
              <p className="text-sm">Current Image:</p>
              <img 
                src={menuData.image.url} 
                alt="Menu item" 
                className="h-20 object-cover rounded"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Saving...' : menuData ? 'Update Menu' : 'Add Menu'}
        </button>
      </form>
    </div>
  );
};

export default MenuForm;