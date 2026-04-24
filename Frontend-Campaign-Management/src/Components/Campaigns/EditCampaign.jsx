import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "../Login/axiosConfig";

const EditCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    campaignName: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
    status: "",
  });

  // Fetch campaign data if editing
  useEffect(() => {
    if (id) {
      axios
        .get(`/getCamp/${id}`)
        .then((response) => {
          const data = response.data;
          setFormData({
            campaignName: data.campaignName,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            budget: data.budget,
            status: data.status,
          });
        })
        .catch((error) => {
          console.error("Error fetching campaign data:", error);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (id) {
      // Update existing campaign
      axios
        .put(`/update/${id}`, formData)
        .then(() => {
          alert("Campaign updated successfully!");
          navigate(`/layout/campaign-details/${id}`);
        })
        .catch((error) => {
          console.error("Error updating campaign:", error);
        });
    } else {
      // Create new campaign
      axios
        .post("/api/campaigns", formData)
        .then(() => {
          alert("Campaign created successfully!");
          navigate("/campaigns");
        })
        .catch((error) => {
          console.error("Error creating campaign:", error);
        });
    }
  };

  return (
    <div>
      <h2>{id}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="campaignName"
          placeholder="Campaign Name"
          value={formData.campaignName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />
        <input
          type="number"
          name="budget"
          placeholder="Budget"
          value={formData.budget}
          onChange={handleChange}
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="">Select Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <button type="submit">{id ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default EditCampaign;
