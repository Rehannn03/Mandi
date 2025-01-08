import React, { useState, useEffect } from 'react';
import axios from 'axios';

const getTodayDate = () => new Date().toISOString().split('T')[0];

const NewLedger = () => {
  const [transactions, setTransactions] = useState([]);
  const [ledgerSummary, setLedgerSummary] = useState({
    totalInflow: 0,
    totalOutflow: 0,
    balance: 0,
  });
  const [formData, setFormData] = useState({
    date: getTodayDate(),
    type: 'inflow',
    relatedTo: 'Dukaandar',
    partyId: '',
    amount: '',
    method: 'cash',
    notes: '',
    dateOfDukaandar: '',
    dateOfBepari: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/transactions');
      setTransactions(response.data.data.ledger.transactions);
      setLedgerSummary({
        totalInflow: response.data.data.ledger.totalInflow,
        totalOutflow: response.data.data.ledger.totalOutflow,
        balance: response.data.data.ledger.balance,
      });
    } catch (err) {
      setError('Failed to fetch transactions');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = formData.type === 'inflow' ? '/api/inflow' : '/api/outflow';
      const submissionData = {
        ...formData,
        date: getTodayDate(),
      };
      const response = await axios.post(endpoint, submissionData);
      const newTransaction = response.data.data.ledger.transactions[response.data.data.ledger.transactions.length - 1];
      setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
      setLedgerSummary({
        totalInflow: response.data.data.ledger.totalInflow,
        totalOutflow: response.data.data.ledger.totalOutflow,
        balance: response.data.data.ledger.balance,
      });
      setFormData({
        date: getTodayDate(),
        type: 'inflow',
        relatedTo: 'Dukaandar',
        partyId: '',
        amount: '',
        method: 'cash',
        notes: '',
        dateOfDukaandar: '',
        dateOfBepari: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6 font-inter">Ledger</h2>

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              readOnly
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md bg-gray-100 cursor-not-allowed font-roboto"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
            >
              <option value="inflow">Inflow (Money Taken)</option>
              <option value="outflow">Outflow (Money Given)</option>
            </select>
          </div>
          <div>
            <label htmlFor="relatedTo" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
              Related To
            </label>
            <select
              id="relatedTo"
              name="relatedTo"
              value={formData.relatedTo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
              required
            >
              <option value="Dukaandar">Dukaandar</option>
              <option value="Bepari">Bepari</option>
              <option value="Gawali">Gawali</option>
              <option value="Bhada">Bhada</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>
          <div>
            <label htmlFor="partyId" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
              Party ID
            </label>
            <input
              type="text"
              id="partyId"
              name="partyId"
              value={formData.partyId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
              required
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
              required
            />
          </div>
          <div>
            <label htmlFor="method" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
              Method
            </label>
            <select
              id="method"
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
            >
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
              Notes
            </label>
            <input
              type="text"
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
            />
          </div>
          {formData.type === 'inflow' && formData.relatedTo === 'Dukaandar' && (
            <div>
              <label htmlFor="dateOfDukaandar" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
                Date of Dukaandar
              </label>
              <input
                type="date"
                id="dateOfDukaandar"
                name="dateOfDukaandar"
                value={formData.dateOfDukaandar}
                onChange={handleChange}
                max={getTodayDate()}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
              />
            </div>
          )}
          {formData.type === 'outflow' && formData.relatedTo === 'Bepari' && (
            <div>
              <label htmlFor="dateOfBepari" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
                Date of Bepari
              </label>
              <input
                type="date"
                id="dateOfBepari"
                name="dateOfBepari"
                value={formData.dateOfBepari}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
              />
            </div>
          )}
        </div>
        {error && (
          <p className="text-[#DC2626] text-sm font-roboto mt-2">{error}</p>
        )}
        <button
          type="submit"
          className="mt-4 w-full bg-[#F97316] text-white py-2 px-4 rounded-md hover:bg-[#EA580C] transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg font-inter font-semibold"
        >
          Add Transaction
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 grid grid-cols-3 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[#1E3A8A] mb-2 font-inter">Total Inflow</h3>
            <p className="text-2xl font-bold text-[#16A34A]">${ledgerSummary.totalInflow.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1E3A8A] mb-2 font-inter">Total Outflow</h3>
            <p className="text-2xl font-bold text-[#DC2626]">${ledgerSummary.totalOutflow.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1E3A8A] mb-2 font-inter">Balance</h3>
            <p className={`text-2xl font-bold ${ledgerSummary.balance >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
              ${ledgerSummary.balance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-[#E5E7EB]">
          <thead className="bg-[#F3F4F6]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider font-roboto">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider font-roboto">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider font-roboto">Related To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider font-roboto">Party ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider font-roboto">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider font-roboto">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider font-roboto">Notes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#E5E7EB]">
            {transactions.map((transaction, index) => (
              <tr key={transaction._id} className={index % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111827] font-roboto">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111827] font-roboto">{transaction.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111827] font-roboto">{transaction.relatedTo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111827] font-roboto">{transaction.partyId}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.type === 'inflow' ? 'text-[#16A34A]' : 'text-[#DC2626]'} font-roboto`}>
                  {transaction.type === 'inflow' ? '+' : '-'}${transaction.amount.toLocaleString()}
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

export default NewLedger;

