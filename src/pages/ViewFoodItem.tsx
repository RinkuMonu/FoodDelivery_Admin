import { useEffect, useState } from "react";
import axios from "axios";

const ViewFoodItem = () => {
  const [menu, setMenu] = useState<any>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get("http://192.168.32.18:4080/api/menus/68232e6882d90d2543dcf2fe");
        setMenu(res.data.data);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      }
    };

    fetchMenu();
  }, []);

  if (!menu) return <div className="text-center mt-10">Loading menu...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 transition-transform transform hover:scale-105">
      <h2 className="text-4xl font-bold mb-2 text-gray-800">{menu.name}</h2>
      <p className="text-gray-600 mb-4">{menu.description}</p>

      <img
        src={`http://192.168.32.18:4080/${menu.image.replace(/\\/g, "/")}`}
        alt={menu.name}
        className="w-full h-64 object-cover rounded-lg shadow-md mb-4 transition-transform transform hover:scale-105"
      />

      <div className="flex justify-between items-center mb-4">
        <span className="text-3xl font-semibold text-green-700">
          ₹{menu.discountedPrice} <del className="text-gray-500 text-sm">₹{menu.price}</del>
        </span>
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-white ${menu.veg ? 'bg-green-500' : 'bg-red-500'}`}>
            {menu.veg ? "Veg" : "Non-Veg"}
          </span>
          <span className="ml-2 px-3 py-1 bg-red-100 text-red-600 rounded-full">{menu.spicyLevel}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700 mb-4">
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p><strong>Serve Size:</strong> {menu.serveSize}</p>
          <p><strong>Preparation Time:</strong> {menu.preparationTime} mins</p>
          <p><strong>Available:</strong> {menu.isAvailable ? "Yes" : "No"}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <p><strong>Restaurant:</strong> {menu.restaurant.name}</p>
          <p><strong>City:</strong> {menu.restaurant.address.city}</p>
          <p><strong>Phone:</strong> {menu.restaurant.contact.phone}</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-1 text-lg">Nutritional Info:</h4>
        <ul className="list-disc pl-5 text-sm">
          {Object.entries(menu.nutritionalInfo).map(([key, val]) => (
            <li key={key}>{key}: {val}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-1 text-lg">Ingredients:</h4>
        <ul className="list-disc pl-5 text-sm">
          {menu.ingredients.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-1 text-lg">Allergens:</h4>
        <ul className="list-disc pl-5 text-sm">
          {menu.allergens.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-1 text-lg">Customizations:</h4>
        {menu.customizations.map((custom: any) => (
          <div key={custom._id} className="mb-2">
            <p className="font-medium">{custom.name}</p>
            <ul className="list-disc pl-5 text-sm">
              {custom.options.map((opt: any) => (
                <li key={opt._id}>
                  {opt.name} (+₹{opt.additionalPrice})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t pt-4 text-sm">
        <p><strong>Ratings:</strong> {menu.ratings.average}⭐ ({menu.ratings.count} reviews)</p>
        <p className="text-gray-500">Updated: {new Date(menu.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ViewFoodItem;
