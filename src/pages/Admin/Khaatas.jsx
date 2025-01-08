import React from 'react';
import { Link } from 'react-router';

const Khaatas = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#F9FAFB]">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="flex space-x-2 text-sm font-roboto">
          <li><Link to="/admin" className="text-[#1E3A8A] hover:text-[#2563EB]">Admin</Link></li>
          <li className="text-[#6B7280]">/</li>
          <li className="text-[#111827]" aria-current="page">Khaatas</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6 font-inter">Khaatas Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/admin/khaatas/dukaandar" 
          className="btn bg-[#F97316] hover:bg-[#EA580C] text-white py-4 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg font-inter font-semibold text-center"
        >
          Dukaandar
        </Link>
        <Link 
          to="/admin/khaatas/bepari" 
          className="btn bg-[#1E3A8A] hover:bg-[#2563EB] text-white py-4 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg font-inter font-semibold text-center"
        >
          Bepari
        </Link>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-[#1E3A8A] mb-4 font-inter">Khaatas Overview</h2>
        <p className="text-[#4B5563] font-roboto">
          Welcome to the Khaatas Management section. Here you can manage Dukaandar and Bepari records.
        </p>
      </div>
    </div>
  );
};

export default Khaatas;