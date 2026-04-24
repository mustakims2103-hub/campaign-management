import React, { useState, useEffect } from "react";
import axios from "../Login/axiosConfig";

const FilterModal = ({ isOpen, onClose, onApply }) => {
  const [filters, setFilters] = useState({
    searchText: "",
    client: "",
    status: "",
    user: "",
    type: "",
    date: "",
  });

  const [options, setOptions] = useState({
    users: [],
    clients: [],
    statuses: [],
    types: [],
  });

  const fetchDropdownOptions = async () => {
    try {
      const [usersRes, statusRes, typeRes] = await Promise.all([
        axios.get("/getAllAss"),
        axios.get("/getallstatus"),
        axios.get("/getalltypes"),
      ]);

      setOptions({
        users: usersRes.data,
        clients: [], // Add logic if needed
        statuses: statusRes.data,
        types: typeRes.data,
      });
    } catch (err) {
      console.error("Error fetching filter options:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDropdownOptions();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters = {
      searchText: "",
      client: "",
      status: "",
      user: "",
      type: "",
      date: "",
    };
    setFilters(emptyFilters);
    onApply(emptyFilters);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop with blur */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur- transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar Modal */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 bg-gray-50">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Filter Campaigns
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 text-2xl"
              aria-label="Close filter"
            >
              &times;
            </button>
          </div>

          {/* Filter Form */}
          <div className="space-y-4 flex-grow overflow-y-auto pr-1 custom-scroll">
            {/* Search Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                name="searchText"
                value={filters.searchText}
                onChange={handleInputChange}
                placeholder="Search Campaign"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>

            {/* Client */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client
              </label>
              <select
                name="client"
                value={filters.client}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring focus:border-blue-500"
              >
                <option value="">Select client</option>
                {options.clients.map((client) => (
                  <option key={client.id} value={client.name}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring focus:border-blue-500"
              >
                <option value="">Select status</option>
                {options.statuses.map((status, idx) => (
                  <option key={idx} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              <select
                name="user"
                value={filters.user}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring focus:border-blue-500"
              >
                <option value="">Select user</option>
                {options.users.map((user) => (
                  <option key={user.id} value={user.assigneeName}>
                    {user.assigneeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring focus:border-blue-500"
              >
                <option value="">Select type</option>
                {options.types.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end space-x-3 border-t pt-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
