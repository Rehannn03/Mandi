import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { adminService } from "../../services/api";
import {
  format,
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  X,
  CalendarIcon,
  HistoryIcon,
} from "lucide-react";

const CustomButton = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200 ${className}`}
  >
    {children}
  </button>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const PaymentHistoryModal = ({ isOpen, onClose, paymentHistory }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment History">
      <div className="mt-4 max-h-96 overflow-y-auto">
        {paymentHistory && paymentHistory.length > 0 ? (
          paymentHistory.map((payment, index) => (
            <div
              key={payment._id || index}
              className="mb-4 p-4 bg-gray-50 rounded-lg"
            >
              <p className="text-sm text-gray-600">
                Date: {format(parseISO(payment.date), "MMMM d, yyyy")}
              </p>
              <p className="text-lg font-semibold">
                Amount: ₹{payment.amount.toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">
            No payments have been made yet.
          </p>
        )}
      </div>
    </Modal>
  );
};

const BepariKhata = () => {
  const { bepariId } = useParams();
  const [khataData, setKhataData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDates, setExpandedDates] = useState({});
  const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);
  const [selectedPaymentHistory, setSelectedPaymentHistory] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [filteredKhataData, setFilteredKhataData] = useState([]);

  useEffect(() => {
    fetchKhata();
  }, [bepariId]);

  useEffect(() => {
    filterByDateRange();
  }, [dateRange, khataData]);

  const fetchKhata = async () => {
    try {
      setLoading(true);
      const response = await adminService.getBepariKhata(bepariId);
      setKhataData(response.message.khata_bepari);
      setFilteredKhataData(response.message.khata_bepari);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch Bepari Khata");
      setLoading(false);
    }
  };

  const filterByDateRange = () => {
    if (!dateRange.start && !dateRange.end) {
      setFilteredKhataData(khataData);
      return;
    }

    const filtered = khataData.filter((khata) => {
      const khataDate = startOfDay(parseISO(khata.date));
      const start = dateRange.start
        ? startOfDay(parseISO(dateRange.start))
        : null;
      const end = dateRange.end ? endOfDay(parseISO(dateRange.end)) : null;

      if (start && end) {
        return isWithinInterval(khataDate, { start, end });
      } else if (start) {
        return khataDate >= start;
      } else if (end) {
        return khataDate <= end;
      }
      return true;
    });

    setFilteredKhataData(filtered);
  };

  const toggleDateExpansion = (date) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const openPaymentHistory = (paymentHistory = []) => {
    setSelectedPaymentHistory(paymentHistory || []);
    setIsPaymentHistoryOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#F9FAFB] min-h-screen">
      {/* Enhanced Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-sm font-medium">
          <li>
            <Link
              to="/admin"
              className="text-[#1E3A8A] hover:text-[#2563EB] transition-colors duration-200"
            >
              Admin
            </Link>
          </li>
          <li className="text-[#6B7280]">/</li>
          <li>
            <Link
              to="/admin/khaatas/bepari"
              className="text-[#1E3A8A] hover:text-[#2563EB] transition-colors duration-200"
            >
              Beparis
            </Link>
          </li>
          <li className="text-[#6B7280]">/</li>
          <li className="text-[#111827] font-semibold" aria-current="page">
            Khata
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-8 font-inter">
        Bepari Khata
      </h1>

      {/* Date Range Filter */}
      <div className="mb-8 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                />
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => setDateRange({ start: "", end: "" })}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
        {filteredKhataData.length === 0 && (
          <p className="mt-4 text-sm text-gray-500 text-center">
            No records found for the selected date range
          </p>
        )}
      </div>

      {/* Khata Cards */}
      {filteredKhataData.map((khata) => (
        <div
          key={khata._id}
          className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-6">
            {/* Date Header */}
            <h2 className="text-xl font-semibold text-[#1E3A8A] mb-6 font-inter flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-[#2563EB]" />
              Khata for {format(parseISO(khata.date), "MMMM d, yyyy")}
            </h2>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-[#6B7280] font-medium mb-1">
                  Total Bakra
                </p>
                <p className="text-2xl font-bold text-[#111827]">
                  {khata.totalBakra}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-[#6B7280] font-medium mb-1">
                  Rate per Bakra
                </p>
                <p className="text-2xl font-bold text-[#111827]">
                  ₹{khata.ratePerBakra.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-[#6B7280] font-medium mb-1">
                  Final Amount
                </p>
                <p className="text-2xl font-bold text-[#111827]">
                  ₹{khata.finalAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <p className="text-sm text-[#6B7280] font-medium mb-1">
                  Paid Amount
                </p>
                <p className="text-2xl font-bold text-[#16A34A]">
                  ₹{khata.paidAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <p className="text-sm text-[#6B7280] font-medium mb-1">
                  Balance
                </p>
                <p className="text-2xl font-bold text-[#DC2626]">
                  ₹{khata.balance.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex justify-between items-center gap-4">
                <button
                  onClick={() => toggleDateExpansion(khata.date)}
                  className="flex-grow flex items-center justify-between px-4 py-3 bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-lg text-[#1E3A8A] transition-colors duration-200"
                >
                  <span className="text-lg font-semibold font-inter flex items-center">
                    Outflow Details
                  </span>
                  {expandedDates[khata.date] ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                <button
                  onClick={() => openPaymentHistory(khata.datePaid || [])}
                  className="px-6 py-3 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#2563EB] transition-all duration-200 flex items-center font-medium"
                >
                  <HistoryIcon className="w-5 h-5 mr-2" />
                  Payment History
                </button>
              </div>

              {/* Outflow Details List */}
              {expandedDates[khata.date] && (
                <div className="mt-4 space-y-4">
                  {khata.outFlowDetails.map((outflow, outflowIndex) => (
                    <div
                      key={outflowIndex}
                      className="bg-[#F9FAFB] p-6 rounded-lg border border-gray-100 hover:border-[#1E3A8A] transition-all duration-200"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-4">
                        <div>
                          <p className="text-sm text-[#6B7280] font-medium mb-1">
                            Quantity
                          </p>
                          <p className="text-lg font-semibold text-[#111827]">
                            {outflow.quantity}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] font-medium mb-1">
                            Rate
                          </p>
                          <p className="text-lg font-semibold text-[#111827]">
                            ₹{outflow.rate.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] font-medium mb-1">
                            Total Amount
                          </p>
                          <p className="text-lg font-semibold text-[#111827]">
                            ₹{outflow.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Dukaandar Information */}
                      <div className="bg-white p-4 rounded-lg border border-gray-100">
                        <p className="text-sm font-medium text-[#1E3A8A] mb-2">
                          Dukaandar Information
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-[#6B7280]">Name</p>
                            <p className="font-medium">
                              {outflow.dukaandar.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-[#6B7280]">Shop</p>
                            <p className="font-medium">
                              {outflow.dukaandar.shopName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-[#6B7280]">Contact</p>
                            <p className="font-medium">
                              {outflow.dukaandar.contact}
                            </p>
                          </div>
                        </div>
                        {outflow.notes && (
                          <div className="mt-3">
                            <p className="text-sm text-[#6B7280]">Notes</p>
                            <p className="font-medium">{outflow.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced Payment History Modal */}
      <PaymentHistoryModal
        isOpen={isPaymentHistoryOpen}
        onClose={() => setIsPaymentHistoryOpen(false)}
        paymentHistory={selectedPaymentHistory}
      />
    </div>
  );
};

export default BepariKhata;
