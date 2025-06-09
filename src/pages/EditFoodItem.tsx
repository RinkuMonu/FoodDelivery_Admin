import React, { useState, useEffect } from "react";
import axiosInstance from "../components/AxiosInstance";
import { useLocation } from "react-router-dom";

interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface CustomizationOption {
  name: string;
  additionalPrice: number;
}

interface Customization {
  name: string;
  options: CustomizationOption[];
  required: boolean;
  multiSelect: boolean;
}

interface MenuItem {
  _id?: string;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  category: string;
  veg: boolean;
  spicyLevel: string;
  ingredients: string[];
  allergens: string[];
  nutritionalInfo: NutritionalInfo;
  preparationTime: number;
  serveSize: string;
  customizations: Customization[];
  isAvailable: boolean;
  imageUrl?: string;
}

const EditFormItem = () => {
  // Initial form state
  const initialState: MenuItem = {
    name: "",
    description: "",
    price: 0,
    discountedPrice: 0,
    category: "",
    veg: true,
    spicyLevel: "Medium",
    ingredients: [],
    allergens: [],
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    },
    preparationTime: 20,
    serveSize: "1 plate",
    customizations: [
      {
        name: "",
        options: [{ name: "", additionalPrice: 0 }],
        required: false,
        multiSelect: false,
      },
    ],
    isAvailable: true,
  };

  const [formData, setFormData] = useState<MenuItem>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ingredientInput, setIngredientInput] = useState<string>("");
  const [allergenInput, setAllergenInput] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [imageUpload, setImageUploadProgress] = useState<number>(0);
  
  const location = useLocation();
  const { initialData } = location.state as { initialData?: MenuItem } || {};

  console.log("initialDataaaaaa", initialData);

  // Initialize form for edit mode
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.imageUrl) {
        setPreviewUrl(initialData.imageUrl);
      }
    }
  }, [initialData]);

  // Create preview for image
  useEffect(() => {
    if (!imageFile) return;

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (formData.price <= 0) newErrors.price = "Price must be positive";
    if (!formData.category) newErrors.category = "Category is required";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [parent, child] = name.split(".");

    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as object),
        [child]: Number(value) || value,
      },
    }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, arrayName: keyof MenuItem) => {
    const { value, checked } = e.target;
    const newArray = [...formData[arrayName] as string[]];

    if (checked) {
      newArray.push(value);
    } else {
      const index = newArray.indexOf(value);
      if (index > -1) newArray.splice(index, 1);
    }

    setFormData((prev) => ({ ...prev, [arrayName]: newArray }));
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()],
      }));
      setIngredientInput("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleAddAllergen = () => {
    if (allergenInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        allergens: [...prev.allergens, allergenInput.trim()],
      }));
      setAllergenInput("");
    }
  };

  const handleRemoveAllergen = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      allergens: prev.allergens.filter((_, i) => i !== index),
    }));
  };

  const handleCustomizationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const customizations = [...formData.customizations];

    customizations[index] = {
      ...customizations[index],
      [name]: type === "checkbox" ? checked : value,
    };

    setFormData((prev) => ({ ...prev, customizations }));
  };

  const handleOptionChange = (
    customIndex: number,
    optionIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const customizations = [...formData.customizations];
    const options = [...customizations[customIndex].options];

    options[optionIndex] = {
      ...options[optionIndex],
      [name]: name === "additionalPrice" ? Number(value) : value,
    };

    customizations[customIndex].options = options;
    setFormData((prev) => ({ ...prev, customizations }));
  };

  const addCustomization = () => {
    setFormData((prev) => ({
      ...prev,
      customizations: [
        ...prev.customizations,
        {
          name: "",
          options: [{ name: "", additionalPrice: 0 }],
          required: false,
          multiSelect: false,
        },
      ],
    }));
  };

  const removeCustomization = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customizations: prev.customizations.filter((_, i) => i !== index),
    }));
  };

  const addOption = (customIndex: number) => {
    const customizations = [...formData.customizations];
    customizations[customIndex].options.push({ name: "", additionalPrice: 0 });
    setFormData((prev) => ({ ...prev, customizations }));
  };

  const removeOption = (customIndex: number, optionIndex: number) => {
    const customizations = [...formData.customizations];
    customizations[customIndex].options = customizations[
      customIndex
    ].options.filter((_, i) => i !== optionIndex);
    setFormData((prev) => ({ ...prev, customizations }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    }
  };

  const uploadImage = async (menuId: string): Promise<any> => {
    if (!imageFile) return;
    
    // Ensure we have a valid menu ID
    if (!menuId) {
      throw new Error("Cannot upload image - menu ID is missing");
    }

    const formData = new FormData();
    formData.append("ccc", imageFile);

    try {
      const response = await axiosInstance.post(
        `api/menus/${menuId}/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setImageUploadProgress(percentCompleted);
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setSuccessMessage("");
    setImageUploadProgress(0);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsUploading(false);
      return;
    }

    try {
      // Step 1: Save menu data
      const url = initialData ? `/api/menus/${initialData._id}` : "/api/menus";
      const method = initialData ? "put" : "post";
      
      const response = await axiosInstance[method](url, formData);
      const result = response.data;
      
      // Get menu ID from the correct source
      const menuId = initialData ? initialData._id : (result._id || result.id);
      
      if (!menuId) {
        throw new Error("Menu was saved but no ID was found");
      }

      // Step 2: Upload image if exists
      if (imageFile) {
        try {
          await uploadImage(menuId);
          setSuccessMessage(
            initialData 
              ? "Menu and image updated successfully!" 
              : "Menu created and image uploaded successfully!"
          );
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          setSuccessMessage(
            initialData
              ? "Menu updated but image upload failed"
              : "Menu created but image upload failed"
          );
        }
      } else {
        setSuccessMessage(
          initialData ? "Menu updated successfully!" : "Menu created successfully!"
        );
      }

      // Reset form after successful operation
      if (!initialData) {
        setFormData(initialState);
        setPreviewUrl("");
        setImageFile(null);
      }

    } catch (error) {
      console.error("Error:", error);
      setErrors({ 
        submit: (error as any).response?.data?.message || 
               (error as Error).message || 
               "Operation failed" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {initialData ? "Edit Menu Item" : "Add New Menu Item"}
      </h2>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image Upload and Preview */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Menu Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <div className="relative">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center mb-4">
                      <span className="text-gray-500">No image selected</span>
                    </div>
                  )}

                  <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg inline-flex items-center">
                    <span>{previewUrl ? "Change Image" : "Upload Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Recommended size: 500x500px (JPG, PNG)
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-700 mb-2">Quick Tips</h3>
              <ul className="text-sm text-blue-600 list-disc pl-5 space-y-1">
                <li>Add high-quality images to attract customers</li>
                <li>Set discounted prices to highlight specials</li>
                <li>Use detailed descriptions to entice orders</li>
                <li>Mark popular items as available</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dish name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Category ID*</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Category ID"
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Price (₹)*</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Discounted Price (₹)
                </label>
                <input
                  type="number"
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Spicy Level</label>
                <select
                  name="spicyLevel"
                  value={formData.spicyLevel}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Mild">Mild</option>
                  <option value="Medium">Medium</option>
                  <option value="Hot">Hot</option>
                  <option value="Extra Hot">Extra Hot</option>
                </select>
              </div>

              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  name="veg"
                  checked={formData.veg}
                  onChange={handleChange}
                  className="w-5 h-5 mr-2"
                />
                <label className="text-gray-700">Vegetarian</label>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 mb-1">Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the dish..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Ingredients */}
              <div>
                <label className="block text-gray-700 mb-1">Ingredients</label>
                <div className="flex">
                  <input
                    type="text"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    className="flex-1 p-3 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add ingredient"
                  />
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.ingredients.map((ing, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                    >
                      {ing}
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        className="ml-2 text-blue-600 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergens */}
              <div>
                <label className="block text-gray-700 mb-1">Allergens</label>
                <div className="flex">
                  <input
                    type="text"
                    value={allergenInput}
                    onChange={(e) => setAllergenInput(e.target.value)}
                    className="flex-1 p-3 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add allergen"
                  />
                  <button
                    type="button"
                    onClick={handleAddAllergen}
                    className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.allergens.map((alg, index) => (
                    <div
                      key={index}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center"
                    >
                      {alg}
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergen(index)}
                        className="ml-2 text-red-600 hover:text-red-900"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Nutritional Info */}
            <div className="mt-6">
              <label className="block text-gray-700 mb-3">
                Nutritional Information
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(formData.nutritionalInfo).map(
                  ([key, value]) => (
                    <div key={key}>
                      <label className="block text-gray-600 text-sm mb-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      <input
                        type="number"
                        name={`nutritionalInfo.${key}`}
                        value={value}
                        onChange={handleNestedChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Customizations */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-gray-700">Customizations</label>
                <button
                  type="button"
                  onClick={addCustomization}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  + Add Customization
                </button>
              </div>

              {formData.customizations.map((custom, customIndex) => (
                <div
                  key={customIndex}
                  className="mb-6 p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">
                      Customization #{customIndex + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeCustomization(customIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={custom.name}
                        onChange={(e) =>
                          handleCustomizationChange(customIndex, e)
                        }
                        className="w-full p-2 border rounded-lg"
                        placeholder="e.g., Add-ons"
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <div>
                        <input
                          type="checkbox"
                          name="required"
                          checked={custom.required}
                          onChange={(e) =>
                            handleCustomizationChange(customIndex, e)
                          }
                          className="mr-2"
                          id={`required-${customIndex}`}
                        />
                        <label
                          htmlFor={`required-${customIndex}`}
                          className="text-gray-600 text-sm"
                        >
                          Required
                        </label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="multiSelect"
                          checked={custom.multiSelect}
                          onChange={(e) =>
                            handleCustomizationChange(customIndex, e)
                          }
                          className="mr-2"
                          id={`multiSelect-${customIndex}`}
                        />
                        <label
                          htmlFor={`multiSelect-${customIndex}`}
                          className="text-gray-600 text-sm"
                        >
                          Multi-select
                        </label>
                      </div>
                    </div>
                  </div>

                  <label className="block text-gray-600 text-sm mb-2">
                    Options
                  </label>
                  {custom.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3"
                    >
                      <div>
                        <input
                          type="text"
                          name="name"
                          value={option.name}
                          onChange={(e) =>
                            handleOptionChange(customIndex, optionIndex, e)
                          }
                          className="w-full p-2 border rounded-lg"
                          placeholder="Option name"
                        />
                      </div>
                      <div className="flex">
                        <input
                          type="number"
                          name="additionalPrice"
                          value={option.additionalPrice}
                          onChange={(e) =>
                            handleOptionChange(customIndex, optionIndex, e)
                          }
                          className="w-full p-2 border rounded-l-lg"
                          placeholder="Additional price"
                          min="0"
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(customIndex, optionIndex)}
                          className="bg-red-500 text-white px-3 rounded-r-lg hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addOption(customIndex)}
                    className="text-sm text-blue-500 hover:text-blue-700"
                  >
                    + Add Option
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-gray-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="w-5 h-5 mr-2"
              id="isAvailable"
            />
            <label htmlFor="isAvailable" className="text-gray-700">
              Available for ordering
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center"
            >
              {isUploading && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {initialData ? "Update Menu Item" : "Create Menu Item"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditFormItem;