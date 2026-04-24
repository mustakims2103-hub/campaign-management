import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "../Login/axiosConfig";

const ProfileInfo = ({ toggleModal }) => {
  const [formData, setFormData] = useState({
    assigneeName: "",
    assigneeEmail: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // React Router's useNavigate hook

  const handleServerPostReq = (data) => {
    axios
      .post(`/addAssignee`, data) // Use the custom axios instance
      .then(() => {
        alert("Assignee has been added!");
        navigate("/layout/campaigns"); // Redirect to MainCampaigns
      })
      .catch((error) => {
        if (error.response) {
          console.error("Server responded with error:", error.response.data);
          alert("Error adding the assignee. Please try again.");
        } else {
          console.error("Error sending request:", error.message);
          alert("Network error. Please check your connection and try again.");
        }
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate Assignee Name
    if (!formData.assigneeName.trim()) {
      newErrors.assigneeName = "Assignee name is required.";
    }

    // Validate Assignee Email
    if (!formData.assigneeEmail.trim()) {
      newErrors.assigneeEmail = "Assignee email is required.";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
        formData.assigneeEmail
      )
    ) {
      newErrors.assigneeEmail = "Enter a valid email address.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      handleServerPostReq(formData);
    }
  };

  return (
    <>
    <div className="w-full flex p-4">
      <div className="">
        <h1 className="text-xl font-bold">Profile Information</h1>
        <p>Update your account's profile information and email address.</p>
      </div>
      <div className="w-full inset-0 flex items-center justify-center">
        <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-md">
          {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Assignee</h2> */}
          <form onSubmit={handleSubmit}>
            {/* Assignee Name */}
            <div className="mb-4">
              <label
                htmlFor="assigneeName"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Name
              </label>
              <input
                id="assigneeName"
                name="assigneeName"
                type="text"
                value={formData.assigneeName}
                onChange={handleChange}
                className={`w-sm border rounded px-3 py-2 focus:outline-none focus:ring ${
                  errors.assigneeName
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {errors.assigneeName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.assigneeName}
                </p>
              )}
            </div>

            {/* Assignee Email */}
            <div className="mb-4">
              <label
                htmlFor="assigneeEmail"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Email
              </label>
              <input
                id="assigneeEmail"
                name="assigneeEmail"
                type="text"
                value={formData.assigneeEmail}
                onChange={handleChange}
                className={`w-sm border rounded px-3 py-2 focus:outline-none focus:ring ${
                  errors.assigneeEmail
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {errors.assigneeEmail && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.assigneeEmail}
                </p>
              )}
            </div>

            {/* Assignee Email */}
            <div className="mb-4">
              <label
                htmlFor="assigneeEmail"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Timezone
              </label>
              <input
                id="assigneeEmail"
                name="assigneeEmail"
                type="text"
                value={formData.assigneeEmail}
                onChange={handleChange}
                className={`w-sm border rounded px-3 py-2 focus:outline-none focus:ring ${
                  errors.assigneeEmail
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {errors.assigneeEmail && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.assigneeEmail}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>

    <div>
      <hr/>
    </div>

     <div className="w-full flex p-4">
      <div className="">
        <h1 className="text-xl font-bold">Update Password</h1>
        <p>Ensure your account is using a long, random password to stay secure.</p>
      </div>
      <div className="w-full inset-0 flex items-center justify-center">
        <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-md">
          {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Assignee</h2> */}
          <form onSubmit={handleSubmit}>
            {/* Assignee Name */}
            <div className="mb-4">
              <label
                htmlFor="assigneeName"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Current Password
              </label>
              <input
                id="assigneeName"
                name="assigneeName"
                type="text"
                value={formData.assigneeName}
                onChange={handleChange}
                className={`w-sm border rounded px-3 py-2 focus:outline-none focus:ring ${
                  errors.assigneeName
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {errors.assigneeName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.assigneeName}
                </p>
              )}
            </div>

            {/* Assignee Email */}
            <div className="mb-4">
              <label
                htmlFor="assigneeEmail"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
               New Password
              </label>
              <input
                id="assigneeEmail"
                name="assigneeEmail"
                type="text"
                value={formData.assigneeEmail}
                onChange={handleChange}
                className={`w-sm border rounded px-3 py-2 focus:outline-none focus:ring ${
                  errors.assigneeEmail
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {errors.assigneeEmail && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.assigneeEmail}
                </p>
              )}
            </div>

            {/* Assignee Email */}
            <div className="mb-4">
              <label
                htmlFor="assigneeEmail"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="assigneeEmail"
                name="assigneeEmail"
                type="text"
                value={formData.assigneeEmail}
                onChange={handleChange}
                className={`w-sm border rounded px-3 py-2 focus:outline-none focus:ring ${
                  errors.assigneeEmail
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {errors.assigneeEmail && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.assigneeEmail}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
  );
};

export default ProfileInfo;
