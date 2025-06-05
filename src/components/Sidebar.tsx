import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  Package,
  Settings,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface NavItem {
  name: string;
  to: string;
  icon: React.ReactNode;
  roles?: string[];
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const { user } = useAuth();
 

  console.log("userrrrrr", user);

  const location = useLocation();

  const navigation: NavItem[] = [
    {
      name: "Dashboard",
      to: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      roles: ["admin", "restaurant"],
    },
    {
      name: "Food Item",
      to: "/fooditem",
      icon: <ShoppingBag size={20} />,
      roles: ["restaurant"],
    },
    {
      name: "Orders",
      to: "/orders",
      icon: <ShoppingCart size={20} />,
      roles: ["admin", "restaurant"],
    },
    {
      name: "Restaurant",
      to: "/restaurant",
      icon: <ShoppingCart size={20} />,
      roles: ["admin"],
    },
    {
      name: "Customers",
      to: "/customers",
      icon: <Users size={20} />,
      roles: ["admin", "restaurant"],
    },
    // {
    //   name: "Inventory",
    //   to: "/inventory",
    //   icon: <Package size={20} />,
    //   roles: ["admin"],
    // },
    // {
    //   name: "Settings",
    //   to: "/settings",
    //   icon: <Settings size={20} />,
    //   roles: ["admin", "restaurant"],
    // },
    {
      name: "Menu",
      to: "/menu",
      icon: <LayoutDashboard size={20} />,
      roles: ["restaurant"],
    },
    {
      name: "Delivery Staff",
      to: "/delivery",
      icon: <ShoppingBag size={20} />,
      roles: ["restaurant"],
    },
    {
      name: "Promotions",
      to: "/promotions",
      icon: <ShoppingCart size={20} />,
      roles: ["admin"],
    },
    {
      name: "Reports",
      to: "/reports",
      icon: <Users size={20} />,
      roles: ["admin","restaurant"],
    },
  ];

  const filteredNavigation = navigation.filter(
    (item) => !item.roles || item.roles.includes(user?.role )
  );
console.log("User role in Sidebar:", user?.role);
  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary-600">
                Food Delivery
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              {filteredNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {user && (
            <div className="p-4 border-t">
              <div className="flex items-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                    {/* {user.name.charAt(0)} */}
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.name}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
              <span className="text-xl font-bold text-primary-600">
                Food Delivery
              </span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {filteredNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? "bg-primary-50 text-primary-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
            {user && (
              <div className="flex-shrink-0 border-t border-gray-200 p-4">
                <div className="flex items-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                      {user.name}
                    </div>
                  )}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
