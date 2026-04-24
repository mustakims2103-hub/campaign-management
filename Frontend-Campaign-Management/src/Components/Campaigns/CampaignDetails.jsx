import React, { useState, useEffect  } from "react";

import { useParams, useNavigate } from "react-router";
import { useRef } from "react";
import axios from "../Login/axiosConfig";
import UploadModal from "./UploadModal";
import CampaignDetailsNavlink from "./CampaignDetailsNavlink";

function CampaignDetails() {
  const { id } = useParams();
 const [campaign, setCampaign] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [files, setFiles] = useState([]);
  const userRole = localStorage.getItem("userRole");
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const fileInputRef = useRef(null); // for hidden input
  const [userFiles, setUserFiles] = useState([]);

  const navigate = useNavigate();

  const removeFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  useEffect(() => {
    axios
      .get(`/getCamp/${id}`)
      .then((response) => setCampaign(response.data))
      .catch((error) =>
        console.error("Error fetching campaign details:", error)
      );

    axios
      .get(`/files/${id}`)
      .then((res) => setFiles(res.data))
      .catch((err) => console.error("Error fetching files:", err));

    axios
      .get(`/files/user/${id}`)
      .then((res) => setUserFiles(res.data))
      .catch((err) => console.error("Error fetching user files:", err));
  }, [id]);

const updateStatus = async (newStatus) => {
  try {
    const token = localStorage.getItem("token");

    await axios.patch(
      `/status/${id}`,
      { status: newStatus },   // matches UpdateStatusDto
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Update UI state
    setCampaign((prev) => ({
      ...prev,
      status: newStatus,
    }));

    setIsDropdownOpen(false);
    alert(`Status changed to: ${newStatus}`);

  } catch (error) {
    console.error("Error updating status:", error.response || error);
    alert("Failed to update status");
  }
};

  // const updateStatus = (newStatus) => {
  //   axios
  //     .patch(`/status/${id}`, { status: newStatus })
  //     .then(() => {
  //        setCampaigns((prevCampaigns) =>
  //       prevCampaigns.map((camp) =>
  //         camp.id === id ? { ...camp, status: newStatus } : camp
  //       )
  //     );

  //     setCampaign((prev) => ({ ...prev, status: newStatus }));
  //     setIsDropdownOpen(false);
  //       window.alert(`Status has been changed to: ${newStatus}`);
  //     })
  //     .catch((error) => console.error("Error updating status:", error));
  // };

  const handleEdit = () => navigate(`/layout/add-campaign/${id}`);

  const handleDeleteCampaign = () => {
  if (!window.confirm("Are you sure you want to delete this campaign?")) return;

  axios
    .delete(`/campaigns/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // if you use JWT auth
      },
    })
    .then(() => {
      alert("Campaign deleted successfully");
      navigate(`/layout/campaigns`);
    })
    .catch((error) => {
      console.error("Error deleting campaign:", error.response || error);
      alert("Failed to delete the campaign.");
    });
};


  const formatMultilineData = (data) => {
    if (!data) return null;
    return data.split(/\n+/).map((line, index) => (
      <p key={index} className="mb-2">
        {line.trim()}
      </p>
    ));
  };

  const handleDownload = (filename) => {
    axios
      .get(`/download/${id}/${filename}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Send the token
        },
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error("Download failed:", err);
        alert("Failed to download the file.");
      });
  };

  const handleUploadClick = () => {
    setShowUploadPopup(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter((file) => file.size > 0);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.size > 0
    );
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleDelete = (filename) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"?`))
      return;

    axios
      .delete(`/delete/${id}/${filename}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        alert("File deleted successfully");
        // Remove the file from local state
        setFiles((prev) => prev.filter((file) => file !== filename));
        setUserFiles((prev) => prev.filter((f) => f !== filename));
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
        alert("Failed to delete the file.");
      });
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      console.warn("No files selected");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      if (file && file.size > 0) {
        formData.append("files", file);
      }
    });

    const uploadUrl =
      userRole === "ROLE_admin" ? `/upload/${id}` : `/upload/user/${id}`;
    const fetchUrl =
      userRole === "ROLE_admin" ? `/files/${id}` : `/files/user/${id}`;

    axios
      .post(uploadUrl, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        alert("Files uploaded successfully");
        setSelectedFiles([]);
        setShowUploadPopup(false);
        return axios.get(fetchUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      })
      .then((res) => {
        userRole === "ROLE_admin" ? setFiles(res.data) : setUserFiles(res.data);
      })
      .catch((err) => {
        console.error("Upload failed:", err);
      });
  };

  if (!campaign) return <div>Loading...</div>;

  return (
    <>
    
    <CampaignDetailsNavlink/>

      <div className="bg-gray-100 min-h-auto mb-5">
        <div className="container mx-auto p-4 bg-white shadow-md rounded-md">
          <div className="flex items-center justify-between">
           <div>
  <h1 className="text-1xl font-bold">{campaign.campaignName}</h1>
  <p>{campaign.campaignSeries}</p>

  {userRole === "ROLE_admin" && (
    <div className="my-2 flex gap-2">
      <button
        onClick={handleEdit}
        className="bg-gray-800 hover:bg-gray-700 text-white text-xs py-2 px-4 rounded"
      >
        EDIT CAMPAIGN
      </button>
      <button
      onClick={handleDeleteCampaign}
        className="bg-red-800 hover:bg-red-700 text-white text-xs py-2 px-4 rounded"
      >
        DELETE CAMPAIGN
      </button>
    </div>
  )}
</div>

            <div className="relative flex items-center justify-center">
              <button
                onClick={() =>
                  userRole === "ROLE_admin" &&
                  setIsDropdownOpen(!isDropdownOpen)
                }
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
                disabled={userRole !== "ROLE_admin"}
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

              {isDropdownOpen && userRole === "ROLE_admin" && (
                <div className="absolute top-full mt-2 w-40 bg-white border rounded shadow-lg z-10">
                  {["In Progress", "Completed", "On Hold", "Stopped"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(status)}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          <hr className="my-4 border-gray-300" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="font-small text-gray-500">Start Date</p>
              <p>{new Date(campaign.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-small text-gray-500">Due Date</p>
              <p>{new Date(campaign.dueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Created At</p>
              <p>{new Date(campaign.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 mt-5 sm:grid-cols-3 gap-4">
            <div>
              <p className="font-medium text-gray-500">Leads</p>
              <p>{campaign.leads}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Assignees</p>
              <div className="flex flex-wrap gap-2">
                {campaign.assignees?.map((assignee, index) => (
                  <div
                    key={index}
                    className="relative group flex flex-col items-center"
                  >
                    <div
                      className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-gray-800 text-gray-800 text-xs font-bold"
                      style={{ minWidth: "30px", minHeight: "30px" }}
                    >
                      {assignee.assigneeName.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute top-10 hidden group-hover:block bg-gray-800 text-white text-xs font-semibold py-1 px-2 rounded shadow">
                      {assignee.assigneeName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 mt-5 sm:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-500">Notes</p>
              <div>{formatMultilineData(campaign.notes)}</div>
            </div>
            <div>
              <p className="font-medium text-gray-500">Assets</p>
              <div>{formatMultilineData(campaign.assets)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 mt-5 sm:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-500">Industry</p>
              <div>{formatMultilineData(campaign.industry)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN FILES SECTION */}
      <div className="bg-gray-100 min-h-auto mb-5">
        <div className="container mx-auto p-4 bg-white shadow-md rounded-md">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-1xl font-bold">Files</h1>
            {userRole === "ROLE_admin" && (
              <button
                onClick={handleUploadClick}
                className="flex items-center bg-white hover:bg-gray-100 text-gray-500 text-xs font-semibold py-2 px-3 border border-gray-400 rounded shadow"
              >
                <img
                  src="https://img.icons8.com/?size=100&id=k1lpkSJU9tmI&format=png&color=000000"
                  alt="Upload Icon"
                  className="h-4 w-4 mr-2"
                />
                UPLOAD FILE
              </button>
            )}
          </div>

          <hr className="my-4 border-gray-300" />

          <div className="space-y-3">
            {files.length === 0 ? (
              <p className="text-gray-500">No files uploaded.</p>
            ) : (
              files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between w-full border border-gray-300 rounded-md shadow-sm bg-white p-3 hover:shadow-md"
                >
                  <button
                    onClick={() => handleDownload(file)}
                    className="text-blue-600 font-medium hover:underline truncate text-left"
                    title="Click to download"
                  >
                    {file}
                  </button>

                  {userRole === "ROLE_admin" && (
                    <button
                      onClick={() => handleDelete(file)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <img
                        src="https://img.icons8.com/ios-glyphs/30/fa314a/trash.png"
                        alt="Delete"
                        className="w-4 h-4"
                      />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <UploadModal
          isOpen={showUploadPopup}
          onClose={() => setShowUploadPopup(false)}
          onUpload={handleUpload}
          handleFileChange={handleFileChange}
          handleDrop={handleDrop}
          selectedFiles={selectedFiles}
          removeFile={removeFile}
        />
      </div>

      {/* USER FILES SECTION */}
      <div className="bg-gray-100 min-h-auto mb-5">
        <div className="container mx-auto p-4 bg-white shadow-md rounded-md">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-1xl font-bold">Manual Uploads</h1>
            {userRole !== "ROLE_admin" && (
              <button
                onClick={handleUploadClick}
                className="flex items-center bg-white hover:bg-gray-100 text-gray-500 text-xs font-semibold py-2 px-3 border border-gray-400 rounded shadow"
              >
                <img
                  src="https://img.icons8.com/?size=100&id=k1lpkSJU9tmI&format=png&color=000000"
                  alt="Upload Icon"
                  className="h-4 w-4 mr-2"
                />
                UPLOAD FILE
              </button>
            )}
          </div>

          <hr className="my-4 border-gray-300" />

          <div className="space-y-3">
            {userFiles.length === 0 ? (
              <p className="text-gray-500">No user files uploaded.</p>
            ) : (
              userFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between w-full border border-gray-300 rounded-md shadow-sm bg-white p-3 hover:shadow-md"
                >
                  <button
                    onClick={() => handleDownload(file)}
                    className="text-blue-600 font-medium hover:underline truncate text-left"
                    title="Click to download"
                  >
                    {file}
                  </button>

                  {userRole !== "ROLE_admin" && (
                    <button
                      onClick={() => handleDelete(file)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <img
                        src="https://img.icons8.com/ios-glyphs/30/fa314a/trash.png"
                        alt="Delete"
                        className="w-4 h-4"
                      />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <UploadModal
          isOpen={showUploadPopup}
          onClose={() => setShowUploadPopup(false)}
          onUpload={handleUpload}
          handleFileChange={handleFileChange}
          handleDrop={handleDrop}
          selectedFiles={selectedFiles}
          removeFile={removeFile}
        />
      </div>

      {/*CLIENT REJECT */}
      <div className="bg-gray-100 min-h-auto mb-5">
        <div className="container mx-auto p-4 bg-white shadow-md rounded-md">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-1xl font-bold">Client Rejects</h1>
          </div>

          <hr className="my-4 border-gray-300" />

          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left font-xs text-gray-800">
                <th className="border border-gray-300 px-4 py-2"> Leads Count  </th>
                   <th className="border border-gray-300 px-4 py-2">Reason</th>
                <th className="border border-gray-300 px-4 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

          {/*PACES */}
      <div className="bg-gray-100 min-h-auto mb-5">
        <div className="container mx-auto p-4 bg-white shadow-md rounded-md">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-1xl font-bold">Paces</h1>
          </div>

          <hr className="my-4 border-gray-300" />

          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left font-xs text-gray-800">
                <th className="border border-gray-300 px-4 py-2"> Leads</th>
                <th className="border border-gray-300 px-4 py-2">Achievement	</th>
                <th className="border border-gray-300 px-4 py-2">Due Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </>
  );
}

export default CampaignDetails;
