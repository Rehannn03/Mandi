import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { adminService } from '../../services/api';
import { format, parseISO } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';

const BepariKhata = () => {
  const { bepariId } = useParams();
  const [khataData, setKhataData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDates, setExpandedDates] = useState({});

  useEffect(() => {
    fetchKhata();
  }, [bepariId]);

  const fetchKhata = async () => {
    try {
      setLoading(true);
      const response = await adminService.getBepariKhata(bepariId);
      setKhataData(response.message.khata_bepari);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch Bepari Khata');
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
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-[#F9FAFB]">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="flex flex-wrap space-x-2 text-sm font-roboto">
          <li><Link to="/admin" className="text-[#1E3A8A] hover:text-[#2563EB]">Admin</Link></li>
          <li className="text-[#6B7280]">/</li>
          <li><Link to="/admin/khaatas/bepari" className="text-[#1E3A8A] hover:text-[#2563EB]">Beparis</Link></li>
          <li className="text-[#6B7280]">/</li>
          <li className="text-[#111827]" aria-current="page">Khata</li>
        </ol>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A8A] mb-6 font-inter">Bepari Khata</h1>

      {khataData.map((khata, index) => (
        <div key={khata._id} className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-[#1E3A8A] mb-4 font-inter">
              Khata for {format(parseISO(khata.date), 'MMMM d, yyyy')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-[#6B7280] font-roboto">Total Bakra</p>
                <p className="text-lg font-semibold text-[#111827] font-inter">{khata.totalBakra}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] font-roboto">Rate per Bakra</p>
                <p className="text-lg font-semibold text-[#111827] font-inter">₹{khata.ratePerBakra.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] font-roboto">Final Amount</p>
                <p className="text-lg font-semibold text-[#111827] font-inter">₹{khata.finalAmount.toLocaleString()}</p>
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
                  Outflow Details
                </span>
                {expandedDates[khata.date] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {expandedDates[khata.date] && (
                <div className="mt-2 space-y-4">
                  {khata.outFlowDetails.map((outflow, outflowIndex) => (
                    <div key={outflowIndex} className="bg-[#F9FAFB] p-4 rounded-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#6B7280] font-roboto">Quantity</p>
                          <p className="text-md font-semibold text-[#111827] font-inter">{outflow.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] font-roboto">Rate</p>
                          <p className="text-md font-semibold text-[#111827] font-inter">{outflow.rate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] font-roboto">Total Amount</p>
                          <p className="text-md font-semibold text-[#111827] font-inter">{outflow.totalAmount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] font-roboto">Dukaandar</p>
                          <p className="text-md font-semibold text-[#111827] font-inter">{outflow.dukaandar.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] font-roboto">Notes</p>
                          <p className="text-md font-semibold text-[#111827] font-inter">{outflow.notes}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-[#6B7280] font-roboto">Dukaandar Details</p>
                        <p className="text-md text-[#111827] font-roboto">
                          Shop: {outflow.dukaandar.shopName}, Address: {outflow.dukaandar.address}, Contact: {outflow.dukaandar.contact}
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

export default BepariKhata;

