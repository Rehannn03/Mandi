import React, { useState, useEffect, useRef } from "react";
import { adminService } from "../../services/api";
import { Search, X } from "lucide-react";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const NewLedger = () => {
  const [transactions, setTransactions] = useState([]);
  const [ledgerSummary, setLedgerSummary] = useState({
    totalInflow: 0,
    totalOutflow: 0,
    balance: 0,
  });
  const [beparis, setBeparis] = useState([]);
  const [dukaandars, setDukaandars] = useState([]);
  const [khataDates, setKhataDates] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    date: getTodayDate(),
    type: "inflow",
    relatedTo: "Dukaandar",
    partyId: "",
    partyName: "",
    amount: 0,
    method: "cash",
    notes: "",
    dateOfDukaandar: "",
    dateOfBepari: "",
  });
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchTransactions();
    fetchBeparis();
    fetchDukaandars();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await adminService.getLedgerByDate(getTodayDate());
      setTransactions(response.data.ledger[0].transactions);
      setLedgerSummary({
        totalInflow: response.data.ledger[0].totalInflow,
        totalOutflow: response.data.ledger[0].totalOutflow,
        balance: response.data.ledger[0].balance,
      });
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch transactions");
    }
  };

  const fetchBeparis = async () => {
    try {
      const response = await adminService.getBepari();
      setBeparis(response.message);
    } catch (error) {
      console.error("Error fetching beparis:", error);
    }
  };

  const fetchDukaandars = async () => {
    try {
      const response = await adminService.getDukaandar();
      setDukaandars(response.message);
    } catch (error) {
      console.error("Error fetching dukaandars:", error);
    }
  };

  const fetchKhataDates = async (id) => {
    try {
      let response;
      if (formData.relatedTo === "Dukaandar") {
        response = await adminService.getDukaandarDates(id);
      } else if (formData.relatedTo === "Bepari") {
        response = await adminService.getBepariDates(id);
      }
      console.log("Khata dates:", response);
      if (response.success) {
        setKhataDates(response.data.khataDates);
      }
    } catch (error) {
      console.error("Error fetching khata dates:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "relatedTo") {
      setFormData((prevData) => ({ ...prevData, partyId: "", partyName: "" }));
      setSearchTerm("");
      setShowDropdown(false);
    }
  };

  const handlePartySelect = (party) => {
    setFormData((prev) => ({
      ...prev,
      partyId: party._id,
      partyName: party.name,
    }));
    setSearchTerm("");
    setShowDropdown(false);
    fetchKhataDates(party._id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsRefreshing(true);
    try {
      const submissionData = {
        ...formData,
        date: getTodayDate(),
      };
      const response =
        formData.type === "inflow"
          ? await adminService.addInflow(submissionData)
          : await adminService.addOutflow(submissionData);

      // const newTransaction =
      //   response.data.ledger[0].transactions[
      //     response.data.ledger[0].transactions.length - 1
      //   ];
      // setTransactions((prevTransactions) => [
      //   ...prevTransactions,
      //   newTransaction,
      // ]);
      // setLedgerSummary({
      //   totalInflow: response.data.ledger[0].totalInflow,
      //   totalOutflow: response.data.ledger[0].totalOutflow,
      //   balance: response.data.ledger[0].balance,
      // });
      await fetchTransactions();
      setFormData({
        date: getTodayDate(),
        type: "inflow",
        relatedTo: "Dukaandar",
        partyId: "",
        partyName: "",
        amount: 0,
        method: "cash",
        notes: "",
        dateOfDukaandar: "",
        dateOfBepari: "",
      });
      setSearchTerm("");
    } catch (err) {
      console.error("Error submitting transaction:", err);
      setError(err.response?.data?.message || "Failed to add transaction");
    }
  };

  const filteredParties = ["Bepari", "Gawali", "Bhada"].includes(
    formData.relatedTo
  )
    ? beparis.filter((bepari) =>
        bepari.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : dukaandars.filter((dukaandar) =>
        dukaandar.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-extrabold text-[#2E47CC] mb-8 font-poppins tracking-tight">
        Ledger Management
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-8 rounded-2xl shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-semibold text-[#374151] mb-2 font-montserrat"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              readOnly
              className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed font-lato"
            />
          </div>
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-semibold text-[#374151] mb-2 font-montserrat"
            >
              Transaction Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-300 font-lato"
            >
              <option value="inflow">Inflow (Money Received)</option>
              <option value="outflow">Outflow (Money Paid)</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="relatedTo"
              className="block text-sm font-semibold text-[#374151] mb-2 font-montserrat"
            >
              Category
            </label>
            <select
              id="relatedTo"
              name="relatedTo"
              value={formData.relatedTo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-300 font-lato"
              required
            >
              <option value="Dukaandar">Dukaandar</option>
              <option value="Bepari">Bepari</option>
              <option value="Gawali">Gawali</option>
              <option value="Bhada">Bhada</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>
          <div className="col-span-full md:col-span-1" ref={searchInputRef}>
            <label
              htmlFor="partySearch"
              className="block text-sm font-semibold text-[#374151] mb-2 font-montserrat"
            >
              Party
            </label>
            <div className="relative">
              {formData.partyName ? (
                <div className="flex items-center justify-between w-full px-4 py-2 border border-[#D1D5DB] rounded-lg font-lato">
                  <span>{formData.partyName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        partyId: "",
                        partyName: "",
                      }));
                      setSearchTerm("");
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <input
                      type="text"
                      id="partySearch"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                      }}
                      className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-300 font-lato"
                      placeholder="Search for party..."
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Search
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            {showDropdown && searchTerm && filteredParties.length > 0 && (
              <ul className="mt-2 max-h-52 overflow-y-auto bg-white border border-[#D1D5DB] rounded-lg shadow-md">
                {filteredParties.map((party) => (
                  <li
                    key={party._id}
                    onClick={() => handlePartySelect(party)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-lato"
                  >
                    {party.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-semibold text-[#374151] mb-2 font-montserrat"
            >
              Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-300 font-lato"
              required
            />
          </div>
          <div>
            <label
              htmlFor="method"
              className="block text-sm font-semibold text-[#374151] mb-2 font-montserrat"
            >
              Payment Method
            </label>
            <select
              id="method"
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-300 font-lato"
            >
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-semibold text-[#374151] mb-2 font-montserrat"
            >
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="1"
              className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-300 font-lato"
            />
          </div>
          {formData.type === "inflow" && formData.relatedTo === "Dukaandar" && (
            <div>
              <label
                htmlFor="dateOfDukaandar"
                className="block text-sm font-semibold text-[#374151] mb-2 font-montserrat"
              >
                Dukaandar Date
              </label>
              <select
                id="dateOfDukaandar"
                name="dateOfDukaandar"
                value={formData.dateOfDukaandar}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-300 font-lato"
              >
                <option value="">Select a date</option>
                {khataDates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          )}
          {formData.type === "outflow" && formData.relatedTo === "Bepari" && (
            <div>
              <label
                htmlFor="dateOfBepari"
                className="block text-sm font-semibold text-[#374151] mb-2 font-montserrat"
              >
                Bepari Date
              </label>
              <select
                id="dateOfBepari"
                name="dateOfBepari"
                value={formData.dateOfBepari}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-300 font-lato"
              >
                <option value="">Select a date</option>
                {khataDates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-sm font-montserrat mt-3">{error}</p>
        )}
        <button
          type="submit"
          className="mt-6 w-full bg-[#2E47CC] hover:bg-[#1A2E99] text-white py-3 px-6 rounded-lg transition-colors duration-300 font-semibold font-poppins shadow-md"
        >
          Add Transaction
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-[#2E47CC] mb-3 font-poppins">
            Total Inflow
          </h3>
          <p className="text-3xl font-extrabold text-green-600 font-lato">
            ₹{ledgerSummary.totalInflow.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-[#2E47CC] mb-3 font-poppins">
            Total Outflow
          </h3>
          <p className="text-3xl font-extrabold text-red-600 font-lato">
            ₹{ledgerSummary.totalOutflow.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-[#2E47CC] mb-3 font-poppins">
            Net Balance
          </h3>
          <p
            className={`text-3xl font-extrabold font-lato ${
              ledgerSummary.balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ₹{ledgerSummary.balance.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {isRefreshing ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E47CC]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-montserrat">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-montserrat">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-montserrat">
                    Party
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-montserrat">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-montserrat">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-montserrat">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <tr
                    key={transaction._id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-lato">
                      {transaction.type === "inflow" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Inflow
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Outflow
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-lato">
                      {transaction.relatedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-lato">
                      {transaction.type === "inflow"
                        ? transaction.dukaandar?.name
                        : transaction.bepari?.name}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.type === "inflow"
                          ? "text-green-600"
                          : "text-red-600"
                      } font-lato`}
                    >
                      {transaction.type === "inflow" ? "+" : "-"}₹
                      {transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-lato">
                      {transaction.method}
                    </td>
                    <td className="px-6 py-4 whitespace-wrap text-sm text-gray-700 font-lato">
                      {transaction.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewLedger;
