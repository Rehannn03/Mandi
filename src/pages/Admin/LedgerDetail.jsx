import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { adminService } from "../../services/api";

const LedgerDetail = () => {
  const { date } = useParams();
  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLedgerData();
  }, [date]);

  const fetchLedgerData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getLedgerByDate(date);
      {
        console.log(response);
      }
      setLedger(response.data.ledger[0]);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch ledger data");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderBreadcrumb = () => {
    return (
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="flex space-x-2 text-sm font-roboto">
          <li>
            <Link to="/admin" className="text-[#1E3A8A] hover:text-[#2563EB]">
              Admin
            </Link>
          </li>
          <li className="text-[#6B7280]">/</li>
          <li>
            <Link
              to="/admin/prevLedger"
              className="text-[#1E3A8A] hover:text-[#2563EB]"
            >
              Previous Ledgers
            </Link>
          </li>
          <li className="text-[#6B7280]">/</li>
          <li className="text-[#111827]" aria-current="page">
            {formatDate(date)}
          </li>
        </ol>
      </nav>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-b from-[#F9FAFB] to-white min-h-screen">
      {renderBreadcrumb()}
      <h1 className="text-4xl font-bold text-[#1E3A8A] mb-8 font-inter animate-fade-in">
        Ledger for {formatDate(ledger.date)}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          {
            title: "Total Inflow",
            value: ledger.totalInflow,
            color: "text-[#16A34A]",
            icon: "+",
          },
          {
            title: "Total Outflow",
            value: ledger.totalOutflow,
            color: "text-[#DC2626]",
            icon: "-",
          },
          {
            title: "Balance",
            value: ledger.balance,
            color: ledger.balance >= 0 ? "text-[#16A34A]" : "text-[#DC2626]",
          },
          {
            title: "Balance in Cash",
            value: ledger.balanceCash,
            color:
              ledger.balanceCash >= 0 ? "text-[#16A34A]" : "text-[#DC2626]",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold text-[#1E3A8A] mb-3 font-inter">
              {item.title}
            </h2>
            <p className={`text-2xl font-bold ${item.color} flex items-center`}>
              {item.icon && <span className="mr-1">{item.icon}</span>}₹
              {item.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E5E7EB]">
            <thead className="bg-[#1E3A8A] text-white">
              <tr>
                {[
                  "Type",
                  "Related To",
                  "Party ID",
                  "Amount",
                  "Method",
                  "Notes",
                ].map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider font-roboto"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E5E7EB]">
              {ledger.transactions.map((transaction, index) => (
                <tr
                  key={transaction._id}
                  className={`${
                    index % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white"
                  } hover:bg-[#F3F4F6] transition-colors duration-150`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-roboto">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        transaction.type === "inflow"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.type === "inflow" ? "Inflow" : "Outflow"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111827] font-roboto">
                    {transaction.relatedTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111827] font-roboto">
                    {transaction.type === "inflow"
                      ? transaction.dukaandar?.name
                      : transaction.bepari?.name}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.type === "inflow"
                        ? "text-[#16A34A]"
                        : "text-[#DC2626]"
                    } font-roboto`}
                  >
                    {transaction.type === "inflow" ? "+" : "-"}₹
                    {transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111827] font-roboto">
                    <span className="px-3 py-1 bg-gray-100 rounded-full">
                      {transaction.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111827] font-roboto">
                    {transaction.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LedgerDetail;
