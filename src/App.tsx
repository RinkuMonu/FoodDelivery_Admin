import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";

import ProductDetail from "./pages/ProductDetail";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Restaurant from "./pages/Restaurant";
import AddRestaurant from "./pages/AddRestaurant";
import ViewRestaurant from "./pages/ViewRestaurant";
import FoodItem from "./pages/FoodItem";
import Menu from "./pages/Menu";
import DeliveryStaff from "./pages/DeliveryStaff";
import ProfilePage from "./pages/Profile";
import Reports from "./pages/Reports";
import EditRestaurant from "./pages/EditRestaurant";
import ViewFoodItem from "./pages/ViewFoodItem";
import AddFoodItem from "./pages/AddFoodItem";
import EditFoodItem from "./pages/EditFoodItem";
import AddRestauran from "./pages/AddRestauran";
import AssignOrder from "./pages/AssignOrders";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* <Route
            path="/fooditem"
            element={
              <ProtectedRoute allowedRoles={["restaurant"]}>
                <Products />
              </ProtectedRoute>
            }
          /> */}

          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="settings" element={<Settings />} />
          <Route path="restaurant" element={<Restaurant />} />
          <Route path="addrestaurant" element={<AddRestauran />} />
          <Route path="viewreataurant/:id" element={<ViewRestaurant />} />
          <Route path="fooditem" element={<FoodItem />} />
          <Route path="delivery" element={<DeliveryStaff />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="menu" element={<Menu />} />
          <Route path="reports" element={<Reports />} />
          <Route path="edit" element={<EditRestaurant />} />
          <Route path="viewfooditem/:id" element={<ViewFoodItem />} />
          <Route path="addfooditem" element={<AddFoodItem />} />
          <Route path="editfooditem" element={<EditFoodItem />} />
          <Route path="editfooditem/:id" element={<EditFoodItem />} />
          <Route path="assignorder/:id" element={<AssignOrder />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
