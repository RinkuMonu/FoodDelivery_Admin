"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import axiosInstance from "../components/AxiosInstance"

interface Category {
  id: string
  name: string
  description: string
  type: string
  createdAt: string
  image?: string
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [fetchingCategories, setFetchingCategories] = useState(false)
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null)
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  const [toast, setToast] = useState<{
    visible: boolean
    title: string
    description: string
    variant: "success" | "error"
  } | null>(null)

  const showToast = (title: string, description: string, variant: "success" | "error") => {
    setToast({ visible: true, title, description, variant })
    setTimeout(() => setToast(null), 3000)
  }

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setFetchingCategories(true)
    try {
      const response = await axiosInstance.get("/api/categories")
      setCategories(response.data)
      console.log("responseeeee", response)
    } catch (error: any) {
      console.error("Error fetching categories:", error)
      const errorMessage = error.response?.data?.message || "Failed to fetch categories."
      showToast("Error", errorMessage, "error")
    } finally {
      setFetchingCategories(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axiosInstance.post("/api/categories", formData)

      const newCategory = {
        id: response.data.id || Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      }

      setCategories((prev) => [newCategory, ...prev])
      setFormData({ name: "", description: "", type: "" })
      showToast("Success", "Category created successfully!", "success")
    } catch (error: any) {
      console.error("Error creating category:", error)
      const errorMessage = error.response?.data?.message || "Failed to create category. Please try again."
      showToast("Error", errorMessage, "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (categoryId: string, file: File) => {
    setUploadingImage(categoryId)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await axiosInstance.put(`/api/categories/${categoryId}/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId ? { ...cat, image: response.data.imageUrl || URL.createObjectURL(file) } : cat,
        ),
      )
      showToast("Success", "Image uploaded successfully!", "success")
    } catch (error: any) {
      console.error("Error uploading image:", error)
      const errorMessage = error.response?.data?.message || "Failed to upload image. Please try again."
      showToast("Error", errorMessage, "error")
    } finally {
      setUploadingImage(null)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return
    }

    setDeletingCategory(categoryId)

    try {
      await axiosInstance.delete(`/api/categories/${categoryId}`)

      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId))
      showToast("Success", "Category deleted successfully!", "success")
    } catch (error: any) {
      console.error("Error deleting category:", error)
      const errorMessage = error.response?.data?.message || "Failed to delete category. Please try again."
      showToast("Error", errorMessage, "error")
    } finally {
      setDeletingCategory(null)
    }
  }

  const handleFileSelect = (categoryId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showToast("Error", "Please select a valid image file.", "error")
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showToast("Error", "Image size should be less than 5MB.", "error")
        return
      }

      handleImageUpload(categoryId, file)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "cuisine":
        return "🍽️"
      case "drink":
        return "☕"
      case "appetizer":
        return "🍕"
      case "dessert":
        return "🍰"
      case "main":
        return "🍖"
      default:
        return "🏷️"
    }
  }

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "cuisine":
        return "bg-blue-100 text-blue-800"
      case "drink":
        return "bg-purple-100 text-purple-800"
      case "appetizer":
        return "bg-orange-100 text-orange-800"
      case "dessert":
        return "bg-pink-100 text-pink-800"
      case "main":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 animate-slide-in ${
              toast.variant === "success"
                ? "bg-green-50 border-l-4 border-green-500"
                : "bg-red-50 border-l-4 border-red-500"
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                {toast.variant === "success" ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3
                  className={`text-sm font-medium ${toast.variant === "success" ? "text-green-800" : "text-red-800"}`}
                >
                  {toast.title}
                </h3>
                <div className={`mt-1 text-sm ${toast.variant === "success" ? "text-green-700" : "text-red-700"}`}>
                  {toast.description}
                </div>
              </div>
              <button onClick={() => setToast(null)} className="ml-auto pl-3">
                <svg
                  className="h-4 w-4 text-gray-400 hover:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
              <p className="text-gray-500 mt-2">Create and manage your food categories</p>
            </div>
            <button
              onClick={fetchCategories}
              disabled={fetchingCategories}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
            >
              {fetchingCategories ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Refreshing...
                </div>
              ) : (
                "🔄 Refresh"
              )}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Create Category Form */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">➕</span>
                <h2 className="text-xl font-semibold text-gray-900">Create New Category</h2>
              </div>
              <p className="text-gray-500 mt-1">Add a new category to organize your menu items</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Category Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g., spicy, desserts, beverages"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    placeholder="Describe this category..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Category Type *
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select category type</option>
                    <option value="cuisine">Cuisine</option>
                    <option value="drink">Drink</option>
                    <option value="appetizer">Appetizer</option>
                    <option value="dessert">Dessert</option>
                    <option value="main">Main Course</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </div>
                  ) : (
                    "Create Category"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">🏷️</span>
                <h2 className="text-xl font-semibold text-gray-900">Existing Categories</h2>
              </div>
              <p className="text-gray-500 mt-1">{categories.length} categories created</p>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {fetchingCategories ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading categories...</p>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <span className="block text-4xl mb-4">🏷️</span>
                    <p className="font-medium">No categories created yet</p>
                    <p className="text-sm">Create your first category to get started</p>
                  </div>
                ) : (
                  categories.map((category) => (
                    <div key={category.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {category.image ? (
                            <img
                              src={category.image || "/placeholder.svg"}
                              alt={category.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                              onError={(e) => {
                                e.currentTarget.style.display = "none"
                              }}
                            />
                          ) : (
                            <span className="text-2xl">{getTypeIcon(category.type)}</span>
                          )}
                          <div>
                            <h3 className="font-semibold capitalize text-gray-900">{category.name}</h3>
                            <p className="text-sm text-gray-500">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getTypeBadgeClass(category.type)}`}
                          >
                            {category.type}
                          </span>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            disabled={deletingCategory === category.id}
                            className="text-red-600 hover:text-red-800 p-1 rounded disabled:opacity-50 transition-colors"
                            title="Delete category"
                          >
                            {deletingCategory === category.id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Image Upload Section */}
                      <div className="flex items-center gap-2 mt-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileSelect(category.id, e)}
                          ref={(el) => (fileInputRefs.current[category.id] = el)}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRefs.current[category.id]?.click()}
                          disabled={uploadingImage === category.id}
                          className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 transition-colors"
                        >
                          {uploadingImage === category.id ? (
                            <>
                              <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                              Uploading...
                            </>
                          ) : (
                            <>📷 {category.image ? "Change Image" : "Add Image"}</>
                          )}
                        </button>
                        <div className="text-xs text-gray-400">
                          Created: {new Date(category.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* API Information */}
        <div className="mt-6 bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">API Configuration</h2>
            <p className="text-sm text-gray-500">Using Axios instance with base URL: http://192.168.32.18:4080</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Create Category</label>
              <code className="block p-3 bg-gray-100 rounded-md text-sm font-mono text-gray-800">
                POST /api/categories
              </code>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Get Categories</label>
              <code className="block p-3 bg-gray-100 rounded-md text-sm font-mono text-gray-800">
                GET /api/categories
              </code>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
              <code className="block p-3 bg-gray-100 rounded-md text-sm font-mono text-gray-800">
                PUT /api/categories/{"{categoryId}"}/upload-image
              </code>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delete Category</label>
              <code className="block p-3 bg-gray-100 rounded-md text-sm font-mono text-gray-800">
                DELETE /api/categories/{"{categoryId}"}
              </code>
            </div>

            <hr className="my-3" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Authentication</label>
              <code className="block p-3 bg-gray-100 rounded-md text-sm font-mono text-gray-800">
                Authorization: Bearer {"{token from localStorage}"}
              </code>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }

        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  )
}
