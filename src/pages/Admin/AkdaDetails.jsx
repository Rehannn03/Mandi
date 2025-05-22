import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ArrowLeft, Printer, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import AkdaInvoicePreview from "./AkdaPreview";
import { adminService } from "../../services/api";
// import { toast } from "react-hot-toast";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X size={24} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

const AkdaDetails = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id = pathSegments[pathSegments.length - 2]; // Second to last segment
  const date = pathSegments[pathSegments.length - 1]; // Last segment

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [invoice, setInvoice] = useState({
    _id: "",
    bepariId: "",
    totalBakra: 0,
    date: "",
    kharchaDetails: {
      commision: 0,
      kasar: 0,
      kalamFare: 0,
      jagaBhada: 0,
      motorBhada: 0,
      karkoni: 0,
      mandiGawali: 0,
      charaBhusa: 0,
      mazdoori: 0,
    },
    totalKharcha: 0,
    paidAmount: 0,
    balance: 0,
    bepari: {
      name: "",
      address: "",
      phone: "",
    },
  });
  const [initialBalance, setInitialBalance] = useState(0);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await adminService.getAkda(id, date);
        const akdaData = response.data.akda[0];
        // Transform the data to match our state structure
        const transformedData = {
          _id: akdaData._id,
          bepariId: akdaData.bepariId,
          totalBakra: akdaData.totalBakra,
          date: akdaData.date,
          kharchaDetails: akdaData.kharchaDetails[0],
          totalKharcha: akdaData.totalKharcha || 0,
          paidAmount: akdaData.paidAmount || 0,
          balance: akdaData.balance || 0,
          bepari: akdaData.bepari[0],
          settled: akdaData.settled,
        };

        // Store the initial balance
        setInitialBalance(akdaData.balance || 0);
        console.log("Initial Balance Set:", akdaData.balance || 0);

        console.log("Transformed Data:", transformedData);
        setInvoice(transformedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching invoice:", err);
        setError("Failed to fetch invoice");
        setLoading(false);
      }
    };

    if (id && date) {
      fetchInvoice();
    }
  }, [id, date]);

  const handleKharchaChange = (e) => {
    const { name, value } = e.target;
    const numValue = Number.parseFloat(value) || 0;

    // Update kharcha details
    const updatedKharchaDetails = {
      ...invoice.kharchaDetails,
      [name]: numValue,
    };

    // Calculate new total immediately
    const newTotal = Object.values(updatedKharchaDetails).reduce(
      (sum, value) => sum + (Number.parseFloat(value) || 0),
      0
    );

    // Update the entire invoice state with new values
    setInvoice((prev) => ({
      ...prev,
      kharchaDetails: updatedKharchaDetails,
      totalKharcha: newTotal,
      balance: initialBalance - newTotal,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setInvoice((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setInvoice((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Transform the data to match the required API structure
      const apiData = {
        commision: invoice.kharchaDetails.commision,
        kasar: invoice.kharchaDetails.kasar,
        kalamFare: invoice.kharchaDetails.kalamFare,
        jagaBhada: invoice.kharchaDetails.jagaBhada,
        motorBhada: invoice.kharchaDetails.motorBhada,
        karkoni: invoice.kharchaDetails.karkoni,
        mandiGawali: invoice.kharchaDetails.mandiGawali,
        charaBhusa: invoice.kharchaDetails.charaBhusa,
        mazdoori: invoice.kharchaDetails.mazdoori,
        bepariId: invoice.bepariId,
        date: invoice.date,
        totalKharcha: invoice.totalKharcha,
        paidAmount: invoice.paidAmount,
        balance: invoice.balance,
      };

      const response = await adminService.updateAkda(apiData);
      if (response == "Success") {
        alert("Updated Successfully");
      }
    } catch (err) {
      setError("Failed to update invoice");
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const handlePrint = () => {
    setIsPrintModalOpen(true);
  };

  const handleClosePrintModal = () => {
    setIsPrintModalOpen(false);
  };

  const handleCancel = () => {
    alert("Cancel button clicked");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (error) {
      return "";
    }
  };

  const calculateTotalKharcha = () => {
    const { kharchaDetails } = invoice;
    // Only sum the specific kharcha fields
    const kharchaFields = [
      "commision",
      "kasar",
      "kalamFare",
      "jagaBhada",
      "motorBhada",
      "karkoni",
      "mandiGawali",
      "charaBhusa",
      "mazdoori",
    ];

    const total = kharchaFields.reduce(
      (sum, field) => sum + (Number.parseFloat(kharchaDetails[field]) || 0),
      0
    );
    console.log("Calculated Total Kharcha:", total);
    return total;
  };

  const calculateBalance = () => {
    const totalKharcha = calculateTotalKharcha();
    const balance = initialBalance - totalKharcha;
    return balance;
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 mr-4"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-[#1E3A8A]">
            Edit Akda Invoice
          </h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
          >
            <Printer size={16} className="mr-2" />
            Print Invoice
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#1E3A8A] text-white rounded-md hover:bg-[#2563EB]"
          >
            Save Changes
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Invoice Details */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#3B5998] to-[#6A84C3] p-4 text-white">
              <h2 className="text-xl font-semibold">Invoice Details</h2>
              <p className="text-sm opacity-80">ID: {invoice._id}</p>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice ID
                </label>
                <input
                  type="text"
                  name="_id"
                  value={invoice._id}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated invoice ID
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formatDate(invoice.date)}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Bakra
                </label>
                <input
                  type="number"
                  name="totalBakra"
                  value={invoice.totalBakra}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Bepari Information */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#3B5998] to-[#6A84C3] p-4 text-white">
              <h2 className="text-xl font-semibold">Bepari Information</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bepari ID
                </label>
                <input
                  type="text"
                  name="bepariId"
                  value={invoice.bepariId}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated bepari ID
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bepari Name
                </label>
                <input
                  type="text"
                  name="bepari.name"
                  value={invoice.bepari.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bepari Address
                </label>
                <input
                  type="text"
                  name="bepari.address"
                  value={invoice.bepari.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bepari Phone
                </label>
                <input
                  type="text"
                  name="bepari.phone"
                  value={invoice.bepari.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Kharcha Details */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-[#3B5998] to-[#6A84C3] p-4 text-white">
            <h2 className="text-xl font-semibold">Kharcha Details</h2>
            <p className="text-sm opacity-80">Expense breakdown</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission
                </label>
                <input
                  type="number"
                  name="commision"
                  value={invoice.kharchaDetails.commision}
                  onChange={handleKharchaChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kasar
                </label>
                <input
                  type="number"
                  name="kasar"
                  value={invoice.kharchaDetails.kasar}
                  onChange={handleKharchaChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kalam Fare
                </label>
                <input
                  type="number"
                  name="kalamFare"
                  value={invoice.kharchaDetails.kalamFare}
                  onChange={handleKharchaChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jaga Bhada
                </label>
                <input
                  type="number"
                  name="jagaBhada"
                  value={invoice.kharchaDetails.jagaBhada}
                  onChange={handleKharchaChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motor Bhada
                </label>
                <input
                  type="number"
                  name="motorBhada"
                  value={invoice.kharchaDetails.motorBhada}
                  onChange={handleKharchaChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Karkoni
                </label>
                <input
                  type="number"
                  name="karkoni"
                  value={invoice.kharchaDetails.karkoni}
                  onChange={handleKharchaChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mandi Gawali
                </label>
                <input
                  type="number"
                  name="mandiGawali"
                  value={invoice.kharchaDetails.mandiGawali}
                  onChange={handleKharchaChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chara Bhusa
                </label>
                <input
                  type="number"
                  name="charaBhusa"
                  value={invoice.kharchaDetails.charaBhusa}
                  onChange={handleKharchaChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mazdoori
                </label>
                <input
                  type="number"
                  name="mazdoori"
                  value={invoice.kharchaDetails.mazdoori}
                  onChange={handleKharchaChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-4 flex items-center text-[#1E3A8A]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path
                fillRule="evenodd"
                d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-xl font-semibold">Payment Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Kharcha
                </label>
                <input
                  type="number"
                  name="totalKharcha"
                  value={calculateTotalKharcha()}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-calculated total expenses
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paid Amount
                </label>
                <input
                  type="number"
                  name="paidAmount"
                  value={invoice.paidAmount}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Amount paid from database
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Balance
                </label>
                <input
                  type="number"
                  name="balance"
                  value={calculateBalance()}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-calculated remaining balance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#1E3A8A] text-white rounded-md hover:bg-[#2563EB]"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Print Modal */}
      <Modal isOpen={isPrintModalOpen} onClose={handleClosePrintModal}>
        <div className="p-4">
          <AkdaInvoicePreview invoice={invoice} />
        </div>
      </Modal>
    </div>
  );
};

export default AkdaDetails;
