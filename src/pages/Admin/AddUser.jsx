import React, { useState } from 'react';
import { adminService } from '../../services/api';
const AddUser = () => {
  const [formData, setFormData] = useState({
    role: 'Admin',
    name: '',
    email: '',
    password: '',
    shopName: '',
    address: '',
    contact: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Perform validation
    if (!formData.name || !formData.role) {
      setError('Name and Role are required fields');
      return;
    }
    if (formData.role === 'Admin' && (!formData.email || !formData.password)) {
      setError('Email and Password are required for Admin');
      return;
    }
    if (formData.role === 'Dukaandar' && (!formData.shopName || !formData.address || !formData.contact)) {
      setError('Shop Name, Address, and Contact are required for Dukaandar');
      return;
    }
    if (formData.role === 'Bepari' && (!formData.phone || !formData.address)) {
      setError('Phone and Address are required for Bepari');
      return;
    }
    
    try {
      if(formData.role === 'Dukaandar'){
        const response = await adminService.addDukaandar(formData);
        if (response.statusCode === 200) {
          setSuccess('User successfully added');
          // Reset form after successful submission
          setFormData({
            role: 'Admin',
            name: '',
            email: '',
            password: '',
            shopName: '',
            address: '',
            contact: '',
            phone: '',
          });
        } else {
          setError('Failed to add user');
        }
      }
      else if(formData.role === 'Bepari'){
        const response = await adminService.addBepari(formData);
        if (response.statusCode === 200) {
          setSuccess('User successfully added');
          // Reset form after successful submission
          setFormData({
            role: 'Admin',
            name: '',
            email: '',
            password: '',
            shopName: '',
            address: '',
            contact: '',
            phone: '',
          });
        } else {
          setError('Failed to add user');
        }
      }else{
      const response = await adminService.addUser(formData);
      if (response.statusCode === 200) {
        setSuccess('User successfully added');
        // Reset form after successful submission
        setFormData({
          role: 'Admin',
          name: '',
          email: '',
          password: '',
          shopName: '',
          address: '',
          contact: '',
          phone: '',
        });
      } else {
        setError('Failed to add user');
      }
    }
    } catch (error) {
      setError('Failed to add user');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6 font-inter">Add User</h2>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {success && <div className="text-green-500 text-center mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
          >
            <option value="Admin">Admin</option>
            <option value="Dukaandar">Dukaandar</option>
            <option value="Bepari">Bepari</option>
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
            required
          />
        </div>

        {formData.role === 'Admin' && (
          <>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
                required
              />
            </div>
          </>
        )}

        {formData.role === 'Dukaandar' && (
          <>
            <div>
              <label htmlFor="shopName" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
                Shop Name
              </label>
              <input
                type="text"
                id="shopName"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
                required
              />
            </div>
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
                Contact
              </label>
              <input
                type="tel"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
                required
              />
            </div>
          </>
        )}

        {formData.role === 'Bepari' && (
          <>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
                required
              />
            </div>
          </>
        )}

        {error && (
          <p className="text-[#DC2626] text-sm font-roboto">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-[#F97316] text-white py-2 px-4 rounded-md hover:bg-[#EA580C] transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg font-inter font-semibold"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUser;

