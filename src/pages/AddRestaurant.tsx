"use client";

import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../components/AxiosInstance";
import { Plus, X } from "lucide-react";
import { MapPin } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 26.9124, // Jaipur, India
  lng: 75.7873,
};

export default function AddRestaurant() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || {};
  const userId = user._id || "";

  const [showModal, setShowModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [latitude, setLatitude] = useState(user.lat || center.lat);
  const [longitude, setLongitude] = useState(user.lng || center.lng);
  const [fullAddress, setFullAddress] = useState(user.salonAddress || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCklkVV3ho7yawqRP-imgtd1OtfbrH_akU", // 👈 direct key
  });

  // Initialize form data
  const [formData, setFormData] = useState({
    salonOwnerName: user?.salonOwnerName || "",
    salonName: user?.salonName || "",
    mobileNumber: user?.mobileNumber || "",
    email: user?.email || "",
    address: user?.address || "",
    status: "approved",
    locationMapUrl: user?.locationMapUrl || "",
    salonTitle: user?.salonTitle || "",
    salonDescription: user?.salonDescription || "",
    aadharNumber: user?.aadharNumber || "",
    pancardNumber: user?.pancardNumber || "",
    bankDetails: user?.bankDetails || {
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      branchName: "",
    },
    socialLinks: user?.socialLinks || { facebook: "", instagram: "" },
    openingHours: user?.openingHours || {
      monday: "9:00 AM - 8:00 PM",
      tuesday: "9:00 AM - 8:00 PM",
      wednesday: "9:00 AM - 8:00 PM",
      thursday: "9:00 AM - 8:00 PM",
      friday: "9:00 AM - 8:00 PM",
      saturday: "10:00 AM - 6:00 PM",
      sunday: "Closed",
    },
    facilities: user?.facilities || [],
    services: user?.services?.map((service) => ({
      name: service.title || "",
      rate: service.rate || "",
      duration: service.duration || "",
      gender: service.gender || "",
    })) || [
      {
        name: "",
        rate: "",
        duration: "",
        gender: "",
      },
    ],
    category: user?.category || "Beauty",
    salonPhotos: user?.salonPhotos || [],
    salonAgreement: user?.salonAgreement || null,
  });

  // const [restaurantData, setRestaurantData] = useState({
  //   name: '',
  //   description: '',
  //   street: '',
  //   city: '',
  //   state: '',
  //   zipCode: '',
  //   country: '',
  //   phone: '',
  //   alternatePhone: '',
  //   email: '',
  //   cuisine: '',
  //   tags: '',
  //   rating: '',
  //   timings: [
  //     { day: 'Monday', opening: '', closing: '', closed: false },
  //     { day: 'Tuesday', opening: '', closing: '', closed: false },
  //     { day: 'Wednesday', opening: '', closing: '', closed: false },
  //     { day: 'Thursday', opening: '', closing: '', closed: false },
  //     { day: 'Friday', opening: '', closing: '', closed: false },
  //     { day: 'Saturday', opening: '', closing: '', closed: false },
  //     { day: 'Sunday', opening: '', closing: '', closed: false },
  //   ],
  //   serviceOptions: {
  //     dineIn: true,
  //     takeaway: true,
  //     delivery: true,
  //   },
  //   deliveryRadius: 10,
  //   minOrderAmount: 200,
  //   avgDeliveryTime: 40,
  //   deliveryFee: 30,
  //   packagingCharges: 10,
  //   isActive: true,
  //   isVerified: true,
  //   isPromoted: false,
  //   bankDetails: {
  //     accountName: '',
  //     accountNumber: '',
  //     bankName: '',
  //     ifscCode: '',
  //   },
  //   documents: {
  //     fssaiLicense: {
  //       number: '',
  //       expiryDate: '',
  //       image: '',
  //     },
  //     gstNumber: '',
  //     panCard: '',
  //   },
  // });

  const [facilityInput, setFacilityInput] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [agreementPreview, setAgreementPreview] = useState(null);
  const fileInputRef = useRef(null);
  const agreementInputRef = useRef(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle social links changes
  const handleSocialLinkChange = (platform, value) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [platform]: value,
      },
    });
  };

  const handleBankDetails = (name, value) => {
    setFormData({
      ...formData,
      bankDetails: {
        ...formData.bankDetails,
        [name]: value,
      },
    });
  };

  // Handle opening hours changes
  const handleOpeningHoursChange = (day, value) => {
    setFormData({
      ...formData,
      openingHours: {
        ...formData.openingHours,
        [day]: value,
      },
    });
  };

  // Handle facilities
  const handleAddFacility = () => {
    if (facilityInput && !formData.facilities.includes(facilityInput)) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, facilityInput],
      });
      setFacilityInput("");
    }
  };

  const handleRemoveFacility = (index) => {
    const newFacilities = [...formData.facilities];
    newFacilities.splice(index, 1);
    setFormData({
      ...formData,
      facilities: newFacilities,
    });
  };

  // Handle services
  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const newServices = [...formData.services];
    newServices[index][name] = value;
    setFormData({
      ...formData,
      services: newServices,
    });
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [
        ...formData.services,
        { name: "", rate: "", duration: "", gender: "" },
      ],
    });
  };

  const removeService = (index) => {
    const newServices = [...formData.services];
    newServices.splice(index, 1);
    setFormData({
      ...formData,
      services: newServices,
    });
  };

  // Handle image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + formData.salonPhotos.length > 5) {
      alert("You can upload a maximum of 5 images");
      return;
    }

    const newImagePreviews = [];
    const newImages = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImagePreviews.push(reader.result);
        if (newImagePreviews.length === files.length) {
          setImagePreviews([...imagePreviews, ...newImagePreviews]);
        }
      };
      reader.readAsDataURL(file);
      newImages.push(file);
    });

    setFormData({
      ...formData,
      salonPhotos: [...formData.salonPhotos, ...newImages],
    });
  };

  const removeImage = (index) => {
    const newImages = [...formData.salonPhotos];
    const newPreviews = [...imagePreviews];

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setFormData({
      ...formData,
      salonPhotos: newImages,
    });
    setImagePreviews(newPreviews);
  };

  // Handle agreement upload
  const handleAgreementUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAgreementPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData({
        ...formData,
        salonAgreement: file,
      });
    }
  };

  // Location modal functions
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSaveLocation = () => {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    setFormData({
      ...formData,
      locationMapUrl: mapUrl,
    });
    handleCloseModal();
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    try {
      const detailsData = {
        status: "approved",
        salonDetails: {
          salonTitle: formData.salonTitle,
          salonDescription: formData.salonDescription,
          locationMapUrl: formData.locationMapUrl,
          socialLinks: formData.socialLinks,
          openingHours: formData.openingHours,
          facilities: formData.facilities,
          services: formData.services.map((service) => ({
            title: service.name,
            description: service.name,
            rate: service.rate,
            duration: service.duration,
            gender: service.gender,
            discount: 0,
          })),
          bankDetails: formData.bankDetails,
          latitude: latitude,
          longitude: longitude,
          aadharNumber: formData.aadharNumber,
          pancardNumber: formData.pancardNumber,
        },
      };

      await axiosInstance.post(`/api/restaurants'/${userId}`, detailsData);

      const mediaFormData = new FormData();
      let hasMediaToUpdate = false;

      formData.salonPhotos.forEach((photo) => {
        if (photo instanceof File) {
          mediaFormData.append("salonPhotos", photo);
          hasMediaToUpdate = true;
        }
      });

      if (formData.salonAgreement instanceof File) {
        mediaFormData.append("salonAgreement", formData.salonAgreement);
        hasMediaToUpdate = true;
      }

      if (hasMediaToUpdate) {
        await axiosInstance.put(
          `/api/lead/update/media/${userId}`,
          mediaFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      alert("Salon Updated Successfully!");
      navigate("/distributor");
    } catch (error) {
      console.error("Error updating salon:", error);
      setError(error.response?.data?.error || "Failed to update salon!");
    } finally {
      setIsUpdating(false);
    }
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault(); // Prevent page reload

  //   const token = 'your-jwt-token-here'; // Replace with your actual token

  //   // Format data to match your API request structure
  //   const data = {
  //     name: restaurantData.name,
  //     description: restaurantData.description,
  //     owner: '68302306dafcd8c16252f49d', // Replace with actual owner ID
  //     address: {
  //       street: restaurantData.street,
  //       city: restaurantData.city,
  //       state: restaurantData.state,
  //       zipCode: restaurantData.zipCode,
  //       country: restaurantData.country,
  //     },
  //     location: {
  //       type: 'Point',
  //       coordinates: [26.804488, 75.880558], // Replace with actual coordinates
  //     },
  //     contact: {
  //       phone: restaurantData.phone,
  //       alternatePhone: restaurantData.alternatePhone,
  //       email: restaurantData.email,
  //     },
  //     cuisine: ['665004e2d0b3980a7ad6ae13', '665004e2d0b3980a7ad6ae14'], // Replace with actual cuisine IDs
  //     menu: ['665005a3d0b3980a7ad6ae55', '665005a3d0b3980a7ad6ae56'], // Replace with actual menu IDs
  //     images: ['https://example.com/images/restaurant1.jpg', 'https://example.com/images/restaurant2.jpg'], // Replace with actual image URLs
  //     coverImage: 'https://example.com/images/cover.jpg', // Replace with actual cover image URL
  //     rating: parseFloat(restaurantData.rating),
  //     timings: restaurantData.timings,
  //     serviceOptions: restaurantData.serviceOptions,
  //     deliveryRadius: restaurantData.deliveryRadius,
  //     minOrderAmount: restaurantData.minOrderAmount,
  //     avgDeliveryTime: restaurantData.avgDeliveryTime,
  //     deliveryFee: restaurantData.deliveryFee,
  //     packagingCharges: restaurantData.packagingCharges,
  //     tags: restaurantData.tags.split(',').map(tag => tag.trim()), // Split tags into an array
  //     isActive: restaurantData.isActive,
  //     isVerified: restaurantData.isVerified,
  //     isPromoted: restaurantData.isPromoted,
  //     bankDetails: restaurantData.bankDetails,
  //     documents: restaurantData.documents,
  //   };

  //   try {
  //     const response = await axios.post('http://192.168.1.15:4080/api/restaurants', data, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     console.log(response.data);
  //     alert("Restaurant added successfully!");
  //   } catch (error) {
  //     console.error("There was an error adding the restaurant:", error);
  //     alert("Failed to add restaurant");
  //   }}

  // Render the form
  return (
    <div className="container mx-auto px-6 py-4">
      <h1 className="text-2xl font-bold mb-4">Add Restaurant</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="salonOwnerName"
                value={formData.salonOwnerName}
                required
                readOnly
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="salonName"
                value={formData.salonName}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="mobileNumber"
                value={formData.mobileNumber}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="email"
                value={formData.email}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZipCode
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
               Tags (comma separated):
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                required
              />
            </div>
              <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gst Number
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="pancardNumber"
                value={formData.pancardNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="address"
                value={formData.address}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Map URL
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="locationMapUrl"
                  value={formData.locationMapUrl}
                  onChange={handleChange}
                />
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  type="button"
                  onClick={handleShowModal}
                >
                  <MapPin className="h-4 w-4 mr-2" /> Set Location
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone:
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="salonTitle"
                value={formData.salonTitle}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alternate Phone:
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="salonTitle"
                value={formData.salonTitle}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email:
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="salonTitle"
                value={formData.salonTitle}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (1-5):
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="salonTitle"
                value={formData.salonTitle}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Beauty">Veg</option>
                <option value="Barber">NonVeg</option>
                <option value="Spa">Veg & NonVeg</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pan Number
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="pancardNumber"
                value={formData.pancardNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            name="salonDescription"
            value={formData.salonDescription}
            onChange={handleChange}
            rows={3}
          />
        </div>

        {/* Bank Details */}
        <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h5 className="text-lg font-medium text-gray-900">Bank Details</h5>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.bankDetails.accountHolderName || ""}
                  onChange={(e) =>
                    handleBankDetails("accountHolderName", e.target.value)
                  }
                  placeholder="Name on your account"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.bankDetails.AccountNumber || ""}
                  onChange={(e) =>
                    handleBankDetails("AccountNumber", e.target.value)
                  }
                  placeholder="Account Number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.bankDetails.ifscCode || ""}
                  onChange={(e) =>
                    handleBankDetails("ifscCode", e.target.value)
                  }
                  placeholder="IFSC Code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.bankDetails.bankName || ""}
                  onChange={(e) =>
                    handleBankDetails("bankName", e.target.value)
                  }
                  placeholder="Bank Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.bankDetails.branchName || ""}
                  onChange={(e) =>
                    handleBankDetails("branchName", e.target.value)
                  }
                  placeholder="Branch Name"
                />
              </div>
            </div>
          </div>
        </div>
         {/* Documents */}
         <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h5 className="text-lg font-medium text-gray-900">Fssai License</h5>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fssai License Number
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.bankDetails.accountHolderName || ""}
                  onChange={(e) =>
                    handleBankDetails("accountHolderName", e.target.value)
                  }
                  placeholder=" Fssai License Number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.bankDetails.AccountNumber || ""}
                  onChange={(e) =>
                    handleBankDetails("AccountNumber", e.target.value)
                  }
                  placeholder="Expiry Date"
                />
              </div>
              
            </div>
              <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h5 className="text-lg font-medium text-gray-900">
              Fassi License Pdf
            </h5>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <input
                type="file"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                ref={agreementInputRef}
                onChange={handleAgreementUpload}
                accept=".pdf,.doc,.docx"
              />
            </div>
            {agreementPreview && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <p className="text-sm text-blue-700">
                  New agreement file selected for upload
                </p>
              </div>
            )}
            {formData.salonAgreement && !agreementPreview && (
              <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mb-4">
                <p className="text-sm text-gray-700">
                  Existing agreement file is attached
                </p>
              </div>
            )}
          </div>
        </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h5 className="text-lg font-medium text-gray-900">Social Links</h5>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.socialLinks.facebook || ""}
                  onChange={(e) =>
                    handleSocialLinkChange("facebook", e.target.value)
                  }
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.socialLinks.instagram || ""}
                  onChange={(e) =>
                    handleSocialLinkChange("instagram", e.target.value)
                  }
                  placeholder="https://instagram.com/yourpage"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h5 className="text-lg font-medium text-gray-900">Opening Hours</h5>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(formData.openingHours).map(([day, hours]) => (
                <div key={day}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {day}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={hours}
                    onChange={(e) =>
                      handleOpeningHoursChange(day, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
            <h5 className="text-lg font-medium text-gray-900">Facilities</h5>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  placeholder="Add facility (e.g., WiFi, Parking)"
                />
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleAddFacility}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.facilities.map((facility, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {facility}
                  <button
                    type="button"
                    className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                    onClick={() => handleRemoveFacility(index)}
                    aria-label="Remove"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
            <h5 className="text-lg font-medium text-gray-900">Services</h5>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={addService}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Service
            </button>
          </div>
          <div className="p-4">
            {formData.services.map((service, index) => (
              <div
                key={index}
                className="border border-gray-200 p-4 mb-4 rounded-md"
              >
                <div className="flex justify-between items-center mb-3">
                  <h6 className="text-base font-medium text-gray-900">
                    Service #{index + 1}
                  </h6>
                  {formData.services.length > 1 && (
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={() => removeService(index)}
                    >
                      <X className="h-3.5 w-3.5 mr-1" /> Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      name="name"
                      value={service.name}
                      onChange={(e) => handleServiceChange(index, e)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rate (₹)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      name="rate"
                      value={service.rate}
                      onChange={(e) => handleServiceChange(index, e)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      name="duration"
                      value={service.duration}
                      onChange={(e) => handleServiceChange(index, e)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      name="gender"
                      value={service.gender}
                      onChange={(e) => handleServiceChange(index, e)}
                      required
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Salon Photos
        <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h5 className="text-lg font-medium text-gray-900">
              Salon Photos (Max 5)
            </h5>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <input
                type="file"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                ref={fileInputRef}
                onChange={handleImageUpload}
                multiple
                accept="image/*"
                disabled={formData.salonPhotos.length >= 5}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {formData.salonPhotos.map((photo, index) => (
                <div key={index} className="relative">
                  {photo instanceof File ? (
                    <img
                      src={URL.createObjectURL(photo) || "/placeholder.svg"}
                      alt={`Preview ${index}`}
                      className="h-40 w-full object-cover rounded-md"
                    />
                  ) : (
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Salon ${index}`}
                      className="h-40 w-full object-cover rounded-md"
                    />
                  )}
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Salon Agreement
        <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h5 className="text-lg font-medium text-gray-900">
              Salon Agreement
            </h5>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <input
                type="file"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                ref={agreementInputRef}
                onChange={handleAgreementUpload}
                accept=".pdf,.doc,.docx"
              />
            </div>
            {agreementPreview && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <p className="text-sm text-blue-700">
                  New agreement file selected for upload
                </p>
              </div>
            )}
            {formData.salonAgreement && !agreementPreview && (
              <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mb-4">
                <p className="text-sm text-gray-700">
                  Existing agreement file is attached
                </p>
              </div>
            )}
          </div>
        </div> */}

        <div>
          <button
            type="submit"
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUpdating}
          >
            {isUpdating ? "Adding..." : "Add Restaurant"}
          </button>
        </div>
      </form>

      {/* Location Modal */}
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full lg:max-w-4xl">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Set Location on Map
                    </h3>
                    <div className="mt-2">
                      {isLoaded ? (
                        <GoogleMap
                          mapContainerStyle={mapContainerStyle}
                          center={{ lat: latitude, lng: longitude }}
                          zoom={15}
                          onClick={handleMapClick}
                        >
                          <Marker
                            position={{ lat: latitude, lng: longitude }}
                            draggable={true}
                            onDragEnd={handleMapClick}
                          />
                        </GoogleMap>
                      ) : (
                        <div className="text-center py-8">Loading map...</div>
                      )}

                      <div className="mt-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Coordinates:</span>{" "}
                          {latitude.toFixed(6)}, {longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSaveLocation}
                >
                  Save Location
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
