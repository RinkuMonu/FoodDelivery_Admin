import { useState } from 'react';
import { Save, Upload, CreditCard, Globe, Store, Bell, Lock, User, Mail } from 'lucide-react';

const Settings = () => {
  // State for company info form
  const [companyName, setCompanyName] = useState('Your Company');
  const [companyEmail, setCompanyEmail] = useState('info@yourcompany.com');
  const [companyPhone, setCompanyPhone] = useState('+1 (555) 123-4567');
  const [companyAddress, setCompanyAddress] = useState('123 Commerce St, City, Country');
  const [companyWebsite, setCompanyWebsite] = useState('www.yourcompany.com');
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);

  // State for notification settings
  const [emailNotifications, setEmailNotifications] = useState({
    orders: true,
    customers: true,
    products: false,
    inventory: true,
    payments: true,
    security: true
  });

  // State for account settings
  const [accountName, setAccountName] = useState('Admin User');
  const [accountEmail, setAccountEmail] = useState('admin@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle logo upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCompanyLogo(e.target.files[0]);
    }
  };

  // Handle company info form submission
  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save company info logic would go here
    alert('Company information saved successfully!');
  };

  // Handle notification settings submission
  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save notification settings logic would go here
    alert('Notification settings saved successfully!');
  };

  // Handle password change submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // Update password logic would go here
    alert('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account and store settings
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Store className="h-5 w-5 text-gray-400 mr-3" />
            <h3 className="text-lg font-medium leading-6 text-gray-900">Company Information</h3>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Update your store details and branding</p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleCompanySubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="company-logo" className="block text-sm font-medium text-gray-700">
                  Company Logo
                </label>
                <div className="mt-1 flex items-center">
                  <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    {companyLogo ? (
                      <img 
                        src={URL.createObjectURL(companyLogo)} 
                        alt="Company logo" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Store className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-5">
                    <label
                      htmlFor="logo-upload"
                      className="btn btn-secondary cursor-pointer flex items-center"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      <span>Change</span>
                      <input
                        id="logo-upload"
                        name="logo-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="company-name"
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <div className="mt-1">
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      https://
                    </span>
                    <input
                      type="text"
                      name="company-website"
                      id="company-website"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="company-email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="company-email"
                    id="company-email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="company-phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="company-phone"
                    id="company-phone"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="company-address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="company-address"
                    id="company-address"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Save Company Information
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Payment Methods */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
              <h3 className="text-lg font-medium leading-6 text-gray-900">Payment Methods</h3>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Configure your accepted payment methods</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="payment-credit-card"
                    name="payment-credit-card"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="payment-credit-card" className="font-medium text-gray-700">Credit Card</label>
                  <p className="text-gray-500">Accept Visa, MasterCard, and American Express</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="payment-paypal"
                    name="payment-paypal"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="payment-paypal" className="font-medium text-gray-700">PayPal</label>
                  <p className="text-gray-500">Allow customers to pay with PayPal</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="payment-bank-transfer"
                    name="payment-bank-transfer"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="payment-bank-transfer" className="font-medium text-gray-700">Bank Transfer</label>
                  <p className="text-gray-500">Allow direct bank transfers</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button type="button" className="btn btn-primary flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Save Payment Settings
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-gray-400 mr-3" />
              <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Settings</h3>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Configure when and how you receive notifications</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleNotificationSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="notify-orders"
                      name="notify-orders"
                      type="checkbox"
                      checked={emailNotifications.orders}
                      onChange={() => setEmailNotifications({...emailNotifications, orders: !emailNotifications.orders})}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="notify-orders" className="font-medium text-gray-700">New Orders</label>
                    <p className="text-gray-500">Get notified when a new order is placed</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="notify-customers"
                      name="notify-customers"
                      type="checkbox"
                      checked={emailNotifications.customers}
                      onChange={() => setEmailNotifications({...emailNotifications, customers: !emailNotifications.customers})}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="notify-customers" className="font-medium text-gray-700">New Customers</label>
                    <p className="text-gray-500">Get notified when a new customer registers</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="notify-inventory"
                      name="notify-inventory"
                      type="checkbox"
                      checked={emailNotifications.inventory}
                      onChange={() => setEmailNotifications({...emailNotifications, inventory: !emailNotifications.inventory})}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="notify-inventory" className="font-medium text-gray-700">Low Inventory</label>
                    <p className="text-gray-500">Get notified when products are running low</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button type="submit" className="btn btn-primary flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-400 mr-3" />
            <h3 className="text-lg font-medium leading-6 text-gray-900">Account Settings</h3>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Update your personal information and password</p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="md:grid md:grid-cols-2 md:gap-6">
            <div>
              <h4 className="text-base font-medium text-gray-900">Your Information</h4>
              <p className="mt-1 text-sm text-gray-500">Update your account details</p>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="account-name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="account-name"
                      id="account-name"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="input"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="account-email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="account-email"
                      id="account-email"
                      value={accountEmail}
                      onChange={(e) => setAccountEmail(e.target.value)}
                      className="input"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button type="button" className="btn btn-primary flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Update Account
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-0">
              <h4 className="text-base font-medium text-gray-900">Change Password</h4>
              <p className="mt-1 text-sm text-gray-500">Update your password to secure your account</p>
              <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="current-password"
                      id="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="new-password"
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="confirm-password"
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button type="submit" className="btn btn-primary flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;