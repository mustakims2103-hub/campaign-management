import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "../Login/axiosConfig";

const AddUserLogin = ({ toggleModal }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    empName: "",
    roles: "user", // Default value set to "user"
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // React Router's useNavigate hook

  const handleServerPostReq = (data) => {
    axios
      .post(`/AddUserLogin`, data) // Use the custom axios instance
      .then(() => {
        alert("User login details have been added!");
        navigate("/layout/campaigns"); // Redirect to campaigns page
      })
      .catch((error) => {
        if (error.response) {
          console.error("Server responded with error:", error.response.data);
          alert("Error adding the user. Please try again.");
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

    // Validate Username
    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    }

    // Validate Password
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    // Validate Employee Name
    if (!formData.empName.trim()) {
      newErrors.empName = "Employee name is required.";
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
    <div className="w-full inset-0 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add User Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Email Id
            </label>
            <input
              id="username"
              name="username"
              type="email"
              value={formData.username}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                errors.username
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                errors.password
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Employee Name */}
          <div className="mb-4">
            <label
              htmlFor="empName"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Employee Name
            </label>
            <input
              id="empName"
              name="empName"
              type="text"
              value={formData.empName}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                errors.empName
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {errors.empName && (
              <p className="text-red-500 text-xs mt-1">{errors.empName}</p>
            )}
          </div>

          {/* Roles */}
          <div className="mb-4">
            <label
              htmlFor="roles"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Roles
            </label>
            <select
              id="roles"
              name="roles"
              value={formData.roles}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={toggleModal}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserLogin;
