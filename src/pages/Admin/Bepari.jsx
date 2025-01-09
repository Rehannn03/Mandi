import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { Link } from 'react-router';
import { Search } from 'lucide-react';

const Bepari = () => {
  const [beparis, setBepari] = useState([]);
  const [filteredBepari, setFilteredBeparis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBeparis();
  }, []);

  useEffect(() => {
    const filtered = beparis.filter(bepari => 
      bepari.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBeparis(filtered);
    setCurrentPage(1);
  }, [searchTerm, beparis]);

  const fetchBeparis = async () => {
    try {
      setLoading(true);
      const response = await adminService.getBepari();
      const sortedDukaandars = response.message.sort((a, b) => a.name.localeCompare(b.name));
      setBepari(sortedDukaandars);
      setFilteredBeparis(sortedDukaandars);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch Dukaandars');
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBepari.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers = Math.ceil(filteredBepari.length / itemsPerPage);
    return (
      <div className="flex justify-center mt-4">
        {Array.from({ length: pageNumbers }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === i + 1 ? 'bg-[#1E3A8A] text-white' : 'bg-[#E5E7EB] text-[#1E3A8A]'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
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
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="flex space-x-2 text-sm font-roboto">
          <li><Link to="/admin" className="text-[#1E3A8A] hover:text-[#2563EB]">Admin</Link></li>
          <li className="text-[#6B7280]">/</li>
          <li className="text-[#111827]" aria-current="page">Beparis</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6 font-inter">Beparis</h1>

      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search Beparis..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 pl-10 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" size={20} />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-[#E5E7EB]">
          <thead className="bg-[#F3F4F6]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider font-roboto">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider font-roboto">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider font-roboto">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider font-roboto">Balance</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#E5E7EB]">
            {currentItems.map((bepari) => (
              <tr key={bepari._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111827] font-roboto">{bepari.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111827] font-roboto">{bepari.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111827] font-roboto">{bepari.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#16A34A] font-roboto">
                  ₹{bepari.balance.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-roboto">
                  <Link
                    to={`/admin/khaatas/bepari/${bepari._id}`}
                    className="text-[#1E3A8A] hover:text-[#2563EB] bg-[#E5E7EB] hover:bg-[#D1D5DB] px-3 py-2 rounded-md transition-colors duration-200"
                  >
                    View Khata
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderPagination()}
    </div>
  );
};

export default Bepari;

