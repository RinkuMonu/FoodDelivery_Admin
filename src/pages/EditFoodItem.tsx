import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../components/AxiosInstance";

const EditFoodItem = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [menuId, setMenuId] = useState(_id || "");
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    discountedPrice: 0,
    restaurant: "",
    category: "",
    veg: true,
    spicyLevel: "Medium",
    ingredients: [""],
    allergens: [""],
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    },
    preparationTime: 0,
    serveSize: "",
    customizations: [
      {
        name: "",
        options: [{ name: "", additionalPrice: 0 }],
        required: false,
        multiSelect: false
      }
    ],
    isAvailable: true,
    image: ""
  });

  useEffect(() => {
    if (_id) {
      const fetchData = async () => {
        try {
          const res = await axiosInstance.get(`/menus/${_id}`);
          setFormData(res.data);
        } catch (error) {
          console.error("Failed to fetch menu data:", error);
        }
      };
      fetchData();
    }
  }, [_id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = _id ? `/menus/${_id}` : `/menus`;
    const method = _id ? "put" : "post";

    try {
      const res = await axiosInstance[method](url, formData);
      const finalMenuId = _id || res.data._id;
      setMenuId(finalMenuId);

      if (imageFile) {
        await uploadImage(finalMenuId);
      }

      alert(_id ? "Menu updated!" : "Menu added!");
      navigate("/menu-list");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error occurred while saving menu.");
    }
  };

  const uploadImage = async (menuId) => {
    const formDataImg = new FormData();
    formDataImg.append("ccc", imageFile);

    try {
      await axiosInstance.post(`/menus/${menuId}/upload-image`, formDataImg, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Image uploaded");
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>{_id ? "Edit Menu" : "Add Menu"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Food Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label>Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <label>Discounted Price</label>
            <input
              type="number"
              className="form-control"
              name="discountedPrice"
              value={formData.discountedPrice || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label>Restaurant ID</label>
          <input
            type="text"
            className="form-control"
            name="restaurant"
            value={formData.restaurant || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Category ID</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Spicy Level</label>
          <select
            className="form-control"
            name="spicyLevel"
            value={formData.spicyLevel || "Medium"}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>Hot</option>
          </select>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="veg"
            checked={!!formData.veg}
            onChange={handleChange}
          />
          <label className="form-check-label">Veg</label>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="isAvailable"
            checked={!!formData.isAvailable}
            onChange={handleChange}
          />
          <label className="form-check-label">Is Available</label>
        </div>

        <div className="mb-3">
          <label>Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        {formData.image && (
          <div className="mb-3">
            <label>Current Image:</label>
            <div>
              <img
                src={`http://localhost:4080/${formData.image}`}
                alt="menu"
                style={{ width: "120px", borderRadius: "8px", marginTop: "10px" }}
              />
            </div>
          </div>
        )}

        <div className="mb-3">
          <label>Nutritional Info</label>
          <div className="row">
            {Object.keys(formData.nutritionalInfo).map((key) => (
              <div className="col" key={key}>
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder={key}
                  value={formData.nutritionalInfo[key] || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      nutritionalInfo: {
                        ...prev.nutritionalInfo,
                        [key]: e.target.value
                      }
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          {_id ? "Update Menu" : "Add Menu"}
        </button>
      </form>
    </div>
  );
};

export default EditFoodItem;
