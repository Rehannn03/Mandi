import React, { useState, useEffect } from "react";
import { adminService } from "../../services/api";
import { Link } from "react-router";
import { Search } from "lucide-react";

const Dukaandar = () => {
  const [dukaandars, setDukaandars] = useState([]);
  const [filteredDukaandars, setFilteredDukaandars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDukaandars();
  }, []);

  useEffect(() => {
    const filtered = dukaandars.filter(
      (dukaandar) =>
        dukaandar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dukaandar.shopName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDukaandars(filtered);
    setCurrentPage(1);
  }, [searchTerm, dukaandars]);

  const fetchDukaandars = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDukaandar();
      const sortedDukaandars = response.message.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setDukaandars(sortedDukaandars);
      setFilteredDukaandars(sortedDukaandars);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch Dukaandars");
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDukaandars.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers = Math.ceil(filteredDukaandars.length / itemsPerPage);
    return (
      <div className="flex justify-center mt-4">
        {Array.from({ length: pageNumbers }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-[#1E3A8A] text-white"
                : "bg-[#E5E7EB] text-[#1E3A8A]"
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
    <div className="max-w-7xl mx-auto p-8 bg-gradient-to-b from-[#F9FAFB] to-white min-h-screen">
      {/* Enhanced Breadcrumb with better spacing and transitions */}
      <nav aria-label="breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-3 text-sm font-roboto">
          <li>
            <Link
              to="/admin"
              className="text-[#1E3A8A] hover:text-[#2563EB] transition-colors duration-200 flex items-center"
            >
              <span className="hover:underline">Admin</span>
            </Link>
          </li>
          <li className="text-[#6B7280]">/</li>
          <li className="text-[#111827] font-medium" aria-current="page">
            Dukaandars
          </li>
        </ol>
      </nav>

      {/* Enhanced Header with subtle animation */}
      <h1 className="text-4xl font-bold text-[#1E3A8A] mb-8 font-inter animate-fade-in">
        Dukaandars Directory
      </h1>

      {/* Enhanced Search with better visual feedback */}
      <div className="mb-8 relative group">
        <input
          type="text"
          placeholder="Search by name or shop name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-3 pl-12 border-2 border-[#E5E7EB] rounded-lg
                   focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20
                   transition-all duration-300 font-roboto text-lg"
        />
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280]
                          group-hover:text-[#1E3A8A] transition-colors duration-200"
          size={22}
        />
      </div>

      {/* Enhanced Table Container */}
      <div
        className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#E5E7EB]
                    transform transition-all duration-300 hover:shadow-xl"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E5E7EB]">
            <thead className="bg-[#F8FAFC]">
              <tr>
                {[
                  "Name",
                  "Shop Name",
                  "Address",
                  "Contact",
                  "Balance",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-xs font-semibold text-[#1E3A8A] 
                                            uppercase tracking-wider font-roboto"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E5E7EB]">
              {currentItems.map((dukaandar) => (
                <tr
                  key={dukaandar._id}
                  className="hover:bg-[#F8FAFC] transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827] font-roboto">
                    {dukaandar.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563] font-roboto">
                    {dukaandar.shopName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563] font-roboto">
                    {dukaandar.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563] font-roboto">
                    {dukaandar.contact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#16A34A] font-roboto">
                    ₹{dukaandar.balance.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-roboto">
                    <Link
                      to={`/admin/khaatas/dukaandar/${dukaandar._id}`}
                      className="inline-flex items-center px-4 py-2 bg-[#1E3A8A] text-white rounded-lg
                               hover:bg-[#2563EB] transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      View Khata
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      <div className="mt-8">{renderPagination()}</div>
    </div>
  );
};

export default Dukaandar;
