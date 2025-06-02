import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-9xl font-bold text-primary-500">404</h1>
        <h2 className="mt-6 text-3xl font-bold text-gray-900">Page not found</h2>
        <p className="mt-2 text-sm text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-8">
          <Link 
            to="/dashboard" 
            className="btn btn-primary inline-flex items-center"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;