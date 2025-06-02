import React, { useEffect, useState } from "react";
import axiosInstance from "../components/AxiosInstance"; // Ensure this is correctly configured
import dayjs from "dayjs";

// ----------- Types -----------
interface User {
  _id: string;
  mobileNumber: string;
  role: string;
  addresses: any[];
  profilePicture: string;
  favorites: any[];
  isActive: boolean;
  isVerified: boolean;
  wallet: number;
  walletLastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

// SVG Icons from Heroicons for visual enhancement
const MobileIcon = () => (
  <svg
    className="w-5 h-5 mr-2 text-blue-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <rect x="7" y="2" width="10" height="20" rx="2" ry="2" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

const RoleIcon = () => (
  <svg
    className="w-5 h-5 mr-2 text-indigo-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
    <path d="M6 18v-1a4 4 0 014-4h4a4 4 0 014 4v1" />
  </svg>
);

const WalletIcon = () => (
  <svg
    className="w-5 h-5 mr-2 text-green-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M17 9V7a4 4 0 00-8 0v2" />
    <rect x="3" y="9" width="18" height="12" rx="2" ry="2" />
  </svg>
);

const StatusIcon = ({ active }: { active: boolean }) => (
  active ? (
    <svg
      className="w-5 h-5 text-green-500 mr-2"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg
      className="w-5 h-5 text-red-500 mr-2"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
);

const VerifiedIcon = ({ verified }: { verified: boolean }) => (
  verified ? (
    <svg
      className="w-5 h-5 text-green-500 mr-2"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 0L10.59 6.83L4 7.64L8.55 12.15L7.32 19L12 15.92L16.68 19L15.45 12.15L20 7.64L13.41 6.83L12 0Z" />
    </svg>
  ) : (
    <svg
      className="w-5 h-5 text-red-500 mr-2"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
);

// ----------- Component -----------
const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axiosInstance
      .get<{ success: boolean; user: User }>("api/users/profile")
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
        }
      })
      .catch((error) => {
        console.error("Failed to load user data", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600">
        <div className="text-lg text-white font-semibold animate-pulse">
          Loading Profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center mt-10 text-red-600 font-semibold text-xl">
          Unable to load profile.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Profile Picture Section */}
          <div className="md:w-1/3 bg-gradient-to-tr from-indigo-700 via-purple-700 to-pink-700 flex flex-col items-center justify-center p-8">
            <div className="relative group">
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-40 h-40 rounded-full border-8 border-white shadow-xl object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute bottom-0 right-0 bg-green-500 border-4 border-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                {/* Online status dot */}
                <span className="block w-4 h-4 rounded-full bg-green-300 animate-pulse"></span>
              </div>
            </div>
            <h2 className="mt-6 text-white text-3xl font-extrabold tracking-tight">
              Admin Profile
            </h2>
            <p className="mt-2 text-indigo-200 font-medium">{user.mobileNumber}</p>
          </div>

          {/* Details Section */}
          <div className="md:w-2/3 p-10 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Role */}
              <div className="flex items-center text-gray-800 bg-indigo-50 rounded-xl p-4 shadow hover:shadow-lg transition-shadow cursor-default">
                <RoleIcon />
                <div>
                  <p className="text-sm font-semibold">Role</p>
                  <p className="text-lg font-bold">{user.role}</p>
                </div>
              </div>
              {/* Wallet */}
              <div className="flex items-center text-gray-800 bg-green-50 rounded-xl p-4 shadow hover:shadow-lg transition-shadow cursor-default">
                <WalletIcon />
                <div>
                  <p className="text-sm font-semibold">Wallet Balance</p>
                  <p className="text-lg font-bold">₹{user.wallet.toLocaleString()}</p>
                </div>
              </div>
              {/* Status */}
              <div className="flex items-center text-gray-800 bg-indigo-50 rounded-xl p-4 shadow hover:shadow-lg transition-shadow cursor-default">
                <StatusIcon active={user.isActive} />
                <div>
                  <p className="text-sm font-semibold">Status</p>
                  <p className={`text-lg font-bold ${user.isActive ? "text-green-600" : "text-red-600"}`}>
                    {user.isActive ? "Active ✅" : "Inactive ❌"}
                  </p>
                </div>
              </div>
              {/* Verified */}
              <div className="flex items-center text-gray-800 bg-indigo-50 rounded-xl p-4 shadow hover:shadow-lg transition-shadow cursor-default">
                <VerifiedIcon verified={user.isVerified} />
                <div>
                  <p className="text-sm font-semibold">Verified</p>
                  <p className={`text-lg font-bold ${user.isVerified ? "text-green-600" : "text-red-600"}`}>
                    {user.isVerified ? "Yes ✅" : "No ❌"}
                  </p>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="mt-6 border-t border-gray-300 pt-6 text-gray-600">
              <p>
                <span className="font-semibold">Created At:</span>{" "}
                {dayjs(user.createdAt).format("DD MMM YYYY, hh:mm A")}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Last Updated:</span>{" "}
                {dayjs(user.updatedAt).format("DD MMM YYYY, hh:mm A")}
              </p>
            </div>

            {/* Mobile number with icon, repeated for quick accessibility */}
            <div className="mt-6 flex items-center text-gray-800 bg-indigo-50 rounded-xl p-4 shadow hover:shadow-lg transition-shadow cursor-default max-w-sm">
              <MobileIcon />
              <div>
                <p className="text-sm font-semibold">Mobile Number</p>
                <p className="text-lg font-bold">{user.mobileNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

