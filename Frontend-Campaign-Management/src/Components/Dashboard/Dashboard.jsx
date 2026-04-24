import React, { useEffect, useState } from "react";
import axios from "../Login/axiosConfig";

function Dashboard() {
  const [statusCounts, setStatusCounts] = useState({
    "In Progress": 0,
    Completed: 0,
    "On Hold": 0,
    Stopped: 0,
    Paused: 0,
    Cancelled: 0,
  });

  // Status to Tailwind class mapping
  const statusClassMap = {
    "In Progress": "text-blue-400",
    Completed: "text-green-400",
    "On Hold": "text-yellow-400",
    Stopped: "text-red-400",
    Paused: "text-gray-400",
    Cancelled: "text-gray-400",
  };

  useEffect(() => {
    axios
      .get("/status-counts")
      .then((response) => {
        const counts = {
          "In Progress": 0,
          Completed: 0,
          "On Hold": 0,
          Stopped: 0,
          Paused: 0,
          Cancelled: 0,
        };

        response.data.forEach(({ status, count }) => {
          if (counts.hasOwnProperty(status)) {
            counts[status] = count;
          }
        });

        setStatusCounts(counts);
      })
      .catch((error) => {
        console.error("Failed to fetch campaign status counts:", error);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid max-w-md md:max-w-xl mb-8 border border-gray-200 rounded-lg shadow-xs dark:border-gray-700 md:mb-12 bg-white dark:bg-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-800 text-white rounded">
          <h2 className="text-xl font-semibold text-center">
            Campaign Status Summary
          </h2>
        </div>

        <div className="grid grid-cols-2 divide-x divide-y divide-gray-300 dark:divide-gray-600 text-center text-gray-700 dark:text-gray-200">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="py-4 grid">
              <span className="text-2xl font-black ">
                {count}
              </span>
              <span className={`${statusClassMap[status] || "text-gray-400"}`}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
