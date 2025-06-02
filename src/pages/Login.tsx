import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Use your context
import axiosInstance from "../components/AxiosInstance";
import { ShoppingBag } from "lucide-react";

const Login = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { login, isAuthenticated } = useAuth(); // 👈 Context se le!
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/dashboard";
  console.log("frommm", from);
  console.log("isAuthenticated:", isAuthenticated);

  useEffect(() => {
    // Sirf tabhi redirect karo jab user already destination pe nahi hai
    if (isAuthenticated && location.pathname !== from) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from, location.pathname]);

  // Step 1: Send OTP
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      const res = await axiosInstance.post("/api/users/send-otp", {
        mobileNumber,
      });
      setSuccessMsg(res.data?.message || "OTP sent successfully");
      setStep(2);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP (use context's login)
  // Step 2: Verify OTP (use context's login)
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(mobileNumber, otp); // 👈 API call done

      // ✅ Get user from localStorage (set in login)
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");

      // ✅ Redirect based on role
      if (userData.role === "admin" || userData.role === "user") {
        navigate("/", { replace: true });
      } else {
        // Optional fallback
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- UI same as before, remove local isAuthenticated state and Navigate JSX ---
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex w-1/2 h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80"
          alt="Login Illustration"
          className="object-cover rounded-3xl shadow-2xl w-4/5 h-4/5"
        />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white py-16 px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 shadow-md mb-3">
              <ShoppingBag className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Sign in with OTP
            </h2>
            <p className="text-sm text-gray-500">
              Secure admin dashboard access
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4 shadow">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 rounded-md bg-green-50 p-4 shadow">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      {successMsg}
                    </h3>
                  </div>
                </div>
              </div>
            )}
            {step === 1 ? (
              <form className="space-y-6" onSubmit={handleSendOtp}>
                <div>
                  <label
                    htmlFor="mobileNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mobile Number
                  </label>
                  <div className="mt-1">
                    <input
                      id="mobileNumber"
                      name="mobileNumber"
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 text-lg"
                      placeholder="Enter your mobile number"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 shadow-lg transition duration-150 flex justify-center"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>
            ) : (
              <form className="space-y-6" onSubmit={handleVerifyOtp}>
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Enter OTP
                  </label>
                  <div className="mt-1">
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 text-lg tracking-widest"
                      placeholder="123456"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 shadow-lg transition duration-150 flex justify-center"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
                <button
                  type="button"
                  className="mt-4 w-full text-sm text-indigo-500 hover:underline"
                  onClick={() => setStep(1)}
                >
                  Change mobile number
                </button>
              </form>
            )}
          </div>
          <div className="text-center text-xs text-gray-400 pt-6">
            © {new Date().getFullYear()} Unique Admin Panel. All rights
            reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
