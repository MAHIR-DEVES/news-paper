'use client';

import { getUserInfo } from '@/app/lib/getUserInfo';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const CompanyInfoPage = () => {
  const [user, setUser] = useState(null);
  const [companyData, setCompanyData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    industry: '',
    description: '',
    logo: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserInfo();
        setUser(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = e => {
    const file = e.target.files[0];
    if (file) {
      setCompanyData(prev => ({
        ...prev,
        logo: file,
      }));

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      toast.success('Company info saved successfully!');
      setCompanyData({
        name: '',
        email: '',
        phone: '',
        address: '',
        description: '',
        logo: '',
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to save company info');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your company information and settings
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* User Info Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img
                    src={`${process.env.NEXT_PUBLIC_ROOT_URL}${
                      user?.image || '/default-avatar.png'
                    }`}
                    alt="User"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                  />
                  <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#F63C25] border-2 border-white"></div>
                </div>

                <h2 className="text-xl font-bold text-gray-800">
                  {user?.name}
                </h2>
                <p className="text-gray-600 mt-1">{user?.email}</p>

                <span className="mt-3 px-4 py-1 bg-[#FFF2F0] text-[#F63C25] text-sm font-medium rounded-full inline-flex items-center">
                  <span className="w-2 h-2 bg-[#F63C25] rounded-full mr-2"></span>
                  {user?.role}
                </span>

                <div className="w-full mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Last Updated
                  </h3>
                  <p className="text-gray-600 text-sm">
                    October 15, 2023 at 2:30 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Info Form */}
          <div className="lg:w-2/3">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Company Information
                </h2>
                <p className="text-gray-600">
                  Update your company details and contact information
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={companyData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F63C25] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={companyData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F63C25] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={companyData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F63C25] focus:border-transparent transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={companyData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F63C25] focus:border-transparent transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Company Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={companyData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F63C25] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Company Logo
                </h3>
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-2xl font-bold">
                          Logo
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <span className="px-4 py-2 bg-[#F63C25] text-white rounded-lg font-medium text-sm hover:bg-[#E0351E] transition-colors">
                        Upload New Logo
                      </span>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-gray-500 text-sm mt-2">
                      Recommended: 300x300px, PNG or JPG
                    </p>
                  </div>
                </div>
              </div> */}

              <div className="flex justify-end pt-6 border-t border-gray-100">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium mr-4 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-[#F63C25] text-white rounded-lg font-medium hover:bg-[#E0351E] disabled:opacity-70 transition-colors flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoPage;
