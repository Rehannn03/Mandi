import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { adminService } from '../../services/api';

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
      {console.log(response)}
      setLedger(response.data.ledger[0]);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch ledger data');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderBreadcrumb = () => {
    return (
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="flex space-x-2 text-sm font-roboto">
          <li><Link to="/admin" className="text-[#1E3A8A] hover:text-[#2563EB]">Admin</Link></li>
          <li className="text-[#6B7280]">/</li>
          <li><Link to="/admin/prevLedger" className="text-[#1E3A8A] hover:text-[#2563EB]">Previous Ledgers</Link></li>
          <li className="text-[#6B7280]">/</li>
          <li className="text-[#111827]" aria-current="page">{formatDate(date)}</li>
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
    <div className="max-w-6xl mx-auto p-6 bg-[#F9FAFB]">
      {renderBreadcrumb()}
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6 font-inter">
        Ledger for {formatDate(ledger.date)}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-[#1E3A8A] mb-2 font-inter">Total Inflow</h2>
          <p className="text-2xl font-bold text-[#16A34A]">₹{ledger.totalInflow.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-[#1E3A8A] mb-2 font-inter">Total Outflow</h2>
          <p className="text-2xl font-bold text-[#DC2626]">₹{ledger.totalOutflow.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-[#1E3A8A] mb-2 font-inter">Balance</h2>
          <p className={`text-2xl font-bold ${ledger.balance >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
            ₹{ledger.balance.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-[#1E3A8A] mb-2 font-inter">Balance in Cash</h2>
          <p className={`text-2xl font-bold ${ledger.balanceCash >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
            ₹{ ledger.balanceCash.toLocaleString() }
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-[#E5E7EB]">
          <thead className="bg-[#F3F4F6]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider font-roboto">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider font-roboto">Related To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider font-roboto">Party ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider font-roboto">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider font-roboto">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider font-roboto">Notes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#E5E7EB]">
            {ledger.transactions.map((transaction, index) => (
              <tr key={transaction._id} className={index % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111827] font-roboto">{transaction.type==='inflow'? 'Inflow':'Outflow'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111827] font-roboto">{transaction.relatedTo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111827] font-roboto">{transaction.type === 'inflow' ? transaction.dukaandar.name : transaction.bepari.name}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.type === 'inflow' ? 'text-[#16A34A]' : 'text-[#DC2626]'} font-roboto`}>
                  {transaction.type === 'inflow' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111827] font-roboto">{transaction.method}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111827] font-roboto">{transaction.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LedgerDetail;

