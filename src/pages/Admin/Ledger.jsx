import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { adminService } from '../../services/api';

const Ledger = () => {
  const [ledgerExistsToday, setLedgerExistsToday] = useState(false);

  useEffect(() => {
    checkTodayLedger();
  }, []);

  const checkTodayLedger = async () => {
    try {
      const response = await adminService.prevLedger();
      if (response.statusCode === 200) {
        const today = new Date().toISOString().split('T')[0];
        const ledgerExists = response.message.some(ledger => ledger.date === today);
        setLedgerExistsToday(ledgerExists);
      }
    } catch (error) {
      console.error('Error checking ledger:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#F9FAFB]">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="flex space-x-2 text-sm font-roboto">
          <li><Link to="/admin" className="text-[#1E3A8A] hover:text-[#2563EB]">Admin</Link></li>
          <li className="text-[#6B7280]">/</li>
          <li className="text-[#111827]" aria-current="page">Ledger</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6 font-inter">Ledger Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ledgerExistsToday ? (
          <Link 
            to="/admin/resumeLedger" 
            className="btn bg-[#F97316] hover:bg-[#EA580C] text-white py-4 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg font-inter font-semibold text-center"
          >
            Resume Today's Ledger
          </Link>
        ) : (
          <Link 
            to="/admin/newLedger" 
            className="btn bg-[#F97316] hover:bg-[#EA580C] text-white py-4 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg font-inter font-semibold text-center"
          >
            Create New Ledger
          </Link>
        )}
        <Link 
          to="/admin/prevLedger" 
          className="btn bg-[#1E3A8A] hover:bg-[#2563EB] text-white py-4 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg font-inter font-semibold text-center"
        >
          Show Previous Ledgers
        </Link>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-[#1E3A8A] mb-4 font-inter">Ledger Overview</h2>
        <p className="text-[#4B5563] font-roboto">
          Welcome to the Ledger Management section. Here you can create a new ledger for today, 
          resume work on an existing ledger, or view previous ledgers. 
          {ledgerExistsToday 
            ? "A ledger for today already exists. You can resume working on it."
            : "There is no ledger for today yet. You can create a new one to start recording transactions."}
        </p>
      </div>
    </div>
  );
};

export default Ledger;

