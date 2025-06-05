"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, X, DollarSign, FileText, Utensils, ArrowLeft, Save } from 'lucide-react'
// import { updateMenuItem, getMenuItemById } from "./api/menuApi"

interface EditMenuItemProps {
  menuItemId: string
}

export default function EditMenuItem({ menuItemId }: EditMenuItemProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state matching your curl request structure exactly
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    discountedPrice: 0,
    restaurant: "",
    category: "",
    veg: true,
    spicyLevel: "Mild",
    ingredients: [],
    allergens: [],
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    },
    preparationTime: 0,
    serveSize: "",
    customizations: [],
  })

  // Input states for dynamic arrays
  const [newIngredient, setNewIngredient] = useState("")
  const [newAllergen, setNewAllergen] = useState("")
  const [newCustomization, setNewCustomization] = useState({
    name: "",
    options: [],
    multiSelect: false,
  })
  const [newCustomizationOption, setNewCustomizationOption] = useState({
    name: "",
    additionalPrice: 0,
  })

  // Load menu item data
  useEffect(() => {
    const loadMenuItem = async () => {
      if (!menuItemId) return

      try {
        setIsLoading(true)
        setError(null)

        console.log("Loading menu item with ID:", menuItemId)
        const menuItem = await getMenuItemById(menuItemId)

        console.log("Loaded menu item data:", menuItem)

        // Map the menu item data to form state
        setFormData({
          name: menuItem.name || "",
          description: menuItem.description || "",
          price: menuItem.price || 0,
          discountedPrice: menuItem.discountedPrice || 0,
          restaurant: typeof menuItem.restaurant === "string" ? menuItem.restaurant : menuItem.restaurant?._id || "",
          category: typeof menuItem.category === "string" ? menuItem.category : menuItem.category?._id || "",
          veg: menuItem.veg !== undefined ? menuItem.veg : true,
          spicyLevel: menuItem.spicyLevel || "Mild",
          ingredients: menuItem.ingredients || [],
          allergens: menuItem.allergens || [],
          nutritionalInfo: menuItem.nutritionalInfo || {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0,
          },
          preparationTime: menuItem.preparationTime || 0,
          serveSize: menuItem.serveSize || "",
          customizations: menuItem.customizations || [],
        })
      } catch (error: any) {
        console.error("Error loading menu item:", error)
        setError(error.message || "Failed to load menu item data")
      } finally {
        setIsLoading(false)
      }
    }

    loadMenuItem()
  }, [menuItemId])

  // Handle basic input changes
  const handleInputChange = (path: string, value: any) => {
    const keys = path.split(".")
    setFormData((prev) => {
      const newData = { ...prev }
      let current: any = newData

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  // Handle ingredients
  const addIngredient = () => {
    if (newIngredient.trim() && !formData.ingredients.includes(newIngredient.trim())) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()],
      }))
      setNewIngredient("")
    }
  }

  const removeIngredient = (ingredientToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((ingredient) => ingredient !== ingredientToRemove),
    }))
  }

  // Handle allergens
  const addAllergen = () => {
    if (newAllergen.trim() && !formData.allergens.includes(newAllergen.trim())) {
      setFormData((prev) => ({
        ...prev,
        allergens: [...prev.allergens, newAllergen.trim()],
      }))
      setNewAllergen("")
    }
  }

  const removeAllergen = (allergenToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      allergens: prev.allergens.filter((allergen) => allergen !== allergenToRemove),
    }))
  }

  // Handle customizations
  const addCustomizationOption = () => {
    if (newCustomizationOption.name.trim()) {
      setNewCustomization((prev) => ({
        ...prev,
        options: [...prev.options, { ...newCustomizationOption }],
      }))
      setNewCustomizationOption({ name: "", additionalPrice: 0 })
    }
  }

  const removeCustomizationOption = (index: number) => {
    setNewCustomization((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }))
  }

  const addCustomization = () => {
    if (newCustomization.name.trim() && newCustomization.options.length > 0) {
      setFormData((prev) => ({
        ...prev,
        customizations: [...prev.customizations, { ...newCustomization }],
      }))
      setNewCustomization({
        name: "",
        options: [],
        multiSelect: false,
      })
    }
  }

  const removeCustomization = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customizations: prev.customizations.filter((_, i) => i !== index),
    }))
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      // Prepare data for API (matching your curl structure exactly)
      const menuItemData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        discountedPrice: formData.discountedPrice || undefined,
        restaurant: formData.restaurant,
        category: formData.category,
        veg: formData.veg,
        spicyLevel: formData.spicyLevel,
        ingredients: formData.ingredients,
        allergens: formData.allergens,
        nutritionalInfo: formData.nutritionalInfo,
        preparationTime: formData.preparationTime,
        serveSize: formData.serveSize,
        customizations: formData.customizations,
      }

      console.log("Updating menu item data:", menuItemData)

      // Make API call using the axios instance
      const result = await updateMenuItem(menuItemId, menuItemData)

      console.log("Menu item updated successfully:", result)
      setSuccess(`Menu item "${result.name}" updated successfully!`)

      // Show success message for 5 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 5000)
    } catch (error: any) {
      console.error("Error updating menu item:", error)
      setError(error.message || "Failed to update menu item")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-4 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading menu item data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-4 max-w-6xl">
      <div className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold">Edit Menu Item</h1>
          <p className="text-gray-600 mt-1">Update menu item information</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <strong>Success:</strong> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  placeholder="Enter menu item name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant ID *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.restaurant}
                  onChange={(e) => handleInputChange("restaurant", e.target.value)}
                  required
                  placeholder="683ea757ae3bc600d16246ec"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category ID *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  required
                  placeholder="6823266382d90d2543dcf2f6"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Serve Size</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.serveSize}
                  onChange={(e) => handleInputChange("serveSize", e.target.value)}
                  placeholder="12 inch"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                required
                placeholder="Describe your menu item"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Details */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing & Details
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                  required
                  placeholder="12.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discounted Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.discountedPrice}
                  onChange={(e) => handleInputChange("discountedPrice", Number.parseFloat(e.target.value) || 0)}
                  placeholder="10.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preparation Time (min) *</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.preparationTime}
                  onChange={(e) => handleInputChange("preparationTime", Number.parseInt(e.target.value) || 0)}
                  required
                  placeholder="20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spicy Level</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.spicyLevel}
                  onChange={(e) => handleInputChange("spicyLevel", e.target.value)}
                >
                  <option value="Mild">Mild</option>
                  <option value="Medium">Medium</option>
                  <option value="Hot">Hot</option>
                  <option value="Extra Hot">Extra Hot</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.veg}
                  onChange={(e) => handleInputChange("veg", e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Vegetarian</label>
              </div>
            </div>
          </div>
        </div>

        {/* Nutritional Information */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Nutritional Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.nutritionalInfo.calories}
                  onChange={(e) => handleInputChange("nutritionalInfo.calories", Number.parseInt(e.target.value) || 0)}
                  placeholder="800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Protein (g)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.nutritionalInfo.protein}
                  onChange={(e) => handleInputChange("nutritionalInfo.protein", Number.parseInt(e.target.value) || 0)}
                  placeholder="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Carbs (g)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.nutritionalInfo.carbs}
                  onChange={(e) => handleInputChange("nutritionalInfo.carbs", Number.parseInt(e.target.value) || 0)}
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fat (g)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.nutritionalInfo.fat}
                  onChange={(e) => handleInputChange("nutritionalInfo.fat", Number.parseInt(e.target.value) || 0)}
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fiber (g)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.nutritionalInfo.fiber}
                  onChange={(e) => handleInputChange("nutritionalInfo.fiber", Number.parseInt(e.target.value) || 0)}
                  placeholder="5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Ingredients</h2>
          </div>
          <div className="p-6">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="Add ingredient (e.g., tomato sauce)"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIngredient())}
              />
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={addIngredient}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {ingredient}
                  <button
                    type="button"
                    className="ml-2 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                    onClick={() => removeIngredient(ingredient)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Allergens */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Allergens</h2>
          </div>
          <div className="p-6">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newAllergen}
                onChange={(e) => setNewAllergen(e.target.value)}
                placeholder="Add allergen (e.g., gluten)"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAllergen())}
              />
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={addAllergen}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.allergens.map((allergen, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                >
                  {allergen}
                  <button
                    type="button"
                    className="ml-2 h-4 w-4 rounded-full inline-flex items-center justify-center text-red-400 hover:bg-red-200 hover:text-red-500"
                    onClick={() => removeAllergen(allergen)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Customizations */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Customizations</h2>
          </div>
          <div className="p-6">
            {/* Add new customization */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-medium mb-4">Add New Customization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customization Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newCustomization.name}
                    onChange={(e) => setNewCustomization({ ...newCustomization, name: e.target.value })}
                    placeholder="Extra Toppings"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newCustomization.multiSelect}
                    onChange={(e) => setNewCustomization({ ...newCustomization, multiSelect: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Allow Multiple Selection</label>
                </div>
              </div>

              {/* Add customization options */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Options</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newCustomizationOption.name}
                    onChange={(e) => setNewCustomizationOption({ ...newCustomizationOption, name: e.target.value })}
                    placeholder="Option name"
                  />
                  <input
                    type="number"
                    step="0.01"
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newCustomizationOption.additionalPrice}
                    onChange={(e) =>
                      setNewCustomizationOption({
                        ...newCustomizationOption,
                        additionalPrice: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Price"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={addCustomizationOption}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {newCustomization.options.map((option, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>
                        {option.name} (+₹{option.additionalPrice.toFixed(2)})
                      </span>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => removeCustomizationOption(index)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={addCustomization}
                disabled={!newCustomization.name.trim() || newCustomization.options.length === 0}
              >
                Add Customization
              </button>
            </div>

            {/* Display added customizations */}
            <div className="space-y-4">
              {formData.customizations.map((customization, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{customization.name}</h4>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => removeCustomization(index)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {customization.multiSelect ? "Multiple selection allowed" : "Single selection only"}
                  </p>
                  <div className="space-y-1">
                    {customization.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="text-sm">
                        • {option.name} (+₹{option.additionalPrice.toFixed(2)})
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Updating Menu Item..." : "Update Menu Item"}
          </button>
        </div>
      </form>
    </div>
  )
}
