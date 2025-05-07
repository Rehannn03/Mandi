import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Save,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Printer,
  X,
} from "lucide-react";
import AkdaInvoicePreview from "./AkdaPreview";
// import { toast } from "react-hot-toast";

const CustomButton = ({
  onClick,
  children,
  className,
  isLoading,
  icon: Icon,
}) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {isLoading ? (
      <Loader2 className="animate-spin" size={18} />
    ) : (
      Icon && <Icon size={18} />
    )}
    {children}
  </button>
);

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
  error,
  helperText,
}) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-2 border ${
          disabled ? "bg-gray-50" : "bg-white"
        } ${
          error
            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        } rounded-md focus:outline-none focus:ring-2 transition-colors duration-200`}
      />
      {error && (
        <AlertCircle
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500"
          size={18}
        />
      )}
    </div>
    {helperText && (
      <p className={`mt-1 text-sm ${error ? "text-red-600" : "text-gray-500"}`}>
        {helperText}
      </p>
    )}
  </div>
);

const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-4">
    {Icon && <Icon className="text-[#1E3A8A]" size={20} />}
    <h2 className="text-xl font-semibold text-[#1E3A8A]">{title}</h2>
  </div>
);

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

  // Fetch invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        // Simulating API call with setTimeout
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data based on the provided JSON
        const mockInvoice = {
          _id: "67952e2c536b03db82eed85c",
          bepariId: "6773f20570c1d8732dbf62cc",
          totalBakra: 15,
          date: "2025-01-26T00:00:00.000Z",
          kharchaDetails: {
            commision: 200,
            kasar: 50,
            kalamFare: 20,
            jagaBhada: 1000,
            motorBhada: 15000,
            karkoni: 0,
            mandiGawali: 1000,
            charaBhusa: 0,
            mazdoori: 0,
          },
          totalKharcha: 17270, // Updated to match the screenshot
          paidAmount: 50000,
          balance: 32730, // Updated to match the screenshot
          bepari: {
            name: "Bepari_4",
            address: "Add4",
            phone: "12345",
          },
        };

        setInvoice(mockInvoice);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch invoice");
        setLoading(false);
      }
    };

    fetchInvoice();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setInvoice({
        ...invoice,
        [parent]: {
          ...invoice[parent],
          [child]: value,
        },
      });
    } else {
      setInvoice({
        ...invoice,
        [name]: value,
      });
    }
  };

  const handleKharchaChange = (e) => {
    const { name, value } = e.target;
    const numValue = Number.parseFloat(value) || 0;

    setInvoice({
      ...invoice,
      kharchaDetails: {
        ...invoice.kharchaDetails,
        [name]: numValue,
      },
    });
  };

  const calculateTotalKharcha = () => {
    const { kharchaDetails } = invoice;
    return Object.values(kharchaDetails).reduce(
      (sum, value) => sum + (Number.parseFloat(value) || 0),
      0
    );
  };

  const calculateBalance = () => {
    return invoice.paidAmount - calculateTotalKharcha();
  };

  useEffect(() => {
    if (!loading) {
      const totalKharcha = calculateTotalKharcha();
      const balance = calculateBalance();

      setInvoice((prev) => ({
        ...prev,
        totalKharcha,
        balance,
      }));
    }
  }, [invoice.kharchaDetails, invoice.paidAmount, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Invoice updated successfully!");
    } catch (err) {
      setError("Failed to update invoice");
    }
  };

  const handleBack = () => {
    alert("Back button clicked - would navigate back to invoice list");
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
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
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
                  value={invoice.totalKharcha}
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
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Balance
                </label>
                <input
                  type="number"
                  name="balance"
                  value={invoice.balance}
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
