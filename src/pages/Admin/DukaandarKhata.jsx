import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { adminService } from '../../services/api';
const DukaandarKhata = () => {
  const { dukaandarId } = useParams();
  const [khataData, setKhataData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDates, setExpandedDates] = useState({});

  useEffect(() => {
    fetchKhata();
  }, [dukaandarId]);

  const fetchKhata = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDukaandarKhata(dukaandarId);
      {console.log(response)}
      setKhataData(response.message.khata);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch Dukaandar Khata');
      setLoading(false);
    }
  };

  const toggleDateExpansion = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#F9FAFB]">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="flex space-x-2 text-sm font-roboto">
          <li><Link to="/admin" className="text-[#1E3A8A] hover:text-[#2563EB]">Admin</Link></li>
          <li className="text-[#6B7280]">/</li>
          <li><Link to="/admin/khaatas/dukaandar" className="text-[#1E3A8A] hover:text-[#2563EB]">Dukaandars</Link></li>
          <li className="text-[#6B7280]">/</li>
          <li className="text-[#111827]" aria-current="page">Khata</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6 font-inter">Dukaandar Khata</h1>

      {khataData.map((khata, index) => (
        <div key={khata._id} className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#1E3A8A] mb-4 font-inter">
              Khata for {format(parseISO(khata.date), 'MMMM d, yyyy')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-[#6B7280] font-roboto">Total Amount</p>
                <p className="text-lg font-semibold text-[#111827] font-inter">₹{khata.totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] font-roboto">Paid Amount</p>
                <p className="text-lg font-semibold text-[#16A34A] font-inter">₹{khata.paidAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] font-roboto">Balance</p>
                <p className="text-lg font-semibold text-[#DC2626] font-inter">₹{khata.balance.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => toggleDateExpansion(khata.date)}
                className="w-full flex justify-between items-center py-2 px-4 bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors duration-200 rounded-lg"
              >
                <span className="text-lg font-semibold text-[#1E3A8A] font-inter">
                  Purchases
                </span>
                {expandedDates[khata.date] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {expandedDates[khata.date] && (
                <div className="mt-2 space-y-4">
                  {khata.purchases.map((purchase, purchaseIndex) => (
                    <div key={purchaseIndex} className="bg-[#F9FAFB] p-4 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-[#6B7280] font-roboto">Quantity</p>
                          <p className="text-md font-semibold text-[#111827] font-inter">{purchase.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] font-roboto">Amount</p>
                          <p className="text-md font-semibold text-[#111827] font-inter">₹{purchase.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] font-roboto">Final Amount</p>
                          <p className="text-md font-semibold text-[#111827] font-inter">₹{purchase.finalAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] font-roboto">Bepari</p>
                          <p className="text-md font-semibold text-[#111827] font-inter">{purchase.bepari.name}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-[#6B7280] font-roboto">Bepari Details</p>
                        <p className="text-md text-[#111827] font-roboto">
                          Phone: {purchase.bepari.phone}, Address: {purchase.bepari.address}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DukaandarKhata;

