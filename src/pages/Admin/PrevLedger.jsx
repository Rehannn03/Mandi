import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { adminService } from '../../services/api';



const PreviousLedgers = () => {
  const [ledgerDates, setLedgerDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('year');
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    fetchLedgerDates();
  }, []);

  const fetchLedgerDates = async () => {
    try {
      setLoading(true);
      const response = await adminService.prevLedger();
      const dates = response.data.dates;
      const organizedDates = organizeDates(dates);
      setLedgerDates(organizedDates);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch ledger dates');
      setLoading(false);
    }
  };

  const organizeDates = (dates) => {
    return dates.reduce((acc, dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth();
      if (!acc[year]) acc[year] = {};
      if (!acc[year][month]) acc[year][month] = [];
      acc[year][month].push(date);
      return acc;
    }, {});
  };

  const renderYearList = () => {
    return Object.keys(ledgerDates).sort((a, b) => b - a).map(year => (
      <button
        key={year}
        onClick={() => {
          setSelectedYear(year);
          setCurrentView('month');
        }}
        className="block w-full text-left px-4 py-2 hover:bg-[#F3F4F6] transition duration-150 ease-in-out"
      >
        {year}
      </button>
    ));
  };

  const renderMonthList = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return Object.keys(ledgerDates[selectedYear]).sort((a, b) => b - a).map(month => (
      <button
        key={month}
        onClick={() => {
          setSelectedMonth(month);
          setCurrentView('date');
        }}
        className="block w-full text-left px-4 py-2 hover:bg-[#F3F4F6] transition duration-150 ease-in-out"
      >
        {months[month]}
      </button>
    ));
  };

  const renderDateList = () => {
    return ledgerDates[selectedYear][selectedMonth].sort((a, b) => b - a).map(date => (
      <Link
        key={date.toISOString()}
        to={`/admin/ledger/${date.toISOString().split('T')[0]}`}
        className="block w-full text-left px-4 py-2 hover:bg-[#F3F4F6] transition duration-150 ease-in-out"
      >
        {date.toLocaleDateString()}
      </Link>
    ));
  };

  const renderBreadcrumb = () => {
    return (
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="flex space-x-2 text-sm font-roboto">
          <li><Link to="/admin" className="text-[#1E3A8A] hover:text-[#2563EB]">Admin</Link></li>
          <li className="text-[#6B7280]">/</li>
          <li><Link to="/admin/prevLedger" className="text-[#1E3A8A] hover:text-[#2563EB]">Previous Ledgers</Link></li>
          {selectedYear && (
            <>
              <li className="text-[#6B7280]">/</li>
              <li>
                <button onClick={() => setCurrentView('year')} className="text-[#1E3A8A] hover:text-[#2563EB]">
                  {selectedYear}
                </button>
              </li>
            </>
          )}
          {selectedMonth !== null && (
            <>
              <li className="text-[#6B7280]">/</li>
              <li>
                <button onClick={() => setCurrentView('month')} className="text-[#1E3A8A] hover:text-[#2563EB]">
                  {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' })}
                </button>
              </li>
            </>
          )}
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
    <div className="max-w-4xl mx-auto p-6 bg-[#F9FAFB]">
      {renderBreadcrumb()}
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6 font-inter">Previous Ledgers</h1>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {currentView === 'year' && renderYearList()}
        {currentView === 'month' && renderMonthList()}
        {currentView === 'date' && renderDateList()}
      </div>
    </div>
  );
};

export default PreviousLedgers;