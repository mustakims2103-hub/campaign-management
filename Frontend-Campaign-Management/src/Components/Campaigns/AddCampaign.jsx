import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "../Login/axiosConfig";


const AddCampaign = ({ toggleModal }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    campaignName: "",
    campaignSeries: "",
    assignees: [],
    type: "",
    status: "",
    startDate: "",
    dueDate: "",
    leads: "",
    notes: "",
    assets: "",
    industry: "",
  });

  const [emps, setEmps] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState({});

  // 🔁 Load employee list
  useEffect(() => {
    axios
      .get(`/getAllAss`)
      .then((response) => {
        setEmps(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, []);

  // 🔁 If editing, load existing campaign
  useEffect(() => {
    if (id) {
      axios
        .get(`/getCamp/${id}`)
        .then((response) => {
          const data = response.data;
          setFormData({
            campaignName: data.campaignName || "",
            campaignSeries: data.campaignSeries || "",
            assignees: data.assignees || [],
            type: data.type || "",
            status: data.status || "",
            startDate: data.startDate || "",
            dueDate: data.dueDate || "",
            leads: data.leads || "",
            notes: data.notes || "",
            assets: data.assets || "",
            industry: data.industry || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching campaign data:", error);
        });
    }
  }, [id]);

  const handleAssigneeSelection = (employee) => {
    if (!formData.assignees.some((e) => e.id === employee.id)) {
      setFormData((prevState) => ({
        ...prevState,
        assignees: [...prevState.assignees, employee],
      }));
    }
  };

  const removeAssignee = (employee) => {
    setFormData((prevState) => ({
      ...prevState,
      assignees: prevState.assignees.filter((e) => e.id !== employee.id),
    }));
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
    if (!formData.campaignName) newErrors.campaignName = "Campaign name is required.";
    if (!formData.assignees.length) newErrors.assignees = "At least one assignee is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const finalData = {
      ...formData,
      assignees: formData.assignees.map((a) => ({ id: a.id })),
    };

    if (id) {
      axios
        .put(`/update/${id}`, finalData)
        .then(() => {
          alert("Campaign updated successfully!");
            navigate(`/layout/campaign-details/${id}`);
        })
        .catch((error) => {
          console.error("Error updating campaign:", error);
          alert("Error updating campaign.");
        });
    } else {
      axios
        .post(`/addcamp`, finalData)
        .then(() => {
          alert("Campaign created successfully!");
          navigate("/layout/campaigns");
        })
        .catch((error) => {
          console.error("Error creating campaign:", error);
          alert("Error creating campaign.");
        });
    }
  };

  const filteredEmps = emps.filter((emp) =>
    emp.assigneeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full inset-0 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {id ? "Edit Campaign" : "Add Campaign"}
        </h2>
        <form onSubmit={handleSubmit}>
            {/* Campaign Name */}
            <div className="mb-4">
              <label
                htmlFor="campaignName"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Campaign Name
              </label>
              <input
                id="campaignName"
                name="campaignName"
                type="text"
                value={formData.campaignName}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                  errors.campaignName
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {errors.campaignName && (
                <p className="text-red-500 text-xs mt-1">{errors.campaignName}</p>
              )}
            </div>

            {/* Campaign Series */}
            <div className="mb-4">
              <label
                htmlFor="campaignSeries"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Campaign Series
              </label>
              <input
                id="campaignSeries"
                name="campaignSeries"
                type="text"
                value={formData.campaignSeries}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                  errors.campaignSeries
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {errors.campaignSeries && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.campaignSeries}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="campaignType"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Campaign Type
              </label>
              <input
                id="type"
                name="type"
                type="text"
                value={formData.type}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                  errors.type
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {errors.type && (
                <p className="text-red-500 text-xs mt-1">{errors.type}</p>
              )}
            </div>

             {/* Assignees */}
         <div className="mb-4">
            <label htmlFor="assignees" className="block text-sm font-medium mb-1 text-gray-700">
              Assignees
            </label>
            <div className="border rounded px-3 py-2">
              <input
                type="text"
                placeholder="Search employees"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full mb-2 border rounded px-3 py-1 focus:outline-none focus:ring focus:ring-blue-200"
              />
              <div className="mb-2 flex flex-wrap gap-2">
                {formData.assignees.map((assignee, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center space-x-2"
                  >
                     <span>{assignee.assigneeName}</span>
                   
                     <span>{assignee.assigneeEmail}</span>
                    <button
                      type="button"
                      onClick={() => removeAssignee(assignee)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="border-t pt-2">
                {filteredEmps.length > 0 ? (
                  filteredEmps.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center space-x-2 mb-1"
                    >
                      <input
                        type="checkbox"
                        id={`employee-${employee.id}`}
                        checked={formData.assignees.some((e) => e.id === employee.id)}
                        onChange={() => handleAssigneeSelection(employee)}
                        className="cursor-pointer"
                      />
                      <label
                        htmlFor={`employee-${employee.id}`}
                        className="text-gray-800 cursor-pointer"
                      >
                        {employee.assigneeName}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No employees available to select.</p>
                )}
              </div>
            </div>
            {errors.assignees && (
              <p className="text-red-500 text-xs mt-1">{errors.assignees}</p>
            )}
          </div>




            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                  errors.status
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              >
                <option value="">Select Status</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Stopped">Stopped</option>
                <option value="On Hold">On Hold</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-xs mt-1">{errors.status}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                  errors.startDate
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Due Date
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                  errors.dueDate
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="leads"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Leads
              </label>
              <textarea
                id="leads"
                name="leads"
                value={formData.leads}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                  errors.leads
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              ></textarea>
              {errors.leads && (
                <p className="text-red-500 text-xs mt-1">{errors.leads}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="notes"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                  errors.notes
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              ></textarea>
              {errors.notes && (
                <p className="text-red-500 text-xs mt-1">{errors.notes}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="assets"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Assets
              </label>
              <textarea
                id="assets"
                name="assets"
                value={formData.assets}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                  errors.assets
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              ></textarea>
              {errors.assets && (
                <p className="text-red-500 text-xs mt-1">{errors.assets}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="industry"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Industry
              </label>
              <textarea
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                  errors.industry
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              ></textarea>
              {errors.industry && (
                <p className="text-red-500 text-xs mt-1">{errors.industry}</p>
              )}
            </div>

            {/* Buttons */}
        <div className="flex justify-end space-x-4">
  <button
    type="button"
    onClick={toggleModal}
    className="px-5 py-2.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200"
  >
    Cancel
  </button>
  <button
    type="submit"
    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
  >
    {id ? "Update Campaign" : "Create Campaign"}
  </button>
</div>
          </form>
        </div>
      </div>
    );
  };

  export default AddCampaign;
