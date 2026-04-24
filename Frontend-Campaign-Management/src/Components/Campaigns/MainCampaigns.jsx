import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "../Login/axiosConfig";
import FilterModal from "./FilterModal";

function MainCampaigns() {
  const navigate = useNavigate();
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20;
  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail")?.toLowerCase();
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(`/getallcamp?page=0&size=10000`);
        const all = response.data.content;

        let filtered = all;

   

  if (userRole !== "ROLE_admin" && userEmail) {
  
  filtered = all.filter((campaign) =>
    Array.isArray(campaign.assignees) &&
    campaign.assignees.some(
      (assignee) =>
        assignee?.assigneeEmail?.toLowerCase().trim() === userEmail.trim()
    )
  );
}

        setAllCampaigns(filtered);
        setFilteredCampaigns(filtered);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Failed to load campaigns. Please try again.");
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const totalPages = Math.ceil(filteredCampaigns.length / pageSize);
  const currentData = filteredCampaigns.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const handleAddCampaignClick = () => navigate("/layout/add-campaign");
  const handlePrevious = () => currentPage > 0 && setCurrentPage((prev) => prev - 1);
  const handleNext = () => currentPage < totalPages - 1 && setCurrentPage((prev) => prev + 1);
  const handlePageClick = (page) => setCurrentPage(page);

  const handleApplyFilters = (filters) => {
    const { searchText, client, status, user, type, date } = filters;

    const filtered = allCampaigns.filter((c) => {
      const matchesSearchText =
        !searchText ||
        c.campaignName?.toLowerCase().includes(searchText.toLowerCase()) ||
        c.client?.toLowerCase().includes(searchText.toLowerCase());

      const matchesClient = !client || c.client === client;
      const matchesStatus = !status || c.status === status;
      const matchesType = !type || c.type === type;
      const matchesDate =
        !date || new Date(c.dueDate).toISOString().split("T")[0] === date;

      const matchesUser =
        !user ||
        (Array.isArray(c.assignees) &&
          c.assignees.some(
            (a) => a.assigneeName?.toLowerCase() === user.toLowerCase()
          ));

      return (
        matchesSearchText &&
        matchesClient &&
        matchesStatus &&
        matchesUser &&
        matchesType &&
        matchesDate
      );
    });

    setFilteredCampaigns(filtered);
    setCurrentPage(0);
    setShowFilterModal(false);
  };

  if (loading) return <div className="text-center py-4">Loading campaigns...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-2 bg-white shadow-md rounded-md">
        <div className="forButton mb-4 flex items-center space-x-4">
          <button className="flex items-center bg-white hover:bg-gray-100 text-gray-500 text-xs font-semibold py-2 px-3 border border-gray-400 rounded shadow">
            <img
              src="https://img.icons8.com/?size=100&id=k1lpkSJU9tmI&format=png&color=000000"
              alt="Export Icon"
              className="h-4 w-4 mr-2"
            />
            EXPORT
          </button>

          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center bg-gray-800 hover:bg-gray-700 text-white text-xs py-2 px-4 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4 mr-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M4 9h16M5 14h14M6 19h12" />
            </svg>
            FILTER
          </button>

          {userRole === "ROLE_admin" && (
            <button
              onClick={handleAddCampaignClick}
              className="flex items-center ml-auto bg-gray-800 hover:bg-gray-700 text-white text-xs py-2 px-4 rounded"
            >
              <span className="">+</span> ADD CAMPAIGN
            </button>
          )}
        </div>

        {/* CAMPAIGN TABLE CODE REMAINS THE SAME — OMITTED HERE TO KEEP IT SHORT */}
   <div className="campData overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left font-xs text-gray-800">
                <th className="border border-gray-300 px-2 py-2">Name</th>
                <th className="border border-gray-300 px-2 py-2">Type</th>
                <th className="border border-gray-300 px-2 py-2">Leads</th>
                <th className="border border-gray-300 px-2 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Assignee</th>
                <th className="border border-gray-300 px-2 py-2">Created At</th>
                <th className="border border-gray-300 px-2 py-2">End Date</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No campaigns found.
                  </td>
                </tr>
              ) : (
                currentData.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="border border-gray-300 text-left px-2 py-2">
                      <a
                        href={`/layout/campaign-details/${campaign.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {campaign.campaignName} <br />
                      </a>
                      {campaign.campaignSeries}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">{campaign.type}</td>
                    <td className="border border-gray-300 px-2 py-2">{campaign.leads}</td>
                    <td className="border border-gray-300 px-2 py-2">
                      <div className="flex items-center justify-center">
                        <button
                          className={`flex items-center justify-center bg-white font-medium border rounded-full shadow ${
                            campaign.status === "In Progress"
                              ? "border-blue-400 text-blue-400"
                              : campaign.status === "Completed"
                              ? "border-green-400 text-green-400"
                              : campaign.status === "Stopped"
                              ? "border-red-400 text-red-400"
                              : campaign.status === "On Hold"
                              ? "border-yellow-400 text-yellow-400"
                              : "border-gray-400 text-gray-400"
                          }`}
                          style={{ fontSize: "14px", width: "110px", height: "30px" }}
                        >
                          <span
                            className={`mr-1 mb-1 ${
                              campaign.status === "In Progress"
                                ? "text-blue-400"
                                : campaign.status === "Completed"
                                ? "text-green-400"
                                : campaign.status === "Stopped"
                                ? "text-red-400"
                                : campaign.status === "On Hold"
                                ? "text-yellow-400"
                                : "text-gray-400"
                            }`}
                            style={{ fontSize: "18px" }}
                          >
                            ●
                          </span>
                          {campaign.status}
                        </button>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <div className="grid grid-cols-3 gap-2">
                        {campaign.assignees?.map((assignee, index) => (
                          <div key={index} className="relative group flex flex-col items-center">
                            <div className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-gray-800 text-gray-800 text-xs font-bold">
                              {assignee.assigneeName.charAt(0).toUpperCase()}
                            </div>
                            <span className="absolute top-10 hidden group-hover:block bg-gray-800 text-white text-xs font-semibold py-1 px-2 rounded shadow">
                              {assignee.assigneeName}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(campaign.createdAt).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(campaign.dueDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>


        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={handleApplyFilters}
        />

        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(index)}
              className={`px-3 py-1 text-sm rounded ${
                currentPage === index ? "bg-gray-800 text-white" : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainCampaigns;
