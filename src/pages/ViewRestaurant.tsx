import React, { useEffect, useState } from "react";

import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { MdDiscount, MdDeliveryDining, MdTableBar } from "react-icons/md";
import { IoFastFoodSharp } from "react-icons/io5";
import axiosInstance from "../components/AxiosInstance";
import { useParams } from "react-router-dom";

// ------- Types --------
interface RestaurantApiResponse {
  success: boolean;
  data: Restaurant;
}

interface Restaurant {
  address: Address;
  contact: Contact;
  serviceOptions: ServiceOptions;
  _id: string;
  name: string;
  description: string;
  owner: Owner;
  location: {
    type: string;
    coordinates: [number, number];
    _id: string;
  };
  cuisine: Cuisine[];
  menu: MenuItem[];
  images: string[];
  image: string;
  distance: string;
  deliveryTime: string;
  rating: number;
  discount: string;
  offers: Offer[];
  ratings: {
    average: number;
    count: number;
  };
  timings: Timing[];
  priceRange: string;
  deliveryRadius: number;
  minOrderAmount: number;
  avgDeliveryTime: number;
  deliveryFee: number;
  packagingCharges: number;
  tags: string[];
  isActive: boolean;
  isVerified: boolean;
  isPromoted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  reviews: any[];
  id: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Contact {
  phone: string;
  alternatePhone: string;
  email: string;
}

interface ServiceOptions {
  dineIn: boolean;
  takeaway: boolean;
  delivery: boolean;
}

interface Owner {
  _id: string;
  profilePicture: string;
}

interface Cuisine {
  _id: string;
  name: string;
}

interface Offer {
  id: number;
  text: string;
  highlight: boolean;
  icon: string;
  _id: string;
}

interface Timing {
  day: string;
  opening: string;
  closing: string;
  closed: boolean;
  _id: string;
}

interface MenuItem {
  nutritionalInfo: NutritionalInfo;
  ratings: {
    average: number;
    count: number;
  };
  _id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  restaurant: string;
  category?: string | null;
  veg: boolean;
  spicyLevel?: string;
  ingredients: string[];
  allergens: string[];
  preparationTime: number;
  isAvailable: boolean;
  isPopular: boolean;
  isRecommended: boolean;
  serveSize: string;
  customizations: Customization[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface Customization {
  name: string;
  options: CustomizationOption[];
  required: boolean;
  multiSelect: boolean;
  _id: string;
}

interface CustomizationOption {
  name: string;
  additionalPrice: number;
  _id: string;
  id: string;
}

// ------- Component --------

const ViewRestaurant: React.FC = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

    const { id } = useParams();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axiosInstance.get<RestaurantApiResponse>(
          `api/restaurants/${id}`
        );
        setRestaurant(res?.data?.data);
        console.log("res.....rrr", res);
      } catch (error) {
        setError("Failed to load restaurant data");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);



  if (loading)
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  if (!restaurant) return null;

  return (
    <div className="max-w-5xl mx-auto my-8 p-6 bg-white rounded-2xl shadow-xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">{restaurant?.name}</h2>
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <FaMapMarkerAlt />
            {restaurant.address.street}, {restaurant?.address?.city},{" "}
            {restaurant.address.state} - {restaurant?.address?.zipCode}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="bg-green-100 px-3 py-1 rounded-full text-green-700">
              {restaurant.serviceOptions.dineIn && (
                <MdTableBar className="inline mr-1" />
              )}
              {restaurant.serviceOptions.dineIn ? "Dine-In" : ""}
            </span>
            <span className="bg-yellow-100 px-3 py-1 rounded-full text-yellow-700">
              {restaurant.serviceOptions.takeaway && (
                <IoFastFoodSharp className="inline mr-1" />
              )}
              {restaurant.serviceOptions.takeaway ? "Takeaway" : ""}
            </span>
            <span className="bg-blue-100 px-3 py-1 rounded-full text-blue-700">
              {restaurant.serviceOptions.delivery && (
                <MdDeliveryDining className="inline mr-1" />
              )}
              {restaurant.serviceOptions.delivery ? "Delivery" : ""}
            </span>
          </div>
          <div className="flex items-center gap-4 text-gray-600 mt-2">
            <span>
              <FaPhoneAlt className="inline mr-1" />
              {restaurant.contact.phone}
            </span>
            <span>
              <FaPhoneAlt className="inline mr-1" />
              {restaurant.contact.alternatePhone}
            </span>
            <span>
              <FaEnvelope className="inline mr-1" />
              {restaurant.contact.email}
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
          <span className="text-2xl font-semibold text-orange-500">
            {restaurant.rating} ★
          </span>
          <span className="bg-orange-100 px-3 py-1 rounded-full text-orange-700">
            {restaurant.discount}
          </span>
          <span className="bg-gray-200 px-3 py-1 rounded-full text-gray-600">
            {restaurant.priceRange} Price Range
          </span>
        </div>
      </div>

      {/* Offers */}
      {restaurant.offers && restaurant.offers.length > 0 && (
        <div className="flex gap-4">
          {restaurant.offers.map((offer) => (
            <div
              key={offer._id}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl shadow-sm ${
                offer.highlight
                  ? "bg-green-100 text-green-700 font-semibold"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <MdDiscount className="text-lg" />
              <span>{offer.icon}</span>
              <span>{offer.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Cuisine & Tags */}
      <div className="flex gap-3 flex-wrap">
        {restaurant.cuisine.map((c) => (
          <span
            key={c._id}
            className="bg-blue-50 px-2 py-1 rounded-xl text-blue-700 text-xs"
          >
            {c.name}
          </span>
        ))}
        {restaurant.tags.map((tag, i) => (
          <span
            key={i}
            className="bg-gray-100 px-2 py-1 rounded-xl text-gray-700 text-xs"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Menu */}
      <div>
        <h3 className="text-xl font-bold mb-3">Menu</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {restaurant.menu.map((item) => (
            <div
              key={item._id}
              className="border rounded-xl p-4 flex flex-col bg-gray-50 shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-semibold">{item.name}</h4>
                {item.veg ? (
                  <span className="text-green-600 border border-green-600 px-2 py-0.5 rounded text-xs ml-2">
                    Veg
                  </span>
                ) : (
                  <span className="text-red-600 border border-red-600 px-2 py-0.5 rounded text-xs ml-2">
                    Non-Veg
                  </span>
                )}
                {item.spicyLevel && (
                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs">
                    {item.spicyLevel}
                  </span>
                )}
              </div>
              <div className="text-gray-600">{item.description}</div>
              <div className="flex gap-3 mt-2">
                <span className="text-lg font-bold text-green-700">
                  ₹{item.discountedPrice ?? item.price}
                </span>
                {item.discountedPrice && (
                  <span className="line-through text-gray-500">
                    ₹{item.price}
                  </span>
                )}
                <span className="ml-auto text-xs text-gray-500">
                  Prep: {item.preparationTime} min
                </span>
              </div>
              {item.nutritionalInfo && (
                <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                  <span>Calories: {item.nutritionalInfo.calories}</span>
                  <span>Protein: {item.nutritionalInfo.protein}g</span>
                  <span>Carbs: {item.nutritionalInfo.carbs}g</span>
                  <span>Fat: {item.nutritionalInfo.fat}g</span>
                  <span>Fiber: {item.nutritionalInfo.fiber}g</span>
                </div>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {item.ingredients &&
                  item.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="bg-yellow-50 px-2 py-0.5 rounded text-yellow-700 text-xs"
                    >
                      {ing}
                    </span>
                  ))}
                {item.allergens &&
                  item.allergens.map((all, idx) => (
                    <span
                      key={idx}
                      className="bg-red-50 px-2 py-0.5 rounded text-red-700 text-xs"
                    >
                      {all}
                    </span>
                  ))}
              </div>
              {/* Customizations */}
              {item.customizations && item.customizations.length > 0 && (
                <div className="mt-2">
                  <div className="font-medium text-gray-800 mb-1">
                    Customizations:
                  </div>
                  {item.customizations.map((cust) => (
                    <div key={cust._id} className="ml-2 mb-1">
                      <div className="text-sm">{cust.name}</div>
                      <div className="flex gap-2 flex-wrap">
                        {cust.options.map((opt) => (
                          <span
                            key={opt.id}
                            className="bg-blue-50 px-2 py-0.5 rounded text-blue-600 text-xs"
                          >
                            {opt.name} (+₹{opt.additionalPrice})
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Timings */}
      <div>
        <h3 className="text-xl font-bold mb-2">Timings</h3>
        <div className="flex gap-4 flex-wrap">
          {restaurant.timings.map((t) => (
            <div key={t._id} className="bg-gray-100 px-4 py-2 rounded-lg">
              <span className="font-semibold">{t.day}: </span>
              <span>{t.closed ? "Closed" : `${t.opening} - ${t.closing}`}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery info */}
      <div className="flex gap-4 flex-wrap text-sm text-gray-600">
        <div>
          Distance: <span className="font-semibold">{restaurant.distance}</span>
        </div>
        <div>
          Delivery Time:{" "}
          <span className="font-semibold">{restaurant.deliveryTime}</span>
        </div>
        <div>
          Avg Delivery:{" "}
          <span className="font-semibold">
            {restaurant.avgDeliveryTime} min
          </span>
        </div>
        <div>
          Fee: <span className="font-semibold">₹{restaurant.deliveryFee}</span>
        </div>
        <div>
          Min Order:{" "}
          <span className="font-semibold">₹{restaurant.minOrderAmount}</span>
        </div>
        <div>
          Radius:{" "}
          <span className="font-semibold">{restaurant.deliveryRadius} km</span>
        </div>
        <div>
          Packaging:{" "}
          <span className="font-semibold">₹{restaurant.packagingCharges}</span>
        </div>
      </div>
    </div>
  );
};

export default ViewRestaurant;
