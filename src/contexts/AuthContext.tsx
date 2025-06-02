import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import axiosInstance from '../components/AxiosInstance';

interface User {
  id: string;
  name?: string;
  mobileNumber: string;
  role?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (mobileNumber: string, otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const storedToken = localStorage.getItem('accessToken');
  const storedUser = localStorage.getItem('userData');

  if (storedToken) {
    setToken(storedToken);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
  }

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  setIsLoading(false);
}, []);


  // OTP-based login
  const login = async (mobileNumber: string, otp: string) => {
    setIsLoading(true);
    try {
      // API call: verify OTP
      const res = await axiosInstance.post('/api/users/verify-otp', {mobileNumber : mobileNumber.trim(), otp});
      console.log("Verify OTP Response:", res);
      
      const userData: User = {
        id: res.data?.data?._id ,
        name: res.data?.data?.name,
        mobileNumber,
        role: res.data?.data?.role ,
       
      };
      const accessToken = res.data?.data?.token;
      setUser(userData);
      setToken(accessToken);
      localStorage.setItem('accessToken', accessToken);
      // sessionStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userData', JSON.stringify(userData));

      // Set token for all next axios requests
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    
    localStorage.removeItem('accessToken');
    // Remove token from axios
    delete axiosInstance.defaults.headers.common['Authorization'];
  };
  console.log("user...........",user)
useEffect(() => {
  console.log("🟢 useEffect - token/user from storage");
  console.log("Token:", token);
  console.log("User:", user);
}, [token, user]);

useEffect(() => {
  console.log("🔄 AuthContext isAuthenticated:", !!user && !!token);
}, [user, token]);
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!token,
        isLoading,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
    
  );
};
