import { useNavigate } from 'react-router-dom';
import { Plane, Globe, Shield, Clock } from 'lucide-react';
import { SearchForm } from '../components/search/SearchForm';

export function Home() {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-24">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 sm:w-7 sm:h-7 text-primary-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">SkySearch</h1>
          </div>

          {/* Tagline */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
              Find Your Perfect Flight
            </h2>
            <p className="text-base sm:text-xl text-primary-100 max-w-2xl mx-auto px-4">
              Search hundreds of airlines and compare prices to find the best deals
              for your next adventure.
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto overflow-hidden">
            <SearchForm onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
            Why travelers choose us
          </h3>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Global Coverage
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                Search flights from hundreds of airlines worldwide. From budget
                carriers to premium options.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Best Price Guarantee
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                Compare prices across multiple airlines to ensure you get the best
                deal available.
              </p>
            </div>

            <div className="text-center sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Real-Time Results
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                Get instant search results with live prices and availability
                updates as you filter.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
            <span className="font-semibold text-white text-sm sm:text-base">SkySearch</span>
          </div>
          <p className="text-xs sm:text-sm">
            Powered by Amadeus API. Flight data is for demonstration purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
