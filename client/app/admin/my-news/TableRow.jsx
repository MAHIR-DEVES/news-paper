'use client';
import Image from 'next/image';
import Swal from 'sweetalert2';
import axios from 'axios';
import Link from 'next/link';
import { GrFormView } from 'react-icons/gr';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useState } from 'react';

const TableRow = ({ news, refetch, onView }) => {
  const handelDelete = async id => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        // Axios DELETE request
        const response = await axios.delete(`http://localhost:5000/news/${id}`);

        if (response.data.deleted) {
          Swal.fire('Deleted!', 'The news has been deleted.', 'success');
          refetch();
        }
      } catch (error) {
        Swal.fire('Error!', 'Something went wrong.', 'error');
        console.error(error);
      }
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200 even:bg-gray-50/50">
      {/* Image and Title */}
      <td className="px-4 py-4 sm:px-6">
        <div className="flex items-center">
          {news?.image ? (
            <div className="flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-md overflow-hidden bg-gray-100">
              <img
                src={
                  news.image.startsWith('http')
                    ? news.image
                    : `${process.env.NEXT_PUBLIC_ROOT_URL}${news.image}`
                }
                alt={news?.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 flex items-center justify-center bg-gray-200 rounded-md text-gray-500 text-xs sm:text-sm">
              N/A
            </div>
          )}
          <div className="ml-3 min-w-0">
            <div className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
              {news.title}
            </div>
            {/* Mobile-only category badge */}
            <div className="sm:hidden mt-1">
              <span
                className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full
              ${
                news.category === 'Politics'
                  ? 'bg-red-100 text-red-800'
                  : news.category === 'Sports'
                  ? 'bg-green-100 text-green-800'
                  : news.category === 'Technology'
                  ? 'bg-blue-100 text-blue-800'
                  : news.category === 'Entertainment'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
              >
                {news.category}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Category - Hidden on mobile */}
      <td className="hidden sm:table-cell px-4 py-4 sm:px-6 whitespace-nowrap">
        <span
          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full
        ${
          news.category === 'Politics'
            ? 'bg-red-100 text-red-800'
            : news.category === 'Sports'
            ? 'bg-green-100 text-green-800'
            : news.category === 'Technology'
            ? 'bg-blue-100 text-blue-800'
            : news.category === 'Entertainment'
            ? 'bg-purple-100 text-purple-800'
            : 'bg-gray-100 text-gray-800'
        }`}
        >
          {news.category}
        </span>
      </td>

      {/* Description - Hidden on mobile */}
      <td className="hidden md:table-cell px-4 py-4 sm:px-6">
        <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">
          {news.description}
        </div>
      </td>

      {/* Publish Date */}
      <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
        <div className="text-sm text-gray-600">
          <div className="hidden sm:block">
            {new Date(news?.publish).toLocaleDateString('bn-BD', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <div className="sm:hidden text-xs">
            {new Date(news?.publish).toLocaleDateString('bn-BD', {
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>
      </td>

      {/* Action Buttons */}
      <td className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-end space-x-2 sm:space-x-3">
          {/* View Button */}
          <button
            onClick={onView}
            className="p-2 sm:px-3 sm:py-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 group flex items-center"
            title="View Details"
          >
            <GrFormView className="w-4 h-4 sm:mr-1 inline" />
            <span className="hidden sm:inline group-hover:underline">View</span>
          </button>

          {/* Edit Button */}
          <Link href={`/admin/my-news/${news.id}`}>
            <button
              className="p-2 sm:px-3 sm:py-1.5 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 group flex items-center"
              title="Edit News"
            >
              <FaEdit className="w-4 h-4 sm:mr-1 inline" />
              <span className="hidden sm:inline group-hover:underline">
                Edit
              </span>
            </button>
          </Link>

          {/* Delete Button */}
          <button
            onClick={() => handelDelete(news.id)}
            className="p-2 sm:px-3 sm:py-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 group flex items-center"
            title="Delete News"
          >
            <MdDelete className="w-4 h-4 sm:mr-1 inline" />
            <span className="hidden sm:inline group-hover:underline">
              Delete
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
