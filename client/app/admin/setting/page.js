'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [pixelCode, setPixelCode] = useState('');
  const [savedPixel, setSavedPixel] = useState(''); // এখানে ডাটাবেস থেকে আসবে

  // 1️⃣ GET API call on mount
  useEffect(() => {
    const fetchPixel = async () => {
      try {
        const res = await fetch('http://localhost:5000/pixels/latest'); // তোমার GET API
        if (!res.ok) throw new Error('Failed to fetch pixel');
        const data = await res.json();
        setSavedPixel(data.code || ''); // ডাটাবেসে থাকা কোড
      } catch (err) {
        console.error(err);
      }
    };

    fetchPixel();
  }, []);

  // 2️⃣ Pixel code সাবমিট করা
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/pixels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: pixelCode }),
      });

      if (res.ok) {
        setPixelCode('');
        toast.success('Pixel saved successfully!');
        // সেভ হওয়ার পর GET API আবার কল করে নতুন কোড দেখাবে
        const updated = await res.json();
        setSavedPixel(pixelCode); // অথবা GET API কল করতে পারো আবার
      } else {
        toast.error('Failed to save pixel.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        {/* Pixel Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#FFF2F0] flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#F63C25]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Meta Pixel Settings
            </h3>
          </div>

          {/* If pixel already saved */}
          {savedPixel ? (
            <div className="mb-8 p-5 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-gray-700">Active Pixel:</h4>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center">
                  Active
                </span>
              </div>
              <div className="p-4 bg-gray-100 rounded-md overflow-x-auto">
                <code className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {savedPixel}
                </code>
              </div>
            </div>
          ) : (
            <div className="mb-8 p-5 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-700 text-sm">No pixel set yet.</p>
            </div>
          )}

          {/* Pixel Form */}
          <form onSubmit={handleSubmit}>
            <label className="block mb-3 font-medium text-gray-700">
              Add / Update Meta Pixel Code:
            </label>
            <textarea
              value={pixelCode}
              onChange={e => setPixelCode(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-4 h-32 focus:ring-2 focus:ring-[#F63C25] focus:border-transparent transition-all"
              placeholder="Paste your pixel code here: <script>...</script>"
            />
            <button
              type="submit"
              className="mt-4 bg-[#F63C25] hover:bg-[#E0351E] text-white px-6 py-3 rounded-lg shadow-sm font-medium transition-colors"
            >
              Save Pixel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
